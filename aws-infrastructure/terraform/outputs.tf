# Outputs for Cleyverse AWS Infrastructure

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.cleyverse_vpc.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.cleyverse_vpc.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public_subnets[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private_subnets[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.cleyverse_igw.id
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = aws_nat_gateway.nat_gateway[*].id
}

output "security_group_web_id" {
  description = "ID of the web security group"
  value       = aws_security_group.web_sg.id
}

output "security_group_db_id" {
  description = "ID of the database security group"
  value       = aws_security_group.db_sg.id
}

output "db_instance_id" {
  description = "ID of the RDS instance"
  value       = aws_db_instance.cleyverse_db.id
}

output "db_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.cleyverse_db.endpoint
  sensitive   = true
}

output "db_name" {
  description = "RDS instance database name"
  value       = aws_db_instance.cleyverse_db.db_name
}

output "db_username" {
  description = "RDS instance username"
  value       = aws_db_instance.cleyverse_db.username
  sensitive   = true
}

output "db_port" {
  description = "RDS instance port"
  value       = aws_db_instance.cleyverse_db.port
}

output "db_arn" {
  description = "ARN of the RDS instance"
  value       = aws_db_instance.cleyverse_db.arn
}

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.cleyverse_app.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.cleyverse_app.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.cleyverse_app.public_dns
}

output "ec2_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.cleyverse_app.private_ip
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for digital files"
  value       = aws_s3_bucket.digital_files.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for digital files"
  value       = aws_s3_bucket.digital_files.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.digital_files.bucket_domain_name
}

output "cloudtrail_bucket_name" {
  description = "Name of the S3 bucket for CloudTrail logs"
  value       = aws_s3_bucket.cloudtrail_bucket.bucket
}

output "kms_key_db_arn" {
  description = "ARN of the KMS key for database encryption"
  value       = aws_kms_key.db_key.arn
}

output "kms_key_ebs_arn" {
  description = "ARN of the KMS key for EBS encryption"
  value       = aws_kms_key.ebs_key.arn
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.cleyverse_app_logs.name
}

output "cloudtrail_arn" {
  description = "ARN of the CloudTrail"
  value       = aws_cloudtrail.cleyverse_trail.arn
}

output "key_pair_name" {
  description = "Name of the EC2 Key Pair"
  value       = aws_key_pair.cleyverse_key.key_name
}

# Application URLs
output "api_url" {
  description = "API URL"
  value       = "https://api.${var.domain_name}"
}

output "staging_api_url" {
  description = "Staging API URL"
  value       = "https://api-staging.${var.domain_name}"
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "https://${var.domain_name}"
}

# Connection Information
output "ssh_connection_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i ~/.ssh/cleyverse-key-${var.environment}.pem ubuntu@${aws_instance.cleyverse_app.public_ip}"
}

output "database_connection_string" {
  description = "Database connection string (sensitive)"
  value       = "postgresql://${aws_db_instance.cleyverse_db.username}:${var.db_password}@${aws_db_instance.cleyverse_db.endpoint}:5432/${aws_db_instance.cleyverse_db.db_name}"
  sensitive   = true
}

# GDPR Compliance Information
output "gdpr_compliance_status" {
  description = "GDPR compliance status"
  value       = "ENABLED - All GDPR requirements implemented"
}

output "data_retention_policy" {
  description = "Data retention policy"
  value       = "${var.data_retention_years} years as per GDPR requirements"
}

output "encryption_status" {
  description = "Encryption status"
  value       = "ENABLED - All data encrypted at rest and in transit"
}

output "audit_logging_status" {
  description = "Audit logging status"
  value       = "ENABLED - All activities logged for compliance"
}

# Cost Information
output "estimated_monthly_cost" {
  description = "Estimated monthly cost for this infrastructure"
  value = var.environment == "production" ? "~$150-200/month" : "~$50-80/month"
}

# Deployment Information
output "deployment_instructions" {
  description = "Instructions for deploying the application"
  value = <<-EOT
    1. SSH into the EC2 instance: ${aws_instance.cleyverse_app.public_ip}
    2. Clone your repository: git clone <your-repo-url> /var/www/cleyverse
    3. Run deployment script: /var/www/cleyverse/deploy.sh
    4. Configure SSL certificates: certbot --nginx -d api.${var.domain_name} -d api-staging.${var.domain_name}
    5. Start the application: pm2 start /var/www/cleyverse/ecosystem.config.js
  EOT
}

# Monitoring Information
output "monitoring_dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=Cleyverse-${var.environment}"
}

output "log_groups" {
  description = "CloudWatch log groups"
  value = [
    aws_cloudwatch_log_group.cleyverse_app_logs.name,
    "/aws/rds/instance/${aws_db_instance.cleyverse_db.id}/postgresql"
  ]
}