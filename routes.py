from flask import request, jsonify, send_from_directory
from app import app, db
from models import User
import logging


@app.route('/')
def index():
    """Serve the main login/registration page"""
    return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files from root directory"""
    return send_from_directory('.', filename)


@app.route('/api/login', methods=['POST'])
def login():
    """Handle login requests"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        identifier = data.get('identifier')  # email or username
        password = data.get('password')
        
        if not identifier or not password:
            return jsonify({'success': False, 'message': 'Email/username and password are required'}), 400
        
        # Try to find user by email or username
        user = User.query.filter(
            (User.email == identifier) | (User.username == identifier)
        ).first()
        
        if user and user.check_password(password):
            return jsonify({
                'success': True, 
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'full_name': user.full_name
                }
            })
        else:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred during login'}), 500


@app.route('/api/register', methods=['POST'])
def register():
    """Handle registration requests"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Extract and validate required fields
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        full_name = data.get('fullName', '').strip()
        role = data.get('role', '').strip()
        
        # Validation
        if not all([username, email, password, full_name, role]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if role not in ['student', 'teacher']:
            return jsonify({'success': False, 'message': 'Invalid role selected'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters long'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == email) | (User.username == username)
        ).first()
        
        if existing_user:
            if existing_user.email == email:
                return jsonify({'success': False, 'message': 'Email already registered'}), 409
            else:
                return jsonify({'success': False, 'message': 'Username already taken'}), 409
        
        # Create new user
        new_user = User(
            username=username,
            email=email,
            full_name=full_name,
            role=role
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'role': new_user.role,
                'full_name': new_user.full_name
            }
        })
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Registration error: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred during registration'}), 500


@app.route('/api/check-availability', methods=['POST'])
def check_availability():
    """Check if username or email is available"""
    try:
        data = request.get_json()
        field = data.get('field')  # 'username' or 'email'
        value = data.get('value', '').strip()
        
        if not field or not value:
            return jsonify({'available': False})
        
        if field == 'username':
            exists = User.query.filter_by(username=value).first() is not None
        elif field == 'email':
            exists = User.query.filter_by(email=value).first() is not None
        else:
            return jsonify({'available': False})
        
        return jsonify({'available': not exists})
        
    except Exception as e:
        logging.error(f"Availability check error: {str(e)}")
        return jsonify({'available': False})
