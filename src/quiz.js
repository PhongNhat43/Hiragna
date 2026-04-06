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
  questionHistory: [],
  quizType: null, // 'hiragana', 'katakana', 'kanji', or 'mixed'
  questionSet: null, // set to QUIZ_TYPE_CONFIG[quizType].data, or concat for mixed
  autoAdvance: true,
  feedbackDelay: 800,
  reviewEnabled: true,
  selectedGroup: 'all',
  mode: null,
  fcIndex: 0,
  fcKnew: 0,
  fcNeedReview: 0,
  fcAnswerShown: false,
  mixedTypes: [], // ['hiragana','katakana',...] — only used when quizType === 'mixed'
  // Pronunciation Trainer
  ptPhase: null,       // 'learn' | 'practice' | 'choose'
  ptItems: [],         // items cho phase hiện tại
  ptLearnItems: [],    // original lesson items (dùng để shuffle sang practice)
  ptIndex: 0,
  ptUnsureItems: [],   // items đánh "Chưa chắc" trong practice
  ptWrongItems: [],    // items trả lời sai trong choose
  ptChooseTotal: 0,    // số items đưa vào choose phase (để tính kết quả)
  ptAnswerShown: false,
  ptLessonKey: null    // e.g. 'basic_vowels'
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
  // Sequential pick (dedup): cycle through shuffled array by questionCount
  const correctIdx = quizState.questionCount % dataSet.length;
  const correct = dataSet[correctIdx];
  const optionsPool = dataSet.length >= 4 ? dataSet : QUIZ_TYPE_CONFIG[quizState.quizType].data;
  let options = [correct.romaji];
  // Guard: max attempts to prevent infinite loop when unique romaji < 4
  const maxAttempts = optionsPool.length * 4;
  let attempts = 0;
  while (options.length < 4 && attempts < maxAttempts) {
    const rand = optionsPool[getRandomInt(optionsPool.length)].romaji;
    if (!options.includes(rand)) options.push(rand);
    attempts++;
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



function speakJapanese(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  utt.rate = 0.8;
  window.speechSynthesis.speak(utt);
}

document.addEventListener('DOMContentLoaded', () => {
  // UI rendering and event listeners
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const quizTypeScreen = document.getElementById('quiztype-screen');
  const quizTypeBtns = document.querySelectorAll('.quiztype-btn');
  const difficultyScreen = document.getElementById('difficulty-screen');
  const mainQuiz = document.getElementById('main-quiz');
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  const flashcardScreen = document.getElementById('flashcard-screen');
  const fcProgress = document.getElementById('fc-progress');
  const fcCharacter = document.getElementById('fc-character');
  const fcAnswer = document.getElementById('fc-answer');
  const fcShowBtn = document.getElementById('fc-show-btn');
  const fcKnewBtn = document.getElementById('fc-knew-btn');
  const fcReviewBtn = document.getElementById('fc-review-btn');
  const fcRestartBtn = document.getElementById('fc-restart-btn');

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
  const settingsScreen = document.getElementById('settings-screen');
  const settingBtns = document.querySelectorAll('.setting-btn');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const backToGroupBtn = document.getElementById('back-to-group-btn');
  const groupFilterScreen = document.getElementById('group-filter-screen');
  const groupButtonsContainer = document.getElementById('group-buttons');
  const confirmGroupBtn = document.getElementById('confirm-group-btn');
  const backToDifficultyBtn = document.getElementById('back-to-difficulty-btn');
  const reviewAllBtn = document.getElementById('review-all-btn');
  const backFromQuiztypeBtn = document.getElementById('back-from-quiztype-btn');
  const backFromDifficultyBtn = document.getElementById('back-from-difficulty-btn');
  const mixTypeScreen = document.getElementById('mix-type-screen');
  const mixedBtn = document.getElementById('mixed-btn');
  const startMixedBtn = document.getElementById('start-mixed-btn');
  const backFromMixTypeBtn = document.getElementById('back-from-mix-type-btn');
  const mixTypeCheckboxes = document.querySelectorAll('.mix-type-options input[type="checkbox"]');
  // Pronunciation Trainer DOM refs
  const ptBtn = document.getElementById('pt-btn');
  const ptTypeScreen = document.getElementById('pt-type-screen');
  const ptTypeBtns = document.querySelectorAll('.pt-type-btn');
  const backFromPTTypeBtn = document.getElementById('back-from-pt-type-btn');
  const ptLessonScreen = document.getElementById('pt-lesson-screen');
  const ptLessonTitle = document.getElementById('pt-lesson-title');
  const ptLessonButtonsContainer = document.getElementById('pt-lesson-buttons');
  const backFromPTLessonBtn = document.getElementById('back-from-pt-lesson-btn');
  const ptScreen = document.getElementById('pt-screen');
  const ptPhaseLabel = document.getElementById('pt-phase-label');
  const ptProgressEl = document.getElementById('pt-progress');
  const ptCardSection = document.getElementById('pt-card-section');
  const ptCharacter = document.getElementById('pt-character');
  const ptReading = document.getElementById('pt-reading');
  const ptChooseSection = document.getElementById('pt-choose-section');
  const ptChoiceOptionsContainer = document.getElementById('pt-choice-options');
  const ptSpeakBtn = document.getElementById('pt-speak-btn');
  const ptRevealBtn = document.getElementById('pt-reveal-btn');
  const ptKnewBtn = document.getElementById('pt-knew-btn');
  const ptUnsureBtn = document.getElementById('pt-unsure-btn');
  const ptNextBtn = document.getElementById('pt-next-btn');
  const ptExitBtn = document.getElementById('pt-exit-btn');
  const ptSummaryScreen = document.getElementById('pt-summary-screen');
  const ptSummaryTitle = document.getElementById('pt-summary-title');
  const ptSummaryContent = document.getElementById('pt-summary-content');
  const ptRetryBtn = document.getElementById('pt-retry-btn');
  const ptNextLessonBtn = document.getElementById('pt-next-lesson-btn');
  const ptPTHomeBtn = document.getElementById('pt-pt-home-btn');

  const weakReviewBtn = document.getElementById('weak-review-btn');
  const progressScreen = document.getElementById('progress-screen');
  const progressContent = document.getElementById('progress-content');
  const viewProgressBtn = document.getElementById('view-progress-btn');
  const resetProgressBtn = document.getElementById('reset-progress-btn');
  const resetWeakItemsBtn = document.getElementById('reset-weak-items-btn');
  const backFromProgressBtn = document.getElementById('back-from-progress-btn');

  // Progress tracking
  function saveQuizProgress() {
    const progress = loadProgress();
    const correct = quizState.score;
    const wrong = quizState.totalQuestions - quizState.score;
    const type = quizState.quizType;

    progress.overall.totalQuizzes++;
    progress.overall.totalQuestions += quizState.totalQuestions;
    progress.overall.correctAnswers += correct;
    progress.overall.wrongAnswers += wrong;

    progress.byType[type].totalQuizzes++;
    progress.byType[type].totalQuestions += quizState.totalQuestions;
    progress.byType[type].correctAnswers += correct;
    progress.byType[type].wrongAnswers += wrong;

    saveProgress(progress);
  }

  function renderAccuracy(correct, total) {
    if (total === 0) return 'N/A';
    return (correct / total * 100).toFixed(1) + '%';
  }

  function showProgressScreen() {
    const p = loadProgress();
    const o = p.overall;
    const w = loadWeakItems();
    const types = [
      { key: 'hiragana', label: 'Hiragana' },
      { key: 'katakana', label: 'Katakana' },
      { key: 'kanji',    label: 'Kanji' },
      { key: 'mixed',    label: 'Hỗn Hợp' }
    ];

    const typeRows = types.map(t => {
      const d = p.byType[t.key];
      return `<tr>
        <td>${t.label}</td>
        <td>${d.totalQuizzes}</td>
        <td>${d.correctAnswers}</td>
        <td>${d.wrongAnswers}</td>
        <td>${renderAccuracy(d.correctAnswers, d.totalQuestions)}</td>
        <td>${w[t.key].length}</td>
      </tr>`;
    }).join('');

    progressContent.innerHTML = `
      <div class="progress-section">
        <h3>Tổng Quan</h3>
        <table class="progress-table">
          <tr><th>Số Quiz</th><th>Câu hỏi</th><th>Đúng</th><th>Sai</th><th>Chính xác</th></tr>
          <tr>
            <td>${o.totalQuizzes}</td>
            <td>${o.totalQuestions}</td>
            <td>${o.correctAnswers}</td>
            <td>${o.wrongAnswers}</td>
            <td>${renderAccuracy(o.correctAnswers, o.totalQuestions)}</td>
          </tr>
        </table>
      </div>
      <div class="progress-section">
        <h3>Theo Loại</h3>
        <table class="progress-table">
          <tr><th>Loại</th><th>Số Quiz</th><th>Đúng</th><th>Sai</th><th>Chính xác</th><th>Điểm yếu</th></tr>
          ${typeRows}
        </table>
      </div>
    `;

    modeSelectionScreen.style.display = 'none';
    progressScreen.style.display = 'flex';
    saveSession({ screen: 'progress-screen' });
  }

  // Mode selection logic
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quizState.mode = btn.getAttribute('data-mode');
      modeSelectionScreen.style.display = 'none';
      quizTypeScreen.style.display = 'flex';
      saveSession({ screen: 'quiztype-screen', mode: quizState.mode });
    });
  });

  weakReviewBtn.addEventListener('click', () => {
    quizState.mode = 'weak-review';
    modeSelectionScreen.style.display = 'none';
    quizTypeScreen.style.display = 'flex';
    saveSession({ screen: 'quiztype-screen', mode: 'weak-review' });
  });

  backFromQuiztypeBtn.addEventListener('click', () => {
    quizTypeScreen.style.display = 'none';
    quizState.mode = null;
    modeSelectionScreen.style.display = 'flex';
    clearSession();
  });

  backFromDifficultyBtn.addEventListener('click', () => {
    difficultyScreen.style.display = 'none';
    if (quizState.quizType === 'mixed') {
      mixTypeCheckboxes.forEach(cb => { cb.checked = quizState.mixedTypes.includes(cb.value); });
      startMixedBtn.disabled = quizState.mixedTypes.length < 2;
      mixTypeScreen.style.display = 'flex';
      saveSession({ screen: 'mix-type-screen', mode: quizState.mode, mixedTypes: quizState.mixedTypes });
    } else {
      quizState.quizType = null;
      quizState.questionSet = null;
      quizTypeScreen.style.display = 'flex';
      saveSession({ screen: 'quiztype-screen', mode: quizState.mode });
    }
  });

  // Quiz type selection logic
  quizTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-quiztype');
      quizState.quizType = type;
      quizState.questionSet = QUIZ_TYPE_CONFIG[type].data;
      if (quizState.mode === 'weak-review') {
        const weakItems = loadWeakItems();
        if (weakItems[type].length === 0) {
          alert('Không có mục yếu cho ' + QUIZ_TYPE_CONFIG[type].label + '. Hãy tiếp tục luyện tập!');
          return;
        }
        quizTypeScreen.style.display = 'none';
        startWeakReview();
      } else if (quizState.mode === 'flashcard') {
        quizTypeScreen.style.display = 'none';
        renderGroupButtons();
        groupFilterScreen.style.display = 'flex';
        saveSession({ screen: 'group-filter-screen', mode: quizState.mode, quizType: type });
      } else {
        quizTypeScreen.style.display = 'none';
        difficultyScreen.style.display = 'flex';
        saveSession({ screen: 'difficulty-screen', mode: quizState.mode, quizType: type });
      }
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
      difficultyScreen.style.display = 'none';
      if (quizState.quizType === 'mixed') {
        quizState.selectedGroup = 'all';
        settingsScreen.style.display = 'flex';
        saveSession({ screen: 'settings-screen', mode: quizState.mode, quizType: 'mixed', mixedTypes: quizState.mixedTypes, difficulty: diff, totalQuestions: quizState.totalQuestions, selectedGroup: 'all', autoAdvance: quizState.autoAdvance, feedbackDelay: quizState.feedbackDelay, reviewEnabled: quizState.reviewEnabled });
      } else {
        renderGroupButtons();
        groupFilterScreen.style.display = 'flex';
        saveSession({ screen: 'group-filter-screen', mode: quizState.mode, quizType: quizState.quizType, difficulty: diff, totalQuestions: quizState.totalQuestions });
      }
    });
  });

  // Group filter screen logic
  function renderGroupButtons() {
    const groups = GROUP_CONFIG[quizState.quizType];
    groupButtonsContainer.innerHTML = '';
    quizState.selectedGroup = Object.keys(groups)[0];
    Object.entries(groups).forEach(([id, group], index) => {
      const btn = document.createElement('button');
      btn.className = 'group-btn' + (index === 0 ? ' active' : '');
      btn.setAttribute('data-group', id);
      btn.textContent = group.label;
      btn.addEventListener('click', () => {
        quizState.selectedGroup = id;
        groupButtonsContainer.querySelectorAll('.group-btn')
          .forEach(b => b.classList.toggle('active', b === btn));
      });
      groupButtonsContainer.appendChild(btn);
    });
  }

  function applySettingsButtons() {
    settingBtns.forEach(btn => {
      const setting = btn.getAttribute('data-setting');
      const rawValue = btn.getAttribute('data-value');
      let value;
      if (rawValue === 'true') value = true;
      else if (rawValue === 'false') value = false;
      else value = Number(rawValue);
      btn.classList.toggle('active', quizState[setting] === value);
    });
  }

  function restoreSession() {
    try {
      const session = loadSession();
      if (!session || !session.screen) {
        modeSelectionScreen.style.display = 'flex';
        return;
      }
      switch (session.screen) {
        case 'quiztype-screen':
          quizState.mode = session.mode;
          quizTypeScreen.style.display = 'flex';
          break;
        case 'mix-type-screen':
          quizState.mode = session.mode;
          quizState.quizType = 'mixed';
          quizState.mixedTypes = session.mixedTypes || [];
          mixTypeCheckboxes.forEach(cb => { cb.checked = quizState.mixedTypes.includes(cb.value); });
          startMixedBtn.disabled = quizState.mixedTypes.length < 2;
          mixTypeScreen.style.display = 'flex';
          break;
        case 'difficulty-screen':
          quizState.mode = session.mode;
          quizState.quizType = session.quizType;
          if (session.quizType === 'mixed') {
            quizState.mixedTypes = session.mixedTypes || [];
            quizState.questionSet = quizState.mixedTypes.flatMap(t => QUIZ_TYPE_CONFIG[t].data);
          } else {
            quizState.questionSet = QUIZ_TYPE_CONFIG[session.quizType].data;
          }
          difficultyScreen.style.display = 'flex';
          break;
        case 'group-filter-screen':
          quizState.mode = session.mode;
          quizState.quizType = session.quizType;
          quizState.questionSet = QUIZ_TYPE_CONFIG[session.quizType].data;
          if (session.difficulty) {
            quizState.difficulty = session.difficulty;
            quizState.totalQuestions = session.totalQuestions;
          }
          renderGroupButtons();
          groupFilterScreen.style.display = 'flex';
          break;
        case 'settings-screen':
          quizState.mode = session.mode;
          quizState.quizType = session.quizType;
          if (session.quizType === 'mixed') {
            quizState.mixedTypes = session.mixedTypes || [];
            quizState.questionSet = quizState.mixedTypes.flatMap(t => QUIZ_TYPE_CONFIG[t].data);
          } else {
            quizState.questionSet = QUIZ_TYPE_CONFIG[session.quizType].data;
          }
          quizState.difficulty = session.difficulty;
          quizState.totalQuestions = session.totalQuestions;
          quizState.selectedGroup = session.selectedGroup;
          quizState.autoAdvance = session.autoAdvance;
          quizState.feedbackDelay = session.feedbackDelay;
          quizState.reviewEnabled = session.reviewEnabled;
          if (session.quizType !== 'mixed') renderGroupButtons();
          applySettingsButtons();
          settingsScreen.style.display = 'flex';
          break;
        case 'progress-screen':
          showProgressScreen();
          break;
        default:
          modeSelectionScreen.style.display = 'flex';
      }
    } catch (e) {
      modeSelectionScreen.style.display = 'flex';
    }
  }

  backToDifficultyBtn.addEventListener('click', () => {
    groupFilterScreen.style.display = 'none';
    if (quizState.mode === 'flashcard' || quizState.mode === 'weak-review') {
      quizTypeScreen.style.display = 'flex';
      saveSession({ screen: 'quiztype-screen', mode: quizState.mode });
    } else {
      difficultyScreen.style.display = 'flex';
      saveSession({ screen: 'difficulty-screen', mode: quizState.mode, quizType: quizState.quizType });
    }
  });

  backToGroupBtn.addEventListener('click', () => {
    settingsScreen.style.display = 'none';
    if (quizState.quizType === 'mixed') {
      difficultyScreen.style.display = 'flex';
      saveSession({ screen: 'difficulty-screen', mode: quizState.mode, quizType: 'mixed', mixedTypes: quizState.mixedTypes });
    } else {
      groupFilterScreen.style.display = 'flex';
      saveSession({ screen: 'group-filter-screen', mode: quizState.mode, quizType: quizState.quizType, difficulty: quizState.difficulty, totalQuestions: quizState.totalQuestions });
    }
  });

  confirmGroupBtn.addEventListener('click', () => {
    groupFilterScreen.style.display = 'none';
    if (quizState.mode === 'flashcard') {
      startFlashcard();
    } else {
      settingsScreen.style.display = 'flex';
      saveSession({ screen: 'settings-screen', mode: quizState.mode, quizType: quizState.quizType, difficulty: quizState.difficulty, totalQuestions: quizState.totalQuestions, selectedGroup: quizState.selectedGroup, autoAdvance: quizState.autoAdvance, feedbackDelay: quizState.feedbackDelay, reviewEnabled: quizState.reviewEnabled });
    }
  });

  // Settings screen logic
  settingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const setting = btn.getAttribute('data-setting');
      const rawValue = btn.getAttribute('data-value');
      let value;
      if (rawValue === 'true') value = true;
      else if (rawValue === 'false') value = false;
      else value = Number(rawValue);
      quizState[setting] = value;
      document.querySelectorAll(`.setting-btn[data-setting="${setting}"]`).forEach(b => {
        b.classList.toggle('active', b === btn);
      });
    });
  });

  startQuizBtn.addEventListener('click', () => {
    if (quizState.quizType !== 'mixed') {
      const group = GROUP_CONFIG[quizState.quizType][quizState.selectedGroup];
      const fullData = QUIZ_TYPE_CONFIG[quizState.quizType].data;
      quizState.questionSet = group.filter === null
        ? fullData
        : fullData.filter(item => group.filter.includes(item.romaji));
    }
    // Slice 3: shuffle copy for sequential dedup — không mutate original data
    quizState.questionSet = shuffle(quizState.questionSet.slice());
    quizState.score = 0;
    quizState.questionCount = 0;
    quizState.isAnswered = false;
    quizState.quizComplete = false;
    quizState.incorrectAnswers = [];
    quizState.reviewIndex = 0;
    quizState.questionHistory = [];
    settingsScreen.style.display = 'none';
    mainQuiz.style.display = 'flex';
    saveSession({ screen: 'mode-selection-screen' });
    reviewBtn.style.display = 'none';
    reviewAllBtn.style.display = 'none';
    reviewArea.style.display = 'none';
    renderQuestion();
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
    // Slice 1: reset display state bị ẩn từ review hoặc showResult
    optionsArea.style.display = '';
    skipBtn.style.display = '';
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
    quizState.questionHistory.push({
      kana: quizState.currentQuestion.kana,
      correctRomaji: quizState.currentQuestion.correctRomaji,
      userAnswer: option,
      isCorrect: correct
    });
    disableOptions();
    if (correct) {
      btn.style.background = '#bbf7d0';
      if (quizState.quizType !== 'mixed') {
        removeFromWeakItem(quizState.quizType, quizState.currentQuestion.kana);
      }
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
      if (quizState.quizType !== 'mixed') {
        addToWeakItem(quizState.quizType, quizState.currentQuestion.kana);
      }
    }
    renderScore();
    if (quizState.autoAdvance) {
      setTimeout(() => {
        if (quizState.questionSet !== null) advanceToNextQuestion();
      }, quizState.feedbackDelay);
    } else {
      setTimeout(() => {
        if (quizState.questionSet !== null) nextBtn.style.display = 'inline-block';
      }, quizState.feedbackDelay);
    }
  }

  function disableOptions() {
    Array.from(optionsArea.children).forEach(btn => btn.disabled = true);
  }

  function renderScore() {
    scoreSpan.textContent = `Điểm: ${quizState.score}`;
  }

  function showResult() {
    quizState.quizComplete = true;
    saveQuizProgress();
    optionsArea.innerHTML = '';
    hiraganaChar.textContent = `Hoàn Thành Quiz!`;
    scoreSpan.textContent = `Điểm Cuối: ${quizState.score} / ${quizState.totalQuestions}`;
    nextBtn.style.display = 'none';
    skipBtn.style.display = 'none';
    reviewArea.style.display = 'none';
    if (quizState.reviewEnabled && quizState.incorrectAnswers.length > 0) {
      reviewBtn.style.display = 'inline-block';
    }
    reviewAllBtn.style.display = 'inline-block';
  }

  function showReview() {
    quizState.reviewIndex = 0;
    renderReviewQuestion();
  }

  function showReviewAll() {
    quizState.reviewIndex = 0;
    renderReviewAllQuestion();
  }

  function renderReviewAllQuestion() {
    if (quizState.questionHistory.length === 0) return;
    const item = quizState.questionHistory[quizState.reviewIndex];
    const statusLabel = item.isCorrect ? 'Đúng' : 'Sai';
    const statusColor = item.isCorrect ? '#bbf7d0' : '#fecaca';
    reviewArea.innerHTML = `
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <h3>${quizState.reviewIndex + 1} / ${quizState.questionHistory.length}</h3>
        <p><strong>Ký tự:</strong> ${item.kana}</p>
        <p><strong>Câu trả lời:</strong> ${item.userAnswer || 'Đã bỏ qua'}</p>
        <p><strong>Đáp án đúng:</strong> ${item.correctRomaji}</p>
        <p><strong>Kết quả:</strong> <span style="background:${statusColor};padding:2px 8px;border-radius:4px;">${statusLabel}</span></p>
        <div style="margin-top: 15px;">
          ${quizState.reviewIndex > 0 ? '<button id="review-prev-btn">Trước</button>' : ''}
          ${quizState.reviewIndex < quizState.questionHistory.length - 1 ? '<button id="review-next-btn">Tiếp</button>' : ''}
        </div>
      </div>
    `;
    reviewArea.style.display = 'block';
    optionsArea.style.display = 'none';

    const prevBtn = document.getElementById('review-prev-btn');
    const nextReviewBtn = document.getElementById('review-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      quizState.reviewIndex--;
      renderReviewAllQuestion();
    });
    if (nextReviewBtn) nextReviewBtn.addEventListener('click', () => {
      quizState.reviewIndex++;
      renderReviewAllQuestion();
    });
  }

  function renderReviewQuestion() {
    if (quizState.incorrectAnswers.length === 0) return;
    const item = quizState.incorrectAnswers[quizState.reviewIndex];
    reviewArea.innerHTML = `
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <h3>${quizState.reviewIndex + 1} / ${quizState.incorrectAnswers.length}</h3>
        <p><strong>Ký tự:</strong> ${item.kana}</p>
        <p><strong>Câu trả lời:</strong> ${item.userAnswer || 'Đã bỏ qua'}</p>
        <p><strong>Đáp án đúng:</strong> ${item.correctRomaji}</p>
        <div style="margin-top: 15px;">
          ${quizState.reviewIndex > 0 ? '<button id="review-prev-btn">Trước</button>' : ''}
          ${quizState.reviewIndex < quizState.incorrectAnswers.length - 1 ? '<button id="review-next-btn">Tiếp</button>' : ''}
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

  // Weak Review logic
  function startWeakReview() {
    const type = quizState.quizType;
    const weakItems = loadWeakItems();
    const fullData = QUIZ_TYPE_CONFIG[type].data;
    const weakSet = new Set(weakItems[type]);
    quizState.questionSet = shuffle(fullData.filter(item => weakSet.has(item.kana)));
    quizState.totalQuestions = quizState.questionSet.length;
    quizState.score = 0;
    quizState.questionCount = 0;
    quizState.isAnswered = false;
    quizState.quizComplete = false;
    quizState.incorrectAnswers = [];
    quizState.reviewIndex = 0;
    quizState.questionHistory = [];
    mainQuiz.style.display = 'flex';
    saveSession({ screen: 'mode-selection-screen' });
    reviewBtn.style.display = 'none';
    reviewAllBtn.style.display = 'none';
    reviewArea.style.display = 'none';
    renderQuestion();
  }

  // Flashcard logic
  function startFlashcard() {
    if (quizState.quizType === 'mixed') {
      quizState.questionSet = shuffle(quizState.questionSet.slice());
    } else {
      const group = GROUP_CONFIG[quizState.quizType][quizState.selectedGroup];
      const fullData = QUIZ_TYPE_CONFIG[quizState.quizType].data;
      const filtered = group.filter === null
        ? fullData.slice()
        : fullData.filter(item => group.filter.includes(item.romaji));
      quizState.questionSet = shuffle(filtered);
    }
    quizState.fcIndex = 0;
    quizState.fcKnew = 0;
    quizState.fcNeedReview = 0;
    quizState.fcAnswerShown = false;
    flashcardScreen.style.display = 'flex';
    saveSession({ screen: 'mode-selection-screen' });
    renderFlashcard();
  }

  function renderFlashcard() {
    const card = quizState.questionSet[quizState.fcIndex];
    fcProgress.textContent = `${quizState.fcIndex + 1} / ${quizState.questionSet.length}`;
    fcCharacter.textContent = card.kana;
    fcAnswer.textContent = card.romaji;
    fcAnswer.style.display = 'none';
    fcShowBtn.style.display = 'inline-block';
    fcKnewBtn.style.display = 'none';
    fcReviewBtn.style.display = 'none';
    quizState.fcAnswerShown = false;
  }

  function showFlashcardAnswer() {
    fcAnswer.style.display = 'block';
    fcShowBtn.style.display = 'none';
    fcKnewBtn.style.display = 'inline-block';
    fcReviewBtn.style.display = 'inline-block';
    quizState.fcAnswerShown = true;
  }

  function handleFlashcardResult(knew) {
    if (knew) {
      quizState.fcKnew++;
    } else {
      quizState.fcNeedReview++;
    }
    quizState.fcIndex++;
    if (quizState.fcIndex < quizState.questionSet.length) {
      renderFlashcard();
    } else {
      showFlashcardSummary();
    }
  }

  function showFlashcardSummary() {
    fcCharacter.textContent = 'Hoàn Thành Phiên!';
    fcAnswer.style.display = 'none';
    fcShowBtn.style.display = 'none';
    fcKnewBtn.style.display = 'none';
    fcReviewBtn.style.display = 'none';
    fcProgress.innerHTML = `
      <p>Tổng: ${quizState.questionSet.length}</p>
      <p style="color:#16a34a;">Đã biết: ${quizState.fcKnew}</p>
      <p style="color:#dc2626;">Cần ôn: ${quizState.fcNeedReview}</p>
    `;
  }

  fcShowBtn.addEventListener('click', () => {
    showFlashcardAnswer();
  });

  fcKnewBtn.addEventListener('click', () => {
    handleFlashcardResult(true);
  });

  fcReviewBtn.addEventListener('click', () => {
    handleFlashcardResult(false);
  });

  fcRestartBtn.addEventListener('click', () => {
    flashcardScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
    clearSession();
    quizState.mode = null;
    quizState.quizType = null;
    quizState.questionSet = null;
    quizState.selectedGroup = 'all';
    quizState.fcIndex = 0;
    quizState.fcKnew = 0;
    quizState.fcNeedReview = 0;
    quizState.fcAnswerShown = false;
  });

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
    quizState.questionHistory.push({
      kana: quizState.currentQuestion.kana,
      correctRomaji: quizState.currentQuestion.correctRomaji,
      userAnswer: null,
      isCorrect: false
    });
    if (quizState.quizType !== 'mixed') {
      addToWeakItem(quizState.quizType, quizState.currentQuestion.kana);
    }
    disableOptions();
    setTimeout(() => {
      if (quizState.questionSet !== null) advanceToNextQuestion();
    }, quizState.feedbackDelay);
  });

  reviewBtn.addEventListener('click', () => {
    showReview();
  });

  reviewAllBtn.addEventListener('click', () => {
    showReviewAll();
  });

  restartBtn.addEventListener('click', () => {
    mainQuiz.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
    clearSession();
    quizState.mode = null;
    quizState.quizType = null;
    quizState.questionSet = null;
    quizState.mixedTypes = [];
    quizState.difficulty = null;
    quizState.totalQuestions = 10;
    quizState.score = 0;
    quizState.questionCount = 0;
    quizState.isAnswered = false;
    quizState.quizComplete = false;
    quizState.incorrectAnswers = [];
    quizState.reviewIndex = 0;
    quizState.autoAdvance = true;
    quizState.feedbackDelay = 800;
    quizState.reviewEnabled = true;
    quizState.selectedGroup = 'all';
    quizState.questionHistory = [];
    reviewBtn.style.display = 'none';
    reviewAllBtn.style.display = 'none';
    reviewArea.style.display = 'none';
    settingsScreen.style.display = 'none';
    groupFilterScreen.style.display = 'none';
  });

  viewProgressBtn.addEventListener('click', () => {
    showProgressScreen();
  });

  backFromProgressBtn.addEventListener('click', () => {
    progressScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
    clearSession();
  });

  resetWeakItemsBtn.addEventListener('click', () => {
    if (window.confirm('Xóa toàn bộ mục yếu? Không thể hoàn tác.')) {
      resetWeakItems();
      showProgressScreen();
    }
  });

  resetProgressBtn.addEventListener('click', () => {
    if (window.confirm('Xóa toàn bộ tiến trình? Không thể hoàn tác.')) {
      resetProgress();
      showProgressScreen();
    }
  });

  // Mixed quiz type handlers
  mixedBtn.addEventListener('click', () => {
    if (quizState.mode === 'weak-review') {
      alert('Hỗn Hợp không hỗ trợ Ôn Tập Từ Yếu.');
      return;
    }
    quizState.quizType = 'mixed';
    quizState.mixedTypes = [];
    mixTypeCheckboxes.forEach(cb => { cb.checked = false; });
    startMixedBtn.disabled = true;
    quizTypeScreen.style.display = 'none';
    mixTypeScreen.style.display = 'flex';
    saveSession({ screen: 'mix-type-screen', mode: quizState.mode, mixedTypes: [] });
  });

  mixTypeCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = [...mixTypeCheckboxes].filter(c => c.checked).map(c => c.value);
      quizState.mixedTypes = selected;
      startMixedBtn.disabled = selected.length < 2;
      saveSession({ screen: 'mix-type-screen', mode: quizState.mode, mixedTypes: selected });
    });
  });

  startMixedBtn.addEventListener('click', () => {
    const combined = quizState.mixedTypes.flatMap(type => QUIZ_TYPE_CONFIG[type].data);
    quizState.questionSet = combined;
    quizState.selectedGroup = 'all';
    mixTypeScreen.style.display = 'none';
    if (quizState.mode === 'flashcard') {
      startFlashcard();
    } else {
      difficultyScreen.style.display = 'flex';
      saveSession({ screen: 'difficulty-screen', mode: quizState.mode, quizType: 'mixed', mixedTypes: quizState.mixedTypes });
    }
  });

  backFromMixTypeBtn.addEventListener('click', () => {
    mixTypeScreen.style.display = 'none';
    quizState.quizType = null;
    quizState.mixedTypes = [];
    quizTypeScreen.style.display = 'flex';
    saveSession({ screen: 'quiztype-screen', mode: quizState.mode });
  });

  // ========================
  // Pronunciation Trainer (PT)
  // ========================

  const PT_LESSON_KEYS = ['basic_vowels', 'k_group', 's_group'];
  const PT_LESSON_LABELS = { basic_vowels: 'Nguyên âm', k_group: 'Nhóm K', s_group: 'Nhóm S' };

  function renderPTLessons() {
    const type = quizState.quizType;
    const groups = GROUP_CONFIG[type];
    const data = QUIZ_TYPE_CONFIG[type].data;
    ptLessonTitle.textContent = QUIZ_TYPE_CONFIG[type].label + ' — Chọn Bài';
    ptLessonButtonsContainer.innerHTML = '';
    PT_LESSON_KEYS.forEach((key, idx) => {
      const group = groups[key];
      if (!group) return;
      const count = group.filter
        ? data.filter(item => group.filter.includes(item.romaji)).length
        : data.length;
      const btn = document.createElement('button');
      btn.className = 'pt-lesson-btn';
      btn.textContent = `Bài ${idx + 1} — ${PT_LESSON_LABELS[key]} (${count} ký tự)`;
      btn.addEventListener('click', () => startPTLearn(key));
      ptLessonButtonsContainer.appendChild(btn);
    });
  }

  function startPTLearn(lessonKey) {
    const type = quizState.quizType;
    const group = GROUP_CONFIG[type][lessonKey];
    const fullData = QUIZ_TYPE_CONFIG[type].data;
    const items = group.filter
      ? fullData.filter(item => group.filter.includes(item.romaji))
      : fullData.slice();

    quizState.ptLessonKey = lessonKey;
    quizState.ptPhase = 'learn';
    quizState.ptLearnItems = items.slice();
    quizState.ptItems = items.slice(); // sequential for learn
    quizState.ptIndex = 0;
    quizState.ptUnsureItems = [];
    quizState.ptWrongItems = [];
    quizState.ptChooseTotal = 0;
    quizState.ptAnswerShown = false;

    ptLessonScreen.style.display = 'none';
    ptScreen.style.display = 'flex';
    renderPTItem();
  }

  function renderPTItem() {
    const item = quizState.ptItems[quizState.ptIndex];
    ptProgressEl.textContent = `${quizState.ptIndex + 1} / ${quizState.ptItems.length}`;
    quizState.ptAnswerShown = false;

    // reset all action buttons
    ptSpeakBtn.style.display = 'none';
    ptRevealBtn.style.display = 'none';
    ptKnewBtn.style.display = 'none';
    ptUnsureBtn.style.display = 'none';
    ptNextBtn.style.display = 'none';

    if (quizState.ptPhase === 'learn') {
      ptPhaseLabel.textContent = '📖 Học';
      ptCardSection.style.display = 'flex';
      ptChooseSection.style.display = 'none';
      ptCharacter.textContent = item.kana;
      ptReading.textContent = item.romaji;
      ptReading.style.display = 'none';
      if (window.speechSynthesis) ptSpeakBtn.style.display = 'inline-block';
      ptRevealBtn.textContent = 'Xem cách đọc';
      ptRevealBtn.style.display = 'inline-block';
      ptNextBtn.style.display = 'inline-block';
      setTimeout(() => speakJapanese(item.kana), 300);

    } else if (quizState.ptPhase === 'practice') {
      ptPhaseLabel.textContent = '✏️ Luyện — Nhìn & Đọc';
      ptCardSection.style.display = 'flex';
      ptChooseSection.style.display = 'none';
      ptCharacter.textContent = item.kana;
      ptReading.textContent = item.romaji;
      ptReading.style.display = 'none';
      ptRevealBtn.textContent = 'Nghe & Xem đáp án';
      ptRevealBtn.style.display = 'inline-block';

    } else if (quizState.ptPhase === 'choose') {
      ptPhaseLabel.textContent = '🎧 Luyện — Nghe & Chọn';
      ptCardSection.style.display = 'none';
      ptChooseSection.style.display = 'flex';
      renderChooseOptions(item);
      setTimeout(() => speakJapanese(item.kana), 300);
    }
  }

  function renderChooseOptions(item) {
    const pool = QUIZ_TYPE_CONFIG[quizState.quizType].data;
    const options = [item.kana];
    let attempts = 0;
    while (options.length < 4 && attempts < pool.length * 4) {
      const rand = pool[getRandomInt(pool.length)].kana;
      if (!options.includes(rand)) options.push(rand);
      attempts++;
    }
    shuffle(options);

    ptChoiceOptionsContainer.innerHTML = '';
    options.forEach(kana => {
      const btn = document.createElement('button');
      btn.className = 'pt-choice-btn';
      btn.textContent = kana;
      btn.addEventListener('click', () => handleChooseAnswer(kana, btn, item));
      ptChoiceOptionsContainer.appendChild(btn);
    });
  }

  function handleChooseAnswer(selected, btn, item) {
    ptChoiceOptionsContainer.querySelectorAll('.pt-choice-btn').forEach(b => { b.disabled = true; });
    const correct = selected === item.kana;
    if (correct) {
      btn.classList.add('correct');
    } else {
      btn.classList.add('wrong');
      ptChoiceOptionsContainer.querySelectorAll('.pt-choice-btn').forEach(b => {
        if (b.textContent === item.kana) b.classList.add('correct');
      });
      if (!quizState.ptWrongItems.find(i => i.kana === item.kana)) {
        quizState.ptWrongItems.push(item);
      }
    }
    speakJapanese(item.kana);
    setTimeout(advancePT, 900);
  }

  function advancePT() {
    quizState.ptIndex++;
    if (quizState.ptIndex < quizState.ptItems.length) {
      renderPTItem();
      return;
    }
    // Phase exhausted — decide next step
    if (quizState.ptPhase === 'learn') {
      quizState.ptPhase = 'practice';
      quizState.ptItems = shuffle(quizState.ptLearnItems.slice());
      quizState.ptIndex = 0;
      renderPTItem();
    } else if (quizState.ptPhase === 'practice') {
      if (quizState.ptUnsureItems.length > 0) {
        quizState.ptPhase = 'choose';
        quizState.ptChooseTotal = quizState.ptUnsureItems.length;
        quizState.ptItems = shuffle(quizState.ptUnsureItems.slice());
        quizState.ptIndex = 0;
        renderPTItem();
      } else {
        showPTSummary();
      }
    } else if (quizState.ptPhase === 'choose') {
      showPTSummary();
    }
  }

  function showPTSummary() {
    ptScreen.style.display = 'none';
    const unsureCount = quizState.ptUnsureItems.length;
    const wrongCount = quizState.ptWrongItems.length;

    if (wrongCount === 0 && unsureCount === 0) {
      ptSummaryTitle.textContent = 'Hoàn thành!';
      ptSummaryContent.innerHTML = '<p class="pt-summary-perfect">Xuất sắc! Bạn đã nhớ hết ký tự. 🎉</p>';
    } else if (wrongCount === 0) {
      ptSummaryTitle.textContent = 'Hoàn thành!';
      ptSummaryContent.innerHTML = `<p class="pt-summary-perfect">Tốt lắm! Đã ôn xong ${quizState.ptChooseTotal} ký tự cần luyện. 👍</p>`;
    } else {
      ptSummaryTitle.textContent = 'Kết Quả';
      ptSummaryContent.innerHTML = `<p>Còn <span class="pt-count-wrong">${wrongCount}</span> ký tự cần ôn thêm.</p>`;
    }

    ptRetryBtn.style.display = wrongCount > 0 ? 'inline-block' : 'none';
    ptSummaryScreen.style.display = 'flex';
  }

  // PT event listeners
  ptBtn.addEventListener('click', () => {
    modeSelectionScreen.style.display = 'none';
    ptTypeScreen.style.display = 'flex';
    clearSession();
  });

  backFromPTTypeBtn.addEventListener('click', () => {
    ptTypeScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });

  ptTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quizState.quizType = btn.getAttribute('data-type');
      ptTypeScreen.style.display = 'none';
      renderPTLessons();
      ptLessonScreen.style.display = 'flex';
    });
  });

  backFromPTLessonBtn.addEventListener('click', () => {
    ptLessonScreen.style.display = 'none';
    ptTypeScreen.style.display = 'flex';
  });

  ptSpeakBtn.addEventListener('click', () => {
    speakJapanese(quizState.ptItems[quizState.ptIndex].kana);
  });

  ptRevealBtn.addEventListener('click', () => {
    const item = quizState.ptItems[quizState.ptIndex];
    ptReading.style.display = 'block';
    quizState.ptAnswerShown = true;
    speakJapanese(item.kana);
    if (quizState.ptPhase === 'practice') {
      ptRevealBtn.style.display = 'none';
      ptKnewBtn.style.display = 'inline-block';
      ptUnsureBtn.style.display = 'inline-block';
    }
    // for 'learn', ptNextBtn already visible
  });

  ptKnewBtn.addEventListener('click', advancePT);

  ptUnsureBtn.addEventListener('click', () => {
    const item = quizState.ptItems[quizState.ptIndex];
    if (!quizState.ptUnsureItems.find(i => i.kana === item.kana)) {
      quizState.ptUnsureItems.push(item);
    }
    advancePT();
  });

  ptNextBtn.addEventListener('click', advancePT);

  ptExitBtn.addEventListener('click', () => {
    ptScreen.style.display = 'none';
    quizState.ptPhase = null;
    quizState.ptItems = [];
    quizState.ptIndex = 0;
    quizState.ptUnsureItems = [];
    quizState.ptWrongItems = [];
    renderPTLessons();
    ptLessonScreen.style.display = 'flex';
  });

  ptRetryBtn.addEventListener('click', () => {
    ptSummaryScreen.style.display = 'none';
    quizState.ptPhase = 'choose';
    quizState.ptChooseTotal = quizState.ptWrongItems.length;
    quizState.ptItems = shuffle(quizState.ptWrongItems.slice());
    quizState.ptWrongItems = [];
    quizState.ptIndex = 0;
    ptScreen.style.display = 'flex';
    renderPTItem();
  });

  ptNextLessonBtn.addEventListener('click', () => {
    ptSummaryScreen.style.display = 'none';
    renderPTLessons();
    ptLessonScreen.style.display = 'flex';
  });

  ptPTHomeBtn.addEventListener('click', () => {
    ptSummaryScreen.style.display = 'none';
    quizState.quizType = null;
    modeSelectionScreen.style.display = 'flex';
    clearSession();
  });

  // Hide all screens, then restore session or show home
  progressScreen.style.display = 'none';
  quizTypeScreen.style.display = 'none';
  mixTypeScreen.style.display = 'none';
  difficultyScreen.style.display = 'none';
  groupFilterScreen.style.display = 'none';
  settingsScreen.style.display = 'none';
  mainQuiz.style.display = 'none';
  flashcardScreen.style.display = 'none';
  ptTypeScreen.style.display = 'none';
  ptLessonScreen.style.display = 'none';
  ptScreen.style.display = 'none';
  ptSummaryScreen.style.display = 'none';
  modeSelectionScreen.style.display = 'none';
  reviewBtn.style.display = 'none';
  reviewAllBtn.style.display = 'none';
  reviewArea.style.display = 'none';
  restoreSession();
});
