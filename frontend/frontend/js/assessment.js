// Assessment page specific functionality
let currentQuestionIndex = 0;
let answers = {};
const questions = [
    {
        question: "What type of work environment do you prefer?",
        options: [
            "Remote work from home",
            "Office with team collaboration",
            "Hybrid (mix of remote and office)",
            "Flexible/varies"
        ]
    },
    {
        question: "Which of these activities interests you most?",
        options: [
            "Building websites and applications",
            "Analyzing data and creating reports",
            "Managing projects and teams",
            "Designing user experiences"
        ]
    },
    {
        question: "What's your preferred learning style?",
        options: [
            "Hands-on practice and experimentation",
            "Reading documentation and tutorials",
            "Video courses and interactive content",
            "Working with mentors and peers"
        ]
    },
    {
        question: "Which programming language interests you most?",
        options: [
            "JavaScript/TypeScript",
            "Python",
            "Java",
            "C#",
            "I'm not sure yet"
        ]
    },
    {
        question: "What type of problems do you enjoy solving?",
        options: [
            "User interface and experience challenges",
            "Data analysis and business intelligence",
            "System architecture and optimization",
            "Creative and design problems"
        ]
    },
    {
        question: "How do you prefer to work with others?",
        options: [
            "Leading and mentoring team members",
            "Collaborating as an equal team member",
            "Working independently with occasional check-ins",
            "Pair programming and close collaboration"
        ]
    },
    {
        question: "What's your experience level with technology?",
        options: [
            "Complete beginner",
            "Some basic knowledge",
            "Intermediate with some projects",
            "Advanced with professional experience"
        ]
    },
    {
        question: "Which industry interests you most?",
        options: [
            "Technology and software",
            "Finance and banking",
            "Healthcare and medical",
            "E-commerce and retail",
            "Education and training"
        ]
    },
    {
        question: "What motivates you most in your career?",
        options: [
            "High salary and financial security",
            "Creative freedom and innovation",
            "Helping others and making an impact",
            "Continuous learning and growth"
        ]
    },
    {
        question: "How do you handle challenges and setbacks?",
        options: [
            "Research and find solutions independently",
            "Ask for help from colleagues or mentors",
            "Take a break and return with fresh perspective",
            "Break down the problem into smaller parts"
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeAssessment();
});

function initializeAssessment() {
    showQuestion();
    updateProgress();
    updateButtons();
}

function showQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    questionContainer.innerHTML = `
        <div class="question active">
            <h3>${currentQuestion.question}</h3>
            <div class="answer-options">
                ${currentQuestion.options.map((option, index) => `
                    <div class="option" onclick="selectOption(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function selectOption(optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const options = document.querySelectorAll('.option');
    if (options[optionIndex]) {
        options[optionIndex].classList.add('selected');
    }
    
    // Store answer
    answers[currentQuestionIndex] = optionIndex;
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
        updateProgress();
        updateButtons();
    } else {
        // Assessment complete
        completeAssessment();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
        updateProgress();
        updateButtons();
        
        // Restore previous selection if exists
        if (answers[currentQuestionIndex] !== undefined) {
            const options = document.querySelectorAll('.option');
            if (options[answers[currentQuestionIndex]]) {
                options[answers[currentQuestionIndex]].classList.add('selected');
            }
        }
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length;
    }
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.innerHTML = 'Complete Assessment <i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
        
        // Disable next button if no option selected
        if (answers[currentQuestionIndex] === undefined) {
            nextBtn.disabled = true;
        }
    }
}

function completeAssessment() {
    // Calculate results based on answers
    const results = calculateResults();
    
    // Show results
    showResults(results);
}

