// Gemini AI Chat Widget Functionality
let chatWidgetOpen = false;
let chatHistory = [];

// Initialize chat widget
function initializeChatWidget() {
    const chatInput = document.getElementById('chatInput');
    const chatToggle = document.getElementById('chatToggle');
    const chatBadge = document.getElementById('chatBadge');
    
    if (!chatInput || !chatToggle) return;
    
    // Hide badge after first interaction
    if (chatBadge) {
        setTimeout(() => {
            chatBadge.style.display = 'none';
        }, 5000);
    }
    
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
    
    if (!chatWidget || !chatToggle) return;
    
    chatWidgetOpen = !chatWidgetOpen;
    
    if (chatWidgetOpen) {
        chatWidget.classList.add('active');
        chatToggle.style.display = 'none';
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
        }
    } else {
        chatWidget.classList.remove('active');
        chatToggle.style.display = 'flex';
    }
}

// Send message function
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
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
    if (!chatMessages) return;
    
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
    if (!chatMessages) return;
    
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
    if (chatInput) {
        chatInput.value = question;
        sendMessage();
    }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatWidget();
});
