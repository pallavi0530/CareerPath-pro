// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Initialize skill bars animation
    initializeSkillBars();
    
    // Initialize assessment
    initializeAssessment();
    
    // Initialize career paths
    initializeCareerPaths();
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

// Assessment functionality
let currentQuestionIndex = 0;
let answers = {};
const questions = [
    {
        question: "What type of work environment do you prefer?",
        options: [
            "Remote work from home",
            "Office with team collaboration",
            "Hybrid (mix of remote and office)",
            "Flexible/varies"
        ]
    },
    {
        question: "Which of these activities interests you most?",
        options: [
            "Building websites and applications",
            "Analyzing data and creating reports",
            "Managing projects and teams",
            "Designing user experiences"
        ]
    },
    {
        question: "What's your preferred learning style?",
        options: [
            "Hands-on practice and experimentation",
            "Reading documentation and tutorials",
            "Video courses and interactive content",
            "Working with mentors and peers"
        ]
    },
    {
        question: "Which programming language interests you most?",
        options: [
            "JavaScript/TypeScript",
            "Python",
            "Java",
            "C#",
            "I'm not sure yet"
        ]
    },
    {
        question: "What type of problems do you enjoy solving?",
        options: [
            "User interface and experience challenges",
            "Data analysis and business intelligence",
            "System architecture and optimization",
            "Creative and design problems"
        ]
    },
    {
        question: "How do you prefer to work with others?",
        options: [
            "Leading and mentoring team members",
            "Collaborating as an equal team member",
            "Working independently with occasional check-ins",
            "Pair programming and close collaboration"
        ]
    },
    {
        question: "What's your experience level with technology?",
        options: [
            "Complete beginner",
            "Some basic knowledge",
            "Intermediate with some projects",
            "Advanced with professional experience"
        ]
    },
    {
        question: "Which industry interests you most?",
        options: [
            "Technology and software",
            "Finance and banking",
            "Healthcare and medical",
            "E-commerce and retail",
            "Education and training"
        ]
    },
    {
        question: "What motivates you most in your career?",
        options: [
            "High salary and financial security",
            "Creative freedom and innovation",
            "Helping others and making an impact",
            "Continuous learning and growth"
        ]
    },
    {
        question: "How do you handle challenges and setbacks?",
        options: [
            "Research and find solutions independently",
            "Ask for help from colleagues or mentors",
            "Take a break and return with fresh perspective",
            "Break down the problem into smaller parts"
        ]
    }
];

function initializeAssessment() {
    showQuestion();
    updateProgress();
}

function showQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const currentQuestion = questions[currentQuestionIndex];
    
    questionContainer.innerHTML = `
        <div class="question active">
            <h3>${currentQuestion.question}</h3>
            <div class="answer-options">
                ${currentQuestion.options.map((option, index) => `
                    <div class="option" onclick="selectOption(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function selectOption(optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    document.querySelectorAll('.option')[optionIndex].classList.add('selected');
    
    // Store answer
    answers[currentQuestionIndex] = optionIndex;
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
        updateProgress();
        updateButtons();
    } else {
        // Assessment complete
        completeAssessment();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
        updateProgress();
        updateButtons();
        
        // Restore previous selection if exists
        if (answers[currentQuestionIndex] !== undefined) {
            document.querySelectorAll('.option')[answers[currentQuestionIndex]].classList.add('selected');
        }
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.innerHTML = 'Complete Assessment <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
    
    // Disable next button if no option selected
    if (answers[currentQuestionIndex] === undefined) {
        nextBtn.disabled = true;
    }
}

function completeAssessment() {
    // Calculate results based on answers
    const results = calculateResults();
    
    // Show results
    showResults(results);
}

function calculateResults() {
    // Simple scoring system - in a real app, this would be more sophisticated
    const scores = {
        frontend: 0,
        backend: 0,
        fullstack: 0,
        data: 0
    };
    
    // Weight different questions differently
    const weights = {
        0: { frontend: 1, backend: 0, fullstack: 1, data: 0 }, // Work environment
        1: { frontend: 2, backend: 1, fullstack: 2, data: 1 }, // Activities
        2: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Learning style
        3: { frontend: 2, backend: 1, fullstack: 2, data: 0 }, // Programming language
        4: { frontend: 2, backend: 1, fullstack: 1, data: 1 }, // Problem solving
        5: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Team work
        6: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Experience
        7: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Industry
        8: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Motivation
        9: { frontend: 1, backend: 1, fullstack: 1, data: 1 }  // Challenges
    };
    
    // Calculate scores
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] !== undefined) {
            const weight = weights[i];
            scores.frontend += weight.frontend;
            scores.backend += weight.backend;
            scores.fullstack += weight.fullstack;
            scores.data += weight.data;
        }
    }
    
    // Find the highest scoring path
    const maxScore = Math.max(...Object.values(scores));
    const recommendedPath = Object.keys(scores).find(key => scores[key] === maxScore);
    
    return {
        scores,
        recommendedPath,
        confidence: Math.round((maxScore / Object.values(scores).reduce((a, b) => a + b, 0)) * 100)
    };
}

