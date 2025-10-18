# Variables for Cleyverse AWS Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
  
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be one of: production, staging, development."
  }
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "cleyfi.com"
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "public_key" {
  description = "Public key for EC2 instance access"
  type        = string
}

variable "paystack_secret_key" {
  description = "Paystack secret key"
  type        = string
  sensitive   = true
}

variable "paystack_public_key" {
  description = "Paystack public key"
  type        = string
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "smtp_username" {
  description = "SMTP username for email"
  type        = string
  sensitive   = true
}

variable "smtp_password" {
  description = "SMTP password for email"
  type        = string
  sensitive   = true
}

variable "admin_email" {
  description = "Admin email for notifications"
  type        = string
}

variable "backup_retention_days" {
  description = "Number of days to retain backups (GDPR compliance)"
  type        = number
  default     = 2555 # 7 years
}

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}

variable "enable_monitoring" {
  description = "Enable detailed monitoring"
  type        = bool
  default     = true
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for production resources"
  type        = bool
  default     = true
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the application"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"
}

variable "allocated_storage" {
  description = "Allocated storage for RDS instance"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Maximum allocated storage for RDS instance"
  type        = number
  default     = 100
}

variable "multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = true
}

variable "enable_performance_insights" {
  description = "Enable Performance Insights for RDS"
  type        = bool
  default     = true
}

variable "performance_insights_retention_period" {
  description = "Performance Insights retention period in days"
  type        = number
  default     = 7
}

variable "monitoring_interval" {
  description = "RDS monitoring interval in seconds"
  type        = number
  default     = 60
}

variable "backup_window" {
  description = "RDS backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "RDS maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

# GDPR Compliance Variables
variable "gdpr_compliance_enabled" {
  description = "Enable GDPR compliance features"
  type        = bool
  default     = true
}

variable "data_retention_years" {
  description = "Data retention period in years (GDPR compliance)"
  type        = number
  default     = 7
}

variable "enable_encryption_at_rest" {
  description = "Enable encryption at rest for all resources"
  type        = bool
  default     = true
}

variable "enable_encryption_in_transit" {
  description = "Enable encryption in transit"
  type        = bool
  default     = true
}

variable "enable_audit_logging" {
  description = "Enable audit logging for compliance"
  type        = bool
  default     = true
}

variable "enable_data_classification" {
  description = "Enable data classification and tagging"
  type        = bool
  default     = true
}

variable "privacy_contact_email" {
  description = "Privacy contact email for GDPR compliance"
  type        = string
  default     = "privacy@cleyfi.com"
}

variable "dpo_contact_email" {
  description = "Data Protection Officer contact email"
  type        = string
  default     = "dpo@cleyfi.com"
}

# Security Variables
variable "enable_waf" {
  description = "Enable AWS WAF for application protection"
  type        = bool
  default     = true
}

variable "enable_shield" {
  description = "Enable AWS Shield for DDoS protection"
  type        = bool
  default     = true
}

variable "enable_guardduty" {
  description = "Enable AWS GuardDuty for threat detection"
  type        = bool
  default     = true
}

variable "enable_config" {
  description = "Enable AWS Config for compliance monitoring"
  type        = bool
  default     = true
}

# Cost Optimization Variables
variable "enable_spot_instances" {
  description = "Enable spot instances for cost optimization"
  type        = bool
  default     = false
}

variable "enable_auto_scaling" {
  description = "Enable auto scaling for EC2 instances"
  type        = bool
  default     = true
}

variable "min_capacity" {
  description = "Minimum capacity for auto scaling"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum capacity for auto scaling"
  type        = number
  default     = 5
}

variable "desired_capacity" {
  description = "Desired capacity for auto scaling"
  type        = number
  default     = 2
}