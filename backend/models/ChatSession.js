const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    tokens: Number,
    responseTime: Number, // in milliseconds
    category: {
      type: String,
      enum: ['career_guidance', 'skill_advice', 'interview_prep', 'learning_resources', 'general']
    }
  }
});

const chatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [messageSchema],
  context: {
    currentCareerPath: String,
    experienceLevel: String,
    interests: [String],
    lastAssessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended'],
    default: 'active'
  },
  analytics: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    assistantMessages: { type: Number, default: 0 },
    averageResponseTime: Number,
    categories: {
      career_guidance: { type: Number, default: 0 },
      skill_advice: { type: Number, default: 0 },
      interview_prep: { type: Number, default: 0 },
      learning_resources: { type: Number, default: 0 },
      general: { type: Number, default: 0 }
    }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  endedAt: Date
}, {
  timestamps: true
});

// Index for better performance
chatSessionSchema.index({ user: 1, startedAt: -1 });
chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ status: 1 });

// Update analytics when messages are added
chatSessionSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.updateAnalytics();
  }
  next();
});

// Method to add a message
chatSessionSchema.methods.addMessage = function(role, content, metadata = {}) {
  const message = {
    role,
    content,
    metadata: {
      ...metadata,
      timestamp: new Date()
    }
  };
  
  this.messages.push(message);
  this.lastActivity = new Date();
  
  return this.save();
};

// Method to update analytics
chatSessionSchema.methods.updateAnalytics = function() {
  this.analytics.totalMessages = this.messages.length;
  this.analytics.userMessages = this.messages.filter(msg => msg.role === 'user').length;
  this.analytics.assistantMessages = this.messages.filter(msg => msg.role === 'assistant').length;
  
  // Calculate average response time
  const responseTimes = this.messages
    .filter(msg => msg.metadata.responseTime)
    .map(msg => msg.metadata.responseTime);
  
  if (responseTimes.length > 0) {
    this.analytics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  }
  
  // Update category counts
  this.messages.forEach(msg => {
    if (msg.metadata.category) {
      this.analytics.categories[msg.metadata.category] = 
        (this.analytics.categories[msg.metadata.category] || 0) + 1;
    }
  });
};

// Method to end session
chatSessionSchema.methods.endSession = function() {
  this.status = 'ended';
  this.endedAt = new Date();
  return this.save();
};

// Method to get recent messages
chatSessionSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

// Method to get session summary
chatSessionSchema.methods.getSummary = function() {
  return {
    sessionId: this.sessionId,
    totalMessages: this.analytics.totalMessages,
    duration: this.endedAt ? 
      this.endedAt - this.startedAt : 
      Date.now() - this.startedAt,
    categories: this.analytics.categories,
    status: this.status,
    startedAt: this.startedAt,
    lastActivity: this.lastActivity
  };
};

// Static method to find active sessions for user
chatSessionSchema.statics.findActiveSession = function(userId) {
  return this.findOne({
    user: userId,
    status: 'active'
  }).sort({ lastActivity: -1 });
};

// Static method to cleanup old sessions
chatSessionSchema.statics.cleanupOldSessions = function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.updateMany(
    {
      status: 'ended',
      endedAt: { $lt: cutoffDate }
    },
    {
      $set: { status: 'archived' }
    }
  );
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);
