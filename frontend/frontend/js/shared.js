// Shared functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else if (navbar) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Initialize authentication
    initializeAuth();
    
    // Initialize user navigation
    initializeUserNavigation();

    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize counter animations
    initializeCounterAnimations();
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-category, .recommendation-card, .stat-card, .feature, .feature-card, .timeline-item, .team-member, .value-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add counter animations for stats
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                if (target) {
                    animateValue(counter, 0, target, 2000);
                }
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Utility function for smooth animations
function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    const step = (timestamp) => {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add loading states for buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Loading...';
    button.disabled = true;
    
    return function removeLoadingState() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Handle Enter key on options
    if (e.key === 'Enter' && e.target.classList.contains('option')) {
        e.target.click();
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && document.getElementById('prevBtn') && !document.getElementById('prevBtn').disabled) {
        if (typeof previousQuestion === 'function') {
            previousQuestion();
        }
    }
    
    if (e.key === 'ArrowRight' && document.getElementById('nextBtn') && !document.getElementById('nextBtn').disabled) {
        if (typeof nextQuestion === 'function') {
            nextQuestion();
        }
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next question
            if (document.getElementById('nextBtn') && !document.getElementById('nextBtn').disabled && typeof nextQuestion === 'function') {
                nextQuestion();
            }
        } else {
            // Swipe right - previous question
            if (document.getElementById('prevBtn') && !document.getElementById('prevBtn').disabled && typeof previousQuestion === 'function') {
                previousQuestion();
            }
        }
    }
}

// Authentication functions
function initializeAuth() {
    const user = getCurrentUser();
    updateNavigationState(user);
}

function getCurrentUser() {
    // Check localStorage first, then sessionStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function updateNavigationState(user) {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    
    if (user) {
        // User is logged in
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) {
            navUser.style.display = 'flex';
            updateUserInfo(user);
        }
    } else {
        // User is not logged in
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
    }
}

function updateUserInfo(user) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
        userAvatar.alt = user.name || 'User Avatar';
    }
    
    if (userName) {
        userName.textContent = user.name || user.email || 'User';
    }
}

function logout() {
    // Clear user data from both storage locations
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Update navigation
    updateNavigationState(null);
    
    // Show logout message
    if (typeof showToast === 'function') {
        showToast('You have been logged out successfully.', 'success');
    }
    
    // Redirect to home page if not already there
    if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
    }
}

// User navigation functions
function initializeUserNavigation() {
    const userToggle = document.getElementById('userToggle');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // User dropdown toggle
    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userToggle.classList.toggle('active');
            userDropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (userDropdown && !userDropdown.contains(e.target) && !userToggle.contains(e.target)) {
            userDropdown.classList.remove('show');
            if (userToggle) userToggle.classList.remove('active');
        }
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Handle dropdown item clicks
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.id === 'logoutBtn') {
                return; // Already handled above
            }
            
            e.preventDefault();
            
            // Close dropdown
            if (userDropdown) userDropdown.classList.remove('show');
            if (userToggle) userToggle.classList.remove('active');
            
            // Handle different menu items
            const text = this.textContent.trim();
            switch (text) {
                case 'Profile':
                    handleProfileClick();
                    break;
                case 'Settings':
                    handleSettingsClick();
                    break;
                case 'My Progress':
                    handleProgressClick();
                    break;
                default:
                    console.log('Menu item clicked:', text);
            }
        });
    });
}

function handleProfileClick() {
    // Navigate to profile page or show profile modal
    if (typeof showToast === 'function') {
        showToast('Profile page coming soon!', 'info');
    }
}

function handleSettingsClick() {
    // Navigate to settings page or show settings modal
    if (typeof showToast === 'function') {
        showToast('Settings page coming soon!', 'info');
    }
}

function handleProgressClick() {
    // Navigate to progress page or show progress modal
    if (typeof showToast === 'function') {
        showToast('Progress tracking coming soon!', 'info');
    }
}

// Check authentication status on page load
function checkAuthStatus() {
    const user = getCurrentUser();
    if (user) {
        // User is logged in, update UI
        updateNavigationState(user);
    }
}

// Initialize auth check
checkAuthStatus();

// Toast notification function (simple implementation)
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon"></i>
                <span class="toast-message"></span>
            </div>
            <button class="toast-close" onclick="hideToast()">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(toast);
    }
    
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
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
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideToast();
    }, 5000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}