function showResults(results) {
    const questionContainer = document.getElementById('questionContainer');
    const assessmentButtons = document.querySelector('.assessment-buttons');
    
    questionContainer.innerHTML = `
        <div class="question active">
            <h3>Assessment Complete!</h3>
            <div class="results-container">
                <div class="result-card">
                    <h4>Recommended Career Path</h4>
                    <div class="recommended-path">
                        <i class="fas fa-star"></i>
                        <span class="path-name">${getPathDisplayName(results.recommendedPath)}</span>
                        <span class="confidence">${results.confidence}% match</span>
                    </div>
                </div>
                
                <div class="all-scores">
                    <h4>All Career Path Scores</h4>
                    <div class="score-bars">
                        <div class="score-item">
                            <span>Frontend Developer</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.frontend / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.frontend}</span>
                        </div>
                        <div class="score-item">
                            <span>Backend Developer</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.backend / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.backend}</span>
                        </div>
                        <div class="score-item">
                            <span>Full Stack Developer</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.fullstack / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.fullstack}</span>
                        </div>
                        <div class="score-item">
                            <span>Data Scientist</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.data / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.data}</span>
                        </div>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>Next Steps</h4>
                    <p>Based on your assessment, we recommend exploring the <strong>${getPathDisplayName(results.recommendedPath)}</strong> career path. Click below to view detailed learning roadmaps and resources.</p>
                    <button class="btn btn-primary" onclick="scrollToSection('career-paths')">
                        <i class="fas fa-arrow-right"></i>
                        View Career Path
                    </button>
                </div>
            </div>
        </div>
    `;
    
    assessmentButtons.innerHTML = `
        <button class="btn btn-outline" onclick="restartAssessment()">
            <i class="fas fa-redo"></i>
            Retake Assessment
        </button>
    `;
}

function getPathDisplayName(path) {
    const names = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        fullstack: 'Full Stack Developer',
        data: 'Data Scientist'
    };
    return names[path] || path;
}

function restartAssessment() {
    currentQuestionIndex = 0;
    answers = {};
    showQuestion();
    updateProgress();
    updateButtons();
    
    // Restore original buttons
    document.querySelector('.assessment-buttons').innerHTML = `
        <button class="btn btn-outline" id="prevBtn" onclick="previousQuestion()" disabled>
            <i class="fas fa-arrow-left"></i>
            Previous
        </button>
        <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()">
            Next
            <i class="fas fa-arrow-right"></i>
        </button>
    `;
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                setTimeout(() => {
                    skillBar.style.width = width + '%';
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Career paths functionality
function initializeCareerPaths() {
    // Set up career path tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const careerPaths = document.querySelectorAll('.career-path');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetPath = this.textContent.toLowerCase().replace(' ', '');
            showCareerPath(targetPath);
        });
    });
}

function showCareerPath(pathName) {
    // Remove active class from all tabs and paths
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.career-path').forEach(path => path.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Show corresponding career path
    const pathId = getPathId(pathName);
    const careerPath = document.getElementById(pathId);
    if (careerPath) {
        careerPath.classList.add('active');
    }
}

function getPathId(pathName) {
    const pathMap = {
        'frontenddeveloper': 'frontend',
        'backenddeveloper': 'backend',
        'fullstackdeveloper': 'fullstack',
        'datascientist': 'data',
        'mobiledeveloper': 'mobile',
        'devopsengineer': 'devops',
        'cybersecurity': 'cybersecurity',
        'productmanager': 'product',
        'mechanicalengineer': 'mechanical',
        'civilengineer': 'civil',
        'electricalengineer': 'electrical',
        'biomedicalengineer': 'biomedical'
    };
    return pathMap[pathName] || 'frontend';
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
    const animatedElements = document.querySelectorAll('.skill-category, .recommendation-card, .stat-card, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
});

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

