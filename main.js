// DOM elements
const tabButtons = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const alertContainer = document.getElementById('alertContainer');

// Password toggle functionality
const passwordToggles = document.querySelectorAll('.password-toggle');
const passwordInputs = document.querySelectorAll('input[type="password"]');

// Form inputs for validation
const usernameInput = document.getElementById('registerUsername');
const emailInput = document.getElementById('registerEmail');
const passwordInput = document.getElementById('registerPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Debounce function for API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializePasswordToggles();
    initializeFormValidation();
    initializePasswordStrength();
    initializeAvailabilityChecks();
});

// Tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    // Update tab buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    
    // Update forms
    authForms.forEach(form => form.classList.remove('active'));
    document.getElementById(`${targetTab}Form`).classList.add('active');
    
    // Clear alerts when switching tabs
    clearAlerts();
    
    // Reset forms
    if (targetTab === 'login') {
        resetForm(loginForm);
    } else {
        resetForm(registerForm);
    }
}

// Password toggle functionality
function initializePasswordToggles() {
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = toggle.querySelector('i');
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form validation
function initializeFormValidation() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Register form
    registerForm.addEventListener('submit', handleRegister);
    
    // Real-time validation
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Password confirmation validation
    confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);
}

// Password strength indicator
function initializePasswordStrength() {
    passwordInput.addEventListener('input', updatePasswordStrength);
}

function updatePasswordStrength() {
    const password = passwordInput.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthIndicator');
    
    const strength = calculatePasswordStrength(password);
    
    // Remove all strength classes
    strengthBar.className = 'strength-bar';
    
    // Add appropriate strength class
    switch (strength.level) {
        case 1:
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--accent-danger)';
            break;
        case 2:
            strengthBar.classList.add('strength-fair');
            strengthText.textContent = 'Fair';
            strengthText.style.color = 'var(--accent-warning)';
            break;
        case 3:
            strengthBar.classList.add('strength-good');
            strengthText.textContent = 'Good';
            strengthText.style.color = '#1f6feb';
            break;
        case 4:
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = 'var(--accent-primary)';
            break;
        default:
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--accent-danger)';
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    score += checks.length ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.numbers ? 1 : 0;
    score += checks.special ? 1 : 0;
    
    return {
        level: Math.max(1, Math.min(4, score - 1)),
        checks
    };
}

// Availability checks
function initializeAvailabilityChecks() {
    const debouncedUsernameCheck = debounce(checkUsernameAvailability, 500);
    const debouncedEmailCheck = debounce(checkEmailAvailability, 500);
    
    usernameInput.addEventListener('input', debouncedUsernameCheck);
    emailInput.addEventListener('input', debouncedEmailCheck);
}

async function checkUsernameAvailability() {
    const username = usernameInput.value.trim();
    const availabilitySpan = document.getElementById('usernameAvailability');
    
    if (username.length < 3) {
        availabilitySpan.textContent = 'Username must be at least 3 characters';
        availabilitySpan.className = '';
        return;
    }
    
    try {
        const response = await fetch('/api/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                field: 'username',
                value: username
            })
        });
        
        const data = await response.json();
        
        if (data.available) {
            availabilitySpan.textContent = 'Username is available';
            availabilitySpan.className = 'text-success';
        } else {
            availabilitySpan.textContent = 'Username is already taken';
            availabilitySpan.className = 'text-danger';
        }
    } catch (error) {
        console.error('Username availability check failed:', error);
        availabilitySpan.textContent = 'Unable to check availability';
        availabilitySpan.className = 'text-warning';
    }
}

async function checkEmailAvailability() {
    const email = emailInput.value.trim();
    const availabilitySpan = document.getElementById('emailAvailability');
    
    if (!isValidEmail(email)) {
        availabilitySpan.textContent = 'Please enter a valid email address';
        availabilitySpan.className = '';
        return;
    }
    
    try {
        const response = await fetch('/api/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                field: 'email',
                value: email
            })
        });
        
        const data = await response.json();
        
        if (data.available) {
            availabilitySpan.textContent = 'Email is available';
            availabilitySpan.className = 'text-success';
        } else {
            availabilitySpan.textContent = 'Email is already registered';
            availabilitySpan.className = 'text-danger';
        }
    } catch (error) {
        console.error('Email availability check failed:', error);
        availabilitySpan.textContent = 'Unable to check availability';
        availabilitySpan.className = 'text-warning';
    }
}

