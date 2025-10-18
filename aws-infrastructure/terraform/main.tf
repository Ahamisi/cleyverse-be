# Cleyverse AWS Infrastructure with GDPR Compliance
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Cleyverse"
      Environment = var.environment
      GDPR        = "Compliant"
      DataRetention = "7years"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# VPC Configuration
resource "aws_vpc" "cleyverse_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "cleyverse-vpc-${var.environment}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "cleyverse_igw" {
  vpc_id = aws_vpc.cleyverse_vpc.id

  tags = {
    Name = "cleyverse-igw-${var.environment}"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnets" {
  count             = 2
  vpc_id            = aws_vpc.cleyverse_vpc.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "cleyverse-public-subnet-${count.index + 1}-${var.environment}"
    Type = "Public"
  }
}

# Private Subnets
resource "aws_subnet" "private_subnets" {
  count             = 2
  vpc_id            = aws_vpc.cleyverse_vpc.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "cleyverse-private-subnet-${count.index + 1}-${var.environment}"
    Type = "Private"
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.cleyverse_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.cleyverse_igw.id
  }

  tags = {
    Name = "cleyverse-public-rt-${var.environment}"
  }
}

# Route Table Association for Public Subnets
resource "aws_route_table_association" "public_rta" {
  count          = length(aws_subnet.public_subnets)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# NAT Gateway for Private Subnets
resource "aws_eip" "nat_eip" {
  count  = 2
  domain = "vpc"

  tags = {
    Name = "cleyverse-nat-eip-${count.index + 1}-${var.environment}"
  }
}

resource "aws_nat_gateway" "nat_gateway" {
  count         = 2
  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id     = aws_subnet.public_subnets[count.index].id

  tags = {
    Name = "cleyverse-nat-gateway-${count.index + 1}-${var.environment}"
  }

  depends_on = [aws_internet_gateway.cleyverse_igw]
}

# Route Table for Private Subnets
resource "aws_route_table" "private_rt" {
  count  = 2
  vpc_id = aws_vpc.cleyverse_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway[count.index].id
  }

  tags = {
    Name = "cleyverse-private-rt-${count.index + 1}-${var.environment}"
  }
}

# Route Table Association for Private Subnets
resource "aws_route_table_association" "private_rta" {
  count          = length(aws_subnet.private_subnets)
  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private_rt[count.index].id
}

# Security Groups
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

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Application Port
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cleyverse-web-sg-${var.environment}"
  }
}

