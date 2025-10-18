# Cleyverse AWS Infrastructure Configuration
# Copy this file to terraform.tfvars and fill in your values

# AWS Configuration
aws_region = "us-east-1"
environment = "staging"  # or "production"

# Domain Configuration
domain_name = "cleyfi.com"

# Database Configuration
db_password = "Cleyverse2024!SecureDB#"

# SSH Key Configuration
public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDGgB6p/tQf6NdJjvlIxUdj2n2IjwWtfIhvlUxQdvWLHpYu66vuhjg+IZAKyqgL8PkokwW6/8+tIHNWFVtSgg5d67J0PGIdGcq8LrgMEkGMjJ85bo36yJjQavkF32rmFO/0IetasU2nA01q+3eiH9gzQkxbEdWYzM35v7s8HH8D1nobewNSHLaktGv8ST1U7iLzpN9Zd8lnfSxoLZdWRlKzv7b3yrR+QoJ7p6vxIgiEEUx5gcfQuGI/68JvT1oYkoGGroNRftGAGqNbZxIeHG2PCFJAV9wafhyKp+EfAAhfjZaZjYs87hkTC75hy/Avgw2Ozrhy1/VX8H+UY4Kd7PQcgjzaNXe75esPx4Do6glx+rX73vwGc/QW9a53EYrSUa33etdqPYQLWjV7iv8m8BWSyTf8d08ekaaDhHHX2+W6mbRqzqyixjUEPJsZdk0FY0C+WZI4LC2IQP76nPPjatmR35apuy1s3HTxq9AiinqOJ3RB6b+xLoDyIoq2mz6LGorfu12Jrv7nE39PWHLFsXTDDrcmeA0owGnW1v1AikZ315Ns+Fg3m7GJkaob+oZGF1X97IKc7SxENqI1vWW84fA5SlJl3pjczwdC2v4dbBOjh9xmBAPizD5TbptDdulrQJZ5uCsccnWTsD7qs3Zj/pYi34L3k2qtTXWbtDsCow11Vw== cleyverse-production"

# Payment Configuration
paystack_secret_key = "sk_live_your_paystack_secret_key"
paystack_public_key = "pk_live_your_paystack_public_key"

# JWT Configuration
jwt_secret = "Cleyverse2024!JWTSecret#SuperSecureKeyForProduction"

# Email Configuration (AWS SES)
smtp_username = "your-ses-smtp-username"
smtp_password = "your-ses-smtp-password"

# Admin Configuration
admin_email = "theaceman@cleyfi.com"

# GDPR Compliance Configuration
gdpr_compliance_enabled = true
data_retention_years = 7
enable_encryption_at_rest = true
enable_encryption_in_transit = true
enable_audit_logging = true
enable_data_classification = true
privacy_contact_email = "privacy@cleyfi.com"
dpo_contact_email = "dpo@cleyfi.com"

# Security Configuration
enable_waf = true
enable_shield = true
enable_guardduty = true
enable_config = true

# Resource Configuration
instance_type = "t3.micro"  # for staging, use "t3.medium" for production
db_instance_class = "db.t3.micro"  # for staging, use "db.t3.small" for production
allocated_storage = 20
max_allocated_storage = 100
multi_az = false  # false for staging to save costs

# Monitoring Configuration
enable_monitoring = true
enable_performance_insights = true
performance_insights_retention_period = 7
monitoring_interval = 60

# Backup Configuration
backup_retention_days = 2555  # 7 years for GDPR compliance
log_retention_days = 30

# Cost Optimization
enable_auto_scaling = true
min_capacity = 1
max_capacity = 5
desired_capacity = 2
enable_spot_instances = false  # Set to true for cost savings in staging

# Additional Tags
tags = {
  Project = "Cleyverse"
  Owner = "Cleyfi Team"
  CostCenter = "Engineering"
  Environment = "Production"
  GDPR = "Compliant"
}