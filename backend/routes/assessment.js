const express = require('express');
const { body, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/assessment/questions
// @desc    Get assessment questions
// @access  Private
router.get('/questions', async (req, res) => {
  try {
    const questions = [
      {
        id: '1',
        question: 'What type of work environment do you prefer?',
        options: [
          { text: 'Remote work from home', value: 'remote', weight: { frontend: 2, backend: 1, fullstack: 2, data: 1 } },
          { text: 'Office with team collaboration', value: 'office', weight: { frontend: 1, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Hybrid (mix of remote and office)', value: 'hybrid', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Flexible/varies', value: 'flexible', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } }
        ],
        category: 'work_environment',
        order: 1
      },
      {
        id: '2',
        question: 'Which of these activities interests you most?',
        options: [
          { text: 'Building websites and applications', value: 'web_dev', weight: { frontend: 3, backend: 1, fullstack: 3, data: 0 } },
          { text: 'Analyzing data and creating reports', value: 'data_analysis', weight: { frontend: 0, backend: 1, fullstack: 1, data: 3 } },
          { text: 'Managing projects and teams', value: 'management', weight: { frontend: 1, backend: 1, fullstack: 2, data: 1 } },
          { text: 'Designing user experiences', value: 'design', weight: { frontend: 3, backend: 0, fullstack: 2, data: 0 } }
        ],
        category: 'technical_interest',
        order: 2
      },
      {
        id: '3',
        question: 'What\'s your preferred learning style?',
        options: [
          { text: 'Hands-on practice and experimentation', value: 'hands_on', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Reading documentation and tutorials', value: 'reading', weight: { frontend: 1, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Video courses and interactive content', value: 'video', weight: { frontend: 2, backend: 1, fullstack: 2, data: 1 } },
          { text: 'Working with mentors and peers', value: 'mentorship', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } }
        ],
        category: 'learning_style',
        order: 3
      },
      {
        id: '4',
        question: 'Which programming language interests you most?',
        options: [
          { text: 'JavaScript/TypeScript', value: 'javascript', weight: { frontend: 3, backend: 1, fullstack: 2, data: 0 } },
          { text: 'Python', value: 'python', weight: { frontend: 0, backend: 2, fullstack: 1, data: 3 } },
          { text: 'Java', value: 'java', weight: { frontend: 0, backend: 3, fullstack: 2, data: 1 } },
          { text: 'C#', value: 'csharp', weight: { frontend: 0, backend: 2, fullstack: 1, data: 0 } },
          { text: 'I\'m not sure yet', value: 'unsure', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } }
        ],
        category: 'technical_interest',
        order: 4
      },
      {
        id: '5',
        question: 'What type of problems do you enjoy solving?',
        options: [
          { text: 'User interface and experience challenges', value: 'ui_ux', weight: { frontend: 3, backend: 0, fullstack: 2, data: 0 } },
          { text: 'Data analysis and business intelligence', value: 'data_bi', weight: { frontend: 0, backend: 1, fullstack: 1, data: 3 } },
          { text: 'System architecture and optimization', value: 'architecture', weight: { frontend: 0, backend: 3, fullstack: 2, data: 1 } },
          { text: 'Creative and design problems', value: 'creative', weight: { frontend: 2, backend: 0, fullstack: 1, data: 0 } }
        ],
        category: 'problem_solving',
        order: 5
      },
      {
        id: '6',
        question: 'How do you prefer to work with others?',
        options: [
          { text: 'Leading and mentoring team members', value: 'leading', weight: { frontend: 1, backend: 1, fullstack: 2, data: 1 } },
          { text: 'Collaborating as an equal team member', value: 'collaborating', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Working independently with occasional check-ins', value: 'independent', weight: { frontend: 2, backend: 2, fullstack: 1, data: 2 } },
          { text: 'Pair programming and close collaboration', value: 'pair_programming', weight: { frontend: 2, backend: 2, fullstack: 2, data: 1 } }
        ],
        category: 'teamwork',
        order: 6
      },
      {
        id: '7',
        question: 'What\'s your experience level with technology?',
        options: [
          { text: 'Complete beginner', value: 'beginner', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } },
          { text: 'Some basic knowledge', value: 'basic', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } },
          { text: 'Intermediate with some projects', value: 'intermediate', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Advanced with professional experience', value: 'advanced', weight: { frontend: 3, backend: 3, fullstack: 3, data: 3 } }
        ],
        category: 'experience',
        order: 7
      },
      {
        id: '8',
        question: 'Which industry interests you most?',
        options: [
          { text: 'Technology and software', value: 'tech', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Finance and banking', value: 'finance', weight: { frontend: 1, backend: 2, fullstack: 2, data: 3 } },
          { text: 'Healthcare and medical', value: 'healthcare', weight: { frontend: 1, backend: 1, fullstack: 1, data: 2 } },
          { text: 'E-commerce and retail', value: 'ecommerce', weight: { frontend: 2, backend: 2, fullstack: 2, data: 1 } },
          { text: 'Education and training', value: 'education', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } }
        ],
        category: 'technical_interest',
        order: 8
      },
      {
        id: '9',
        question: 'What motivates you most in your career?',
        options: [
          { text: 'High salary and financial security', value: 'salary', weight: { frontend: 1, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Creative freedom and innovation', value: 'creativity', weight: { frontend: 3, backend: 1, fullstack: 2, data: 1 } },
          { text: 'Helping others and making an impact', value: 'impact', weight: { frontend: 1, backend: 1, fullstack: 1, data: 2 } },
          { text: 'Continuous learning and growth', value: 'learning', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } }
        ],
        category: 'motivation',
        order: 9
      },
      {
        id: '10',
        question: 'How do you handle challenges and setbacks?',
        options: [
          { text: 'Research and find solutions independently', value: 'independent_research', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } },
          { text: 'Ask for help from colleagues or mentors', value: 'ask_help', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } },
          { text: 'Take a break and return with fresh perspective', value: 'break_perspective', weight: { frontend: 1, backend: 1, fullstack: 1, data: 1 } },
          { text: 'Break down the problem into smaller parts', value: 'break_down', weight: { frontend: 2, backend: 2, fullstack: 2, data: 2 } }
        ],
        category: 'problem_solving',
        order: 10
      }
    ];

    res.json({
      success: true,
      data: { questions }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions'
    });
  }
});

