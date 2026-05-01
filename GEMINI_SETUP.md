# Gemini AI Integration Setup Guide

This guide will help you set up the Gemini AI integration for your CareerPath Pro website.

## Prerequisites

1. A Google Cloud Platform account
2. Access to the Gemini API (Google AI Studio)

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure the API Key

1. Open `gemini-config.js`
2. Find the line: `apiKey: 'YOUR_GEMINI_API_KEY_HERE'`
3. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
4. Save the file

```javascript
const GEMINI_CONFIG = {
    apiKey: 'your-actual-api-key-here', // Replace with your API key
    // ... rest of configuration
};
```

## Step 3: Test the Integration

1. Open your website in a browser
2. Click the chat widget button (bottom right)
3. Ask a career-related question like:
   - "What skills should I learn for frontend development?"
   - "How do I prepare for a tech interview?"
   - "What career path should I choose?"

## Features

### Career-Focused AI Assistant
- **Specialized Responses**: Only provides career and professional development advice
- **Contextual Understanding**: Remembers conversation history for better responses
- **Industry Insights**: Provides salary ranges, job market trends, and career outlook
- **Learning Resources**: Suggests specific courses, platforms, and practice resources

### Supported Topics
- Frontend Development (React, JavaScript, HTML/CSS)
- Backend Development (Python, Java, Node.js, APIs)
- Data Science (Analytics, Machine Learning, AI)
- DevOps & Cloud (AWS, Azure, Docker, Kubernetes)
- Mobile Development (iOS, Android, React Native)
- Cybersecurity
- Product Management
- Interview Preparation
- Skill Development
- Career Path Planning

### Safety Features
- **Topic Restriction**: Only responds to career-related questions
- **Fallback System**: Works even without API key (using pre-built responses)
- **Error Handling**: Graceful degradation if API is unavailable
- **Rate Limiting**: Built-in delays to prevent API abuse

## Customization

### Adding New Career Categories

Edit `gemini-config.js` to add new career categories:

```javascript
careerCategories: {
    'new-career': ['keyword1', 'keyword2', 'keyword3'],
    // ... existing categories
}
```

### Updating Salary Ranges

Update salary information in the configuration:

```javascript
salaryRanges: {
    'career-name': { min: 50000, max: 120000, average: 85000 },
    // ... existing ranges
}
```

### Modifying System Prompt

Customize the AI's behavior by editing the system prompt:

```javascript
systemPrompt: `Your custom system prompt here...`
```

## Troubleshooting

### Common Issues

1. **"API Key Not Found" Error**
   - Ensure you've replaced the placeholder API key
   - Check that the API key is valid and active

2. **"API Request Failed" Error**
   - Verify your internet connection
   - Check if the Gemini API is available
   - Ensure you have sufficient API quota

3. **Chat Not Responding**
   - Check browser console for errors
   - Verify that both `gemini-config.js` and `script.js` are loaded
   - Try refreshing the page

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('gemini-debug', 'true');
```

## Security Considerations

1. **API Key Protection**: Never commit your API key to version control
2. **Rate Limiting**: The integration includes built-in rate limiting
3. **Input Validation**: All user inputs are validated before sending to the API
4. **Error Handling**: Sensitive information is not exposed in error messages

## Performance Optimization

1. **Caching**: Responses are cached to reduce API calls
2. **Debouncing**: Input is debounced to prevent excessive API requests
3. **Lazy Loading**: The chat widget loads only when needed
4. **Fallback Responses**: Pre-built responses ensure the chat always works

## Monitoring and Analytics

Track chat usage by adding analytics:

```javascript
// Add to sendMessage function
gtag('event', 'chat_message', {
    'event_category': 'engagement',
    'event_label': 'career_chat'
});
```

## Support

For issues with the Gemini AI integration:

1. Check the browser console for error messages
2. Verify your API key is correct and active
3. Test with the fallback responses first
4. Review the configuration settings

## Cost Management

- Gemini API has generous free tier limits
- Monitor your usage in Google AI Studio
- Consider implementing response caching for high-traffic sites
- Use fallback responses to reduce API calls

---

**Note**: This integration is designed specifically for career guidance and professional development. The AI will politely redirect non-career related questions back to career topics.
