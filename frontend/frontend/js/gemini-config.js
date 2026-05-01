// Gemini AI Configuration for CareerPath Pro
// This file contains the configuration and API setup for Gemini AI integration

const GEMINI_CONFIG = {
    // API Configuration
    apiKey: 'YOUR_GEMINI_API_KEY_HERE', // Replace with your actual Gemini API key
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Career-focused system prompt
    systemPrompt: `You are a professional career advisor and skill development expert. Your role is to provide personalized career guidance, skill recommendations, and professional development advice. 

Key responsibilities:
- Help users discover suitable career paths based on their interests and skills
- Provide specific skill development recommendations
- Offer interview preparation tips and strategies
- Suggest learning resources and educational paths
- Give industry insights and market trends
- Advise on professional development and career advancement

Guidelines:
- Always focus on career-related topics only
- Provide actionable, specific advice
- Be encouraging and supportive
- Include relevant salary ranges and job market information
- Suggest concrete next steps
- Keep responses professional yet conversational
- If asked about non-career topics, politely redirect to career-related subjects

Remember: You are exclusively a career advisor. If users ask about topics unrelated to careers, professional development, or skills, politely redirect them back to career-focused discussions.`,

    // Career-specific response templates
    responseTemplates: {
        greeting: "Hello! I'm your AI Career Assistant, powered by Gemini. I'm here to help you with all aspects of your professional development. What career questions can I help you with today?",
        
        redirect: "I'm specialized in career guidance and professional development. I'd be happy to help you with career-related questions instead! What would you like to know about your professional journey?",
        
        error: "I apologize, but I'm having trouble processing your request right now. Please try rephrasing your career question, and I'll do my best to help you!",
        
        followUp: "That's a great question! To give you the most helpful advice, could you tell me more about your current situation, experience level, or specific career goals?"
    },

    // Career categories for better response targeting
    careerCategories: {
        'frontend': ['frontend', 'react', 'javascript', 'html', 'css', 'ui', 'ux', 'web design'],
        'backend': ['backend', 'server', 'api', 'database', 'python', 'java', 'node.js', 'php'],
        'fullstack': ['fullstack', 'full stack', 'full-stack', 'web development', 'full stack developer'],
        'data': ['data science', 'data analyst', 'analytics', 'machine learning', 'ai', 'python', 'r', 'statistics'],
        'devops': ['devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'infrastructure'],
        'mobile': ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'],
        'cybersecurity': ['cybersecurity', 'security', 'penetration testing', 'ethical hacking', 'information security'],
        'product': ['product management', 'product manager', 'product strategy', 'business analysis'],
        'interview': ['interview', 'interview preparation', 'hiring', 'job search', 'resume', 'cv'],
        'skills': ['skills', 'learning', 'development', 'training', 'education', 'certification'],
        'career': ['career', 'career path', 'career change', 'job', 'employment', 'profession']
    },

    // Learning resources database
    learningResources: {
        'frontend': {
            courses: ['freeCodeCamp', 'The Odin Project', 'MDN Web Docs', 'React Official Docs'],
            platforms: ['Coursera', 'Udemy', 'edX', 'Pluralsight'],
            practice: ['CodePen', 'JSFiddle', 'GitHub', 'Frontend Mentor']
        },
        'backend': {
            courses: ['Python for Everybody', 'Node.js Complete Guide', 'Java Programming'],
            platforms: ['Coursera', 'Udemy', 'edX', 'Pluralsight'],
            practice: ['LeetCode', 'HackerRank', 'GitHub', 'Stack Overflow']
        },
        'data': {
            courses: ['Data Science Specialization', 'Machine Learning Course', 'Python for Data Science'],
            platforms: ['Coursera', 'edX', 'Kaggle Learn', 'DataCamp'],
            practice: ['Kaggle', 'Google Colab', 'Jupyter Notebooks', 'GitHub']
        }
    },

    // Salary ranges (updated for 2024)
    salaryRanges: {
        'frontend': { min: 65000, max: 140000, average: 95000 },
        'backend': { min: 70000, max: 150000, average: 105000 },
        'fullstack': { min: 75000, max: 160000, average: 115000 },
        'data': { min: 80000, max: 170000, average: 125000 },
        'devops': { min: 85000, max: 180000, average: 130000 },
        'mobile': { min: 70000, max: 150000, average: 110000 },
        'cybersecurity': { min: 90000, max: 190000, average: 140000 },
        'product': { min: 95000, max: 200000, average: 145000 }
    }
};

// Function to get Gemini AI response
async function getGeminiCareerResponse(userMessage, chatHistory = []) {
    try {
        // Check if API key is configured
        if (!GEMINI_CONFIG.apiKey || GEMINI_CONFIG.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return getFallbackResponse(userMessage);
        }

        // Prepare the request
        const requestBody = {
            contents: [{
                parts: [{
                    text: `${GEMINI_CONFIG.systemPrompt}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful, specific response focused on career guidance.`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // Add chat history for context
        if (chatHistory.length > 0) {
            const historyContext = chatHistory.slice(-5).map(msg => 
                `${msg.sender}: ${msg.message}`
            ).join('\n');
            requestBody.contents[0].parts[0].text += `\n\nPrevious conversation:\n${historyContext}`;
        }

        // Make API request
        const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format from Gemini API');
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        return getFallbackResponse(userMessage);
    }
}

// Fallback response when API is not available
function getFallbackResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for career categories
    for (const [category, keywords] of Object.entries(GEMINI_CONFIG.careerCategories)) {
        if (keywords.some(keyword => message.includes(keyword))) {
            return generateCategoryResponse(category, userMessage);
        }
    }
    
    // Default response
    return GEMINI_CONFIG.responseTemplates.greeting;
}

// Generate category-specific responses
function generateCategoryResponse(category, userMessage) {
    const salary = GEMINI_CONFIG.salaryRanges[category];
    const resources = GEMINI_CONFIG.learningResources[category];
    
    let response = `I'd be happy to help you with ${category} career guidance! `;
    
    if (salary) {
        response += `\n\n**Salary Range:** $${salary.min.toLocaleString()} - $${salary.max.toLocaleString()} (Average: $${salary.average.toLocaleString()})`;
    }
    
    if (resources) {
        response += `\n\n**Recommended Learning Resources:**\n`;
        if (resources.courses) {
            response += `• Courses: ${resources.courses.join(', ')}\n`;
        }
        if (resources.platforms) {
            response += `• Platforms: ${resources.platforms.join(', ')}\n`;
        }
        if (resources.practice) {
            response += `• Practice: ${resources.practice.join(', ')}\n`;
        }
    }
    
    response += `\n\nWhat specific aspect of ${category} would you like to know more about?`;
    
    return response;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GEMINI_CONFIG, getGeminiCareerResponse };
}
