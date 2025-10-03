-- Cleyverse Database Initialization
-- Basic schema for the creator economy platform

-- Create user for application
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'cleyverse') THEN
      CREATE USER cleyverse WITH PASSWORD 'password123';
   END IF;
END
$$;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS user_management;
CREATE SCHEMA IF NOT EXISTS payment_processing;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS affiliates;
CREATE SCHEMA IF NOT EXISTS ai_agents;

-- Set search path
SET search_path TO user_management, payment_processing, commerce, events, affiliates, ai_agents, public;

-- Users table (basic structure)
CREATE TABLE IF NOT EXISTS user_management.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'creator' CHECK (role IN ('creator', 'vendor', 'admin', 'support', 'viewer')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification', 'banned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON user_management.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - change in production!)
INSERT INTO user_management.users (
    email, first_name, last_name, role, status
) VALUES (
    'admin@cleyverse.com',
    'Admin',
    'User',
    'admin',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Grant permissions to cleyverse user
GRANT ALL PRIVILEGES ON DATABASE cleyverse TO cleyverse;
GRANT ALL ON SCHEMA user_management TO cleyverse;
GRANT ALL ON SCHEMA payment_processing TO cleyverse;
GRANT ALL ON SCHEMA commerce TO cleyverse;
GRANT ALL ON SCHEMA events TO cleyverse;
GRANT ALL ON SCHEMA affiliates TO cleyverse;
GRANT ALL ON SCHEMA ai_agents TO cleyverse;
GRANT ALL ON ALL TABLES IN SCHEMA user_management TO cleyverse;
GRANT ALL ON ALL SEQUENCES IN SCHEMA user_management TO cleyverse;

COMMENT ON DATABASE cleyverse IS 'Cleyverse - Creator Economy Platform Database';
COMMENT ON SCHEMA user_management IS 'User management and authentication data';