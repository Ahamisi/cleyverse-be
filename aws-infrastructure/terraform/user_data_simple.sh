#!/bin/bash

# Cleyverse Application Setup Script
# GDPR Compliant Configuration

set -e

# Logging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting Cleyverse application setup"

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

# Create environment file (will be updated during deployment)
cat > /var/www/cleyverse/.env << EOF
# Application Configuration
NODE_ENV=production
PORT=3000
BASE_URL=https://api.cleyfi.com
FRONTEND_URL=https://cleyfi.com

# Database Configuration (will be updated during deployment)
DATABASE_URL=postgresql://cleyverse:password@localhost:5432/cleyverse
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=cleyverse
DB_PASSWORD=password
DB_NAME=cleyverse

# JWT Configuration
JWT_SECRET=Cleyverse2024!JWTSecret#SuperSecureKeyForProduction
JWT_EXPIRES_IN=7d

# Email Configuration (AWS SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password

# Payment Configuration
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key

# File Storage Configuration
DIGITAL_FILES_PATH=/var/www/cleyverse/uploads/digital
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket

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
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    min_uptime: '10s',
    max_restarts: 10
  }]
};
EOF

# Create basic Nginx configuration
cat > /etc/nginx/sites-available/cleyverse << EOF
server {
    listen 80;
    server_name api.cleyfi.com api-staging.cleyfi.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
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

# Set proper ownership
chown -R ubuntu:ubuntu /var/www/cleyverse
chown -R ubuntu:ubuntu /var/log/cleyverse

echo "Cleyverse application setup completed successfully!"
echo "Ready for application deployment!"

# Signal completion
echo "User data script completed at $(date)" > /var/log/user-data-completion.log