// Form handlers
async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = loginForm.querySelector('.auth-btn');
    const spinner = submitBtn.querySelector('.spinner-border');
    
    // Clear previous alerts
    clearAlerts();
    
    // Get form data
    const formData = new FormData(loginForm);
    const data = {
        identifier: formData.get('identifier').trim(),
        password: formData.get('password')
    };
    
    // Validate required fields
    if (!data.identifier || !data.password) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, spinner, true);
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(`Welcome back, ${result.user.full_name}!`, 'success');
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Redirect or update UI as needed
            setTimeout(() => {
                // Here you would typically redirect to dashboard
                showAlert(`Login successful! Role: ${result.user.role}`, 'info');
            }, 1500);
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred during login. Please try again.', 'danger');
    } finally {
        setLoadingState(submitBtn, spinner, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const submitBtn = registerForm.querySelector('.auth-btn');
    const spinner = submitBtn.querySelector('.spinner-border');
    
    // Clear previous alerts
    clearAlerts();
    
    // Validate form
    if (!validateRegisterForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(registerForm);
    const data = {
        username: formData.get('username').trim(),
        email: formData.get('email').trim(),
        password: formData.get('password'),
        fullName: formData.get('fullName').trim(),
        role: formData.get('role')
    };
    
    // Show loading state
    setLoadingState(submitBtn, spinner, true);
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(`Account created successfully! Welcome, ${result.user.full_name}!`, 'success');
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Switch to login tab after successful registration
            setTimeout(() => {
                switchTab('login');
                showAlert('Registration successful! You can now log in.', 'info');
            }, 2000);
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('An error occurred during registration. Please try again.', 'danger');
    } finally {
        setLoadingState(submitBtn, spinner, false);
    }
}

// Validation functions
function validateRegisterForm() {
    let isValid = true;
    
    // Validate all required fields
    const requiredFields = [
        { input: usernameInput, name: 'Username' },
        { input: emailInput, name: 'Email' },
        { input: passwordInput, name: 'Password' },
        { input: confirmPasswordInput, name: 'Confirm Password' },
        { input: document.getElementById('registerFullName'), name: 'Full Name' }
    ];
    
    requiredFields.forEach(field => {
        if (!field.input.value.trim()) {
            setFieldError(field.input, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Validate role selection
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const roleSelected = Array.from(roleInputs).some(input => input.checked);
    if (!roleSelected) {
        showAlert('Please select your role (Student or Teacher)', 'danger');
        isValid = false;
    }
    
    // Validate email format
    if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        setFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password strength
    if (passwordInput.value && passwordInput.value.length < 6) {
        setFieldError(passwordInput, 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Validate password confirmation
    if (passwordInput.value !== confirmPasswordInput.value) {
        setFieldError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function validatePasswordConfirmation() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        setFieldError(confirmPasswordInput, 'Passwords do not match');
    } else if (confirmPassword) {
        clearFieldError(confirmPasswordInput);
        setFieldValid(confirmPasswordInput);
    }
}

function validateField(input) {
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        setFieldError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && value && !isValidEmail(value)) {
        setFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(input);
    if (value) setFieldValid(input);
    return true;
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setFieldError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function setFieldValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}

function clearFieldError(input) {
    input.classList.remove('is-invalid', 'is-valid');
    
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
    }
}

function setLoadingState(button, spinner, loading) {
    if (loading) {
        button.disabled = true;
        spinner.classList.remove('d-none');
    } else {
        button.disabled = false;
        spinner.classList.add('d-none');
    }
}

function resetForm(form) {
    form.reset();
    
    // Clear all validation states
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        clearFieldError(input);
    });
    
    // Reset password strength indicator
    if (form === registerForm) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.getElementById('strengthIndicator');
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Weak';
        strengthText.style.color = 'var(--accent-danger)';
        
        // Clear availability indicators
        document.getElementById('usernameAvailability').textContent = '';
        document.getElementById('emailAvailability').textContent = '';
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'danger' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    alertDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        ${message}
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function clearAlerts() {
    alertContainer.innerHTML = '';
}

// Check for existing user session on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        showAlert(`Welcome back, ${userData.full_name}! You are logged in as a ${userData.role}.`, 'info');
    }
});
