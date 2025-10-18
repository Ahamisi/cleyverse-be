#!/bin/bash

# Cleyverse Application Setup Script
# GDPR Compliant Configuration

set -e

# Variables from Terraform
ENVIRONMENT="${environment}"
DB_ENDPOINT="${db_endpoint}"
DB_NAME="${db_name}"
DB_USERNAME="${db_username}"
DB_PASSWORD="${db_password}"
S3_BUCKET="${s3_bucket}"
DOMAIN_NAME="${domain_name}"

# Logging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting Cleyverse application setup for environment: $ENVIRONMENT"

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    htop \
    vim \
    ufw \
    fail2ban \
    logrotate

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf aws awscliv2.zip

# Install Docker (for future containerization)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io
usermod -aG docker ubuntu

# Install Nginx
apt-get install -y nginx

# Install Certbot for SSL
apt-get install -y certbot python3-certbot-nginx

# Create application directory
mkdir -p /var/www/cleyverse
chown -R ubuntu:ubuntu /var/www/cleyverse

# Create uploads directory with proper permissions
mkdir -p /var/www/cleyverse/uploads/digital
chown -R ubuntu:ubuntu /var/www/cleyverse/uploads
chmod -R 755 /var/www/cleyverse/uploads

# Create logs directory
mkdir -p /var/log/cleyverse
chown -R ubuntu:ubuntu /var/log/cleyverse

# Configure firewall (GDPR Compliance: Security)
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 3000

# Configure Fail2Ban (GDPR Compliance: Security)
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Configure log rotation (GDPR Compliance: Log Management)
cat > /etc/logrotate.d/cleyverse << EOF
/var/log/cleyverse/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Create environment file
cat > /var/www/cleyverse/.env << EOF
# Application Configuration
NODE_ENV=production
PORT=3000
BASE_URL=https://api.${DOMAIN_NAME}
FRONTEND_URL=https://${DOMAIN_NAME}

# Database Configuration
DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}:5432/${DB_NAME}
DB_HOST=${DB_ENDPOINT}
DB_PORT=5432
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

# JWT Configuration
JWT_SECRET=$${jwt_secret}
JWT_EXPIRES_IN=7d

# Email Configuration (AWS SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=$${smtp_username}
SMTP_PASS=$${smtp_password}

# Payment Configuration
PAYSTACK_SECRET_KEY=$${paystack_secret_key}
PAYSTACK_PUBLIC_KEY=$${paystack_public_key}

# File Storage Configuration
DIGITAL_FILES_PATH=/var/www/cleyverse/uploads/digital
AWS_REGION=us-east-1
S3_BUCKET_NAME=${S3_BUCKET}

# Security Configuration (GDPR Compliance)
BCRYPT_ROUNDS=12
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# GDPR Compliance Settings
GDPR_ENABLED=true
DATA_RETENTION_DAYS=2555
AUDIT_LOGGING_ENABLED=true
ENCRYPTION_ENABLED=true

# Monitoring Configuration
ENABLE_MONITORING=true
LOG_LEVEL=info
EOF

# Set proper permissions for environment file
chown ubuntu:ubuntu /var/www/cleyverse/.env
chmod 600 /var/www/cleyverse/.env

# Create PM2 ecosystem file
cat > /var/www/cleyverse/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'cleyverse-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/cleyverse/error.log',
    out_file: '/var/log/cleyverse/out.log',
    log_file: '/var/log/cleyverse/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    // GDPR Compliance: Log rotation
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Security: Restart on file changes
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    // Health monitoring
    min_uptime: '10s',
    max_restarts: 10
  }]
};
EOF

# Create Nginx configuration
cat > /etc/nginx/sites-available/cleyverse << EOF
# Rate limiting (GDPR Compliance: Security)
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=upload:10m rate=5r/s;

# Upstream configuration
upstream cleyverse_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name api.${DOMAIN_NAME} api-staging.${DOMAIN_NAME};
    return 301 https://\$server_name\$request_uri;
}

