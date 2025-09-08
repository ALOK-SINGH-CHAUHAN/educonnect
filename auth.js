const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('./User');

const router = express.Router();

// Login endpoint
router.post('/login', [
    body('identifier').notEmpty().withMessage('Email/username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Email/username and password are required'
            });
        }

        const { identifier, password } = req.body;

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });

        if (user && user.checkPassword(password)) {
            res.json({
                success: true,
                message: 'Login successful',
                user: user.toJSON()
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
});

// Registration endpoint
router.post('/register', [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('role').isIn(['student', 'teacher']).withMessage('Invalid role selected')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { username, email, password, fullName, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered'
                });
            } else {
                return res.status(409).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }

        // Create new user
        const newUser = new User({
            username: username,
            email: email,
            full_name: fullName,
            role: role
        });

        newUser.setPassword(password);
        await newUser.save();

        res.json({
            success: true,
            message: 'Registration successful',
            user: newUser.toJSON()
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during registration'
        });
    }
});

// Check availability endpoint
router.post('/check-availability', async (req, res) => {
    try {
        const { field, value } = req.body;

        if (!field || !value) {
            return res.json({ available: false });
        }

        let query = {};
        if (field === 'username') {
            query.username = value.trim();
        } else if (field === 'email') {
            query.email = value.trim().toLowerCase();
        } else {
            return res.json({ available: false });
        }

        const exists = await User.findOne(query);
        res.json({ available: !exists });

    } catch (error) {
        console.error('Availability check error:', error);
        res.json({ available: false });
    }
});

module.exports = router;