function calculateResults() {
    // Simple scoring system - in a real app, this would be more sophisticated
    const scores = {
        frontend: 0,
        backend: 0,
        fullstack: 0,
        data: 0
    };
    
    // Weight different questions differently
    const weights = {
        0: { frontend: 1, backend: 0, fullstack: 1, data: 0 }, // Work environment
        1: { frontend: 2, backend: 1, fullstack: 2, data: 1 }, // Activities
        2: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Learning style
        3: { frontend: 2, backend: 1, fullstack: 2, data: 0 }, // Programming language
        4: { frontend: 2, backend: 1, fullstack: 1, data: 1 }, // Problem solving
        5: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Team work
        6: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Experience
        7: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Industry
        8: { frontend: 1, backend: 1, fullstack: 1, data: 1 }, // Motivation
        9: { frontend: 1, backend: 1, fullstack: 1, data: 1 }  // Challenges
    };
    
    // Calculate scores
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] !== undefined) {
            const weight = weights[i];
            scores.frontend += weight.frontend;
            scores.backend += weight.backend;
            scores.fullstack += weight.fullstack;
            scores.data += weight.data;
        }
    }
    
    // Find the highest scoring path
    const maxScore = Math.max(...Object.values(scores));
    const recommendedPath = Object.keys(scores).find(key => scores[key] === maxScore);
    
    return {
        scores,
        recommendedPath,
        confidence: Math.round((maxScore / Object.values(scores).reduce((a, b) => a + b, 0)) * 100)
    };
}

function showResults(results) {
    const questionContainer = document.getElementById('questionContainer');
    const assessmentButtons = document.querySelector('.assessment-buttons');
    
    if (!questionContainer) return;
    
    questionContainer.innerHTML = `
        <div class="question active">
            <h3>Assessment Complete!</h3>
            <div class="results-container">
                <div class="result-card">
                    <h4>Recommended Career Path</h4>
                    <div class="recommended-path">
                        <i class="fas fa-star"></i>
                        <span class="path-name">${getPathDisplayName(results.recommendedPath)}</span>
                        <span class="confidence">${results.confidence}% match</span>
                    </div>
                </div>
                
                <div class="all-scores">
                    <h4>All Career Path Scores</h4>
                    <div class="score-bars">
                        <div class="score-item">
                            <span>Frontend Developer</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.frontend / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.frontend}</span>
                        </div>
                        <div class="score-item">
                            <span>Backend Developer</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.backend / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.backend}</span>
                        </div>
                        <div class="score-item">
                            <span>Full Stack Developer</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.fullstack / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.fullstack}</span>
                        </div>
                        <div class="score-item">
                            <span>Data Scientist</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${(results.scores.data / Math.max(...Object.values(results.scores))) * 100}%"></div>
                            </div>
                            <span>${results.scores.data}</span>
                        </div>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>Next Steps</h4>
                    <p>Based on your assessment, we recommend exploring the <strong>${getPathDisplayName(results.recommendedPath)}</strong> career path. Click below to view detailed learning roadmaps and resources.</p>
                    <a href="career-paths.html" class="btn btn-primary">
                        <i class="fas fa-arrow-right"></i>
                        View Career Path
                    </a>
                </div>
            </div>
        </div>
    `;
    
    if (assessmentButtons) {
        assessmentButtons.innerHTML = `
            <button class="btn btn-outline" onclick="restartAssessment()">
                <i class="fas fa-redo"></i>
                Retake Assessment
            </button>
        `;
    }
}

function getPathDisplayName(path) {
    const names = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        fullstack: 'Full Stack Developer',
        data: 'Data Scientist'
    };
    return names[path] || path;
}

function restartAssessment() {
    currentQuestionIndex = 0;
    answers = {};
    showQuestion();
    updateProgress();
    updateButtons();
    
    // Restore original buttons
    const assessmentButtons = document.querySelector('.assessment-buttons');
    if (assessmentButtons) {
        assessmentButtons.innerHTML = `
            <button class="btn btn-outline" id="prevBtn" onclick="previousQuestion()" disabled>
                <i class="fas fa-arrow-left"></i>
                Previous
            </button>
            <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()">
                Next
                <i class="fas fa-arrow-right"></i>
            </button>
        `;
    }
}
