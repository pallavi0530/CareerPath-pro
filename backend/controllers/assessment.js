const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Assessment = require('../models/Assessment');

// @desc    Submit career assessment
// @route   POST /api/v1/assessments
// @access  Private
exports.submitAssessment = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const { answers } = req.body;

    // Calculate career path scores based on answers
    const careerScores = calculateCareerScores(answers);
    
    // Find the highest scoring career path
    const recommendedPath = Object.keys(careerScores).reduce((a, b) => 
        careerScores[a] > careerScores[b] ? a : b
    );

    // Calculate confidence score (0-100)
    const maxScore = Math.max(...Object.values(careerScores));
    const confidenceScore = Math.round((maxScore / 50) * 100); // Assuming max possible score is 50

    // Generate next steps based on recommended path
    const nextSteps = generateNextSteps(recommendedPath);

    // Format results
    const results = {
        recommendedPath,
        confidenceScore: Math.min(confidenceScore, 100),
        careerScores: Object.entries(careerScores).map(([path, score]) => ({
            path: formatPathName(path),
            score: Math.round(score)
        })),
        nextSteps
    };

    const assessment = await Assessment.create({
        user: req.user.id,
        answers,
        results
    });

    res.status(201).json({
        success: true,
        data: assessment
    });
});

// @desc    Get all assessments for a user
// @route   GET /api/v1/assessments
// @access  Private
exports.getAssessments = asyncHandler(async (req, res, next) => {
    const assessments = await Assessment.find({ user: req.user.id })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: assessments.length,
        data: assessments
    });
});

// @desc    Get single assessment
// @route   GET /api/v1/assessments/:id
// @access  Private
exports.getAssessment = asyncHandler(async (req, res, next) => {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
        return next(
            new ErrorResponse(`Assessment not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user owns assessment or is admin
    if (assessment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to view this assessment`,
                403
            )
        );
    }

    res.status(200).json({
        success: true,
        data: assessment
    });
});

// Helper function to calculate career scores based on answers
function calculateCareerScores(answers) {
    const scores = {
        frontend: 0,
        backend: 0,
        fullstack: 0,
        data: 0,
        mobile: 0,
        devops: 0,
        cybersecurity: 0,
        product: 0,
        mechanical: 0,
        civil: 0,
        electrical: 0,
        biomedical: 0
    };

    // Scoring logic based on answer patterns
    answers.forEach(answer => {
        const { questionId, selectedOption } = answer;
        
        // Question 1: Interest in technology
        if (questionId === 1) {
            if (selectedOption === 'A') {
                scores.frontend += 3;
                scores.backend += 2;
                scores.fullstack += 3;
                scores.mobile += 2;
            } else if (selectedOption === 'B') {
                scores.data += 3;
                scores.cybersecurity += 2;
                scores.electrical += 2;
            } else if (selectedOption === 'C') {
                scores.mechanical += 3;
                scores.civil += 3;
                scores.electrical += 2;
            } else if (selectedOption === 'D') {
                scores.biomedical += 3;
                scores.mechanical += 2;
            }
        }
        
        // Question 2: Problem-solving approach
        if (questionId === 2) {
            if (selectedOption === 'A') {
                scores.frontend += 2;
                scores.mobile += 2;
                scores.product += 2;
            } else if (selectedOption === 'B') {
                scores.backend += 3;
                scores.devops += 3;
                scores.cybersecurity += 2;
            } else if (selectedOption === 'C') {
                scores.data += 3;
                scores.electrical += 2;
                scores.biomedical += 2;
            } else if (selectedOption === 'D') {
                scores.mechanical += 3;
                scores.civil += 3;
                scores.fullstack += 2;
            }
        }
        
        // Question 3: Work environment preference
        if (questionId === 3) {
            if (selectedOption === 'A') {
                scores.frontend += 2;
                scores.mobile += 2;
                scores.product += 2;
            } else if (selectedOption === 'B') {
                scores.backend += 2;
                scores.devops += 2;
                scores.data += 2;
            } else if (selectedOption === 'C') {
                scores.mechanical += 3;
                scores.civil += 3;
                scores.electrical += 3;
            } else if (selectedOption === 'D') {
                scores.biomedical += 3;
                scores.cybersecurity += 2;
                scores.fullstack += 2;
            }
        }
        
        // Question 4: Learning style
        if (questionId === 4) {
            if (selectedOption === 'A') {
                scores.frontend += 2;
                scores.mobile += 2;
                scores.product += 2;
            } else if (selectedOption === 'B') {
                scores.backend += 2;
                scores.devops += 2;
                scores.cybersecurity += 2;
            } else if (selectedOption === 'C') {
                scores.data += 3;
                scores.electrical += 2;
                scores.biomedical += 2;
            } else if (selectedOption === 'D') {
                scores.mechanical += 3;
                scores.civil += 3;
                scores.fullstack += 2;
            }
        }
        
        // Question 5: Career goals
        if (questionId === 5) {
            if (selectedOption === 'A') {
                scores.frontend += 2;
                scores.mobile += 2;
                scores.product += 3;
            } else if (selectedOption === 'B') {
                scores.backend += 2;
                scores.devops += 2;
                scores.data += 2;
            } else if (selectedOption === 'C') {
                scores.mechanical += 3;
                scores.civil += 3;
                scores.electrical += 3;
            } else if (selectedOption === 'D') {
                scores.biomedical += 3;
                scores.cybersecurity += 2;
                scores.fullstack += 2;
            }
        }
    });

    return scores;
}

// Helper function to format path names
function formatPathName(path) {
    const pathNames = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        fullstack: 'Full Stack Developer',
        data: 'Data Scientist',
        mobile: 'Mobile Developer',
        devops: 'DevOps Engineer',
        cybersecurity: 'Cybersecurity Specialist',
        product: 'Product Manager',
        mechanical: 'Mechanical Engineer',
        civil: 'Civil Engineer',
        electrical: 'Electrical Engineer',
        biomedical: 'Biomedical Engineer'
    };
    return pathNames[path] || path;
}

// Helper function to generate next steps
function generateNextSteps(recommendedPath) {
    const nextStepsMap = {
        frontend: "Start with HTML, CSS, and JavaScript fundamentals. Build projects using React or Vue.js. Create a portfolio showcasing your work.",
        backend: "Learn a server-side language like Node.js, Python, or Java. Understand databases and APIs. Practice building RESTful services.",
        fullstack: "Master both frontend and backend technologies. Learn about deployment, version control, and DevOps practices.",
        data: "Learn Python or R for data analysis. Study statistics and machine learning. Work with datasets and visualization tools.",
        mobile: "Choose between iOS (Swift) or Android (Kotlin/Java) development. Learn mobile UI/UX principles and app deployment.",
        devops: "Learn cloud platforms (AWS, Azure, GCP), containerization (Docker), and CI/CD pipelines. Master infrastructure as code.",
        cybersecurity: "Study network security, ethical hacking, and risk assessment. Get certified in security frameworks and tools.",
        product: "Learn about product management methodologies, user research, and business strategy. Develop leadership and communication skills.",
        mechanical: "Master CAD software, thermodynamics, and materials science. Gain hands-on experience with manufacturing processes.",
        civil: "Study structural analysis, geotechnical engineering, and construction management. Learn AutoCAD and civil engineering software.",
        electrical: "Focus on circuit analysis, power systems, and electronics. Learn programming for embedded systems and automation.",
        biomedical: "Combine engineering principles with biology and medicine. Study medical devices, imaging systems, and regulatory requirements."
    };
    
    return nextStepsMap[recommendedPath] || "Continue exploring different career paths and gaining relevant skills.";
}