// @route   POST /api/assessment/start
// @desc    Start a new assessment
// @access  Private
router.post('/start', async (req, res) => {
  try {
    const { deviceInfo, ipAddress } = req.body;

    const assessment = new Assessment({
      user: req.user._id,
      metadata: {
        deviceInfo,
        ipAddress,
        totalTime: 0
      }
    });

    await assessment.save();

    res.status(201).json({
      success: true,
      message: 'Assessment started successfully',
      data: {
        assessmentId: assessment._id,
        status: assessment.status
      }
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting assessment'
    });
  }
});

// @route   POST /api/assessment/:id/answer
// @desc    Submit an answer for a question
// @access  Private
router.post('/:id/answer', [
  body('questionId').notEmpty(),
  body('selectedOption').notEmpty(),
  body('selectedIndex').isInt({ min: 0 }),
  body('timeSpent').optional().isInt({ min: 0 })
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

    const { questionId, selectedOption, selectedIndex, timeSpent = 0 } = req.body;
    const assessmentId = req.params.id;

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      user: req.user._id,
      status: 'in_progress'
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found or not in progress'
      });
    }

    // Add or update answer
    const existingAnswerIndex = assessment.answers.findIndex(
      answer => answer.questionId.toString() === questionId
    );

    const answerData = {
      questionId,
      selectedOption,
      selectedIndex,
      timeSpent
    };

    if (existingAnswerIndex >= 0) {
      assessment.answers[existingAnswerIndex] = answerData;
    } else {
      assessment.answers.push(answerData);
    }

    await assessment.save();

    res.json({
      success: true,
      message: 'Answer saved successfully',
      data: {
        totalAnswers: assessment.answers.length
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving answer'
    });
  }
});

// @route   POST /api/assessment/:id/complete
// @desc    Complete the assessment
// @access  Private
router.post('/:id/complete', [
  body('totalTime').isInt({ min: 0 })
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

    const { totalTime } = req.body;
    const assessmentId = req.params.id;

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      user: req.user._id,
      status: 'in_progress'
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found or not in progress'
      });
    }

    // Update assessment metadata
    assessment.metadata.totalTime = totalTime;
    assessment.metadata.completedAt = new Date();
    assessment.status = 'completed';

    // Calculate results
    assessment.calculateResults();
    await assessment.save();

    // Add assessment to user's history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { assessmentHistory: assessment._id }
    });

    res.json({
      success: true,
      message: 'Assessment completed successfully',
      data: {
        results: assessment.results,
        summary: assessment.getSummary()
      }
    });
  } catch (error) {
    console.error('Complete assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing assessment'
    });
  }
});

// @route   GET /api/assessment/history
// @desc    Get user's assessment history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const assessments = await Assessment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('results metadata status createdAt');

    const total = await Assessment.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        assessments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get assessment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assessment history'
    });
  }
});

// @route   GET /api/assessment/:id
// @desc    Get specific assessment details
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      data: { assessment }
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assessment'
    });
  }
});

module.exports = router;
