-- PostgreSQL Database Setup Script
-- Run this script to create the database and user

-- Create database (run as postgres superuser)
CREATE DATABASE db_name;

-- Create user
CREATE USER pritesh WITH PASSWORD 'pritesh';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE db_name TO pritesh;

-- Connect to the database
\c db_name

-- Grant schema privileges (optional, for more control)
GRANT ALL ON SCHEMA public TO pritesh;

-- Note: Tables will be automatically created by TypeORM when the app starts
-- with synchronize: true enabled (development mode only)

