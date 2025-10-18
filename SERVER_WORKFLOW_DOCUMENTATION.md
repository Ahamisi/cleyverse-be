# Cleyverse Server Workflow Documentation

## Overview

This document provides a comprehensive overview of the Cleyverse backend server infrastructure, deployment workflow, and operational procedures. It serves as a reference for understanding the current state and future maintenance of the system.

## Infrastructure Architecture

### AWS Infrastructure (Terraform)

**Location**: `aws-infrastructure/terraform/`

#### Core Components:
- **VPC**: `10.0.0.0/16` with public and private subnets
- **EC2 Instance**: `t3.micro` running Ubuntu 22.04 LTS
- **RDS PostgreSQL**: `db.t3.micro` with automated backups
- **S3 Buckets**: Digital files storage and CloudTrail logs
- **CloudWatch**: Logging and monitoring
- **CloudTrail**: Audit logging for compliance

#### Key Files:
- `main.tf` - Main infrastructure configuration
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `terraform.tfvars` - Environment-specific values

#### Current Environment:
- **Environment**: `staging`
- **Domain**: `cleyfi.com`
- **API URL**: `https://api-staging.cleyfi.com`
- **EC2 Public IP**: `3.236.39.203`
- **RDS Endpoint**: `cleyverse-db-staging.cwlea4ym8h2p.us-east-1.rds.amazonaws.com`

### Application Architecture

**Location**: `api/`

#### Technology Stack:
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with flexible auth system
- **File Storage**: AWS S3 integration
- **Email**: AWS SES integration
- **Process Manager**: PM2
- **Web Server**: Nginx (reverse proxy)

#### Key Modules:
1. **Users Module** - User management, profiles, settings
2. **Auth Module** - Authentication, JWT, temporary codes
3. **Links Module** - Link management, click tracking
4. **Collections Module** - Link grouping and organization
5. **Forms Module** - Dynamic form creation and submissions
6. **Shop Module** - Store management, products, orders
7. **Events Module** - Event management, vendors, guests
8. **Payments Module** - Payment processing, invoices
9. **Upload Module** - File uploads to S3

## Deployment Workflow

### 1. Infrastructure Deployment

```bash
# Navigate to terraform directory
cd aws-infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

### 2. Application Deployment

#### Current Deployment Process:
1. **Code Push**: Push code to GitHub repository
2. **Server Pull**: SSH into EC2 and pull latest code
3. **Build**: Run `npm run build` in the `api` directory
4. **Restart**: Restart PM2 process

#### Manual Deployment Commands:
```bash
# SSH into server
ssh -i ~/.ssh/cleyverse-key-staging.pem ubuntu@3.236.39.203

# Navigate to application directory
cd /var/www/cleyverse

# Pull latest code
git pull origin main

# Install dependencies
cd api && npm install

# Build application
npm run build

# Restart PM2
pm2 restart cleyverse-api
```

### 3. Environment Configuration

#### PM2 Ecosystem Configuration:
**File**: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'cleyverse-api',
    script: './api/dist/src/main.js',
    cwd: '/var/www/cleyverse',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'postgresql://...',
      JWT_SECRET: '...',
      // ... other environment variables
    }
  }]
};
```

#### Environment Variables:
- `NODE_ENV`: `production`
- `PORT`: `3000`
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `PAYSTACK_SECRET_KEY`: Payment processing
- `PAYSTACK_PUBLIC_KEY`: Payment processing
- `AWS_REGION`: `us-east-1`
- `AWS_ACCESS_KEY_ID`: AWS credentials
- `AWS_SECRET_ACCESS_KEY`: AWS credentials
- `SES_FROM_EMAIL`: `noreply@cleyfi.com`
- `SES_FROM_NAME`: `Cleyverse`
- `S3_BUCKET_NAME`: `cleyverse-digital-files-staging`
- `S3_REGION`: `us-east-1`

## Operational Procedures

### 1. Server Monitoring

#### PM2 Commands:
```bash
# Check application status
pm2 status

# View logs
pm2 logs cleyverse-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart cleyverse-api

# Stop application
pm2 stop cleyverse-api
```

#### Nginx Status:
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 2. Database Operations

#### Connection Details:
- **Host**: `cleyverse-db-staging.cwlea4ym8h2p.us-east-1.rds.amazonaws.com`
- **Port**: `5432`
- **Database**: `cleyverse_staging`
- **Username**: `cleyverse`
- **Password**: `Cleyverse2024!SecureDB#`

#### Backup Commands:
```bash
# Create backup
pg_dump -h cleyverse-db-staging.cwlea4ym8h2p.us-east-1.rds.amazonaws.com \
        -U cleyverse \
        -d cleyverse_staging \
        -f backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h cleyverse-db-staging.cwlea4ym8h2p.us-east-1.rds.amazonaws.com \
     -U cleyverse \
     -d cleyverse_staging \
     -f backup_file.sql
```

