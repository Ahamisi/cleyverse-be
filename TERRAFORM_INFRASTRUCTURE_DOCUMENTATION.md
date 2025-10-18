# Cleyverse Terraform Infrastructure Documentation

## Overview

This document provides comprehensive documentation of the Terraform infrastructure for the Cleyverse platform. It covers all resources, configurations, and deployment procedures.

## Infrastructure Location

**Path**: `aws-infrastructure/terraform/`

## Architecture Overview

### High-Level Architecture
```
Internet Gateway
       │
   ┌───▼───┐
   │  VPC  │ (10.0.0.0/16)
   │       │
   ├───────┤
   │Public │ ┌─────────────┐
   │Subnet │ │    EC2      │
   │       │ │  Instance   │
   └───────┘ └─────────────┘
       │
   ┌───▼───┐
   │Private│ ┌─────────────┐
   │Subnet │ │     RDS     │
   │       │ │ PostgreSQL  │
   └───────┘ └─────────────┘
```

## Core Components

### 1. Networking (VPC)

#### VPC Configuration
```hcl
resource "aws_vpc" "cleyverse_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "cleyverse-vpc-${var.environment}"
  }
}
```

#### Subnets
- **Public Subnets**: `10.0.1.0/24`, `10.0.2.0/24` (for EC2 instances)
- **Private Subnets**: `10.0.10.0/24`, `10.0.20.0/24` (for RDS)

#### Internet Gateway
```hcl
resource "aws_internet_gateway" "cleyverse_igw" {
  vpc_id = aws_vpc.cleyverse_vpc.id
  
  tags = {
    Name = "cleyverse-igw-${var.environment}"
  }
}
```

#### NAT Gateways
- **Purpose**: Allow private subnets to access internet
- **Availability Zones**: `us-east-1a`, `us-east-1b`

### 2. Security Groups

#### Web Security Group
```hcl
resource "aws_security_group" "web_sg" {
  name_prefix = "cleyverse-web-sg-${var.environment}"
  vpc_id      = aws_vpc.cleyverse_vpc.id

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH (restrict to your IP)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Should be restricted to admin IP
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

#### Database Security Group
```hcl
resource "aws_security_group" "db_sg" {
  name_prefix = "cleyverse-db-sg-${var.environment}"
  vpc_id      = aws_vpc.cleyverse_vpc.id

  # PostgreSQL from web security group
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  # Allow EC2 instance to connect to RDS
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # VPC CIDR block
  }
}
```

### 3. Compute (EC2)

#### EC2 Instance Configuration
```hcl
resource "aws_instance" "cleyverse_app" {
  ami                    = "ami-0c02fb55956c7d316" # Ubuntu 22.04 LTS
  instance_type          = var.instance_type
  key_name              = aws_key_pair.cleyverse_key.key_name
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  subnet_id             = aws_subnet.public_subnets[0].id
  
  # User data script for initial setup
  user_data = base64encode(file("${path.module}/user_data_simple.sh"))
  
  # EBS volume configuration
  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
    kms_key_id  = aws_kms_key.ebs_key.arn
  }
  
  tags = {
    Name = "cleyverse-app-${var.environment}"
  }
}
```

#### Key Pair
```hcl
resource "aws_key_pair" "cleyverse_key" {
  key_name   = "cleyverse-key-${var.environment}"
  public_key = var.public_key
}
```

### 4. Database (RDS)

#### RDS PostgreSQL Configuration
```hcl
resource "aws_db_instance" "cleyverse_db" {
  identifier = "cleyverse-db-${var.environment}"
  
  # Engine configuration
  engine         = "postgres"
  engine_version = "15.7"
  instance_class = var.db_instance_class
  
  # Database configuration
  db_name  = "cleyverse_${var.environment}"
  username = "cleyverse"
  password = var.db_password
  
  # Storage configuration
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.db_key.arn
  
  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.cleyverse_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  publicly_accessible    = false
  
  # Backup configuration
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn
  
  # Parameter group
  parameter_group_name = aws_db_parameter_group.cleyverse_db_params.name
  
  # Deletion protection
  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"
  
  tags = {
    Name = "cleyverse-db-${var.environment}"
  }
}
```

#### Database Parameter Group
```hcl
resource "aws_db_parameter_group" "cleyverse_db_params" {
  family = "postgres15"
  name   = "cleyverse-db-params-${var.environment}"

  parameter {
    name  = "rds.force_ssl"
    value = "0"  # Disabled for development
  }

  tags = {
    Name = "cleyverse-db-params-${var.environment}"
  }
}
```

### 5. Storage (S3)

#### Digital Files Bucket
```hcl
resource "aws_s3_bucket" "digital_files" {
  bucket = "cleyverse-digital-files-${var.environment}-${random_string.bucket_suffix.result}"

  tags = {
    Name = "cleyverse-digital-files-${var.environment}"
  }
}