// Initialize counter animations
document.addEventListener('DOMContentLoaded', function() {
    initializeCounterAnimations();
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Handle Enter key on options
    if (e.key === 'Enter' && e.target.classList.contains('option')) {
        e.target.click();
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && !document.getElementById('prevBtn').disabled) {
        previousQuestion();
    }
    
    if (e.key === 'ArrowRight' && !document.getElementById('nextBtn').disabled) {
        nextQuestion();
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
            if (!document.getElementById('nextBtn').disabled) {
                nextQuestion();
            }
        } else {
            // Swipe right - previous question
            if (!document.getElementById('prevBtn').disabled) {
                previousQuestion();
            }
        }
    }
}

// Gemini AI Chat Widget Functionality
let chatWidgetOpen = false;
let chatHistory = [];

// Initialize chat widget
function initializeChatWidget() {
    const chatInput = document.getElementById('chatInput');
    const chatToggle = document.getElementById('chatToggle');
    const chatBadge = document.getElementById('chatBadge');
    
    // Hide badge after first interaction
    setTimeout(() => {
        chatBadge.style.display = 'none';
    }, 5000);
    
    // Enter key support for chat input
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize chat input
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// Toggle chat widget
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    
    chatWidgetOpen = !chatWidgetOpen;
    
    if (chatWidgetOpen) {
        chatWidget.classList.add('active');
        chatToggle.style.display = 'none';
        document.getElementById('chatInput').focus();
    } else {
        chatWidget.classList.remove('active');
        chatToggle.style.display = 'flex';
    }
}

// Send message function
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const response = await getGeminiResponse(message);
        hideTypingIndicator();
        addMessageToChat(response, 'bot');
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
        console.error('Chat error:', error);
    }
}