### 3. SSL Certificate Management

#### Current Status:
- **SSL**: Not yet configured
- **Domain**: `api-staging.cleyfi.com` (needs SSL)
- **Production Domain**: `api.cleyfi.com` (needs SSL)

#### SSL Setup Commands:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api-staging.cleyfi.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Log Management

#### Application Logs:
- **Location**: `/home/ubuntu/.pm2/logs/`
- **Files**: 
  - `cleyverse-api-out.log`
  - `cleyverse-api-error.log`

#### Nginx Logs:
- **Access Log**: `/var/log/nginx/access.log`
- **Error Log**: `/var/log/nginx/error.log`

#### CloudWatch Logs:
- **Log Group**: `/aws/ec2/cleyverse-app`
- **RDS Logs**: `/aws/rds/instance/cleyverse-db-staging/postgresql`

## Security Configuration

### 1. Firewall (Security Groups)

#### Web Security Group:
- **HTTP**: Port 80 (0.0.0.0/0)
- **HTTPS**: Port 443 (0.0.0.0/0)
- **SSH**: Port 22 (Your IP only)

#### Database Security Group:
- **PostgreSQL**: Port 5432 (Web SG only)

### 2. Access Control

#### SSH Access:
- **Key File**: `~/.ssh/cleyverse-key-staging.pem`
- **User**: `ubuntu`
- **IP**: `3.236.39.203`

#### Database Access:
- **SSL**: Disabled (for development)
- **Access**: EC2 instance only
- **Backup**: Automated daily backups

### 3. Environment Security

#### Secrets Management:
- **JWT Secret**: `Cleyverse2024!JWTSecret#SuperSecureKeyForProduction`
- **DB Password**: `Cleyverse2024!SecureDB#`
- **AWS Keys**: Stored in PM2 environment

## Recent Changes and Updates

### 1. AWS SES Integration (Completed)
- **Service**: `AWSSESService` in `shared/services/aws-ses.service.ts`
- **Integration**: Updated `EmailService` to use AWS SES
- **Templates**: HTML and text email templates
- **Fallback**: Console logging for development

### 2. S3 Upload System (Completed)
- **Service**: `AWSS3Service` in `shared/services/aws-s3.service.ts`
- **Controller**: `UploadController` in `modules/upload/upload.controller.ts`
- **Entity**: `UserFile` for tracking uploaded files
- **Features**: Direct upload, presigned URLs, file management

### 3. PM2 Configuration (Completed)
- **File**: `ecosystem.config.js`
- **Environment**: All variables properly configured
- **Process**: Single instance with auto-restart

## Troubleshooting Guide

### 1. Application Issues

#### Application Won't Start:
```bash
# Check PM2 logs
pm2 logs cleyverse-api --lines 100

# Check environment variables
pm2 env 0

# Restart with fresh environment
pm2 delete all && pm2 start ecosystem.config.js
```

#### Database Connection Issues:
```bash
# Test database connection
psql -h cleyverse-db-staging.cwlea4ym8h2p.us-east-1.rds.amazonaws.com \
     -U cleyverse \
     -d cleyverse_staging

# Check RDS status in AWS Console
```

#### Nginx Issues:
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### 2. Performance Issues

#### High Memory Usage:
```bash
# Check PM2 memory usage
pm2 monit

# Restart if needed
pm2 restart cleyverse-api
```

#### Slow Database Queries:
```bash
# Check RDS performance insights in AWS Console
# Review application logs for slow queries
```

### 3. SSL Issues

#### Certificate Problems:
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
curl -I https://api-staging.cleyfi.com
```

## Future Improvements

### 1. Immediate Tasks
- [ ] Set up SSL certificates for domains
- [ ] Configure AWS SES with actual credentials
- [ ] Set up CloudWatch monitoring and alerts
- [ ] Implement automated backups verification
- [ ] Security audit of infrastructure

### 2. Production Readiness
- [ ] Load balancing with multiple EC2 instances
- [ ] Auto-scaling groups
- [ ] CDN with CloudFront
- [ ] Database read replicas
- [ ] Redis caching layer

### 3. CI/CD Pipeline
- [ ] GitHub Actions for automated deployment
- [ ] Automated testing pipeline
- [ ] Blue-green deployment strategy
- [ ] Rollback procedures

## Contact and Support

### Key Information:
- **Domain**: `cleyfi.com`
- **Staging API**: `https://api-staging.cleyfi.com`
- **Production API**: `https://api.cleyfi.com` (pending SSL)
- **Admin Email**: `theaceman@cleyfi.com`

### Access Credentials:
- **SSH Key**: `~/.ssh/cleyverse-key-staging.pem`
- **AWS Region**: `us-east-1`
- **Environment**: `staging`

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Staging Environment Active
