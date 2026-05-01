const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const ChatSession = require('../models/ChatSession');

const router = express.Router();

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get recent assessments
    const recentAssessments = await Assessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('results metadata status createdAt');

    // Get recent chat sessions
    const recentChats = await ChatSession.find({ user: userId })
      .sort({ lastActivity: -1 })
      .limit(3)
      .select('sessionId analytics startedAt lastActivity');

    // Get user stats
    const totalAssessments = await Assessment.countDocuments({ user: userId });
    const totalChatSessions = await ChatSession.countDocuments({ user: userId });
    const completedAssessments = await Assessment.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });

    // Get most recent assessment result
    const latestAssessment = await Assessment.findOne({ 
      user: userId, 
      status: 'completed' 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile(),
        stats: {
          totalAssessments,
          completedAssessments,
          totalChatSessions
        },
        recentAssessments,
        recentChats: recentChats.map(chat => chat.getSummary()),
        latestAssessment: latestAssessment ? latestAssessment.getSummary() : null
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   PUT /api/user/skills
// @desc    Update user skills
// @access  Private
router.put('/skills', [
  body('skills').isArray(),
  body('skills.*.name').trim().notEmpty(),
  body('skills.*.level').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('skills.*.category').isIn(['technical', 'soft', 'language', 'tool'])
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

    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { 'profile.skills': skills } },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating skills'
    });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('notifications').optional().isObject(),
  body('privacy').optional().isObject()
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

    const { notifications, privacy } = req.body;
    const updates = {};

    if (notifications) {
      updates['preferences.notifications'] = {
        ...req.user.preferences.notifications,
        ...notifications
      };
    }

    if (privacy) {
      updates['preferences.privacy'] = {
        ...req.user.preferences.privacy,
        ...privacy
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @route   GET /api/user/analytics
// @desc    Get user analytics data
// @access  Private
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Assessment analytics
    const assessmentStats = await Assessment.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          averageTime: { $avg: '$metadata.totalTime' }
        }
      }
    ]);

    // Chat analytics
    const chatStats = await ChatSession.aggregate([
      {
        $match: {
          user: userId,
          startedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMessages: { $sum: '$analytics.totalMessages' },
          averageResponseTime: { $avg: '$analytics.averageResponseTime' }
        }
      }
    ]);

    // Career path distribution
    const careerPathStats = await Assessment.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$results.recommendedPath',
          count: { $sum: 1 }
        }
      }
    ]);

    // Skill distribution
    const skillStats = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$profile.skills' },
      {
        $group: {
          _id: '$profile.skills.level',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        assessmentStats: assessmentStats[0] || { total: 0, completed: 0, averageTime: 0 },
        chatStats: chatStats[0] || { totalSessions: 0, totalMessages: 0, averageResponseTime: 0 },
        careerPathDistribution: careerPathStats,
        skillDistribution: skillStats
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's assessments
    await Assessment.deleteMany({ user: userId });

    // Delete user's chat sessions
    await ChatSession.deleteMany({ user: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
});

// @route   GET /api/user/export
// @desc    Export user data
// @access  Private
router.get('/export', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId).select('-password');
    
    // Get assessments
    const assessments = await Assessment.find({ user: userId });
    
    // Get chat sessions
    const chatSessions = await ChatSession.find({ user: userId });

    const exportData = {
      user: user.getPublicProfile(),
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        results: assessment.results,
        completedAt: assessment.metadata.completedAt,
        totalTime: assessment.metadata.totalTime
      })),
      chatSessions: chatSessions.map(session => session.getSummary()),
      exportedAt: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="careerpath-data.json"');
    res.json(exportData);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data'
    });
  }
});

module.exports = router;
