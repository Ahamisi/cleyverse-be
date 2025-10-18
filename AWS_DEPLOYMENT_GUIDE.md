# 🚀 Cleyverse AWS Deployment Guide

## Overview

This guide will help you deploy the Cleyverse backend to AWS with **GDPR compliance**, **enterprise-grade security**, and **production-ready infrastructure**.

## 🌐 Domain Structure

- **Production API**: `api.cleyfi.com`
- **Staging API**: `api-staging.cleyfi.com`
- **Frontend**: `cleyfi.com`
- **Admin Dashboard**: `admin.cleyfi.com`

## 🔒 GDPR Compliance Features

✅ **Data Encryption**: All data encrypted at rest and in transit  
✅ **Audit Logging**: Complete audit trail for all activities  
✅ **Data Retention**: 7-year retention policy as per GDPR  
✅ **Access Controls**: Role-based access with monitoring  
✅ **Privacy Headers**: GDPR-compliant HTTP headers  
✅ **Data Classification**: Automatic data tagging and classification  
✅ **Backup Strategy**: Secure, encrypted backups with retention  
✅ **Right to be Forgotten**: Automated data deletion capabilities  

## 📋 Prerequisites

### 1. AWS Account Setup
- AWS account with appropriate permissions
- AWS CLI installed and configured
- Terraform installed (version >= 1.0)

### 2. Domain Configuration
- Domain `cleyfi.com` registered
- DNS management access
- SSL certificate capability

### 3. Required Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Configure AWS CLI
aws configure
```

### 4. SSH Key Pair
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/cleyverse-key-production.pem
ssh-keygen -t rsa -b 4096 -f ~/.ssh/cleyverse-key-staging.pem
```

## 🏗️ Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Cloud Infrastructure                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Production    │    │     Staging     │                │
│  │   Environment   │    │   Environment   │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┤
│  │                VPC (10.0.0.0/16)                       │
│  │  ┌─────────────────┐    ┌─────────────────┐            │
│  │  │  Public Subnet  │    │  Private Subnet │            │
│  │  │  (10.0.1.0/24)  │    │  (10.0.10.0/24) │            │
│  │  │                 │    │                 │            │
│  │  │  ┌───────────┐  │    │  ┌───────────┐  │            │
│  │  │  │    EC2    │  │    │  │    RDS    │  │            │
│  │  │  │  Instance │  │    │  │ PostgreSQL│  │            │
│  │  │  │           │  │    │  │           │  │            │
│  │  │  │  Nginx    │  │    │  │  Encrypted│  │            │
│  │  │  │  Node.js  │  │    │  │  Backups  │  │            │
│  │  │  │  PM2      │  │    │  │  Multi-AZ │  │            │
│  │  │  └───────────┘  │    │  └───────────┘  │            │
│  │  └─────────────────┘    └─────────────────┘            │
│  └─────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │      S3         │    │   CloudWatch    │                │
│  │  Digital Files  │    │   Monitoring    │                │
│  │  Encrypted      │    │   Logs & Metrics│                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   CloudTrail    │    │   Route 53      │                │
│  │  Audit Logging  │    │   DNS & SSL     │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Deployment

### Step 1: Configure Environment Variables

```bash
# Copy the example configuration
cp aws-infrastructure/terraform/terraform.tfvars.example aws-infrastructure/terraform/terraform.tfvars

# Edit with your actual values
nano aws-infrastructure/terraform/terraform.tfvars
```

**Required Configuration:**
```hcl
# AWS Configuration
aws_region = "us-east-1"
environment = "production"  # or "staging"

# Domain Configuration
domain_name = "cleyfi.com"

# Database Configuration
db_password = "your-secure-database-password-here"

# SSH Key Configuration
public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC... your-public-key-here"

# Payment Configuration
paystack_secret_key = "sk_live_your_paystack_secret_key"
paystack_public_key = "pk_live_your_paystack_public_key"

# JWT Configuration
jwt_secret = "your-super-secure-jwt-secret-key-here"

# Email Configuration (AWS SES)
smtp_username = "your-ses-smtp-username"
smtp_password = "your-ses-smtp-password"

# Admin Configuration
admin_email = "admin@cleyfi.com"
```

### Step 2: Deploy Infrastructure

```bash
# Deploy to production
./aws-infrastructure/deploy.sh production

# Or deploy to staging
./aws-infrastructure/deploy.sh staging
```

### Step 3: Configure DNS

After deployment, update your DNS records:

```
# A Records
api.cleyfi.com          → [EC2_PUBLIC_IP]
api-staging.cleyfi.com  → [EC2_PUBLIC_IP]

# CNAME Records (optional)
www.cleyfi.com          → cleyfi.com
admin.cleyfi.com        → cleyfi.com
```

## 📊 Cost Estimation

### Production Environment
- **EC2 t3.medium**: ~$30/month
- **RDS db.t3.small**: ~$25/month
- **S3 Storage**: ~$5/month
- **Data Transfer**: ~$10/month
- **CloudWatch**: ~$5/month
- **Total**: ~$75-100/month

