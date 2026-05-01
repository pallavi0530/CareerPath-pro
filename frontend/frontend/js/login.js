// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
});

function initializeLoginPage() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Get error elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Get modal elements
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetEmailInput = document.getElementById('resetEmail');
    const resetEmailError = document.getElementById('resetEmailError');
    const resetSpinner = document.getElementById('resetSpinner');
    
    // Get social login buttons
    const googleLoginBtn = document.getElementById('googleLogin');
    const linkedinLoginBtn = document.getElementById('linkedinLogin');
    
    // Get toast notification
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');
    
    // Password toggle functionality
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6;
    }
    
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }
    
    function hideError(element) {
        element.textContent = '';
        element.classList.remove('show');
    }
    
    function clearErrors() {
        hideError(emailError);
        hideError(passwordError);
        hideError(resetEmailError);
    }
    
    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = emailInput.value.trim();
            if (email && !validateEmail(email)) {
                showError(emailError, 'Please enter a valid email address');
            } else {
                hideError(emailError);
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (emailError.classList.contains('show')) {
                hideError(emailError);
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            const password = passwordInput.value;
            if (password && !validatePassword(password)) {
                showError(passwordError, 'Password must be at least 6 characters long');
            } else {
                hideError(passwordError);
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (passwordError.classList.contains('show')) {
                hideError(passwordError);
            }
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = rememberMeCheckbox.checked;
            
            // Clear previous errors
            clearErrors();
            
            // Validate form
            let hasErrors = false;
            
            if (!email) {
                showError(emailError, 'Email is required');
                hasErrors = true;
            } else if (!validateEmail(email)) {
                showError(emailError, 'Please enter a valid email address');
                hasErrors = true;
            }
            
            if (!password) {
                showError(passwordError, 'Password is required');
                hasErrors = true;
            } else if (!validatePassword(password)) {
                showError(passwordError, 'Password must be at least 6 characters long');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Show loading state
            showLoadingState(loginBtn, loginSpinner);
            
            try {
                // Simulate API call
                const response = await simulateLogin(email, password, rememberMe);
                
                if (response.success) {
                    // Store user data
                    if (rememberMe) {
                        localStorage.setItem('user', JSON.stringify(response.user));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(response.user));
                    }
                    
                    // Show success message
                    showToast('Login successful! Redirecting...', 'success');
                    
                    // Redirect to home page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showToast(response.message || 'Login failed. Please check your credentials.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('An error occurred. Please try again.', 'error');
            } finally {
                hideLoadingState(loginBtn, loginSpinner);
            }
        });
    }
    
    // Forgot password functionality
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showModal(forgotPasswordModal);
        });
    }
    
    if (closeForgotModal) {
        closeForgotModal.addEventListener('click', function() {
            hideModal(forgotPasswordModal);
        });
    }
    
    // Close modal when clicking outside
    if (forgotPasswordModal) {
        forgotPasswordModal.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                hideModal(forgotPasswordModal);
            }
        });
    }
    
    // Forgot password form submission
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = resetEmailInput.value.trim();
            
            if (!email) {
                showError(resetEmailError, 'Email is required');
                return;
            }
            
            if (!validateEmail(email)) {
                showError(resetEmailError, 'Please enter a valid email address');
                return;
            }
            
            // Show loading state
            showLoadingState(forgotPasswordForm.querySelector('button'), resetSpinner);
            
            try {
                // Simulate API call
                const response = await simulateForgotPassword(email);
                
                if (response.success) {
                    showToast('Password reset link sent to your email!', 'success');
                    hideModal(forgotPasswordModal);
                    resetEmailInput.value = '';
                } else {
                    showToast(response.message || 'Failed to send reset link. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                showToast('An error occurred. Please try again.', 'error');
            } finally {
                hideLoadingState(forgotPasswordForm.querySelector('button'), resetSpinner);
            }
        });
    }
    
    // Social login functionality
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            handleSocialLogin('google');
        });
    }
    
    if (linkedinLoginBtn) {
        linkedinLoginBtn.addEventListener('click', function() {
            handleSocialLogin('linkedin');
        });
    }
    
    // Toast notification functionality
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            hideToast();
        });
    }
    
    // Auto-hide toast after 5 seconds
    if (toast) {
        toast.addEventListener('animationend', function() {
            if (toast.classList.contains('show')) {
                setTimeout(hideToast, 5000);
            }
        });
    }
}

