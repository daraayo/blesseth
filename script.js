const quizData = [
    // Section 1: Extraversion
    [
        {question: "I feel comfortable in social situations."},
        {question: "I enjoy being the center of attention."},
        {question: "I prefer working in teams rather than alone."},
    ],
    // Section 2: Conscientiousness
    [
        {question: "I am always prepared and organized."},
        {question: "I pay attention to details."},
        {question: "I complete tasks thoroughly and on time."},
    ],
    // Section 3: Agreeableness
    [
        {question: "I am interested in other people's feelings."},
        {question: "I try to avoid conflicts and seek harmony."},
        {question: "I enjoy cooperating with others."},
    ],
    // Section 4: Neuroticism
    [
        {question: "I often feel anxious or worried."},
        {question: "I am easily stressed or overwhelmed."},
        {question: "My mood can change quickly."},
    ],
    // Section 5: Openness to Experience
    [
        {question: "I have a vivid imagination."},
        {question: "I enjoy trying new and diverse experiences."},
        {question: "I am curious about many different things."},
    ]
];

const sectionTitles = [
    "Extraversion",
    "Conscientiousness",
    "Agreeableness",
    "Neuroticism",
    "Openness to Experience"
];

let currentSection = 0;
let currentQuestion = 0;
let userAnswers = Array(5).fill().map(() => Array(3).fill(null));
let currentUser = null;

// Authentication functions
function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        alert('Username already exists');
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login.');
    showLogin();
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username] === password) {
        currentUser = username;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        alert(`Welcome, ${username}! You are now entering Section 1: ${sectionTitles[0]}`);
        loadQuestion();
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    currentUser = null;
    userAnswers = Array(5).fill().map(() => Array(3).fill(null));
    currentSection = 0;
    currentQuestion = 0;
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    showLogin();
}

// Quiz functions
function loadQuestion() {
    const questionData = quizData[currentSection][currentQuestion];
    document.getElementById('section-title').textContent = `Section ${currentSection + 1}: ${sectionTitles[currentSection]}`;
    document.getElementById('question-container').innerHTML = `
        <h2>${questionData.question}</h2>
        <div class="options">
            ${[1, 2, 3, 4, 5].map(option => `
                <label>
                    <input type="radio" name="answer" value="${option}" ${userAnswers[currentSection][currentQuestion] === option ? 'checked' : ''}>
                    ${option}
                </label>
            `).join('')}
        </div>
        <p class="scale-description">1 = Strongly Disagree, 5 = Strongly Agree</p>
    `;
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((currentSection * 3 + currentQuestion + 1) / (quizData.length * 3)) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function moveToNextQuestion() {
    if (currentQuestion < 2) {
        currentQuestion++;
    } else if (currentSection < quizData.length - 1) {
        currentSection++;
        currentQuestion = 0;
        alert(`You are now entering Section ${currentSection + 1}: ${sectionTitles[currentSection]}`);
    } else {
        showResults();
        return;
    }
    loadQuestion();
}

function moveToPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
    } else if (currentSection > 0) {
        currentSection--;
        currentQuestion = 2;
        alert(`You are now entering Section ${currentSection + 1}: ${sectionTitles[currentSection]}`);
    }
    loadQuestion();
}

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    const totalScore = calculateTotalScore();
    document.getElementById('total-score').textContent = totalScore;
    displayAnalysis(totalScore);
}

function calculateTotalScore() {
    return userAnswers.flat().reduce((sum, answer) => sum + (answer || 0), 0);
}

function displayAnalysis(totalScore) {
    const maxPossibleScore = 5 * 5 * 3; // 5 sections, 5 max score per question, 3 questions per section
    const percentage = (totalScore / maxPossibleScore) * 100;
    let analysis = '';

    if (percentage >= 80) {
        analysis = "You scored very high on this assessment. This suggests that you have a strong tendency towards extraversion, conscientiousness, agreeableness, emotional stability, and openness to experience.";
    } else if (percentage >= 60) {
        analysis = "You scored above average on this assessment. This indicates that you have a good balance of personality traits, with strengths in most areas.";
    } else if (percentage >= 40) {
        analysis = "Your score is in the average range. This suggests a balanced personality profile with a mix of traits.";
    } else if (percentage >= 20) {
        analysis = "Your score is below average. This might indicate a tendency towards introversion, spontaneity over strict organization, selective social interactions, some emotional sensitivity, and a preference for familiar experiences.";
    } else {
        analysis = "Your score is in the lower range. This could suggest strong preferences for solitary activities, a very flexible approach to tasks, cautious social interactions, higher emotional reactivity, and a comfort with routine experiences.";
    }

    document.getElementById('analysis').innerHTML = `<p>${analysis}</p>`;
}

function restartQuiz() {
    currentSection = 0;
    currentQuestion = 0;
    userAnswers = Array(5).fill().map(() => Array(3).fill(null));
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    loadQuestion();
}

// Event Listeners
document.getElementById('show-signup').addEventListener('click', showSignup);
document.getElementById('show-login').addEventListener('click', showLogin);
document.getElementById('signup-btn').addEventListener('click', signup);
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('prev-btn').addEventListener('click', moveToPreviousQuestion);
document.getElementById('next-btn').addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        userAnswers[currentSection][currentQuestion] = parseInt(selectedAnswer.value);
    }
    moveToNextQuestion();
});
document.getElementById('restart-btn').addEventListener('click', restartQuiz);

// Initialize the page
showLogin();