resource "aws_security_group" "db_sg" {
  name_prefix = "cleyverse-db-sg-${var.environment}"
  vpc_id      = aws_vpc.cleyverse_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cleyverse-db-sg-${var.environment}"
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "cleyverse_db_subnet_group" {
  name       = "cleyverse-db-subnet-group-${var.environment}"
  subnet_ids = aws_subnet.private_subnets[*].id

  tags = {
    Name = "cleyverse-db-subnet-group-${var.environment}"
  }
}

# RDS Instance (PostgreSQL)
resource "aws_db_instance" "cleyverse_db" {
  identifier = "cleyverse-db-${var.environment}"

  # GDPR Compliance: Encrypted storage
  storage_encrypted = true
  kms_key_id        = aws_kms_key.db_key.arn

  # GDPR Compliance: Automated backups with retention
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # GDPR Compliance: Deletion protection
  deletion_protection = var.environment == "production" ? true : false
  skip_final_snapshot = var.environment == "production" ? false : true
  final_snapshot_identifier = var.environment == "production" ? "cleyverse-db-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  engine         = "postgres"
  engine_version = "15.7"
  instance_class = var.environment == "production" ? "db.t3.small" : "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"

  db_name  = "cleyverse"
  username = "cleyverse"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.cleyverse_db_subnet_group.name

  # GDPR Compliance: Performance insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7

  # GDPR Compliance: Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring_role.arn

  tags = {
    Name = "cleyverse-db-${var.environment}"
  }
}

# KMS Key for Database Encryption
resource "aws_kms_key" "db_key" {
  description             = "KMS key for Cleyverse database encryption - GDPR compliance"
  deletion_window_in_days = 7

  tags = {
    Name = "cleyverse-db-key-${var.environment}"
  }
}

resource "aws_kms_alias" "db_key_alias" {
  name          = "alias/cleyverse-db-key-${var.environment}"
  target_key_id = aws_kms_key.db_key.key_id
}

# IAM Role for RDS Monitoring
resource "aws_iam_role" "rds_monitoring_role" {
  name = "cleyverse-rds-monitoring-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring_role_policy" {
  role       = aws_iam_role.rds_monitoring_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# S3 Bucket for Digital Files (GDPR Compliant)
resource "aws_s3_bucket" "digital_files" {
  bucket = "cleyverse-digital-files-${var.environment}-${random_string.bucket_suffix.result}"

  tags = {
    Name = "cleyverse-digital-files-${var.environment}"
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# GDPR Compliance: S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "digital_files_encryption" {
  bucket = aws_s3_bucket.digital_files.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# GDPR Compliance: S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "digital_files_versioning" {
  bucket = aws_s3_bucket.digital_files.id
  versioning_configuration {
    status = "Enabled"
  }
}

# GDPR Compliance: S3 Bucket Lifecycle (Data Retention)
resource "aws_s3_bucket_lifecycle_configuration" "digital_files_lifecycle" {
  bucket = aws_s3_bucket.digital_files.id

  rule {
    id     = "gdpr_data_retention"
    status = "Enabled"

    filter {
      prefix = ""
    }

    # GDPR Compliance: Delete incomplete multipart uploads after 7 days
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }

    # GDPR Compliance: Transition to cheaper storage classes
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # GDPR Compliance: Delete old versions after 7 years (GDPR requirement)
    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 2555 # 7 years
    }
  }
}

# GDPR Compliance: S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "digital_files_pab" {
  bucket = aws_s3_bucket.digital_files.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# GDPR Compliance: S3 Bucket CORS
resource "aws_s3_bucket_cors_configuration" "digital_files_cors" {
  bucket = aws_s3_bucket.digital_files.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = [
      "https://${var.domain_name}",
      "https://api.${var.domain_name}",
      "https://api-staging.${var.domain_name}"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# EC2 Key Pair
resource "aws_key_pair" "cleyverse_key" {
  key_name   = "cleyverse-key-${var.environment}"
  public_key = var.public_key

  tags = {
    Name = "cleyverse-key-${var.environment}"
  }
}

# EC2 Instance
resource "aws_instance" "cleyverse_app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.environment == "production" ? "t3.medium" : "t3.micro"
  key_name      = aws_key_pair.cleyverse_key.key_name

  subnet_id                   = aws_subnet.public_subnets[0].id
  vpc_security_group_ids      = [aws_security_group.web_sg.id]
  associate_public_ip_address = true

  # GDPR Compliance: Encrypted EBS volume
  root_block_device {
    encrypted   = true
    kms_key_id  = aws_kms_key.ebs_key.arn
    volume_type = "gp3"
    volume_size = 30
  }

  # GDPR Compliance: Detailed monitoring
  monitoring = true

  user_data = base64encode(file("${path.module}/user_data_simple.sh"))

  tags = {
    Name = "cleyverse-app-${var.environment}"
  }
}

# KMS Key for EBS Encryption
resource "aws_kms_key" "ebs_key" {
  description             = "KMS key for Cleyverse EBS encryption - GDPR compliance"
  deletion_window_in_days = 7

  tags = {
    Name = "cleyverse-ebs-key-${var.environment}"
  }
}

resource "aws_kms_alias" "ebs_key_alias" {
  name          = "alias/cleyverse-ebs-key-${var.environment}"
  target_key_id = aws_kms_key.ebs_key.key_id
}

# Data source for Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# CloudWatch Log Groups (GDPR Compliance)
resource "aws_cloudwatch_log_group" "cleyverse_app_logs" {
  name              = "/aws/ec2/cleyverse-app-${var.environment}"
  retention_in_days = 30 # GDPR Compliance: Log retention

  tags = {
    Name = "cleyverse-app-logs-${var.environment}"
  }
}

# GDPR Compliance: CloudTrail for audit logging
resource "aws_cloudtrail" "cleyverse_trail" {
  name                          = "cleyverse-trail-${var.environment}"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_bucket.bucket
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true

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

# S3 Bucket for CloudTrail
resource "aws_s3_bucket" "cloudtrail_bucket" {
  bucket = "cleyverse-cloudtrail-${var.environment}-${random_string.cloudtrail_suffix.result}"

  tags = {
    Name = "cleyverse-cloudtrail-${var.environment}"
  }
}

# S3 Bucket Policy for CloudTrail
resource "aws_s3_bucket_policy" "cloudtrail_bucket_policy" {
  bucket = aws_s3_bucket.cloudtrail_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.cloudtrail_bucket.arn
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

resource "random_string" "cloudtrail_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_encryption" {
  bucket = aws_s3_bucket.cloudtrail_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_pab" {
  bucket = aws_s3_bucket.cloudtrail_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}