// Simulate login API call
async function simulateLogin(email, password, rememberMe) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - in real app, this would be an API call
    const validCredentials = {
        'user@example.com': 'password123',
        'admin@example.com': 'admin123',
        'test@example.com': 'test123'
    };
    
    if (validCredentials[email] && validCredentials[email] === password) {
        return {
            success: true,
            user: {
                id: 1,
                email: email,
                name: email.split('@')[0],
                avatar: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=' + email.charAt(0).toUpperCase()
            }
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }
}

// Simulate forgot password API call
async function simulateForgotPassword(email) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - in real app, this would be an API call
    return {
        success: true,
        message: 'Password reset link sent to your email'
    };
}

// Handle social login
function handleSocialLogin(provider) {
    showToast(`Redirecting to ${provider} login...`, 'info');
    
    // In a real app, this would redirect to the OAuth provider
    setTimeout(() => {
        showToast(`${provider} login is not implemented yet. Please use email/password.`, 'warning');
    }, 1000);
}

// Show loading state
function showLoadingState(button, spinner) {
    if (button) {
        button.disabled = true;
        button.querySelector('.btn-text').style.opacity = '0.5';
    }
    if (spinner) {
        spinner.classList.add('show');
    }
}

// Hide loading state
function hideLoadingState(button, spinner) {
    if (button) {
        button.disabled = false;
        button.querySelector('.btn-text').style.opacity = '1';
    }
    if (spinner) {
        spinner.classList.remove('show');
    }
}

// Show modal
function showModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal
function hideModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (toast && toastMessage) {
        // Set message
        toastMessage.textContent = message;
        
        // Set type and icon
        toast.className = `toast ${type}`;
        
        if (toastIcon) {
            switch (type) {
                case 'success':
                    toastIcon.className = 'toast-icon fas fa-check-circle';
                    break;
                case 'error':
                    toastIcon.className = 'toast-icon fas fa-exclamation-circle';
                    break;
                case 'warning':
                    toastIcon.className = 'toast-icon fas fa-exclamation-triangle';
                    break;
                default:
                    toastIcon.className = 'toast-icon fas fa-info-circle';
            }
        }
        
        // Show toast
        toast.classList.add('show');
    }
}

// Hide toast notification
function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Check if user is already logged in
function checkAuthStatus() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
        // User is already logged in, redirect to home
        window.location.href = 'index.html';
    }
}

// Initialize auth check on page load
checkAuthStatus();

// Handle Enter key for form submission
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        
        // If focused on email input, move to password
        if (activeElement && activeElement.id === 'email') {
            e.preventDefault();
            document.getElementById('password').focus();
        }
        // If focused on password input, submit form
        else if (activeElement && activeElement.id === 'password') {
            e.preventDefault();
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    }
});

// Add form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const inputWrappers = document.querySelectorAll('.input-wrapper');
    
    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        const icon = wrapper.querySelector('i');
        
        if (input && icon) {
            input.addEventListener('focus', function() {
                wrapper.style.borderColor = '#6366f1';
                icon.style.color = '#6366f1';
            });
            
            input.addEventListener('blur', function() {
                wrapper.style.borderColor = '#e5e7eb';
                icon.style.color = '#9ca3af';
            });
        }
    });
});

// Add smooth transitions for form elements
document.addEventListener('DOMContentLoaded', function() {
    const formElements = document.querySelectorAll('.form-group, .btn, .input-wrapper');
    
    formElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
    });
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    if (emailInput) {
        emailInput.setAttribute('aria-label', 'Email address');
        emailInput.setAttribute('aria-describedby', 'emailError');
    }
    
    if (passwordInput) {
        passwordInput.setAttribute('aria-label', 'Password');
        passwordInput.setAttribute('aria-describedby', 'passwordError');
    }
    
    if (loginBtn) {
        loginBtn.setAttribute('aria-label', 'Sign in to your account');
    }
    
    // Add role attributes
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    if (forgotPasswordModal) {
        forgotPasswordModal.setAttribute('role', 'dialog');
        forgotPasswordModal.setAttribute('aria-labelledby', 'forgotPasswordModal');
        forgotPasswordModal.setAttribute('aria-modal', 'true');
    }
});

// Add keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    
    if (forgotPasswordModal && forgotPasswordModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            hideModal(forgotPasswordModal);
        }
    }
});

// Add form validation feedback
function addValidationFeedback() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            
            const fieldName = input.name || input.id;
            const errorElement = document.getElementById(fieldName + 'Error');
            
            if (errorElement) {
                let message = '';
                
                if (input.validity.valueMissing) {
                    message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                } else if (input.validity.typeMismatch) {
                    message = `Please enter a valid ${fieldName}`;
                } else if (input.validity.tooShort) {
                    message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
                }
                
                showError(errorElement, message);
            }
        });
    });
}

// Initialize validation feedback
addValidationFeedback();