### Staging Environment
- **EC2 t3.micro**: ~$8/month
- **RDS db.t3.micro**: ~$15/month
- **S3 Storage**: ~$2/month
- **Data Transfer**: ~$3/month
- **CloudWatch**: ~$2/month
- **Total**: ~$30-40/month

## 🔧 Manual Deployment Steps

If you prefer manual deployment:

### 1. Deploy Infrastructure
```bash
cd aws-infrastructure/terraform
terraform init
terraform plan -var="environment=production"
terraform apply
```

### 2. Setup SSL Certificates
```bash
# SSH into EC2 instance
ssh -i ~/.ssh/cleyverse-key-production.pem ubuntu@[EC2_IP]

# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d api.cleyfi.com --non-interactive --agree-tos --email admin@cleyfi.com
sudo certbot --nginx -d api-staging.cleyfi.com --non-interactive --agree-tos --email admin@cleyfi.com

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 3. Deploy Application
```bash
# Copy application files
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
    -e "ssh -i ~/.ssh/cleyverse-key-production.pem" \
    ../api/ ubuntu@[EC2_IP]:/var/www/cleyverse/

# SSH and deploy
ssh -i ~/.ssh/cleyverse-key-production.pem ubuntu@[EC2_IP]
cd /var/www/cleyverse
npm install --production
npm run build
npm run migration:run
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔍 Monitoring & Maintenance

### Health Checks
```bash
# Check application status
curl https://api.cleyfi.com/health

# Check database connection
curl https://api.cleyfi.com/health | jq '.database'

# Check SSL certificate
openssl s_client -connect api.cleyfi.com:443 -servername api.cleyfi.com
```

### Log Monitoring
```bash
# Application logs
pm2 logs cleyverse-api

# Nginx logs
sudo tail -f /var/log/nginx/cleyverse-access.log
sudo tail -f /var/log/nginx/cleyverse-error.log

# System logs
sudo journalctl -u nginx -f
```

### Backup Verification
```bash
# Check backup status
sudo /usr/local/bin/backup-db.sh

# List S3 backups
aws s3 ls s3://cleyverse-digital-files-production-[hash]-backups/database/
```

## 🛡️ Security Features

### GDPR Compliance
- **Data Encryption**: AES-256 encryption for all data
- **Audit Logging**: Complete activity logs with CloudTrail
- **Access Controls**: Role-based permissions
- **Data Retention**: 7-year automated retention
- **Right to be Forgotten**: Automated data deletion
- **Privacy Headers**: GDPR-compliant HTTP headers

### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Privacy-Policy: https://cleyfi.com/privacy
X-Data-Protection-Officer: dpo@cleyfi.com
```

### Rate Limiting
- **API Endpoints**: 10 requests/second
- **File Uploads**: 5 requests/second
- **Staging**: More restrictive limits

## 🔄 CI/CD Pipeline

### Automated Deployment
```bash
# GitHub Actions workflow
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Production
        run: ./aws-infrastructure/deploy.sh production
```

### Environment Promotion
```bash
# Deploy to staging first
./aws-infrastructure/deploy.sh staging

# Test staging environment
curl https://api-staging.cleyfi.com/health

# Deploy to production
./aws-infrastructure/deploy.sh production
```

## 🚨 Troubleshooting

### Common Issues

#### 1. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run
sudo certbot renew
```

#### 2. Database Connection Issues
```bash
# Check database status
aws rds describe-db-instances --db-instance-identifier cleyverse-db-production

# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx
```

#### 3. Application Not Starting
```bash
# Check PM2 status
pm2 status
pm2 logs cleyverse-api

# Check system resources
htop
df -h
free -h
```

#### 4. High Memory Usage
```bash
# Restart application
pm2 restart cleyverse-api

# Check for memory leaks
pm2 monit
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### 2. Application Optimization
```bash
# Enable gzip compression
sudo nano /etc/nginx/sites-available/cleyverse

# Add to server block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks

#### Daily
- Monitor application health
- Check error logs
- Verify backup completion

#### Weekly
- Review security logs
- Update system packages
- Check SSL certificate expiration

#### Monthly
- Review cost optimization
- Update dependencies
- Security audit

### Contact Information
- **Technical Support**: tech@cleyfi.com
- **Security Issues**: security@cleyfi.com
- **GDPR Inquiries**: dpo@cleyfi.com

## 🎯 Next Steps

After successful deployment:

1. **Configure Frontend**: Update frontend to use new API URLs
2. **Set Up Monitoring**: Configure CloudWatch alerts
3. **Test All Features**: Verify all API endpoints work correctly
4. **Load Testing**: Test with expected traffic levels
5. **Security Audit**: Review security configurations
6. **Documentation**: Update team documentation
7. **Training**: Train team on new infrastructure

## 📚 Additional Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [Terraform Documentation](https://terraform.io/docs)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PM2 Process Manager](https://pm2.keymetrics.io/docs/)

---

**🎉 Congratulations! Your Cleyverse backend is now deployed on AWS with enterprise-grade security and GDPR compliance!**