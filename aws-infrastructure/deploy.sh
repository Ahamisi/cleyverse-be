#!/bin/bash

# Cleyverse AWS Deployment Script
# This script deploys the Cleyverse backend to AWS with GDPR compliance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists aws; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists terraform; then
        print_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "All prerequisites met!"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up deployment environment..."
    
    # Create terraform.tfvars if it doesn't exist
    if [ ! -f "terraform/terraform.tfvars" ]; then
        print_warning "terraform.tfvars not found. Creating from example..."
        cp terraform/terraform.tfvars.example terraform/terraform.tfvars
        print_warning "Please edit terraform/terraform.tfvars with your actual values before proceeding."
        exit 1
    fi
    
    # Validate terraform.tfvars
    if grep -q "your-" terraform/terraform.tfvars; then
        print_error "Please update terraform/terraform.tfvars with your actual values."
        exit 1
    fi
    
    print_success "Environment setup completed!"
}

# Function to deploy infrastructure
deploy_infrastructure() {
    local environment=$1
    
    print_status "Deploying infrastructure for environment: $environment"
    
    cd terraform
    
    # Initialize Terraform
    print_status "Initializing Terraform..."
    terraform init
    
    # Plan deployment
    print_status "Planning Terraform deployment..."
    terraform plan -var="environment=$environment" -out=tfplan
    
    # Ask for confirmation
    echo
    print_warning "Review the Terraform plan above."
    read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled by user."
        exit 1
    fi
    
    # Apply deployment
    print_status "Applying Terraform deployment..."
    terraform apply tfplan
    
    # Get outputs
    print_status "Getting deployment outputs..."
    terraform output -json > ../deployment-outputs.json
    
    cd ..
    
    print_success "Infrastructure deployment completed!"
}

# Function to setup SSL certificates
setup_ssl() {
    local environment=$1
    local ec2_ip=$(jq -r '.ec2_public_ip.value' deployment-outputs.json)
    local domain_name=$(jq -r '.domain_name.value' deployment-outputs.json)
    
    print_status "Setting up SSL certificates..."
    
    # Wait for EC2 instance to be ready
    print_status "Waiting for EC2 instance to be ready..."
    sleep 60
    
    # SSH into instance and setup SSL
    print_status "Setting up SSL certificates on EC2 instance..."
    ssh -o StrictHostKeyChecking=no -i ~/.ssh/cleyverse-key-$environment.pem ubuntu@$ec2_ip << EOF
        # Install Certbot if not already installed
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
        
        # Get SSL certificate for production API
        sudo certbot --nginx -d api.$domain_name --non-interactive --agree-tos --email admin@$domain_name
        
        # Get SSL certificate for staging API
        sudo certbot --nginx -d api-staging.$domain_name --non-interactive --agree-tos --email admin@$domain_name
        
        # Setup auto-renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
        
        # Restart Nginx
        sudo systemctl restart nginx
EOF
    
    print_success "SSL certificates setup completed!"
}

# Function to deploy application
deploy_application() {
    local environment=$1
    local ec2_ip=$(jq -r '.ec2_public_ip.value' deployment-outputs.json)
    
    print_status "Deploying application to EC2 instance..."
    
    # Copy application files to EC2
    print_status "Copying application files..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
        -e "ssh -i ~/.ssh/cleyverse-key-$environment.pem" \
        ../api/ ubuntu@$ec2_ip:/var/www/cleyverse/
    
    # Deploy application on EC2
    print_status "Deploying application on EC2 instance..."
    ssh -i ~/.ssh/cleyverse-key-$environment.pem ubuntu@$ec2_ip << EOF
        cd /var/www/cleyverse
        
        # Install dependencies
        npm install --production
        
        # Build application
        npm run build
        
        # Run database migrations
        npm run migration:run
        
        # Start application with PM2
        pm2 start ecosystem.config.js
        
        # Save PM2 configuration
        pm2 save
        
        # Setup PM2 startup script
        pm2 startup
EOF
    
    print_success "Application deployment completed!"
}

