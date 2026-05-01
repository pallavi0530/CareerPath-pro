// Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const registerSpinner = document.getElementById('registerSpinner');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, passwordToggle);
    });

    confirmPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
    });

    // Form validation
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        await handleRegistration();
    });

    // Real-time validation
    document.getElementById('firstName').addEventListener('blur', validateFirstName);
    document.getElementById('lastName').addEventListener('blur', validateLastName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);

    // Social login handlers
    document.getElementById('googleRegister').addEventListener('click', handleGoogleRegister);
    document.getElementById('linkedinRegister').addEventListener('click', handleLinkedInRegister);

    function validateForm() {
        let isValid = true;

        // Clear previous errors
        clearAllErrors();

        // Validate first name
        if (!validateFirstName()) {
            isValid = false;
        }

        // Validate last name
        if (!validateLastName()) {
            isValid = false;
        }

        // Validate email
        if (!validateEmail()) {
            isValid = false;
        }

        // Validate password
        if (!validatePassword()) {
            isValid = false;
        }

        // Validate confirm password
        if (!validateConfirmPassword()) {
            isValid = false;
        }

        // Validate terms agreement
        if (!document.getElementById('agreeTerms').checked) {
            showError('agreeTerms', 'You must agree to the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    function validateFirstName() {
        const firstName = document.getElementById('firstName').value.trim();
        if (!firstName) {
            showError('firstName', 'First name is required');
            return false;
        }
        if (firstName.length < 2) {
            showError('firstName', 'First name must be at least 2 characters');
            return false;
        }
        clearError('firstName');
        return true;
    }

    function validateLastName() {
        const lastName = document.getElementById('lastName').value.trim();
        if (!lastName) {
            showError('lastName', 'Last name is required');
            return false;
        }
        if (lastName.length < 2) {
            showError('lastName', 'Last name must be at least 2 characters');
            return false;
        }
        clearError('lastName');
        return true;
    }

    function validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError('email', 'Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            return false;
        }
        clearError('email');
        return true;
    }

    function validatePassword() {
        const password = document.getElementById('password').value;
        if (!password) {
            showError('password', 'Password is required');
            return false;
        }
        if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showError('password', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        }
        clearError('password');
        return true;
    }

    function validateConfirmPassword() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            return false;
        }
        clearError('confirmPassword');
        return true;
    }

    async function handleRegistration() {
        setLoading(true);

        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                showToast('Account created successfully! Welcome to CareerPath Pro!', 'success');
                
                // Redirect to main page after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            setLoading(false);
        }
    }

    function handleGoogleRegister() {
        showToast('Google registration coming soon!', 'info');
    }

    function handleLinkedInRegister() {
        showToast('LinkedIn registration coming soon!', 'info');
    }

    function setLoading(loading) {
        registerBtn.disabled = loading;
        registerSpinner.style.display = loading ? 'flex' : 'none';
        registerBtn.querySelector('.btn-text').style.display = loading ? 'none' : 'block';
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function togglePasswordVisibility(input, toggle) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }

    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Set icon based on type
        toastIcon.className = 'toast-icon';
        if (type === 'success') {
            toastIcon.classList.add('fas', 'fa-check-circle');
            toast.classList.add('success');
        } else if (type === 'error') {
            toastIcon.classList.add('fas', 'fa-exclamation-circle');
            toast.classList.add('error');
        } else if (type === 'info') {
            toastIcon.classList.add('fas', 'fa-info-circle');
            toast.classList.add('info');
        }
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show', 'success', 'error', 'info');
        }, 5000);
    }

    // Close toast on click
    document.getElementById('toastClose').addEventListener('click', function() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show', 'success', 'error', 'info');
    });
});