resource "aws_s3_bucket_versioning" "digital_files_versioning" {
  bucket = aws_s3_bucket.digital_files.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "digital_files_encryption" {
  bucket = aws_s3_bucket.digital_files.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}
```

#### CloudTrail Bucket
```hcl
resource "aws_s3_bucket" "cloudtrail_bucket" {
  bucket = "cleyverse-cloudtrail-${var.environment}-${random_string.bucket_suffix.result}"

  tags = {
    Name = "cleyverse-cloudtrail-${var.environment}"
  }
}
```

### 6. Security (KMS)

#### Database Encryption Key
```hcl
resource "aws_kms_key" "db_key" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 7

  tags = {
    Name = "cleyverse-db-key-${var.environment}"
  }
}
```

#### EBS Encryption Key
```hcl
resource "aws_kms_key" "ebs_key" {
  description             = "KMS key for EBS encryption"
  deletion_window_in_days = 7

  tags = {
    Name = "cleyverse-ebs-key-${var.environment}"
  }
}
```

### 7. Monitoring (CloudWatch)

#### Log Group
```hcl
resource "aws_cloudwatch_log_group" "cleyverse_app_logs" {
  name              = "/aws/ec2/cleyverse-app"
  retention_in_days = 30

  tags = {
    Name = "cleyverse-app-logs-${var.environment}"
  }
}
```

#### CloudTrail
```hcl
resource "aws_cloudtrail" "cleyverse_trail" {
  name           = "cleyverse-trail-${var.environment}"
  s3_bucket_name = aws_s3_bucket.cloudtrail_bucket.id

  event_selector {
    read_write_type                 = "All"
    include_management_events       = true
    data_resource {
      type   = "AWS::S3::Object"
      values = ["${aws_s3_bucket.digital_files.arn}/*"]
    }
  }

  tags = {
    Name = "cleyverse-trail-${var.environment}"
  }
}
```

## Configuration Files

### 1. Variables (`variables.tf`)

#### Core Variables
```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "cleyfi.com"
}
```

#### Instance Configuration
```hcl
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}
```

#### Security Variables
```hcl
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "public_key" {
  description = "SSH public key"
  type        = string
}
```

### 2. Outputs (`outputs.tf`)

#### Network Outputs
```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.cleyverse_vpc.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.cleyverse_app.public_ip
}
```

#### Database Outputs
```hcl
output "db_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.cleyverse_db.endpoint
  sensitive   = true
}
```

#### Application URLs
```hcl
output "staging_api_url" {
  description = "Staging API URL"
  value       = "https://api-staging.${var.domain_name}"
}
```

### 3. Environment Configuration (`terraform.tfvars`)

#### Current Configuration
```hcl
# Environment
environment = "staging"
aws_region  = "us-east-1"
domain_name = "cleyfi.com"

# Instance Configuration
instance_type     = "t3.micro"
db_instance_class = "db.t3.micro"
multi_az         = false

# Security
db_password = "Cleyverse2024!SecureDB#"
public_key  = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDGgB6p/tQf6NdJjvlIxUdj2n2IjwWtfIhvlUxQdvWLHpYu66vuhjg+IZAKyqgL8PkokwW6/8+tIHNWFVtSgg5d67J0PGIdGcq8LrgMEkGMjJ85bo36yJjQavkF32rmFO/0IetasU2nA01q+3eiH9gzQkxbEdWYzM35v7s8HH8D1nobewNSHLaktGv8ST1U7iLzpN9Zd5lnfSxoLZdWRlKzv7b3yrR+QoJ7p6vxIgiEEUx5gcfQuGI/68JvT1oYkoGGroNRftGAGqNbZxIeHG2PCFJAV9wafhyKp+EfAAhfjZaZjYs87hkTC75hy/Avgw0Ozrhy1/VX8H/UY4Kd7PQcgjzaNXe75esPx4Do6glx+rX73vwGc/QW9a53EYrSUa33etdqPYQLWjV7iv8m8BWSyTf8d08ekaaDhHHX2+W6mbRqzqyixjUEPJsZdk0FY0C+WZI4LC2IQP76nPPjatmR35apuy1s3HTxq9AiinqOJ3RB6b+xLoDyIoq2mz6LGorfu12Jrv7nE39PWHLFsXTDDrcmeA0owGnW1v1AikZ315Ns+Fg3m7GJkaob+oZGF1X97IKc7SxENqI1vWW84fA5SlJl3pjczwdC2v4dbBOjh9xmBAPizD5TbptDdulrQJZ5uCsccnWTsD7qs3Zj/pYi34L3k2qtTXWbtDsCow11Vw== cleyverse-production"

