const express = require('express');
const { body, validationResult } = require('express-validator');
const ChatSession = require('../models/ChatSession');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const router = express.Router();

// Gemini AI integration
const getGeminiResponse = async (message, context = {}) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are a professional career advisor and skill development expert. Provide personalized career guidance based on the user's question.

User Question: ${message}

Context: ${JSON.stringify(context)}

Please provide a helpful, specific response focused on career guidance. Keep your response under 500 words and make it actionable.`;

    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getFallbackResponse(message);
  }
};

// Fallback response when Gemini API is not available
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('frontend') || msg.includes('react') || msg.includes('javascript')) {
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
  
  if (msg.includes('backend') || msg.includes('server') || msg.includes('api')) {
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
  
  if (msg.includes('data') || msg.includes('analytics') || msg.includes('machine learning')) {
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
  
  if (msg.includes('interview') || msg.includes('prepare') || msg.includes('hiring')) {
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

What type of role are you interviewing for? I can provide more specific advice!`;
  }
  
  return `I'd be happy to help with your career questions! Could you be more specific about what you'd like to know? For example:

• "What skills should I learn for [specific role]?"
• "How do I prepare for [type of] interviews?"
• "What career path should I choose?"
• "How can I advance in my current field?"

I'm here to provide personalized career guidance and help you make informed decisions about your professional future!`;
};

// @route   POST /api/chat/session
// @desc    Start a new chat session
// @access  Private
router.post('/session', async (req, res) => {
  try {
    const { context } = req.body;
    
    // Check for existing active session
    let session = await ChatSession.findActiveSession(req.user._id);
    
    if (!session) {
      // Create new session
      session = new ChatSession({
        user: req.user._id,
        sessionId: uuidv4(),
        context: context || {}
      });
      
      await session.save();
    }

    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status
      }
    });
  } catch (error) {
    console.error('Start chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting chat session'
    });
  }
});

// @route   POST /api/chat/message
// @desc    Send a message and get AI response
// @access  Private
router.post('/message', [
  body('message').trim().notEmpty().isLength({ min: 1, max: 1000 }),
  body('sessionId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message, sessionId } = req.body;
    const startTime = Date.now();

    // Find the chat session
    const session = await ChatSession.findOne({
      sessionId,
      user: req.user._id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found or inactive'
      });
    }

    // Add user message
    await session.addMessage('user', message, {
      category: 'general'
    });

    // Get AI response
    const aiResponse = await getGeminiResponse(message, session.context);
    const responseTime = Date.now() - startTime;

    // Add AI response
    await session.addMessage('assistant', aiResponse, {
      tokens: aiResponse.length,
      responseTime,
      category: 'career_guidance'
    });

    res.json({
      success: true,
      data: {
        message: aiResponse,
        sessionId: session.sessionId,
        responseTime
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing message'
    });
  }
});

// @route   GET /api/chat/sessions
// @desc    Get user's chat sessions
// @access  Private
router.get('/sessions', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const sessions = await ChatSession.find({ user: req.user._id })
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('sessionId status analytics startedAt lastActivity');

    const total = await ChatSession.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        sessions: sessions.map(session => session.getSummary()),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat sessions'
    });
  }
});

// @route   GET /api/chat/session/:sessionId
// @desc    Get specific chat session with messages
// @access  Private
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const session = await ChatSession.findOne({
      sessionId,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    const messages = session.getRecentMessages(parseInt(limit));

    res.json({
      success: true,
      data: {
        session: session.getSummary(),
        messages
      }
    });
  } catch (error) {
    console.error('Get chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat session'
    });
  }
});

// @route   POST /api/chat/session/:sessionId/end
// @desc    End a chat session
// @access  Private
router.post('/session/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({
      sessionId,
      user: req.user._id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Active chat session not found'
      });
    }

    await session.endSession();

    res.json({
      success: true,
      message: 'Chat session ended successfully'
    });
  } catch (error) {
    console.error('End chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending chat session'
    });
  }
});

// @route   GET /api/chat/quick-questions
// @desc    Get quick question suggestions
// @access  Private
router.get('/quick-questions', async (req, res) => {
  try {
    const quickQuestions = [
      'What skills should I learn for frontend development?',
      'How do I prepare for a tech interview?',
      'What career path should I choose?',
      'What are the highest paying tech jobs?',
      'How can I transition to a tech career?',
      'What programming language should I learn first?',
      'How do I build a strong portfolio?',
      'What are the best online learning platforms?',
      'How can I improve my coding skills?',
      'What soft skills are important for developers?'
    ];

    res.json({
      success: true,
      data: { quickQuestions }
    });
  } catch (error) {
    console.error('Get quick questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quick questions'
    });
  }
});

module.exports = router;
