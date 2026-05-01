const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    value: String,
    weight: {
      frontend: { type: Number, default: 0 },
      backend: { type: Number, default: 0 },
      fullstack: { type: Number, default: 0 },
      data: { type: Number, default: 0 }
    }
  }],
  category: {
    type: String,
    enum: ['work_environment', 'technical_interest', 'learning_style', 'problem_solving', 'teamwork', 'experience', 'motivation'],
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: String,
      required: true
    },
    selectedIndex: {
      type: Number,
      required: true
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }],
  results: {
    scores: {
      frontend: { type: Number, default: 0 },
      backend: { type: Number, default: 0 },
      fullstack: { type: Number, default: 0 },
      data: { type: Number, default: 0 }
    },
    recommendedPath: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'data'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    strengths: [String],
    areasForImprovement: [String],
    nextSteps: [String]
  },
  metadata: {
    totalTime: {
      type: Number, // in seconds
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      browser: String
    },
    ipAddress: String
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  }
}, {
  timestamps: true
});

// Index for better performance
assessmentSchema.index({ user: 1, createdAt: -1 });
assessmentSchema.index({ 'results.recommendedPath': 1 });
assessmentSchema.index({ status: 1 });

// Calculate results before saving
assessmentSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('answers')) {
    this.calculateResults();
  }
  next();
});

// Method to calculate assessment results
assessmentSchema.methods.calculateResults = function() {
  const scores = {
    frontend: 0,
    backend: 0,
    fullstack: 0,
    data: 0
  };

  // Calculate scores based on answers
  this.answers.forEach(answer => {
    // This would need to be populated with actual question data
    // For now, using a simple scoring system
    const weights = {
      frontend: Math.random() * 10,
      backend: Math.random() * 10,
      fullstack: Math.random() * 10,
      data: Math.random() * 10
    };

    Object.keys(scores).forEach(path => {
      scores[path] += weights[path];
    });
  });

  this.results.scores = scores;

  // Find the highest scoring path
  const maxScore = Math.max(...Object.values(scores));
  const recommendedPath = Object.keys(scores).find(path => scores[path] === maxScore);
  
  this.results.recommendedPath = recommendedPath;
  this.results.confidence = Math.round((maxScore / Object.values(scores).reduce((a, b) => a + b, 0)) * 100);

  // Generate recommendations based on results
  this.results.strengths = this.generateStrengths(recommendedPath);
  this.results.areasForImprovement = this.generateAreasForImprovement(recommendedPath);
  this.results.nextSteps = this.generateNextSteps(recommendedPath);
};

// Generate strengths based on recommended path
assessmentSchema.methods.generateStrengths = function(path) {
  const strengthsMap = {
    frontend: ['Creative thinking', 'Attention to detail', 'User experience focus'],
    backend: ['Logical thinking', 'Problem solving', 'System architecture'],
    fullstack: ['Versatility', 'Project management', 'Technical breadth'],
    data: ['Analytical thinking', 'Statistical knowledge', 'Pattern recognition']
  };
  return strengthsMap[path] || [];
};

// Generate areas for improvement
assessmentSchema.methods.generateAreasForImprovement = function(path) {
  const improvementMap = {
    frontend: ['Advanced JavaScript concepts', 'Performance optimization', 'Testing frameworks'],
    backend: ['Cloud platforms', 'Microservices architecture', 'Security best practices'],
    fullstack: ['DevOps practices', 'Advanced database concepts', 'Scalability patterns'],
    data: ['Machine learning algorithms', 'Big data tools', 'Advanced statistics']
  };
  return improvementMap[path] || [];
};

// Generate next steps
assessmentSchema.methods.generateNextSteps = function(path) {
  const nextStepsMap = {
    frontend: [
      'Complete React tutorial',
      'Build a portfolio project',
      'Learn responsive design principles',
      'Practice with modern CSS frameworks'
    ],
    backend: [
      'Set up a development environment',
      'Learn a backend framework',
      'Practice with databases',
      'Deploy your first API'
    ],
    fullstack: [
      'Choose a tech stack',
      'Build a complete application',
      'Learn version control with Git',
      'Practice with cloud deployment'
    ],
    data: [
      'Learn Python for data science',
      'Practice with Jupyter notebooks',
      'Work on real datasets',
      'Learn data visualization tools'
    ]
  };
  return nextStepsMap[path] || [];
};

// Get assessment summary
assessmentSchema.methods.getSummary = function() {
  return {
    id: this._id,
    recommendedPath: this.results.recommendedPath,
    confidence: this.results.confidence,
    scores: this.results.scores,
    completedAt: this.metadata.completedAt,
    totalTime: this.metadata.totalTime
  };
};

module.exports = mongoose.model('Assessment', assessmentSchema);
module.exports.Question = mongoose.model('Question', questionSchema);