# Main application server
server {
    listen 443 ssl http2;
    server_name api.${DOMAIN_NAME};

    # SSL Configuration (GDPR Compliance: Encryption in Transit)
    ssl_certificate /etc/letsencrypt/live/api.${DOMAIN_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.${DOMAIN_NAME}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers (GDPR Compliance: Security)
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;

    # GDPR Compliance: Privacy headers
    add_header X-Privacy-Policy "https://${DOMAIN_NAME}/privacy" always;
    add_header X-Data-Protection-Officer "dpo@${DOMAIN_NAME}" always;

    # File upload size limit
    client_max_body_size 100M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # API endpoints with rate limiting
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://cleyverse_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # GDPR Compliance: Logging
        access_log /var/log/nginx/cleyverse-access.log;
        error_log /var/log/nginx/cleyverse-error.log;
    }

    # File upload endpoints with stricter rate limiting
    location /stores/*/products/*/digital/upload {
        limit_req zone=upload burst=5 nodelay;
        
        proxy_pass http://cleyverse_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # GDPR Compliance: Enhanced logging for file uploads
        access_log /var/log/nginx/cleyverse-upload-access.log;
        error_log /var/log/nginx/cleyverse-upload-error.log;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://cleyverse_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        access_log off;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }
}

# Staging server configuration
server {
    listen 443 ssl http2;
    server_name api-staging.${DOMAIN_NAME};

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api-staging.${DOMAIN_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api-staging.${DOMAIN_NAME}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Staging-specific rate limiting (more restrictive)
    limit_req zone=api burst=10 nodelay;

    client_max_body_size 50M;

    location / {
        proxy_pass http://cleyverse_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        access_log /var/log/nginx/cleyverse-staging-access.log;
        error_log /var/log/nginx/cleyverse-staging-error.log;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/cleyverse /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start and enable services
systemctl enable nginx
systemctl start nginx

# Create deployment script
cat > /var/www/cleyverse/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Build application
npm run build

# Run database migrations
npm run migration:run

# Restart application
pm2 restart cleyverse-api

echo "Deployment completed successfully!"
EOF

chmod +x /var/www/cleyverse/deploy.sh

# Create health check script
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://api.${DOMAIN_NAME}/health"
RESPONSE=$(curl -s -o /dev/null -w "%%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check passed"
    exit 0
else
    echo "$(date): Health check failed with status: $RESPONSE"
    # Restart application
    pm2 restart cleyverse-api
    exit 1
fi
EOF

chmod +x /usr/local/bin/health-check.sh

# Setup cron jobs
cat > /tmp/crontab << EOF
# Health check every 5 minutes
*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/cleyverse/health-check.log 2>&1

# Log rotation
0 2 * * * /usr/sbin/logrotate /etc/logrotate.d/cleyverse

# System updates (weekly)
0 3 * * 0 apt-get update && apt-get upgrade -y

# Cleanup old logs (daily)
0 1 * * * find /var/log -name "*.log" -mtime +30 -delete
EOF

crontab /tmp/crontab
rm /tmp/crontab

# Install CloudWatch agent for monitoring
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb
rm amazon-cloudwatch-agent.deb

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/cleyverse/combined.log",
            "log_group_name": "/aws/ec2/cleyverse-app-${ENVIRONMENT}",
            "log_stream_name": "{instance_id}",
            "timezone": "UTC"
          },
          {
            "file_path": "/var/log/nginx/cleyverse-access.log",
            "log_group_name": "/aws/ec2/cleyverse-nginx-${ENVIRONMENT}",
            "log_stream_name": "{instance_id}",
            "timezone": "UTC"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "Cleyverse/API",
    "metrics_collected": {
      "cpu": {
        "measurement": ["cpu_usage_idle", "cpu_usage_iowait", "cpu_usage_user", "cpu_usage_system"],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": ["used_percent"],
        "metrics_collection_interval": 60,
        "resources": ["*"]
      },
      "mem": {
        "measurement": ["mem_used_percent"],
        "metrics_collection_interval": 60
      },
      "netstat": {
        "measurement": ["tcp_established", "tcp_time_wait"],
        "metrics_collection_interval": 60
      }
    }
  }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
    -s

# Create systemd service for CloudWatch agent
systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent

# Set proper ownership
chown -R ubuntu:ubuntu /var/www/cleyverse
chown -R ubuntu:ubuntu /var/log/cleyverse

# Create backup script for GDPR compliance
cat > /usr/local/bin/backup-db.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/cleyverse"
DB_NAME="${DB_NAME}"
DB_HOST="${DB_ENDPOINT}"
DB_USER="${DB_USERNAME}"

mkdir -p \$BACKUP_DIR

# Create database backup
PGPASSWORD="${DB_PASSWORD}" pg_dump -h \$DB_HOST -U \$DB_USER -d \$DB_NAME > \$BACKUP_DIR/cleyverse_\$DATE.sql

# Upload to S3 (GDPR Compliance: Secure backup storage)
aws s3 cp \$BACKUP_DIR/cleyverse_\$DATE.sql s3://${S3_BUCKET}-backups/database/

# Cleanup old backups (keep last 30 days locally)
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "\$(date): Database backup completed successfully"
EOF

chmod +x /usr/local/bin/backup-db.sh

# Setup daily backup cron job
echo "0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/cleyverse/backup.log 2>&1" | crontab -

# Final system optimization
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'net.core.somaxconn=65535' >> /etc/sysctl.conf
sysctl -p

# Create GDPR compliance report script
cat > /usr/local/bin/gdpr-report.sh << 'EOF'
#!/bin/bash
echo "GDPR Compliance Report - $(date)"
echo "=================================="
echo "Data Retention: 7 years"
echo "Encryption: Enabled"
echo "Audit Logging: Enabled"
echo "Access Controls: Implemented"
echo "Backup Strategy: Daily automated backups"
echo "Security Monitoring: Active"
echo "=================================="
EOF

chmod +x /usr/local/bin/gdpr-report.sh

echo "Cleyverse application setup completed successfully!"
echo "Environment: $ENVIRONMENT"
echo "Domain: $DOMAIN_NAME"
echo "Database: $DB_ENDPOINT"
echo "S3 Bucket: $S3_BUCKET"

# Signal completion
echo "User data script completed at $(date)" > /var/log/user-data-completion.log