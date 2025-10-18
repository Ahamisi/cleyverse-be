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
      DATABASE_URL: 'postgresql://cleyverse:Cleyverse2024%21SecureDB%23@cleyverse-db-staging.cwlea4ym8h2p.us-east-1.rds.amazonaws.com:5432/cleyverse_staging',
      JWT_SECRET: 'Cleyverse2024!JWTSecret#SuperSecureKeyForProduction',
      PAYSTACK_SECRET_KEY: 'sk_test_b64f9f3df70c270f5ff191b77c7c4abe7e74ea50',
      PAYSTACK_PUBLIC_KEY: 'pk_test_a095478e878b67ff99f634c943d5ac36a2788684',
      PAYSTACK_WEBHOOK_SECRET: 'https://api-staging.cleyfi.com/api/webhooks/paystack',
      FRONTEND_URL: 'https://cleyfi.com',
      DIGITAL_FILES_PATH: '/var/www/cleyverse/uploads/digital',
      // AWS SES Configuration
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'YOUR_AWS_ACCESS_KEY_ID',
      AWS_SECRET_ACCESS_KEY: 'YOUR_AWS_SECRET_ACCESS_KEY',
      SES_FROM_EMAIL: 'noreply@cleyfi.com',
      SES_FROM_NAME: 'Cleyverse',
      // AWS S3 Configuration
      S3_BUCKET_NAME: 'cleyverse-digital-files-staging',
      S3_REGION: 'us-east-1',
    },
    error_file: '/home/ubuntu/.pm2/logs/cleyverse-api-error.log',
    out_file: '/home/ubuntu/.pm2/logs/cleyverse-api-out.log',
    log_file: '/home/ubuntu/.pm2/logs/cleyverse-api-combined.log',
    time: true
  }]
};
