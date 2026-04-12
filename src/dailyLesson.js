// src/dailyLesson.js
// Daily Lesson V1 — Overview → Learn vocab → Learn kanji → Quick practice → Summary

const dlState = {
  dayId: null,
  phase: null, // 'overview' | 'learn-vocab' | 'learn-kanji' | 'practice' | 'summary'
  vocabItems: [],
  kanjiItems: [],
  practiceItems: [],
  currentItems: [],
  currentIndex: 0,
  practiceResults: [],
  answerSelected: false
};

document.addEventListener('DOMContentLoaded', function() {
  var modeSelectionScreen = document.getElementById('mode-selection-screen');
  var dailyBtn = document.getElementById('daily-btn');
  var dailyOverviewScreen = document.getElementById('daily-overview-screen');
  var dailyOverviewList = document.getElementById('daily-overview-list');
  var backFromDailyOverviewBtn = document.getElementById('back-from-daily-overview-btn');
  var dailyLearnScreen = document.getElementById('daily-learn-screen');
  var dailyPhaseLabel = document.getElementById('daily-phase-label');
  var dailyProgress = document.getElementById('daily-progress');
  var dailyDayTitle = document.getElementById('daily-day-title');
  var dailyCardMain = document.getElementById('daily-card-main');
  var dailySpeakBtn = document.getElementById('daily-speak-btn');
  var dailyCardReading = document.getElementById('daily-card-reading');
  var dailyCardMeaning = document.getElementById('daily-card-meaning');
  var dailyCardType = document.getElementById('daily-card-type');
  var dailyNextBtn = document.getElementById('daily-next-btn');
  var dailyExitLearnBtn = document.getElementById('daily-exit-learn-btn');
  var dailyPracticeScreen = document.getElementById('daily-practice-screen');
  var dailyPracticeLabel = document.getElementById('daily-practice-label');
  var dailyPracticeProgress = document.getElementById('daily-practice-progress');
  var dailyPracticeType = document.getElementById('daily-practice-type');
  var dailyPracticePrompt = document.getElementById('daily-practice-prompt');
  var dailyPracticeSpeakBtn = document.getElementById('daily-practice-speak-btn');
  var dailyPracticeSecondary = document.getElementById('daily-practice-secondary');
  var dailyPracticeOptions = document.getElementById('daily-practice-options');
  var dailyExitPracticeBtn = document.getElementById('daily-exit-practice-btn');
  var dailySummaryScreen = document.getElementById('daily-summary-screen');
  var dailySummaryTitle = document.getElementById('daily-summary-title');
  var dailySummaryContent = document.getElementById('daily-summary-content');
  var dailyRetryBtn = document.getElementById('daily-retry-btn');
  var dailyOtherDayBtn = document.getElementById('daily-other-day-btn');
  var dailyHomeBtn = document.getElementById('daily-home-btn');

  function getDay(dayId) {
    for (var i = 0; i < DAILY_LESSONS.length; i++) {
      if (DAILY_LESSONS[i].id === dayId) return DAILY_LESSONS[i];
    }
    return null;
  }

  function getDayStatus(dayId) {
    var progress = loadDailyLessonProgress();
    if (!progress[dayId]) return 'not_started';
    return progress[dayId].status || 'not_started';
  }

  function getStatusMeta(status) {
    if (status === 'completed') {
      return { label: 'Hoàn thành', className: 'completed' };
    }
    if (status === 'in_progress') {
      return { label: 'Đang học', className: 'in-progress' };
    }
    return { label: 'Chưa học', className: 'not-started' };
  }

  function normalizePracticeItems(day) {
    var vocabItems = day.vocab.map(function(item) {
      return {
        id: item.id,
        type: 'vocab',
        prompt: item.jp,
        answer: item.meaning,
        secondary: item.reading
      };
    });

    var kanjiItems = day.kanji.map(function(item) {
      return {
        id: item.id,
        type: 'kanji',
        prompt: item.kanji,
        answer: item.reading,
        secondary: item.meaning
      };
    });

    return dailyShuffle(vocabItems.concat(kanjiItems));
  }

  function dailyShuffle(items) {
    var shuffled = items.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  function renderOverview() {
    var progress = loadDailyLessonProgress();
    dailyOverviewList.innerHTML = '';

    DAILY_LESSONS.forEach(function(day) {
      var record = progress[day.id] || { status: 'not_started' };
      var status = getStatusMeta(record.status);
      var button = document.createElement('button');
      button.className = 'daily-day-btn';
      button.innerHTML =
        '<span class="daily-day-title">' + day.label + '</span>' +
        '<span class="daily-day-meta">Minna Bài ' + day.minnaLesson + ' · 5 vocab · 3 kanji</span>' +
        '<span class="daily-status-badge ' + status.className + '">' + status.label + '</span>';
      button.addEventListener('click', function() {
        startDay(day.id);
      });
      dailyOverviewList.appendChild(button);
    });
  }

  function startDay(dayId) {
    var day = getDay(dayId);
    if (!day) return;

    dlState.dayId = dayId;
    dlState.phase = 'learn-vocab';
    dlState.vocabItems = day.vocab.slice();
    dlState.kanjiItems = day.kanji.slice();
    dlState.practiceItems = normalizePracticeItems(day);
    dlState.currentItems = dlState.vocabItems.slice();
    dlState.currentIndex = 0;
    dlState.practiceResults = [];
    dlState.answerSelected = false;

    saveDailyLessonStatus(dayId, 'in_progress');

    dailyOverviewScreen.style.display = 'none';
    dailySummaryScreen.style.display = 'none';
    dailyPracticeScreen.style.display = 'none';
    dailyLearnScreen.style.display = 'flex';
    renderLearnItem();
  }

  function renderLearnItem() {
    var day = getDay(dlState.dayId);
    var item = dlState.currentItems[dlState.currentIndex];
    if (!day || !item) return;

    dailyDayTitle.textContent = day.label + ' — Minna Bài ' + day.minnaLesson;
    dailyProgress.textContent = (dlState.currentIndex + 1) + ' / ' + dlState.currentItems.length;

    if (dlState.phase === 'learn-vocab') {
      dailyPhaseLabel.textContent = '📖 Học từ vựng';
      dailyCardMain.textContent = item.jp;
      dailyCardReading.textContent = item.reading;
      dailyCardMeaning.textContent = item.meaning;
      dailyCardType.textContent = 'Từ vựng';
    } else {
      dailyPhaseLabel.textContent = '🈶 Học kanji';
      dailyCardMain.textContent = item.kanji;
      dailyCardReading.textContent = item.reading;
      dailyCardMeaning.textContent = item.meaning;
      dailyCardType.textContent = 'Kanji';
    }

    dailySpeakBtn.style.display = 'inline-flex';
  }

  function advanceLearn() {
    dlState.currentIndex++;
    if (dlState.currentIndex < dlState.currentItems.length) {
      renderLearnItem();
      return;
    }

    if (dlState.phase === 'learn-vocab') {
      dlState.phase = 'learn-kanji';
      dlState.currentItems = dlState.kanjiItems.slice();
      dlState.currentIndex = 0;
      renderLearnItem();
      return;
    }

    startPractice();
  }

  function startPractice() {
    dlState.phase = 'practice';
    dlState.currentItems = dlState.practiceItems.slice();
    dlState.currentIndex = 0;
    dlState.practiceResults = [];
    dlState.answerSelected = false;

    dailyLearnScreen.style.display = 'none';
    dailyPracticeScreen.style.display = 'flex';
    renderPracticeItem();
  }

  function renderPracticeItem() {
    var item = dlState.currentItems[dlState.currentIndex];
    if (!item) return;

    dlState.answerSelected = false;
    dailyPracticeOptions.innerHTML = '';
    dailyPracticeLabel.textContent = '⚡ Quick Practice';
    dailyPracticeProgress.textContent = (dlState.currentIndex + 1) + ' / ' + dlState.currentItems.length;
    dailyPracticeType.textContent = item.type === 'vocab' ? 'Từ vựng' : 'Kanji';
    dailyPracticePrompt.textContent = item.prompt;
    dailyPracticeSecondary.textContent = item.secondary;
    dailyPracticeSpeakBtn.style.display = 'inline-flex';

    var options = buildPracticeOptions(item);
    options.forEach(function(option) {
      var button = document.createElement('button');
      button.className = 'daily-practice-option';
      button.textContent = option;
      button.addEventListener('click', function() {
        if (dlState.answerSelected) return;
        dlState.answerSelected = true;
        handlePracticeAnswer(option, item);
      });
      dailyPracticeOptions.appendChild(button);
    });
  }

  function buildPracticeOptions(currentItem) {
    var pool = dlState.currentItems.filter(function(item) {
      return item.type === currentItem.type && item.id !== currentItem.id;
    });
    var wrongOptions = [];
    var attempts = 0;
    var maxAttempts = Math.max(pool.length * 3, 12);

    while (wrongOptions.length < 3 && attempts < maxAttempts && pool.length > 0) {
      var randomItem = pool[Math.floor(Math.random() * pool.length)];
      if (randomItem.answer !== currentItem.answer && wrongOptions.indexOf(randomItem.answer) === -1) {
        wrongOptions.push(randomItem.answer);
      }
      attempts++;
    }

    while (wrongOptions.length < 3) {
      wrongOptions.push('Đáp án phụ ' + (wrongOptions.length + 1));
    }

    return dailyShuffle([currentItem.answer].concat(wrongOptions));
  }

  function handlePracticeAnswer(selected, item) {
    var buttons = dailyPracticeOptions.querySelectorAll('.daily-practice-option');
    var correct = selected === item.answer;

    dlState.practiceResults.push({
      id: item.id,
      type: item.type,
      prompt: item.prompt,
      correctAnswer: item.answer,
      selectedAnswer: selected,
      isCorrect: correct
    });

    buttons.forEach(function(button) {
      button.disabled = true;
      if (button.textContent === selected) {
        button.classList.add(correct ? 'correct' : 'wrong');
      }
      if (!correct && button.textContent === item.answer) {
        button.classList.add('correct');
      }
    });

    setTimeout(advancePractice, 700);
  }

  function advancePractice() {
    dlState.currentIndex++;
    if (dlState.currentIndex < dlState.currentItems.length) {
      renderPracticeItem();
      return;
    }
    showSummary();
  }

  function showSummary() {
    var day = getDay(dlState.dayId);
    var correctCount = dlState.practiceResults.filter(function(result) {
      return result.isCorrect;
    }).length;
    var total = dlState.practiceResults.length;

    saveDailyLessonStatus(dlState.dayId, 'completed');

    dailyPracticeScreen.style.display = 'none';
    dailyLearnScreen.style.display = 'none';
    dailySummaryScreen.style.display = 'flex';
    dailySummaryTitle.textContent = day.label + ' — Hoàn thành';
    dailySummaryContent.innerHTML =
      '<p class="daily-summary-score">Đúng ' + correctCount + ' / ' + total + '</p>' +
      '<p class="daily-summary-status">Trạng thái ngày học: Hoàn thành</p>' +
      '<p class="daily-summary-note">Bạn có thể học lại ngày này bất cứ lúc nào từ danh sách ngày học.</p>';
  }

  function getCurrentSpeakText() {
    var item = dlState.currentItems[dlState.currentIndex];
    if (!item) return null;

    if (dlState.phase === 'learn-vocab' || dlState.phase === 'learn-kanji') {
      return item.reading || item.jp || item.kanji;
    }

    if (dlState.phase === 'practice') {
      return item.answer;
    }

    return null;
  }

  function exitToOverview(fromScreen) {
    if (fromScreen) fromScreen.style.display = 'none';
    renderOverview();
    dailyOverviewScreen.style.display = 'flex';
  }

  dailyBtn.addEventListener('click', function() {
    modeSelectionScreen.style.display = 'none';
    renderOverview();
    dailyOverviewScreen.style.display = 'flex';
  });

  backFromDailyOverviewBtn.addEventListener('click', function() {
    dailyOverviewScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });

  dailyNextBtn.addEventListener('click', advanceLearn);

  dailySpeakBtn.addEventListener('click', function() {
    var text = getCurrentSpeakText();
    if (text) speakJapanese(text);
  });

  dailyPracticeSpeakBtn.addEventListener('click', function() {
    var text = getCurrentSpeakText();
    if (text) speakJapanese(text);
  });

  dailyExitLearnBtn.addEventListener('click', function() {
    exitToOverview(dailyLearnScreen);
  });

  dailyExitPracticeBtn.addEventListener('click', function() {
    exitToOverview(dailyPracticeScreen);
  });

  dailyRetryBtn.addEventListener('click', function() {
    if (!dlState.dayId) return;
    startDay(dlState.dayId);
  });

  dailyOtherDayBtn.addEventListener('click', function() {
    exitToOverview(dailySummaryScreen);
  });

  dailyHomeBtn.addEventListener('click', function() {
    dailySummaryScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });
});
