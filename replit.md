# Overview

This is a Flask-based Student-Teacher Portal web application that provides user authentication and role-based access. The application features a modern dark-themed interface with login and registration functionality, supporting both students and teachers as distinct user roles. The system is designed to be the foundation for educational collaboration tools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Flask web framework with SQLAlchemy ORM for database operations
- **Database**: SQLite for development with PostgreSQL support via environment configuration
- **Authentication**: Username/email-based login with Werkzeug password hashing
- **Session Management**: Flask sessions with configurable secret keys
- **API Design**: RESTful JSON endpoints for frontend-backend communication
- **Deployment**: WSGI-ready with ProxyFix middleware for reverse proxy support

## Frontend Architecture
- **Template Engine**: Jinja2 templates with Bootstrap 5 for responsive UI
- **Styling**: Custom CSS with CSS variables for dark theme consistency
- **JavaScript**: Vanilla JavaScript with modular functionality for form handling
- **UI Components**: Tab-based navigation, real-time form validation, and password strength indicators
- **Icons**: Font Awesome integration for visual elements

## Database Schema
- **User Model**: Stores user credentials, profile information, and role assignment
- **Role System**: Simple string-based roles ('student' or 'teacher') for access control
- **Security**: Password hashing with Werkzeug's secure methods
- **Timestamps**: Created_at tracking for user registration

## Security Features
- **Password Hashing**: Werkzeug generate_password_hash with 256-character hash storage
- **Input Validation**: Server-side validation with client-side feedback
- **Session Security**: Configurable session secrets with environment variable support
- **Error Handling**: Comprehensive logging and user-friendly error messages

# External Dependencies

## Core Dependencies
- **Flask**: Web framework and application server
- **Flask-SQLAlchemy**: Database ORM and migration support
- **Werkzeug**: Password security and WSGI utilities
- **SQLAlchemy**: Database abstraction layer

## Frontend Dependencies
- **Bootstrap 5**: CSS framework via CDN
- **Font Awesome 6**: Icon library via CDN

## Development Tools
- **Logging**: Python's built-in logging module for debugging
- **Environment Variables**: Configuration management for database URLs and secrets

## Database Support
- **SQLite**: Default development database
- **PostgreSQL**: Production database support via DATABASE_URL environment variable
- **Connection Pooling**: Configured for production reliability with pool recycling