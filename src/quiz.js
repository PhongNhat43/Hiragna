// src/quiz.js
// Quiz Logic Layer (no UI rendering)

// Difficulty configuration
const DIFFICULTY_CONFIG = {
  easy: { totalQuestions: 10 },
  medium: { totalQuestions: 15 },
  hard: { totalQuestions: 20 }
};

// All quiz state is stored in this object
const quizState = {
  score: 0,
  currentQuestion: null,
  totalQuestions: 10,
  questionCount: 0,
  isAnswered: false,
  quizComplete: false,
  incorrectAnswers: [],
  reviewIndex: 0,
  quizType: null, // 'hiragana' or 'katakana'
  questionSet: null // set to QUIZ_TYPE_CONFIG[quizType].data
};

// Import QUIZ_TYPE_CONFIG from hiraganaData.js
// (assumes QUIZ_TYPE_CONFIG is in global scope from script tag)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateQuestion() {
  const dataSet = quizState.questionSet;
  const correctIdx = getRandomInt(dataSet.length);
  const correct = dataSet[correctIdx];
  let options = [correct.romaji];
  while (options.length < 4) {
    const rand = dataSet[getRandomInt(dataSet.length)].romaji;
    if (!options.includes(rand)) options.push(rand);
  }
  shuffle(options);
  quizState.currentQuestion = {
    kana: correct.kana,
    correctRomaji: correct.romaji,
    options
  };
  quizState.isAnswered = false;
}

function validateAnswer(selectedRomaji) {
  if (quizState.isAnswered) return false;
  quizState.isAnswered = true;
  if (selectedRomaji === quizState.currentQuestion.correctRomaji) {
    quizState.score++;
    return true;
  }
  return false;
}