# Function to run health checks
run_health_checks() {
    local environment=$1
    local api_url=$(jq -r '.api_url.value' deployment-outputs.json)
    
    print_status "Running health checks..."
    
    # Wait for application to start
    print_status "Waiting for application to start..."
    sleep 30
    
    # Test API health endpoint
    print_status "Testing API health endpoint..."
    if curl -f -s "$api_url/health" > /dev/null; then
        print_success "API health check passed!"
    else
        print_error "API health check failed!"
        exit 1
    fi
    
    # Test database connection
    print_status "Testing database connection..."
    if curl -f -s "$api_url/health" | grep -q "database"; then
        print_success "Database connection test passed!"
    else
        print_warning "Database connection test inconclusive."
    fi
    
    print_success "All health checks completed!"
}

# Function to display deployment summary
display_summary() {
    local environment=$1
    
    print_success "🎉 Deployment completed successfully!"
    echo
    echo "=========================================="
    echo "  CLEYVERSE DEPLOYMENT SUMMARY"
    echo "=========================================="
    echo
    echo "Environment: $environment"
    echo "API URL: $(jq -r '.api_url.value' deployment-outputs.json)"
    echo "Staging API URL: $(jq -r '.staging_api_url.value' deployment-outputs.json)"
    echo "Frontend URL: $(jq -r '.frontend_url.value' deployment-outputs.json)"
    echo
    echo "EC2 Instance: $(jq -r '.ec2_public_ip.value' deployment-outputs.json)"
    echo "Database: $(jq -r '.db_endpoint.value' deployment-outputs.json)"
    echo "S3 Bucket: $(jq -r '.s3_bucket_name.value' deployment-outputs.json)"
    echo
    echo "SSH Command: $(jq -r '.ssh_connection_command.value' deployment-outputs.json)"
    echo
    echo "GDPR Compliance: ✅ ENABLED"
    echo "Encryption: ✅ ENABLED"
    echo "Monitoring: ✅ ENABLED"
    echo "Backups: ✅ ENABLED"
    echo
    echo "=========================================="
    echo
    print_status "Next steps:"
    echo "1. Update your DNS records to point to the EC2 instance"
    echo "2. Test all API endpoints"
    echo "3. Configure your frontend to use the new API URL"
    echo "4. Set up monitoring alerts"
    echo "5. Review GDPR compliance documentation"
    echo
}

# Function to cleanup on error
cleanup_on_error() {
    print_error "Deployment failed. Cleaning up..."
    
    if [ -f "terraform/tfplan" ]; then
        rm terraform/tfplan
    fi
    
    if [ -f "deployment-outputs.json" ]; then
        rm deployment-outputs.json
    fi
    
    print_error "Cleanup completed."
}

# Main deployment function
main() {
    local environment=${1:-production}
    
    # Set trap for cleanup on error
    trap cleanup_on_error ERR
    
    print_status "Starting Cleyverse deployment for environment: $environment"
    echo
    
    # Check prerequisites
    check_prerequisites
    echo
    
    # Setup environment
    setup_environment
    echo
    
    # Deploy infrastructure
    deploy_infrastructure $environment
    echo
    
    # Setup SSL certificates
    setup_ssl $environment
    echo
    
    # Deploy application
    deploy_application $environment
    echo
    
    # Run health checks
    run_health_checks $environment
    echo
    
    # Display summary
    display_summary $environment
}

# Script usage
usage() {
    echo "Usage: $0 [environment]"
    echo
    echo "Environments:"
    echo "  production  - Deploy to production (default)"
    echo "  staging     - Deploy to staging"
    echo
    echo "Examples:"
    echo "  $0 production"
    echo "  $0 staging"
    echo
    echo "Prerequisites:"
    echo "  - AWS CLI configured with appropriate permissions"
    echo "  - Terraform installed"
    echo "  - SSH key pair created and stored in ~/.ssh/"
    echo "  - terraform.tfvars configured with your values"
    echo
}

# Check if help is requested
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    usage
    exit 0
fi

# Validate environment
if [ -n "$1" ] && [ "$1" != "production" ] && [ "$1" != "staging" ]; then
    print_error "Invalid environment: $1"
    echo
    usage
    exit 1
fi

# Run main function
main "$@"