// Add message to chat
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    chatHistory.push({ message, sender, timestamp: new Date() });
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(dots);
    chatMessages.appendChild(typingDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get Gemini AI response
async function getGeminiResponse(userMessage) {
    // Check if Gemini config is available
    if (typeof getGeminiCareerResponse !== 'undefined') {
        try {
            const response = await getGeminiCareerResponse(userMessage, chatHistory);
            return response;
        } catch (error) {
            console.error('Gemini API Error:', error);
            return getFallbackCareerResponse(userMessage);
        }
    }
    
    // Fallback to simulated responses
    return getFallbackCareerResponse(userMessage);
}

// Fallback career response function
async function getFallbackCareerResponse(userMessage) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Career-focused responses based on keywords
    const message = userMessage.toLowerCase();
    
    // Frontend development
    if (message.includes('frontend') || message.includes('react') || message.includes('javascript')) {
        return `Great question about frontend development! Here's what I recommend:

**Essential Skills:**
• HTML5 & CSS3 fundamentals
• JavaScript (ES6+) and modern frameworks like React, Vue, or Angular
• Responsive design and mobile-first approach
• Version control with Git
• Build tools like Webpack or Vite

**Learning Path:**
1. Master HTML/CSS basics (2-3 weeks)
2. Learn JavaScript fundamentals (4-6 weeks)
3. Pick a framework like React (6-8 weeks)
4. Learn state management and testing (4-6 weeks)

**Career Outlook:** Frontend developers are in high demand with average salaries of $75,000-$120,000. The field offers excellent growth opportunities and remote work options.

Would you like me to elaborate on any specific aspect?`;
    }
    
    // Backend development
    else if (message.includes('backend') || message.includes('server') || message.includes('api')) {
        return `Excellent choice! Backend development is a rewarding career path. Here's my guidance:

**Key Technologies:**
• Programming languages: Python, Java, Node.js, or C#
• Databases: PostgreSQL, MongoDB, or MySQL
• Cloud platforms: AWS, Azure, or Google Cloud
• API development and RESTful services
• Security best practices

**Learning Roadmap:**
1. Choose a language (Python recommended for beginners)
2. Learn database design and SQL (3-4 weeks)
3. Master API development (4-6 weeks)
4. Explore cloud services and deployment (4-6 weeks)

**Career Benefits:** Backend developers often earn $80,000-$130,000 with strong job security and opportunities to work on scalable systems.

What specific backend technology interests you most?`;
    }
    
    // Data science
    else if (message.includes('data') || message.includes('analytics') || message.includes('machine learning')) {
        return `Data science is an exciting and lucrative field! Here's your roadmap:

**Core Skills:**
• Python or R for data analysis
• SQL for database queries
• Statistics and mathematics
• Machine learning algorithms
• Data visualization (Tableau, Power BI)
• Jupyter notebooks and pandas

**Learning Path:**
1. Python fundamentals and data manipulation (6-8 weeks)
2. Statistics and probability (4-6 weeks)
3. Machine learning basics (8-10 weeks)
4. Real-world projects and portfolio building (ongoing)

**Career Potential:** Data scientists earn $90,000-$150,000+ with high demand across industries. The field offers excellent remote work opportunities.

Would you like specific resources for getting started?`;
    }
    
    // Interview preparation
    else if (message.includes('interview') || message.includes('prepare') || message.includes('hiring')) {
        return `Interview preparation is crucial for career success! Here's my comprehensive guide:

**Technical Preparation:**
• Practice coding problems on LeetCode, HackerRank
• Review system design concepts
• Prepare for behavioral questions using STAR method
• Research the company and role thoroughly

**Common Questions to Practice:**
• "Tell me about yourself" (2-minute elevator pitch)
• "Why do you want this job?"
• "Describe a challenging project you worked on"
• "Where do you see yourself in 5 years?"

**Interview Tips:**
• Prepare 3-5 questions to ask the interviewer
• Practice explaining your projects clearly
• Dress professionally and arrive early
• Follow up with a thank-you email

**Mock Interview Practice:** Consider doing practice interviews with friends or using online platforms.

What type of role are you interviewing for? I can provide more specific advice!`;
    }
    
    // Career path guidance
    else if (message.includes('career') || message.includes('path') || message.includes('choose')) {
        return `Choosing the right career path is one of the most important decisions! Let me help you:

**Self-Assessment Questions:**
• What activities do you enjoy most?
• What are your natural strengths?
• What type of work environment appeals to you?
• What are your financial goals?

**Popular Tech Career Paths:**
• **Software Development:** Frontend, Backend, Full-stack
• **Data Science:** Analytics, Machine Learning, AI
• **DevOps/Cloud:** Infrastructure, Automation, Security
• **Product Management:** Strategy, User Experience, Business

**Decision Framework:**
1. Take our career assessment quiz
2. Research job market demand and salaries
3. Try small projects in different areas
4. Network with professionals in your target field
5. Consider your long-term goals

**Next Steps:** I recommend starting with our career assessment to get personalized recommendations based on your interests and skills.

What aspects of work are most important to you?`;
    }
    
    // General career advice
    else if (message.includes('skill') || message.includes('learn') || message.includes('develop')) {
        return `Skill development is key to career advancement! Here's my advice:

**Continuous Learning Strategy:**
• Set aside 5-10 hours per week for learning
• Focus on both technical and soft skills
• Build projects to apply what you learn
• Join online communities and forums
• Find a mentor or study group

**High-Demand Skills for 2024:**
• Cloud computing (AWS, Azure, GCP)
• AI and machine learning
• Cybersecurity
• Data analysis and visualization
• Soft skills: communication, leadership, adaptability

**Learning Resources:**
• Online courses: Coursera, Udemy, edX
• Free resources: YouTube, freeCodeCamp, Khan Academy
• Books and documentation
• Hands-on practice with real projects

**Portfolio Building:** Create a GitHub profile with your projects and contribute to open source.

What specific skills are you looking to develop? I can provide targeted recommendations!`;
    }
    
    // Default response
    else {
        const responses = [
            `I'd be happy to help with your career questions! Could you be more specific about what you'd like to know? For example:
            
• "What skills should I learn for [specific role]?"
• "How do I prepare for [type of] interviews?"
• "What career path should I choose?"
• "How can I advance in my current field?"

I'm here to provide personalized career guidance and help you make informed decisions about your professional future!`,
            
            `That's an interesting question! To give you the best career advice, could you tell me more about:
            
• Your current experience level
• What type of work interests you most
• Your career goals and timeline
• Any specific challenges you're facing

The more context you provide, the better I can tailor my recommendations to your situation!`,
            
            `I'm here to help with all your career-related questions! Some areas I can assist with:
            
• Career path selection and planning
• Skill development recommendations
• Interview preparation strategies
• Industry insights and trends
• Learning resource suggestions
• Professional development advice

What would you like to explore today?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Quick question function
function askQuickQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = question;
    sendMessage();
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatWidget();
});
