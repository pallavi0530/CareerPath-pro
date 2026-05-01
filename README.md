# CareerPath Pro - Personalized Career & Skill Advisor

A modern, responsive website that helps users discover their ideal career paths through personalized assessments, skill analysis, and comprehensive career guidance.

## Features

### 🎯 Career Assessment
- Interactive 10-question assessment
- Real-time progress tracking
- Personalized career recommendations
- Detailed scoring system for different career paths

### 📊 Skills Analysis
- Visual skill level indicators
- Technical and soft skills tracking
- Personalized skill recommendations
- Learning resource suggestions

### 🛤️ Career Paths
- Detailed career roadmaps
- Learning timelines and milestones
- Salary and demand information
- Step-by-step progression guides

### 🎨 Modern Design
- Responsive design for all devices
- Smooth animations and transitions
- Accessible navigation
- Professional UI/UX

### 🤖 AI-Powered Features
- Gemini AI integration for personalized career guidance
- Intelligent chat assistant
- Context-aware responses
- Fallback system for offline functionality

### 🔧 Backend API
- RESTful API endpoints
- User authentication and authorization
- Assessment data storage
- Chat session management
- MongoDB integration

## Technologies Used

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons and visual elements
- **Google Fonts** - Typography (Inter font family)

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Gemini AI** - AI-powered career guidance

## Project Structure

```
careerpath-pro/
├── frontend/           # Frontend application
│   ├── index.html      # Main HTML file
│   ├── css/
│   │   └── styles.css  # CSS styles and animations
│   └── js/
│       ├── script.js   # Main JavaScript functionality
│       ├── assessment.js # Assessment logic
│       ├── chat.js     # Chat widget functionality
│       ├── gemini-config.js # AI configuration
│       ├── home.js     # Home page functionality
│       └── shared.js   # Shared utilities
├── backend/            # Backend API
│   ├── server.js       # Main server file
│   ├── package.json    # Dependencies
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── GEMINI_SETUP.md     # AI setup guide
└── README.md           # Project documentation
```

## Getting Started

### Frontend Only (Quick Start)
1. **Open `frontend/index.html`** in your web browser
2. **Start exploring** the career assessment and features
3. **No build process required** - it's ready to run!

### Full Stack Setup
1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp config/config.env.example config/config.env
   # Edit config/config.env with your MongoDB URI and other settings
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   # Open index.html in your browser or serve with a local server
   ```

3. **AI Integration (Optional):**
   - Follow the guide in `GEMINI_SETUP.md`
   - Configure your Gemini API key in `frontend/js/gemini-config.js`

## Key Sections

### 1. Hero Section
- Eye-catching landing area with call-to-action buttons
- Animated floating cards showcasing different skill areas
- Gradient background with modern design

### 2. Career Assessment
- 10 carefully crafted questions covering:
  - Work environment preferences
  - Technical interests
  - Learning styles
  - Problem-solving approaches
  - Career motivations
- Real-time progress bar
- Personalized results with confidence scores

### 3. Skills Analysis
- Visual skill bars with animated progress
- Categories: Technical Skills and Soft Skills
- Personalized recommendations for skill development
- Resource links for learning

### 4. Career Paths
- Tabbed interface for different career options:
  - Frontend Developer
  - Backend Developer
  - Full Stack Developer
  - Data Scientist
- Detailed roadmaps with:
  - Learning milestones
  - Time estimates
  - Salary information
  - Job market demand

### 5. About Section
- Company information and features
- Statistics and achievements
- Contact information

## Interactive Features

### Assessment Functionality
- **Question Navigation**: Previous/Next buttons with keyboard support
- **Option Selection**: Click to select answers with visual feedback
- **Progress Tracking**: Real-time progress bar and question counter
- **Results Display**: Comprehensive results with scoring breakdown
- **Retake Option**: Ability to restart the assessment

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop Enhancement**: Full-featured desktop experience
- **Touch Support**: Swipe gestures for mobile navigation

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Clear focus indicators
- **Screen Reader Friendly**: Semantic HTML structure
- **High Contrast**: Readable color schemes

## Customization

### Adding New Questions
Edit the `questions` array in `script.js`:

```javascript
const questions = [
    {
        question: "Your new question here?",
        options: [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4"
        ]
    }
    // ... existing questions
];
```

### Modifying Career Paths
Update the career path content in `index.html` and add corresponding JavaScript logic in `script.js`.

### Styling Changes
Modify `styles.css` to customize:
- Color scheme (CSS custom properties)
- Typography
- Layout and spacing
- Animations and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Optimized Images**: Efficient loading and display
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Lazy Loading**: Intersection Observer for animations
- **Minimal Dependencies**: No external frameworks

## Future Enhancements

Potential features to add:
- User accounts and progress saving
- More detailed skill assessments
- Integration with learning platforms
- Job market data API integration
- Social sharing features
- Advanced analytics and reporting

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please contact:
- Email: info@careerpathpro.com
- Phone: +1 (555) 123-4567

---

**CareerPath Pro** - Your personalized career and skill advisor for the modern world.
