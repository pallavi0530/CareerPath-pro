// Home page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any home page specific features
    initializeHomeAnimations();
    initializeFeatureCards();
});

// Initialize home page animations
function initializeHomeAnimations() {
    // Animate floating cards
    const floatingCards = document.querySelectorAll('.floating-cards .card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Initialize feature cards
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Smooth scroll to sections (for anchor links)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
