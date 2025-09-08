const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher']
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Method to set password
userSchema.methods.setPassword = function(password) {
    this.password_hash = bcrypt.hashSync(password, 10);
};

// Method to check password
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password_hash);
};

// Transform output to match frontend expectations
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    return {
        id: userObject._id,
        username: userObject.username,
        email: userObject.email,
        role: userObject.role,
        full_name: userObject.full_name,
        created_at: userObject.created_at
    };
};

module.exports = mongoose.model('User', userSchema);