# Application Configuration
jwt_secret = "Cleyverse2024!JWTSecret#SuperSecureKeyForProduction"
admin_email = "theaceman@cleyfi.com"
```

## Deployment Procedures

### 1. Initial Deployment

#### Prerequisites
```bash
# Install Terraform
brew install terraform

# Install AWS CLI
brew install awscli

# Configure AWS credentials
aws configure
```

#### Deployment Steps
```bash
# Navigate to terraform directory
cd aws-infrastructure/terraform

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the infrastructure
terraform apply
```

### 2. Updates and Changes

#### Making Changes
```bash
# Edit configuration files
# Run plan to see changes
terraform plan

# Apply changes
terraform apply
```

#### Destroying Infrastructure
```bash
# Destroy all resources (use with caution)
terraform destroy
```

## Security Considerations

### 1. Network Security
- **VPC**: Isolated network environment
- **Security Groups**: Restrictive access rules
- **Private Subnets**: Database in private subnets
- **NAT Gateway**: Secure internet access for private resources

### 2. Data Security
- **Encryption at Rest**: All storage encrypted with KMS
- **Encryption in Transit**: SSL/TLS for all communications
- **Database Security**: Private subnets, security groups
- **Backup Encryption**: Automated encrypted backups

### 3. Access Control
- **SSH Keys**: Key-based authentication
- **IAM Roles**: Least privilege access
- **CloudTrail**: Audit logging for compliance
- **KMS**: Key management and rotation

## Cost Optimization

### 1. Current Configuration
- **EC2**: `t3.micro` (1 vCPU, 1 GB RAM)
- **RDS**: `db.t3.micro` (1 vCPU, 1 GB RAM)
- **Storage**: 20 GB EBS, 20 GB RDS
- **Estimated Cost**: ~$50-80/month (staging)

### 2. Production Recommendations
- **EC2**: `t3.small` or `t3.medium`
- **RDS**: `db.t3.small` with Multi-AZ
- **Storage**: Larger volumes with provisioned IOPS
- **Estimated Cost**: ~$150-200/month (production)

## Monitoring and Alerting

### 1. CloudWatch Metrics
- **EC2**: CPU, Memory, Disk usage
- **RDS**: CPU, Connections, Storage
- **Application**: Custom metrics via PM2

### 2. Log Management
- **Application Logs**: CloudWatch Logs
- **Access Logs**: Nginx logs
- **Audit Logs**: CloudTrail

### 3. Alerting (To Be Implemented)
- **High CPU Usage**: > 80%
- **High Memory Usage**: > 90%
- **Database Connections**: > 80% of max
- **Disk Space**: > 85%

## Troubleshooting

### 1. Common Issues

#### Terraform State Issues
```bash
# Refresh state
terraform refresh

# Import existing resources
terraform import aws_instance.example i-1234567890abcdef0
```

#### Resource Conflicts
```bash
# Check for naming conflicts
terraform plan

# Use different resource names
# Update variables in terraform.tfvars
```

#### Permission Issues
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify IAM permissions
aws iam list-attached-user-policies --user-name your-username
```

### 2. Resource-Specific Issues

#### EC2 Instance
```bash
# Check instance status
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Check security groups
aws ec2 describe-security-groups --group-ids sg-1234567890abcdef0
```

#### RDS Database
```bash
# Check database status
aws rds describe-db-instances --db-instance-identifier cleyverse-db-staging

# Check parameter groups
aws rds describe-db-parameters --db-parameter-group-name cleyverse-db-params-staging
```

## Future Enhancements

### 1. High Availability
- **Multi-AZ RDS**: Database failover
- **Load Balancer**: Application load balancing
- **Auto Scaling**: Dynamic instance scaling

### 2. Security Enhancements
- **WAF**: Web Application Firewall
- **GuardDuty**: Threat detection
- **Config**: Compliance monitoring

### 3. Performance Optimization
- **ElastiCache**: Redis caching
- **CloudFront**: CDN for static content
- **RDS Read Replicas**: Read scaling

---

**Last Updated**: January 2025
**Version**: 1.0
**Environment**: Staging
**Status**: Active
