const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const ChatSession = require('../models/ChatSession');

// @desc    Get chat response from Gemini AI
// @route   POST /api/v1/chat
// @access  Private
exports.getChatResponse = asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
        return next(new ErrorResponse('Message is required', 400));
    }

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ user: userId })
        .sort({ updatedAt: -1 });

    if (!chatSession) {
        chatSession = await ChatSession.create({
            user: userId,
            messages: []
        });
    }

    // Add user message to session
    chatSession.messages.push({
        sender: 'user',
        text: message,
        timestamp: new Date()
    });

    // Get AI response (this would integrate with actual Gemini API)
    const aiResponse = await getGeminiResponse(message, chatSession.messages);

    // Add AI response to session
    chatSession.messages.push({
        sender: 'bot',
        text: aiResponse,
        timestamp: new Date()
    });

    // Update session timestamp
    chatSession.updatedAt = new Date();

    // Save session
    await chatSession.save();

    res.status(200).json({
        success: true,
        data: {
            response: aiResponse,
            sessionId: chatSession._id
        }
    });
});

// @desc    Get chat history for user
// @route   GET /api/v1/chat
// @access  Private
exports.getChatHistory = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const chatSessions = await ChatSession.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(10); // Get last 10 sessions

    res.status(200).json({
        success: true,
        count: chatSessions.length,
        data: chatSessions
    });
});

// Helper function to get Gemini AI response
async function getGeminiResponse(userMessage, chatHistory) {
    try {
        // This is where you would integrate with the actual Gemini API
        // For now, we'll use a fallback response system
        
        const careerKeywords = [
            'frontend', 'backend', 'fullstack', 'data science', 'devops', 
            'cybersecurity', 'product manager', 'mobile developer',
            'mechanical engineer', 'civil engineer', 'electrical engineer', 
            'biomedical engineer', 'career path', 'skills', 'interview',
            'salary', 'job', 'education', 'degree', 'certification'
        ];

        const lowerCaseMessage = userMessage.toLowerCase();
        const foundKeyword = careerKeywords.find(keyword => 
            lowerCaseMessage.includes(keyword)
        );

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        if (foundKeyword) {
            return generateCareerResponse(foundKeyword, userMessage);
        } else {
            return generateGeneralCareerResponse(userMessage);
        }
    } catch (error) {
        console.error('Error getting Gemini response:', error);
        return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
}

// Helper function to generate career-specific responses
function generateCareerResponse(keyword, userMessage) {
    const responses = {
        'frontend': "Frontend development is a great choice! Focus on HTML, CSS, JavaScript, and modern frameworks like React or Vue.js. Build projects to showcase your skills and create a strong portfolio.",
        'backend': "Backend development involves server-side programming. Learn languages like Node.js, Python, or Java, understand databases, and practice building APIs and web services.",
        'fullstack': "Full-stack development combines frontend and backend skills. You'll need to master both client-side and server-side technologies, plus deployment and DevOps practices.",
        'data science': "Data science is an exciting field! Learn Python or R, study statistics and machine learning, work with datasets, and master visualization tools like Tableau or Power BI.",
        'devops': "DevOps focuses on development and operations collaboration. Learn cloud platforms (AWS, Azure, GCP), containerization with Docker, and CI/CD pipelines.",
        'cybersecurity': "Cybersecurity is crucial in today's digital world. Study network security, ethical hacking, risk assessment, and get certified in security frameworks.",
        'product manager': "Product management requires strong communication and strategic thinking. Learn about user research, business strategy, and product development methodologies.",
        'mobile developer': "Mobile development offers great opportunities. Choose between iOS (Swift) or Android (Kotlin/Java) and learn mobile UI/UX principles.",
        'mechanical engineer': "Mechanical engineering involves designing and analyzing mechanical systems. Master CAD software, thermodynamics, and materials science.",
        'civil engineer': "Civil engineering focuses on infrastructure projects. Study structural analysis, geotechnical engineering, and learn AutoCAD and civil engineering software.",
        'electrical engineer': "Electrical engineering covers power systems and electronics. Focus on circuit analysis, power systems, and embedded systems programming.",
        'biomedical engineer': "Biomedical engineering combines engineering with healthcare. Study medical devices, imaging systems, and regulatory requirements."
    };

    return responses[keyword] || generateGeneralCareerResponse(userMessage);
}

// Helper function to generate general career responses
function generateGeneralCareerResponse(userMessage) {
    const generalResponses = [
        "I'm here to help with your career questions! What specific aspect of career development would you like to explore?",
        "That's an interesting question about careers. Could you tell me more about what specific field or role you're considering?",
        "I'd be happy to help you with career guidance. What type of work environment or industry interests you most?",
        "Great question! To give you the best advice, could you share more about your current skills and career goals?",
        "I'm your career assistant! I can help with career paths, skill development, job search strategies, and more. What would you like to know?"
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}
