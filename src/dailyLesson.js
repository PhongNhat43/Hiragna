// src/dailyLesson.js
// Lesson Study flow: Overview -> Learn vocab -> Practice -> Summary

const dlState = {
  lessonId: null,
  sectionId: null,
  currentSection: null,
  phase: null, // 'overview' | 'learn-vocab' | 'practice' | 'summary'
  currentItems: [],
  currentIndex: 0,
  practiceResults: [],
  answerSelected: false
};

document.addEventListener('DOMContentLoaded', () => {
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  const dailyBtn = document.getElementById('daily-btn');
  const dailyOverviewScreen = document.getElementById('daily-overview-screen');
  const dailyOverviewList = document.getElementById('daily-overview-list');
  const backFromDailyOverviewBtn = document.getElementById('back-from-daily-overview-btn');
  const dailyLearnScreen = document.getElementById('daily-learn-screen');
  const dailyPhaseLabel = document.getElementById('daily-phase-label');
  const dailyProgress = document.getElementById('daily-progress');
  const dailyDayTitle = document.getElementById('daily-day-title');
  const dailyCardTopic = document.getElementById('daily-card-topic');
  const dailyCardMain = document.getElementById('daily-card-main');
  const dailySpeakBtn = document.getElementById('daily-speak-btn');
  const dailyCardReading = document.getElementById('daily-card-reading');
  const dailyCardPronunciation = document.getElementById('daily-card-pronunciation');
  const dailyCardMeaning = document.getElementById('daily-card-meaning');
  const dailyCardType = document.getElementById('daily-card-type');
  const dailyCardNote = document.getElementById('daily-card-note');
  const dailyCardExample = document.getElementById('daily-card-example');
  const dailyNextBtn = document.getElementById('daily-next-btn');
  const dailyExitLearnBtn = document.getElementById('daily-exit-learn-btn');
  const dailyPracticeScreen = document.getElementById('daily-practice-screen');
  const dailyPracticeLabel = document.getElementById('daily-practice-label');
  const dailyPracticeProgress = document.getElementById('daily-practice-progress');
  const dailyPracticeType = document.getElementById('daily-practice-type');
  const dailyPracticePrompt = document.getElementById('daily-practice-prompt');
  const dailyPracticeSpeakBtn = document.getElementById('daily-practice-speak-btn');
  const dailyPracticeSecondary = document.getElementById('daily-practice-secondary');
  const dailyPracticeOptions = document.getElementById('daily-practice-options');
  const dailyExitPracticeBtn = document.getElementById('daily-exit-practice-btn');
  const dailySummaryScreen = document.getElementById('daily-summary-screen');
  const dailySummaryTitle = document.getElementById('daily-summary-title');
  const dailySummaryContent = document.getElementById('daily-summary-content');
  const dailyRetryBtn = document.getElementById('daily-retry-btn');
  const dailyOtherDayBtn = document.getElementById('daily-other-day-btn');
  const dailyHomeBtn = document.getElementById('daily-home-btn');

  const lessonList = Object.values(lessonsData);

  function getLesson(lessonId) {
    return lessonList.find((lesson) => lesson.id === lessonId) || null;
  }

  function getSection(sectionId) {
    for (const lesson of lessonList) {
      const section = lesson.sections.find((item) => item.id === sectionId);
      if (section) {
        return { lesson, section };
      }
    }
    return null;
  }

  function getSectionStatus(sectionId) {
    const progress = loadDailyLessonProgress();
    if (!progress[sectionId]) return 'not_started';
    return progress[sectionId].status || 'not_started';
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

  function renderOverview() {
    dailyOverviewList.innerHTML = '';

    lessonList.forEach((lesson) => {
      const lessonCard = document.createElement('section');
      lessonCard.className = 'daily-lesson-group';

      const lessonTitle = document.createElement('h3');
      lessonTitle.className = 'daily-lesson-title';
      lessonTitle.textContent = lesson.title;
      lessonCard.appendChild(lessonTitle);

      const sectionList = document.createElement('div');
      sectionList.className = 'daily-section-list';

      lesson.sections.forEach((section, index) => {
        const status = getStatusMeta(getSectionStatus(section.id));
        const button = document.createElement('button');
        button.className = 'daily-day-btn';
        button.innerHTML =
          '<span class="daily-day-title">' + section.title + '</span>' +
          '<span class="daily-day-topic">' + lesson.title + '</span>' +
          '<span class="daily-day-meta">' + section.vocabularies.length + ' từ vựng · Section ' + (index + 1) + '</span>' +
          '<span class="daily-status-badge ' + status.className + '">' + status.label + '</span>';
        button.addEventListener('click', () => {
          startSection(lesson.id, section.id);
        });
        sectionList.appendChild(button);
      });

      lessonCard.appendChild(sectionList);
      dailyOverviewList.appendChild(lessonCard);
    });
  }

  function startSection(lessonId, sectionId) {
    const resolved = getSection(sectionId);
    if (!resolved) return;

    dlState.lessonId = lessonId;
    dlState.sectionId = sectionId;
    dlState.currentSection = resolved.section;
    dlState.phase = 'learn-vocab';
    dlState.currentItems = resolved.section.vocabularies.slice();
    dlState.currentIndex = 0;
    dlState.practiceResults = [];
    dlState.answerSelected = false;

    saveDailyLessonStatus(sectionId, 'in_progress');

    dailyOverviewScreen.style.display = 'none';
    dailySummaryScreen.style.display = 'none';
    dailyPracticeScreen.style.display = 'none';
    dailyLearnScreen.style.display = 'flex';
    renderLearnItem();
  }

  function resetLearnExtras() {
    dailyCardPronunciation.textContent = '';
    dailyCardPronunciation.style.display = 'none';
    dailyCardExample.style.display = 'none';
  }

  function renderLearnItem() {
    const lesson = getLesson(dlState.lessonId);
    const item = dlState.currentItems[dlState.currentIndex];
    if (!lesson || !dlState.currentSection || !item) return;

    dailyPhaseLabel.textContent = 'Học từ vựng';
    dailyProgress.textContent = (dlState.currentIndex + 1) + ' / ' + dlState.currentItems.length;
    dailyDayTitle.textContent = lesson.title;
    dailyCardTopic.textContent = dlState.currentSection.title;
    dailyCardMain.textContent = item.jp;
    dailyCardReading.textContent = item.reading;
    dailyCardMeaning.textContent = item.meaning;
    dailyCardType.textContent = item.category || 'Từ vựng';
    dailyCardType.className = 'daily-category-badge';
    dailyCardNote.textContent = item.note || '';
    dailyCardNote.style.display = item.note ? 'block' : 'none';
    resetLearnExtras();
    dailySpeakBtn.style.display = 'inline-flex';
  }

  function advanceLearn() {
    dlState.currentIndex += 1;
    if (dlState.currentIndex < dlState.currentItems.length) {
      renderLearnItem();
      return;
    }
    startPractice();
  }

  function dailyShuffle(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const temp = shuffled[index];
      shuffled[index] = shuffled[randomIndex];
      shuffled[randomIndex] = temp;
    }
    return shuffled;
  }

  function normalizePracticeItems(items) {
    return dailyShuffle(items.map((item) => ({
      id: item.id,
      prompt: item.jp,
      answer: item.meaning,
      secondary: item.reading,
      category: item.category || 'Từ vựng',
      audioText: item.jp
    })));
  }

  function startPractice() {
    if (!dlState.currentSection) return;

    dlState.phase = 'practice';
    dlState.currentItems = normalizePracticeItems(dlState.currentSection.vocabularies);
    dlState.currentIndex = 0;
    dlState.practiceResults = [];
    dlState.answerSelected = false;

    dailyLearnScreen.style.display = 'none';
    dailyPracticeScreen.style.display = 'flex';
    renderPracticeItem();
  }

  function renderPracticeItem() {
    const item = dlState.currentItems[dlState.currentIndex];
    if (!item) return;

    dlState.answerSelected = false;
    dailyPracticeOptions.innerHTML = '';
    dailyPracticeLabel.textContent = 'Quick Practice';
    dailyPracticeProgress.textContent = (dlState.currentIndex + 1) + ' / ' + dlState.currentItems.length;
    dailyPracticeType.textContent = item.category || 'Từ vựng';
    dailyPracticeType.className = 'daily-category-badge';
    dailyPracticePrompt.textContent = item.prompt;
    dailyPracticeSecondary.textContent = item.secondary;
    dailyPracticeSpeakBtn.style.display = 'inline-flex';

    buildPracticeOptions(item).forEach((option) => {
      const button = document.createElement('button');
      button.className = 'daily-practice-option';
      button.textContent = option;
      button.addEventListener('click', () => {
        if (dlState.answerSelected) return;
        dlState.answerSelected = true;
        handlePracticeAnswer(option, item);
      });
      dailyPracticeOptions.appendChild(button);
    });
  }

  function getSectionFallbackPool() {
    const lesson = getLesson(dlState.lessonId);
    if (!lesson || !dlState.currentSection) return [];

    const currentIndex = lesson.sections.findIndex((section) => section.id === dlState.currentSection.id);
    if (currentIndex <= 0) return [];

    const fallback = [];
    for (let index = currentIndex - 1; index >= 0; index -= 1) {
      const section = lesson.sections[index];
      section.vocabularies.forEach((vocab) => {
        fallback.push({
          id: vocab.id,
          answer: vocab.meaning
        });
      });
    }
    return fallback;
  }

  function buildPracticeOptions(currentItem) {
    const currentSectionPool = dailyShuffle(dlState.currentItems
      .filter((item) => item.id !== currentItem.id)
      .map((item) => ({ id: item.id, answer: item.answer })));
    const fallbackPool = dailyShuffle(getSectionFallbackPool());
    const candidatePool = currentSectionPool.concat(fallbackPool);
    const wrongOptions = [];
    const seenAnswers = new Set([currentItem.answer]);

    for (const candidate of candidatePool) {
      if (seenAnswers.has(candidate.answer)) continue;
      seenAnswers.add(candidate.answer);
      wrongOptions.push(candidate.answer);
      if (wrongOptions.length === 3) break;
    }

    return dailyShuffle([currentItem.answer].concat(wrongOptions));
  }

  function handlePracticeAnswer(selected, item) {
    const buttons = dailyPracticeOptions.querySelectorAll('.daily-practice-option');
    const correct = selected === item.answer;

    dlState.practiceResults.push({
      id: item.id,
      prompt: item.prompt,
      correctAnswer: item.answer,
      selectedAnswer: selected,
      isCorrect: correct
    });

    buttons.forEach((button) => {
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
    dlState.currentIndex += 1;
    if (dlState.currentIndex < dlState.currentItems.length) {
      renderPracticeItem();
      return;
    }
    showSummary();
  }

  function showSummary() {
    const lesson = getLesson(dlState.lessonId);
    if (!lesson || !dlState.currentSection) return;

    const correctCount = dlState.practiceResults.filter((result) => result.isCorrect).length;
    const total = dlState.practiceResults.length;

    saveDailyLessonStatus(dlState.sectionId, 'completed');

    dailyPracticeScreen.style.display = 'none';
    dailyLearnScreen.style.display = 'none';
    dailySummaryScreen.style.display = 'flex';
    dailySummaryTitle.textContent = dlState.currentSection.title + ' — Hoàn thành';
    dailySummaryContent.innerHTML =
      '<p class="daily-summary-topic">' + lesson.title + '</p>' +
      '<p class="daily-summary-breakdown">' + dlState.currentSection.vocabularies.length + ' từ vựng</p>' +
      '<p class="daily-summary-score">Đúng ' + correctCount + ' / ' + total + '</p>' +
      '<p class="daily-summary-status">Trạng thái section: Hoàn thành</p>' +
      '<p class="daily-summary-note">Bạn có thể học lại section này bất cứ lúc nào từ danh sách bài học.</p>';
  }

  function getCurrentSpeakText() {
    const item = dlState.currentItems[dlState.currentIndex];
    if (!item) return null;

    if (dlState.phase === 'learn-vocab') {
      return item.jp;
    }

    if (dlState.phase === 'practice') {
      return item.audioText || item.prompt;
    }

    return null;
  }

  function exitToOverview(fromScreen) {
    if (fromScreen) fromScreen.style.display = 'none';
    renderOverview();
    dailyOverviewScreen.style.display = 'flex';
  }

  dailyBtn.addEventListener('click', () => {
    modeSelectionScreen.style.display = 'none';
    renderOverview();
    dailyOverviewScreen.style.display = 'flex';
  });

  backFromDailyOverviewBtn.addEventListener('click', () => {
    dailyOverviewScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });

  dailyNextBtn.addEventListener('click', advanceLearn);

  dailySpeakBtn.addEventListener('click', () => {
    const text = getCurrentSpeakText();
    if (text) speakJapanese(text);
  });

  dailyPracticeSpeakBtn.addEventListener('click', () => {
    const text = getCurrentSpeakText();
    if (text) speakJapanese(text);
  });

  dailyExitLearnBtn.addEventListener('click', () => {
    exitToOverview(dailyLearnScreen);
  });

  dailyExitPracticeBtn.addEventListener('click', () => {
    exitToOverview(dailyPracticeScreen);
  });

  dailyRetryBtn.addEventListener('click', () => {
    if (!dlState.lessonId || !dlState.sectionId) return;
    startSection(dlState.lessonId, dlState.sectionId);
  });

  dailyOtherDayBtn.addEventListener('click', () => {
    exitToOverview(dailySummaryScreen);
  });

  dailyHomeBtn.addEventListener('click', () => {
    dailySummaryScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });
});