document.addEventListener('DOMContentLoaded', () => {
  // UI rendering and event listeners
  const quizTypeScreen = document.getElementById('quiztype-screen');
  const quizTypeBtns = document.querySelectorAll('.quiztype-btn');
  const difficultyScreen = document.getElementById('difficulty-screen');
  const mainQuiz = document.getElementById('main-quiz');
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');

  const hiraganaChar = document.getElementById('hiragana-char');
  const optionsArea = document.getElementById('options-area');
  const scoreSpan = document.getElementById('score');
  const nextBtn = document.getElementById('next-btn');
  const skipBtn = document.getElementById('skip-btn');
  const restartBtn = document.getElementById('restart-btn');
  const reviewBtn = document.getElementById('review-btn');
  const reviewArea = document.getElementById('review-area');
  const progressBar = document.getElementById('progress-bar');
  const questionCounter = document.getElementById('question-counter');

  // Quiz type selection logic
  console.log('Quiz type buttons found:', quizTypeBtns.length);
  quizTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-quiztype');
      console.log('Quiz type button clicked:', type);
      quizState.quizType = type;
      quizState.questionSet = QUIZ_TYPE_CONFIG[type].data;
      quizTypeScreen.style.display = 'none';
      difficultyScreen.style.display = 'flex';
    });
  });

  // Difficulty selection logic
  console.log('Difficulty buttons found:', difficultyBtns.length);
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const diff = btn.getAttribute('data-difficulty');
      console.log('Difficulty button clicked:', diff);
      quizState.difficulty = diff;
      quizState.totalQuestions = DIFFICULTY_CONFIG[diff].totalQuestions;
      quizState.score = 0;
      quizState.questionCount = 0;
      quizState.quizComplete = false;
      quizState.incorrectAnswers = [];
      quizState.reviewIndex = 0;
      difficultyScreen.style.display = 'none';
      mainQuiz.style.display = 'flex';
      renderQuestion();
      reviewBtn.style.display = 'none';
      reviewArea.style.display = 'none';
    });
  });

  function renderProgress() {
    const percent = ((quizState.questionCount) / quizState.totalQuestions) * 100;
    progressBar.style.width = percent + '%';
    questionCounter.textContent = `${quizState.questionCount + 1} / ${quizState.totalQuestions}`;
  }

  function advanceToNextQuestion() {
    quizState.questionCount++;
    if (quizState.questionCount < quizState.totalQuestions) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function renderQuestion() {
    generateQuestion();
    hiraganaChar.textContent = quizState.currentQuestion.kana;
    optionsArea.innerHTML = '';
    quizState.currentQuestion.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = option;
      btn.disabled = false;
      btn.style.background = '';
      btn.addEventListener('click', () => handleAnswer(option, btn));
      optionsArea.appendChild(btn);
    });
    nextBtn.style.display = 'none';
    renderScore();
    renderProgress();
    quizState.quizComplete = false;
  }

  function handleAnswer(option, btn) {
    if (quizState.isAnswered) return;
    const correct = validateAnswer(option);
    disableOptions();
    if (correct) {
      btn.style.background = '#bbf7d0';
    } else {
      btn.style.background = '#fecaca';
      // Find and highlight the correct answer button
      Array.from(optionsArea.children).forEach(button => {
        if (button.textContent === quizState.currentQuestion.correctRomaji) {
          button.style.background = '#bbf7d0';
        }
      });
      // Track incorrect answer
      quizState.incorrectAnswers.push({
        kana: quizState.currentQuestion.kana,
        correctRomaji: quizState.currentQuestion.correctRomaji,
        userAnswer: option
      });
    }
    renderScore();
    // Auto-advance after 800ms delay to show answer feedback
    setTimeout(() => advanceToNextQuestion(), 800);
  }

  function disableOptions() {
    Array.from(optionsArea.children).forEach(btn => btn.disabled = true);
  }

  function renderScore() {
    scoreSpan.textContent = `Score: ${quizState.score}`;
  }

  function showResult() {
    quizState.quizComplete = true;
    optionsArea.innerHTML = '';
    hiraganaChar.textContent = `Quiz Complete!`;
    scoreSpan.textContent = `Final Score: ${quizState.score} / ${quizState.totalQuestions}`;
    nextBtn.style.display = 'none';
    skipBtn.style.display = 'none';
    reviewArea.style.display = 'none';
    if (quizState.incorrectAnswers.length > 0) {
      reviewBtn.style.display = 'inline-block';
    }
  }

  function showReview() {
    quizState.reviewIndex = 0;
    renderReviewQuestion();
  }

  function renderReviewQuestion() {
    if (quizState.incorrectAnswers.length === 0) return;
    const item = quizState.incorrectAnswers[quizState.reviewIndex];
    reviewArea.innerHTML = `
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <h3>Question ${quizState.reviewIndex + 1} of ${quizState.incorrectAnswers.length}</h3>
        <p><strong>Character:</strong> ${item.kana}</p>
        <p><strong>Your answer:</strong> ${item.userAnswer || 'Skipped'}</p>
        <p><strong>Correct answer:</strong> ${item.correctRomaji}</p>
        <div style="margin-top: 15px;">
          ${quizState.reviewIndex > 0 ? '<button id="review-prev-btn">Previous</button>' : ''}
          ${quizState.reviewIndex < quizState.incorrectAnswers.length - 1 ? '<button id="review-next-btn">Next</button>' : ''}
        </div>
      </div>
    `;
    reviewArea.style.display = 'block';
    optionsArea.style.display = 'none';
    
    const prevBtn = document.getElementById('review-prev-btn');
    const nextReviewBtn = document.getElementById('review-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      quizState.reviewIndex--;
      renderReviewQuestion();
    });
    if (nextReviewBtn) nextReviewBtn.addEventListener('click', () => {
      quizState.reviewIndex++;
      renderReviewQuestion();
    });
  }

  nextBtn.addEventListener('click', () => {
    advanceToNextQuestion();
  });

  skipBtn.addEventListener('click', () => {
    if (quizState.isAnswered) return;
    quizState.isAnswered = true;
    quizState.incorrectAnswers.push({
      kana: quizState.currentQuestion.kana,
      correctRomaji: quizState.currentQuestion.correctRomaji,
      userAnswer: null
    });
    disableOptions();
    setTimeout(() => advanceToNextQuestion(), 800);
  });

  reviewBtn.addEventListener('click', () => {
    showReview();
  });

  restartBtn.addEventListener('click', () => {
    // Return to quiz type selection
    mainQuiz.style.display = 'none';
    quizTypeScreen.style.display = 'flex';
    // Reset state
    quizState.quizType = null;
    quizState.questionSet = null;
    quizState.difficulty = null;
    quizState.totalQuestions = 10;
    quizState.score = 0;
    quizState.questionCount = 0;    quizState.isAnswered = false;    quizState.quizComplete = false;
    quizState.incorrectAnswers = [];
    quizState.reviewIndex = 0;
    reviewBtn.style.display = 'none';
    reviewArea.style.display = 'none';
  });

  // Initial state: show quiz type screen, hide others
  quizTypeScreen.style.display = 'flex';
  difficultyScreen.style.display = 'none';
  mainQuiz.style.display = 'none';
  reviewBtn.style.display = 'none';
  reviewArea.style.display = 'none';
});
