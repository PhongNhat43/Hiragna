// src/vocabStudy.js
// Vocab Learning (Phase 4 / HIRA-019):
// - Màn hình chính 6 mục: Học từ vựng (đầy đủ) + 5 mục placeholder.
// - Vòng học: Học (thẻ lật) → Luyện (4 dạng quiz xoay vòng) → Ôn (spaced repetition).
// - Tái dùng: speakJapanese() (quiz.js), loadItemStats/updateItemStat/pickWeighted (progress.js, quiz.js).
// - Key mới: hiragna_vocab_settings (thiết lập), hiragna_vocab_srs (lịch ôn per item).

const VOCAB_SETTINGS_KEY = 'hiragna_vocab_settings';
const VOCAB_SRS_KEY = 'hiragna_vocab_srs';
const VOCAB_ITEM_TYPE = 'vocab'; // bucket trong hiragna_item_stats — dùng chung updateItemStat/pickWeighted

const VOCAB_DEFAULT_SETTINGS = {
  listOrientation: 'vertical',   // 'vertical' | 'horizontal'
  learnAutoSpeak: true,          // (a) tự động phát âm khi mở thẻ
  learnShowReadingFront: false,  // (b) hiện cách đọc ngay từ mặt trước
  learnShowExampleFront: false,  // (c) hiện câu ví dụ ngay từ mặt trước
  practiceTimer: false,          // (a) timer 10s/câu — mặc định tắt
  practiceAutoNext: true,        // (b) tự chuyển câu sau khi chọn
  practiceReviewWrongNow: true,  // (c) ôn lại lỗi sai ngay sau quiz
  reviewMaxPerSession: 10,       // (a) số từ ôn tối đa mỗi buổi
  reviewIncludeMastered: false   // (b) ôn cả từ đã thuộc lâu
};

// SRS: đúng → interval tiến 1→3→7→14→30 ngày; sai → ôn lại sau 10 phút (interval reset).
const VOCAB_SRS_INTERVALS = [1, 3, 7, 14, 30];
const VOCAB_SRS_WRONG_DELAY_MS = 10 * 60 * 1000;

const vsState = {
  tierId: null,          // 'hiragana' | 'katakana' | 'minna'
  deckId: null,          // 'hiragana' | 'katakana' khi tầng bảng chữ
  minnaLessonId: null,   // 'm1'..'m7' khi tầng Minna
  lessonTitle: null,     // tiêu đề bài đang mở
  units: [],             // các unit của bài đang mở
  currentUnit: null,     // unit đang Học/Luyện
  learnItems: [],
  learnIndex: 0,
  learnFlipped: false,
  learnReturn: 'list',   // 'list' | 'review' | 'practice-summary'
  practice: null,        // { unit, queue, index, wrongLast, finalResults, phase, timerId, inTimer }
  reviewBatch: null,
  detailItemId: null
};

// ===== Helpers chung =====

function vsShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function vsGetSettings() {
  const merged = Object.assign({}, VOCAB_DEFAULT_SETTINGS);
  try {
    const raw = localStorage.getItem(VOCAB_SETTINGS_KEY);
    if (!raw) return merged;
    const parsed = JSON.parse(raw);
    // bỏ qua giá trị hỏng (null/undefined) để giữ default
    Object.keys(parsed).forEach(key => {
      if (parsed[key] !== null && parsed[key] !== undefined) merged[key] = parsed[key];
    });
    return merged;
  } catch (e) {
    return merged;
  }
}

function vsSaveSettings(settings) {
  try {
    localStorage.setItem(VOCAB_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    // fail silently
  }
}

function vsLoadSRS() {
  try {
    const raw = localStorage.getItem(VOCAB_SRS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

function vsSaveSRS(data) {
  try {
    localStorage.setItem(VOCAB_SRS_KEY, JSON.stringify(data));
  } catch (e) {
    // fail silently
  }
}

function vsGetSRSEntry(itemId) {
  return vsLoadSRS()[itemId] || null;
}

function vsHasLearned(itemId) {
  return vsGetSRSEntry(itemId) !== null;
}

// Cập nhật lịch ôn theo kết quả trả lời gần nhất (dùng cho cả Học, Luyện, Ôn).
function vsUpdateSRS(itemId, isCorrect) {
  const data = vsLoadSRS();
  const now = Date.now();
  const entry = data[itemId] || { dueAt: now, intervalDays: 0, lastResult: null, difficult: false };
  if (isCorrect) {
    const idx = VOCAB_SRS_INTERVALS.indexOf(entry.intervalDays);
    const nextIdx = idx === -1 ? 0 : Math.min(idx + 1, VOCAB_SRS_INTERVALS.length - 1);
    entry.intervalDays = VOCAB_SRS_INTERVALS[nextIdx];
    entry.dueAt = now + entry.intervalDays * 86400000;
  } else {
    entry.intervalDays = 0;
    entry.dueAt = now + VOCAB_SRS_WRONG_DELAY_MS; // ôn lại sau 10 phút
  }
  entry.lastResult = isCorrect ? 'correct' : 'wrong';
  entry.updatedAt = now;
  data[itemId] = entry;
  vsSaveSRS(data);
  // thống kê per-item — dùng lại updateItemStat() có sẵn, phục vụ ưu tiên độ yếu
  updateItemStat(VOCAB_ITEM_TYPE, itemId, isCorrect);
}

// Đánh dấu / bỏ đánh dấu từ khó → đưa vào ôn sớm.
function vsToggleDifficult(itemId) {
  const data = vsLoadSRS();
  const entry = data[itemId] || { dueAt: Date.now(), intervalDays: 0, lastResult: null, difficult: false };
  entry.difficult = !entry.difficult;
  if (entry.difficult) {
    entry.dueAt = Date.now(); // đến hạn ngay để vào buổi ôn gần nhất
  }
  data[itemId] = entry;
  vsSaveSRS(data);
  return entry.difficult;
}

// Mức thuộc: 'new' | 'learning' | 'mastered' — dựa trên interval SRS hiện tại.
function vsLevel(itemId) {
  const entry = vsGetSRSEntry(itemId);
  if (!entry) return 'new';
  if (entry.intervalDays >= 7) return 'mastered';
  return 'learning';
}

function vsDotClass(itemId) {
  const entry = vsGetSRSEntry(itemId);
  if (entry && entry.difficult) return 'dot-hard';
  const level = vsLevel(itemId);
  return level === 'new' ? 'dot-new' : level === 'learning' ? 'dot-learning' : 'dot-mastered';
}

// ===== Index toàn bộ item: id → { item, unitId, unitTitle, sourceLabel } =====

function _buildVocabIndex() {
  const idx = new Map();
  Object.values(VOCAB_DECKS).forEach(deck => {
    deck.lessons.forEach(lesson => {
      lesson.items.forEach(item => {
        idx.set(item.id, {
          item,
          unitId: lesson.id,
          unitTitle: lesson.title + ' · ' + lesson.range,
          sourceLabel: lesson.title + ' (' + lesson.range + ')'
        });
      });
    });
  });
  VOCAB_MINNA_LESSONS.forEach(lesson => {
    lesson.units.forEach(unit => {
      unit.items.forEach(item => {
        idx.set(item.id, {
          item,
          unitId: unit.id,
          unitTitle: lesson.title + ' · ' + unit.title,
          sourceLabel: lesson.title + ' — ' + unit.title
        });
      });
    });
  });
  return idx;
}

const VOCAB_INDEX = _buildVocabIndex();

function vsGetUnitById(unitId) {
  const parts = unitId.split('_');
  if (parts[0] === 'hira' || parts[0] === 'kata') {
    const deck = VOCAB_DECKS[parts[0] === 'hira' ? 'hiragana' : 'katakana'];
    const lesson = deck.lessons.find(l => l.id === unitId);
    if (!lesson) return null;
    return {
      id: lesson.id,
      title: lesson.title,
      items: lesson.items,
      deckId: deck.id,
      isKana: true
    };
  }
  for (const lesson of VOCAB_MINNA_LESSONS) {
    const unit = lesson.units.find(u => u.id === unitId);
    if (unit) {
      return {
        id: unit.id,
        title: lesson.title + ' — ' + unit.title,
        items: unit.items,
        minnaLessonId: lesson.id,
        isKana: false
      };
    }
  }
  return null;
}

// Nghe chậm — thêm cho trang chi tiết (speakJapanese có sẵn dùng rate 0.8).
function speakJapaneseSlow(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  utt.rate = 0.5;
  window.speechSynthesis.speak(utt);
}

document.addEventListener('DOMContentLoaded', () => {
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  const mainMenuBtns = document.querySelectorAll('.main-menu-btn');
  const placeholderScreen = document.getElementById('placeholder-screen');
  const placeholderTitle = document.getElementById('placeholder-title');
  const backFromPlaceholderBtn = document.getElementById('back-from-placeholder-btn');

  const vocabHomeScreen = document.getElementById('vocab-home-screen');
  const vocabTierBtns = document.querySelectorAll('.vocab-tier-btn');
  const vocabReviewTodayBtn = document.getElementById('vocab-review-today-btn');
  const vocabSettingsBtn = document.getElementById('vocab-settings-btn');
  const backFromVocabHomeBtn = document.getElementById('back-from-vocab-home-btn');
  const vocabHomeDueInfo = document.getElementById('vocab-home-due-info');

  const vocabLessonListScreen = document.getElementById('vocab-lesson-list-screen');
  const vocabLessonListTitle = document.getElementById('vocab-lesson-list-title');
  const vocabLessonButtons = document.getElementById('vocab-lesson-buttons');
  const backFromVocabLessonListBtn = document.getElementById('back-from-vocab-lesson-list-btn');

  const vocabListScreen = document.getElementById('vocab-list-screen');
  const vocabListTitle = document.getElementById('vocab-list-title');
  const vocabListUnits = document.getElementById('vocab-list-units');
  const vocabListOrientationBtn = document.getElementById('vocab-list-orientation-btn');
  const backFromVocabListBtn = document.getElementById('back-from-vocab-list-btn');

  const vocabDetailScreen = document.getElementById('vocab-detail-screen');
  const vdJp = document.getElementById('vd-jp');
  const vdReading = document.getElementById('vd-reading');
  const vdMeaning = document.getElementById('vd-meaning');
  const vdSpeakBtn = document.getElementById('vd-speak-btn');
  const vdSpeakSlowBtn = document.getElementById('vd-speak-slow-btn');
  const vdExample = document.getElementById('vd-example');
  const vdExampleJp = document.getElementById('vd-example-jp');
  const vdExampleVi = document.getElementById('vd-example-vi');
  const vdUsage = document.getElementById('vd-usage');
  const vdUsageText = document.getElementById('vd-usage-text');
  const vdKanji = document.getElementById('vd-kanji');
  const vdKanjiCards = document.getElementById('vd-kanji-cards');
  const vdRepeatBtn = document.getElementById('vd-repeat-btn');
  const vdPracticeBtn = document.getElementById('vd-practice-btn');
  const vdHardBtn = document.getElementById('vd-hard-btn');
  const vdQuiz = document.getElementById('vd-quiz');
  const vdQuizQuestion = document.getElementById('vd-quiz-question');
  const vdQuizOptions = document.getElementById('vd-quiz-options');
  const vdQuizExplain = document.getElementById('vd-quiz-explain');
  const backFromVocabDetailBtn = document.getElementById('back-from-vocab-detail-btn');

  const vocabLearnScreen = document.getElementById('vocab-learn-screen');
  const vlPhaseLabel = document.getElementById('vl-phase-label');
  const vlProgress = document.getElementById('vl-progress');
  const vlFront = document.getElementById('vl-front');
  const vlFrontJp = document.getElementById('vl-front-jp');
  const vlFrontSpeakBtn = document.getElementById('vl-front-speak-btn');
  const vlFrontReading = document.getElementById('vl-front-reading');
  const vlFrontExample = document.getElementById('vl-front-example');
  const vlFlipBtn = document.getElementById('vl-flip-btn');
  const vlBack = document.getElementById('vl-back');
  const vlBackJp = document.getElementById('vl-back-jp');
  const vlBackReading = document.getElementById('vl-back-reading');
  const vlBackMeaning = document.getElementById('vl-back-meaning');
  const vlBackExample = document.getElementById('vl-back-example');
  const vlBackUsage = document.getElementById('vl-back-usage');
  const vlKnewBtn = document.getElementById('vl-knew-btn');
  const vlUnsureBtn = document.getElementById('vl-unsure-btn');
  const vlExitBtn = document.getElementById('vl-exit-btn');

  const vocabPracticeScreen = document.getElementById('vocab-practice-screen');
  const vpPhaseLabel = document.getElementById('vp-phase-label');
  const vpProgress = document.getElementById('vp-progress');
  const vpTimer = document.getElementById('vp-timer');
  const vpTypeLabel = document.getElementById('vp-type-label');
  const vpPrompt = document.getElementById('vp-prompt');
  const vpSpeakBtn = document.getElementById('vp-speak-btn');
  const vpSecondary = document.getElementById('vp-secondary');
  const vpOptions = document.getElementById('vp-options');
  const vpExplain = document.getElementById('vp-explain');
  const vpNextBtn = document.getElementById('vp-next-btn');
  const vpSummary = document.getElementById('vp-summary');
  const vpSummaryContent = document.getElementById('vp-summary-content');
  const vpSummaryNextBtn = document.getElementById('vp-summary-next-btn');
  const vpExitBtn = document.getElementById('vp-exit-btn');

  const vocabReviewScreen = document.getElementById('vocab-review-screen');
  const vrCount = document.getElementById('vr-count');
  const vrList = document.getElementById('vr-list');
  const backFromVocabReviewBtn = document.getElementById('back-from-vocab-review-btn');

  const vocabSettingsScreen = document.getElementById('vocab-settings-screen');
  const vsBtns = document.querySelectorAll('.vs-btn');
  const backFromVocabSettingsBtn = document.getElementById('back-from-vocab-settings-btn');

  const VOCAB_TYPE_LABELS = {
    jp_vi: 'Nhật → Việt',
    vi_jp: 'Việt → Nhật',
    listen: 'Nghe → chọn chữ',
    fill: 'Điền từ vào câu'
  };

  // ========================
  // Điều hướng chung
  // ========================

  function showScreen(el) {
    [vocabHomeScreen, vocabLessonListScreen, vocabListScreen, vocabDetailScreen,
     vocabLearnScreen, vocabPracticeScreen, vocabReviewScreen, vocabSettingsScreen,
     placeholderScreen].forEach(s => { s.style.display = 'none'; });
    el.style.display = 'flex';
  }

  function hideAllVocabScreens() {
    [vocabHomeScreen, vocabLessonListScreen, vocabListScreen, vocabDetailScreen,
     vocabLearnScreen, vocabPracticeScreen, vocabReviewScreen, vocabSettingsScreen,
     placeholderScreen].forEach(s => { s.style.display = 'none'; });
  }

  // ========================
  // Màn hình chính — 6 mục
  // ========================

  mainMenuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const menu = btn.getAttribute('data-menu');
      if (menu === 'vocab') {
        modeSelectionScreen.style.display = 'none';
        renderVocabHome();
        showScreen(vocabHomeScreen);
      } else {
        modeSelectionScreen.style.display = 'none';
        placeholderTitle.textContent = btn.textContent.trim();
        showScreen(placeholderScreen);
      }
    });
  });

  backFromPlaceholderBtn.addEventListener('click', () => {
    showScreen(modeSelectionScreen);
  });

  // ========================
  // Vocab home
  // ========================

  function renderVocabHome() {
    const dueCount = vsDueItems().length;
    vocabHomeDueInfo.textContent = dueCount > 0
      ? 'Hôm nay có ' + dueCount + ' từ đến hạn ôn'
      : 'Hôm nay không có từ đến hạn ôn';
    vocabReviewTodayBtn.disabled = dueCount === 0;
  }

  vocabTierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.getAttribute('data-tier');
      vsState.tierId = tier;
      if (tier === 'minna') {
        vsState.deckId = null;
        renderMinnaLessonList();
      } else {
        vsState.deckId = tier;
        renderDeckLessonList(tier);
      }
      showScreen(vocabLessonListScreen);
    });
  });

  vocabReviewTodayBtn.addEventListener('click', () => {
    vsState.tierId = 'review';
    renderReviewScreen();
    showScreen(vocabReviewScreen);
  });

  vocabSettingsBtn.addEventListener('click', () => {
    renderVocabSettings();
    showScreen(vocabSettingsScreen);
  });

  backFromVocabHomeBtn.addEventListener('click', () => {
    showScreen(modeSelectionScreen);
  });

  // ========================
  // Danh sách bài học
  // ========================

  function countLearnedInItems(items) {
    return items.filter(it => vsHasLearned(it.id)).length;
  }

  function renderDeckLessonList(deckId) {
    const deck = VOCAB_DECKS[deckId];
    vocabLessonListTitle.textContent = deck.title;
    vocabLessonButtons.innerHTML = '';
    deck.lessons.forEach(lesson => {
      const learned = countLearnedInItems(lesson.items);
      const btn = document.createElement('button');
      btn.className = 'vocab-lesson-btn';
      btn.innerHTML =
        '<span class="vocab-lesson-name">' + lesson.title + '</span>' +
        '<span class="vocab-lesson-range">' + lesson.range + '</span>' +
        '<span class="vocab-lesson-meta">' + learned + '/' + lesson.items.length + ' đã học</span>';
      btn.addEventListener('click', () => {
        vsState.lessonTitle = deck.title + ' — ' + lesson.title;
        vsState.units = [vsGetUnitById(lesson.id)];
        renderVocabList();
        showScreen(vocabListScreen);
      });
      vocabLessonButtons.appendChild(btn);
    });
  }

  function renderMinnaLessonList() {
    vocabLessonListTitle.textContent = 'Từ vựng Minna no Nihongo';
    vocabLessonButtons.innerHTML = '';
    VOCAB_MINNA_LESSONS.forEach(lesson => {
      const allItems = lesson.units.flatMap(u => u.items);
      const learned = countLearnedInItems(allItems);
      const btn = document.createElement('button');
      btn.className = 'vocab-lesson-btn';
      btn.innerHTML =
        '<span class="vocab-lesson-name">' + lesson.title + '</span>' +
        '<span class="vocab-lesson-meta">' + learned + '/' + allItems.length + ' đã học · ' + lesson.units.length + ' nhóm</span>';
      btn.addEventListener('click', () => {
        vsState.lessonTitle = lesson.title;
        vsState.units = lesson.units.map(u => vsGetUnitById(u.id));
        renderVocabList();
        showScreen(vocabListScreen);
      });
      vocabLessonButtons.appendChild(btn);
    });
  }

  backFromVocabLessonListBtn.addEventListener('click', () => {
    renderVocabHome();
    showScreen(vocabHomeScreen);
  });

  // ========================
  // Danh sách từ vựng trong bài (dọc / ngang)
  // ========================

  function renderVocabList() {
    const settings = vsGetSettings();
    vocabListTitle.textContent = vsState.lessonTitle;
    vocabListUnits.classList.toggle('horizontal', settings.listOrientation === 'horizontal');
    vocabListUnits.innerHTML = '';

    vsState.units.forEach(unit => {
      const block = document.createElement('section');
      block.className = 'vocab-unit-block';

      const header = document.createElement('div');
      header.className = 'vocab-unit-header';
      const learned = countLearnedInItems(unit.items);
      header.innerHTML =
        '<div><span class="vocab-unit-title">' + unit.title + '</span>' +
        '<span class="vocab-unit-meta">' + learned + '/' + unit.items.length + ' đã học</span></div>';
      const unitActions = document.createElement('div');
      unitActions.className = 'vocab-unit-actions';

      const learnBtn = document.createElement('button');
      learnBtn.className = 'vocab-unit-btn learn';
      learnBtn.textContent = '📖 Học';
      learnBtn.addEventListener('click', () => startLearn(unit.id, 'list'));

      const practiceBtn = document.createElement('button');
      practiceBtn.className = 'vocab-unit-btn practice';
      practiceBtn.textContent = '✏️ Luyện';
      // Ràng buộc: phải học xong ít nhất 1 từ trong bài thì mới luyện được
      practiceBtn.disabled = learned === 0;
      practiceBtn.title = learned === 0 ? 'Học ít nhất 1 từ trong nhóm trước khi luyện' : '';
      practiceBtn.addEventListener('click', () => startPractice(unit.id));

      const reviewBtn = document.createElement('button');
      reviewBtn.className = 'vocab-unit-btn review';
      reviewBtn.textContent = '🔁 Ôn';
      const dueInUnit = unit.items.filter(it => {
        const entry = vsGetSRSEntry(it.id);
        return entry && entry.dueAt <= Date.now();
      }).length;
      reviewBtn.disabled = dueInUnit === 0;
      reviewBtn.title = dueInUnit === 0 ? 'Không có từ đến hạn trong nhóm này' : '';
      reviewBtn.addEventListener('click', () => startReviewSession(unit.id));

      unitActions.appendChild(learnBtn);
      unitActions.appendChild(practiceBtn);
      unitActions.appendChild(reviewBtn);
      header.appendChild(unitActions);
      block.appendChild(header);

      const itemsWrap = document.createElement('div');
      itemsWrap.className = 'vocab-unit-items';
      unit.items.forEach(item => {
        const row = document.createElement('button');
        row.className = 'vocab-row';
        row.innerHTML =
          '<span class="vocab-dot ' + vsDotClass(item.id) + '"></span>' +
          '<span class="vocab-row-main">' +
            '<span class="vocab-row-jp">' + item.jp + '</span>' +
            '<span class="vocab-row-reading">' + item.reading + '</span>' +
          '</span>' +
          (item.meaning ? '<span class="vocab-row-meaning">' + item.meaning + '</span>' : '');
        row.addEventListener('click', () => openDetail(item.id));
        itemsWrap.appendChild(row);
      });
      block.appendChild(itemsWrap);
      vocabListUnits.appendChild(block);
    });
  }

  vocabListOrientationBtn.addEventListener('click', () => {
    const settings = vsGetSettings();
    settings.listOrientation = settings.listOrientation === 'vertical' ? 'horizontal' : 'vertical';
    vsSaveSettings(settings);
    renderVocabList();
  });

  backFromVocabListBtn.addEventListener('click', () => {
    if (vsState.tierId === 'minna') renderMinnaLessonList();
    else renderDeckLessonList(vsState.deckId);
    showScreen(vocabLessonListScreen);
  });

  // ========================
  // Trang chi tiết từ
  // ========================

  function openDetail(itemId) {
    const rec = VOCAB_INDEX.get(itemId);
    if (!rec) return;
    const item = rec.item;
    vsState.detailItemId = itemId;

    vdJp.textContent = item.jp;
    vdReading.textContent = item.reading;
    vdMeaning.textContent = item.meaning || '—';

    vdExample.style.display = item.example ? 'block' : 'none';
    if (item.example) {
      vdExampleJp.textContent = item.example.jp;
      vdExampleVi.textContent = item.example.vi;
    }
    vdUsage.style.display = item.usage ? 'block' : 'none';
    if (item.usage) vdUsageText.textContent = item.usage;

    // Kanji trong từ: số nét + bộ thủ + các từ khác dùng chung chữ đó (quét runtime)
    if (item.kanji && item.kanji.length > 0) {
      vdKanji.style.display = 'block';
      vdKanjiCards.innerHTML = '';
      item.kanji.forEach(char => {
        const info = VOCAB_KANJI_INFO[char] || { strokes: '?', radical: '?', meaning: '' };
        const related = vsFindRelatedWords(item.id, char);
        const card = document.createElement('div');
        card.className = 'vd-kanji-card';
        card.innerHTML =
          '<div class="vd-kanji-char">' + char + '</div>' +
          '<div class="vd-kanji-info">' +
            '<div>Số nét: ' + info.strokes + '</div>' +
            '<div>Bộ thủ: ' + info.radical + (info.meaning ? ' — ' + info.meaning : '') + '</div>' +
            '<div>Từ khác dùng chung: ' + (related.length ? related.join(' · ') : '—') + '</div>' +
          '</div>';
        vdKanjiCards.appendChild(card);
      });
    } else {
      vdKanji.style.display = 'none';
    }

    vdHardBtn.textContent = (vsGetSRSEntry(itemId) && vsGetSRSEntry(itemId).difficult)
      ? 'Bỏ đánh dấu từ khó' : 'Đánh dấu là từ khó';
    // reset quiz inline: giữ cấu trúc tĩnh, chỉ ẩn + xóa phần động
    vdQuiz.style.display = 'none';
    vdQuizQuestion.textContent = '';
    vdQuizOptions.innerHTML = '';
    vdQuizExplain.style.display = 'none';
    vdQuizExplain.textContent = '';
    showScreen(vocabDetailScreen);
  }

  function vsFindRelatedWords(excludeItemId, char) {
    const out = [];
    VOCAB_INDEX.forEach((rec, id) => {
      if (id === excludeItemId) return;
      if (rec.item.kanji && rec.item.kanji.includes(char)) out.push(rec.item.jp);
    });
    return out;
  }

  function vsSpeakCurrentDetail() {
    const rec = VOCAB_INDEX.get(vsState.detailItemId);
    if (rec) speakJapanese(rec.item.jp);
  }

  vdSpeakBtn.addEventListener('click', vsSpeakCurrentDetail);
  vdRepeatBtn.addEventListener('click', vsSpeakCurrentDetail);
  vdSpeakSlowBtn.addEventListener('click', () => {
    const rec = VOCAB_INDEX.get(vsState.detailItemId);
    if (rec) speakJapaneseSlow(rec.item.jp);
  });

  vdHardBtn.addEventListener('click', () => {
    const nowDifficult = vsToggleDifficult(vsState.detailItemId);
    vdHardBtn.textContent = nowDifficult ? 'Bỏ đánh dấu từ khó' : 'Đánh dấu là từ khó';
  });

  // "Luyện ngay từ này" — 1 câu quiz nhỏ tại trang chi tiết
  vdPracticeBtn.addEventListener('click', () => {
    const rec = VOCAB_INDEX.get(vsState.detailItemId);
    if (!rec) return;
    const q = vsMakeQuestion(rec.item, 'jp_vi');
    vdQuiz.style.display = 'block';
    vdQuizQuestion.textContent = q.prompt;
    vdQuizExplain.style.display = 'none';
    vdQuizOptions.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'vocab-practice-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (q.answered) return;
        q.answered = true;
        const correct = opt === q.answer;
        vdQuizOptions.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          if (b.textContent === q.answer) b.classList.add('correct');
          else if (b === btn) b.classList.add('wrong');
        });
        vsUpdateSRS(rec.item.id, correct);
        vdQuizExplain.textContent = (correct ? 'Đúng! ' : 'Sai — đáp án đúng: ' + q.answer + '. ') + (rec.item.usage || rec.item.category);
        vdQuizExplain.style.display = 'block';
        renderVocabList(); // refresh dot nếu quay lại danh sách
      });
      vdQuizOptions.appendChild(btn);
    });
  });

  backFromVocabDetailBtn.addEventListener('click', () => {
    renderVocabList();
    showScreen(vocabListScreen);
  });

  // ========================
  // Màn hình 1 — Học (thẻ lật)
  // ========================

  function startLearn(unitId, returnTarget, itemsOverride) {
    const unit = vsGetUnitById(unitId);
    if (!unit) return;
    vsState.currentUnit = unit;
    vsState.learnItems = itemsOverride || vsShuffle(unit.items.slice());
    vsState.learnIndex = 0;
    vsState.learnFlipped = false;
    vsState.learnReturn = returnTarget;
    renderLearnCard();
    showScreen(vocabLearnScreen);
  }

  function renderLearnCard() {
    const settings = vsGetSettings();
    const item = vsState.learnItems[vsState.learnIndex];
    if (!item) return;

    vsState.learnFlipped = false;
    vlProgress.textContent = (vsState.learnIndex + 1) + ' / ' + vsState.learnItems.length;
    vlPhaseLabel.textContent = vsState.learnReturn === 'review' ? '🔁 Ôn — học lại từ' : '📖 Học từ vựng';

    // Mặt trước: chỉ chữ Nhật + nút nghe (mặc định không hiện nghĩa/cách đọc)
    vlFront.style.display = 'block';
    vlBack.style.display = 'none';
    vlFrontJp.textContent = item.jp;
    vlFrontSpeakBtn.style.display = window.speechSynthesis ? 'inline-flex' : 'none';
    vlFrontReading.style.display = 'none';
    vlFrontExample.style.display = 'none';
    if (settings.learnShowReadingFront && item.meaning) {
      vlFrontReading.textContent = item.reading;
      vlFrontReading.style.display = 'block';
    }
    if (settings.learnShowExampleFront && item.example) {
      vlFrontExample.textContent = item.example.jp;
      vlFrontExample.style.display = 'block';
    }
    vlFlipBtn.style.display = 'inline-block';
    vlKnewBtn.style.display = 'none';
    vlUnsureBtn.style.display = 'none';

    // Mặt sau: cách đọc, nghĩa, ví dụ, cách dùng
    vlBackJp.textContent = item.jp;
    vlBackReading.textContent = item.reading;
    vlBackMeaning.textContent = item.meaning || item.reading;
    vlBackExample.style.display = item.example ? 'block' : 'none';
    if (item.example) {
      vlBackExample.innerHTML =
        '<div class="vl-example-jp">' + item.example.jp + '</div>' +
        '<div class="vl-example-vi">' + item.example.vi + '</div>';
    }
    vlBackUsage.style.display = item.usage ? 'block' : 'none';
    if (item.usage) vlBackUsage.textContent = item.usage;

    if (settings.learnAutoSpeak && window.speechSynthesis) {
      setTimeout(() => speakJapanese(item.jp), 300);
    }
  }

  vlFrontSpeakBtn.addEventListener('click', () => {
    const item = vsState.learnItems[vsState.learnIndex];
    if (item) speakJapanese(item.jp);
  });

  vlFlipBtn.addEventListener('click', () => {
    if (vsState.learnFlipped) return;
    vsState.learnFlipped = true;
    vlFront.style.display = 'none';
    vlBack.style.display = 'block';
    vlFlipBtn.style.display = 'none';
    vlKnewBtn.style.display = 'inline-block';
    vlUnsureBtn.style.display = 'inline-block';
    if (window.speechSynthesis) {
      const item = vsState.learnItems[vsState.learnIndex];
      if (item) speakJapanese(item.jp);
    }
  });

  vlKnewBtn.addEventListener('click', () => handleLearnResult(true));
  vlUnsureBtn.addEventListener('click', () => handleLearnResult(false));

  function handleLearnResult(knew) {
    if (!vsState.learnFlipped) return; // chưa lật thì chưa chấm
    const item = vsState.learnItems[vsState.learnIndex];
    vsUpdateSRS(item.id, knew);
    vsState.learnIndex++;
    if (vsState.learnIndex < vsState.learnItems.length) {
      renderLearnCard();
      return;
    }
    finishLearn();
  }

  function finishLearn() {
    if (vsState.learnReturn === 'review') {
      // quay về danh sách ôn — từ vừa trả lời đã cập nhật dueAt mới → biến khỏi danh sách đến hạn
      renderReviewScreen();
      showScreen(vocabReviewScreen);
    } else if (vsState.learnReturn === 'practice-summary') {
      showPracticeSummary();
      showScreen(vocabPracticeScreen);
    } else {
      renderVocabList();
      showScreen(vocabListScreen);
    }
  }

  vlExitBtn.addEventListener('click', () => {
    // Thoát giữa chừng: không cập nhật gì, quay về nơi xuất phát
    if (vsState.learnReturn === 'review') {
      renderReviewScreen();
      showScreen(vocabReviewScreen);
    } else if (vsState.learnReturn === 'practice-summary') {
      showPracticeSummary();
      showScreen(vocabPracticeScreen);
    } else {
      renderVocabList();
      showScreen(vocabListScreen);
    }
  });

  // ========================
  // Màn hình 2 — Luyện
  // ========================

  function vsQuestionTypesFor(unit) {
    // 4 dạng xoay vòng cho từ vựng; bảng chữ chỉ có 3 dạng (không có ví dụ để điền)
    return unit.isKana
      ? ['jp_vi', 'vi_jp', 'listen']
      : ['jp_vi', 'vi_jp', 'listen', 'fill'];
  }

  function vsMakeQuestion(item, type) {
    const unit = vsGetUnitById(VOCAB_INDEX.get(item.id).unitId);
    const pool = unit ? unit.items.filter(it => it.id !== item.id) : [];

    let prompt = '', answer = '', options = [], secondary = null, audioText = null;

    if (type === 'jp_vi') {
      prompt = item.jp;
      answer = item.meaning || item.reading; // bảng chữ: "nghĩa" = romaji
      options = [answer];
      pool.forEach(p => {
        const val = p.meaning || p.reading;
        if (options.length < 4 && !options.includes(val)) options.push(val);
      });
    } else if (type === 'vi_jp') {
      prompt = item.meaning || item.reading;
      answer = item.jp;
      options = [answer];
      pool.forEach(p => {
        if (options.length < 4 && !options.includes(p.jp)) options.push(p.jp);
      });
    } else if (type === 'listen') {
      prompt = !window.speechSynthesis ? item.reading : '🔊';
      answer = item.jp;
      options = [answer];
      pool.forEach(p => {
        if (options.length < 4 && !options.includes(p.jp)) options.push(p.jp);
      });
      audioText = item.jp;
      if (!window.speechSynthesis) {
        // không có TTS: hiện cách đọc thay vì phát âm
        secondary = item.reading;
      }
    } else if (type === 'fill') {
      const hasBlank = item.example && item.example.jp.includes(item.jp);
      if (!hasBlank) return vsMakeQuestion(item, 'jp_vi'); // fallback
      prompt = item.example.jp.replace(item.jp, '〇');
      answer = item.jp;
      options = [answer];
      pool.forEach(p => {
        if (options.length < 4 && !options.includes(p.jp)) options.push(p.jp);
      });
      secondary = item.example.vi;
    }

    return {
      item, type,
      prompt, answer, options: vsShuffle(options),
      secondary, audioText,
      explain: item.usage || item.category,
      answered: false
    };
  }

  function startPractice(unitId) {
    const unit = vsGetUnitById(unitId);
    if (!unit) return;
    const learned = unit.items.filter(it => vsHasLearned(it.id));
    if (learned.length === 0) return; // phải học ít nhất 1 từ

    vsState.currentUnit = unit;
    const types = vsQuestionTypesFor(unit);
    // Mỗi buổi 5 câu, xoay vòng 4 dạng; từ sai sẽ xuất hiện lại ở cuối buổi (tổng ≤ 7 câu)
    const picked = vsShuffle(unit.items.slice()).slice(0, 5);
    vsState.practice = {
      unit,
      queue: picked.map((item, i) => vsMakeQuestion(item, types[i % types.length])),
      index: 0,
      totalMax: 5,
      finalResults: {},   // itemId → kết quả lần trả lời cuối cùng
      mainDone: false,
      timerId: null,
      timerRemaining: 0
    };
    renderPracticeQuestion();
    showScreen(vocabPracticeScreen);
  }

  function vsClearPracticeTimer() {
    if (vsState.practice && vsState.practice.timerId !== null) {
      clearInterval(vsState.practice.timerId);
      vsState.practice.timerId = null;
    }
    vpTimer.style.display = 'none';
    vpTimer.classList.remove('timer-warning');
  }

  function vsStartPracticeTimer(question) {
    vsClearPracticeTimer();
    const settings = vsGetSettings();
    if (!settings.practiceTimer) return;
    vsState.practice.timerRemaining = 10;
    vpTimer.style.display = 'block';
    vpTimer.textContent = '10s';
    vsState.practice.timerId = setInterval(() => {
      vsState.practice.timerRemaining--;
      vpTimer.textContent = vsState.practice.timerRemaining + 's';
      if (vsState.practice.timerRemaining <= 3) vpTimer.classList.add('timer-warning');
      if (vsState.practice.timerRemaining <= 0) {
        // Hết giờ = tính sai + hiện đáp án đúng
        vsClearPracticeTimer();
        handlePracticeAnswer(null, question);
      }
    }, 1000);
  }

  function renderPracticeQuestion() {
    const p = vsState.practice;
    const q = p.queue[p.index];
    vpSummary.style.display = 'none';
    document.getElementById('vp-question-area').style.display = 'block';
    vpOptions.style.display = 'flex';
    vpExplain.style.display = 'none';
    vpNextBtn.style.display = 'none';
    vpPhaseLabel.textContent = p.mainDone ? '🔁 Luyện lại từ vừa sai' : '✏️ Luyện tập';
    vpProgress.textContent = 'Câu ' + (p.index + 1) + '/' + p.totalMax;
    vpTypeLabel.textContent = VOCAB_TYPE_LABELS[q.type];
    vpPrompt.textContent = q.prompt;
    vpSecondary.style.display = q.secondary ? 'block' : 'none';
    vpSecondary.textContent = q.secondary || '';
    vpSpeakBtn.style.display = (q.type === 'listen' && window.speechSynthesis) ? 'inline-flex' : 'none';

    vpOptions.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'vocab-practice-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (q.answered) return; // chấm ngay, không đổi đáp án
        vsClearPracticeTimer();
        handlePracticeAnswer(opt, q);
      });
      vpOptions.appendChild(btn);
    });

    if (q.type === 'listen' && q.audioText) {
      setTimeout(() => speakJapanese(q.audioText), 300);
    }
    vsStartPracticeTimer(q);
  }

  function handlePracticeAnswer(selected, q) {
    if (q.answered) return;
    q.answered = true;
    const correct = selected === q.answer;

    vpOptions.querySelectorAll('button').forEach(b => {
      b.disabled = true;
      if (b.textContent === q.answer) b.classList.add('correct');
      else if (selected !== null && b.textContent === selected) b.classList.add('wrong');
    });

    // Ghi kết quả lần trả lời gần nhất + cập nhật lịch ôn
    vsState.practice.finalResults[q.item.id] = correct;
    vsUpdateSRS(q.item.id, correct);

    vpExplain.style.display = 'block';
    vpExplain.textContent = (correct ? 'Đúng! ' : (selected === null ? 'Hết giờ — ' : 'Sai — ') + 'đáp án đúng: ' + q.answer + '. ') + q.explain;

    advancePractice();
  }

  function advancePractice() {
    const p = vsState.practice;
    const settings = vsGetSettings();

    if (settings.practiceAutoNext) {
      setTimeout(goNextPracticeQuestion, 900);
    } else {
      vpNextBtn.style.display = 'inline-block';
    }
  }

  function goNextPracticeQuestion() {
    const p = vsState.practice;
    p.index++;

    if (p.index < p.queue.length) {
      renderPracticeQuestion();
      return;
    }

    if (!p.mainDone) {
      // Hết 5 câu chính: từ nào sai sẽ xuất hiện lại ở cuối buổi, tổng ≤ 7 câu
      p.mainDone = true;
      const wrongQs = p.queue.filter(q => p.finalResults[q.item.id] === false);
      const retryIds = [];
      wrongQs.forEach(q => {
        if (p.queue.length < 7 && !retryIds.includes(q.item.id)) {
          retryIds.push(q.item.id);
        }
      });
      if (retryIds.length > 0) {
        const types = vsQuestionTypesFor(p.unit);
        retryIds.forEach(id => {
          const orig = p.queue.find(q => q.item.id === id);
          // câu retry đổi sang dạng khác với câu gốc
          const origIdx = types.indexOf(orig.type);
          const newType = types[(origIdx + 1) % types.length];
          p.queue.push(vsMakeQuestion(orig.item, newType));
        });
        p.totalMax = p.queue.length; // 5 + số câu retry, tối đa 7
        renderPracticeQuestion();
        return;
      }
      showPracticeSummary();
      return;
    }

    // Hết cả câu chính + câu retry → nếu có từ sai và bật "ôn lỗi sai ngay" → mini thẻ Học
    const wrongItems = [];
    p.queue.forEach(q => {
      if (p.finalResults[q.item.id] === false && !wrongItems.find(i => i.id === q.item.id)) {
        wrongItems.push(q.item);
      }
    });
    const settings = vsGetSettings();
    if (wrongItems.length > 0 && settings.practiceReviewWrongNow) {
      // ôn lại lỗi sai ngay sau quiz — dạng thẻ Học
      startLearn(p.unit.id, 'practice-summary', vsShuffle(wrongItems.slice()));
      return;
    }
    // tắt ôn ngay → từ sai đã được cập nhật doAt (+10 phút) → sẽ vào buổi Ôn hôm nay
    showPracticeSummary();
  }

  function vsBuildSummaryData() {
    const p = vsState.practice;
    const ids = Object.keys(p.finalResults);
    const correctCount = ids.filter(id => p.finalResults[id]).length;
    return {
      totalWords: new Set(p.queue.map(q => q.item.id)).size,
      correctCount,
      totalQuestions: p.queue.length
    };
  }

  function showPracticeSummary() {
    const p = vsState.practice;
    const data = vsBuildSummaryData();
    p.summaryData = data;
    vsClearPracticeTimer();
    document.getElementById('vp-question-area').style.display = 'none';
    vpOptions.style.display = 'none';
    vpExplain.style.display = 'none';
    vpNextBtn.style.display = 'none';
    vpPhaseLabel.textContent = 'Kết quả luyện tập';
    vpProgress.textContent = p.unit.title;
    vpSummary.style.display = 'block';
    const perfect = data.correctCount === data.totalWords;
    vpSummaryContent.innerHTML =
      '<p class="vp-summary-score">Đúng ' + data.correctCount + ' / ' + data.totalWords + ' từ</p>' +
      '<p class="vp-summary-note">Đã làm ' + data.totalQuestions + ' câu (tối đa 7 câu/buổi).</p>' +
      '<p class="vp-summary-note">' + (perfect ? 'Xuất sắc! Bạn đã nhớ hết từ trong nhóm. 🎉' : 'Các từ sai sẽ được đưa vào lịch ôn của màn Ôn.') + '</p>';
    showScreen(vocabPracticeScreen);
  }

  vpNextBtn.addEventListener('click', () => {
    vsClearPracticeTimer();
    goNextPracticeQuestion();
  });

  vpSpeakBtn.addEventListener('click', () => {
    const p = vsState.practice;
    const q = p.queue[p.index];
    if (q && q.audioText) speakJapanese(q.audioText);
  });

  vpSummaryNextBtn.addEventListener('click', () => {
    renderVocabList();
    showScreen(vocabListScreen);
  });

  vpExitBtn.addEventListener('click', () => {
    vsClearPracticeTimer();
    renderVocabList();
    showScreen(vocabListScreen);
  });

  // ========================
  // Màn hình 3 — Ôn
  // ========================

  // Tất cả từ đến hạn hôm nay (đã học ít nhất 1 lần + doAt <= now)
  function vsDueItems() {
    const now = Date.now();
    const out = [];
    VOCAB_INDEX.forEach((rec, id) => {
      const entry = vsGetSRSEntry(id);
      if (entry && entry.dueAt <= now) out.push({ item: rec.item, entry });
    });
    return out;
  }

  // Chọn batch ôn: từ khó lên trước, còn lại dùng pickWeighted (ưu tiên item yếu)
  function vsPickReviewBatch(pool, cap) {
    const difficult = pool.filter(rec => rec.entry.difficult).slice(0, cap);
    const batch = difficult.slice();
    const rest = pool.filter(rec => !rec.entry.difficult && !difficult.includes(rec));
    const settings = vsGetSettings();
    const recentItems = [];
    while (batch.length < cap && rest.length > 0) {
      const wrapped = rest.map(rec => ({ kana: rec.item.id, _rec: rec }));
      const picked = pickWeighted(wrapped, VOCAB_ITEM_TYPE, recentItems);
      batch.push(picked._rec);
      rest.splice(rest.findIndex(rec => rec.item.id === picked._rec.item.id), 1);
      recentItems.unshift(picked._rec.item.id);
      if (recentItems.length > 6) recentItems.pop();
    }
    return batch;
  }

  function renderReviewScreen(unitScope) {
    const settings = vsGetSettings();
    const now = Date.now();

    let pool = vsDueItems();

    if (settings.reviewIncludeMastered) {
      // ôn cả từ đã thuộc lâu (interval >= 7 ngày) bất kể đến hạn
      VOCAB_INDEX.forEach((rec, id) => {
        const entry = vsGetSRSEntry(id);
        if (entry && entry.intervalDays >= 7 && !pool.find(r => r.item.id === id)) {
          pool.push({ item: rec.item, entry });
        }
      });
    }

    if (unitScope) {
      const unit = vsGetUnitById(unitScope);
      if (unit) pool = pool.filter(r => unit.items.some(it => it.id === r.item.id));
    }

    const cap = Math.min(settings.reviewMaxPerSession, pool.length);
    vsState.reviewBatch = vsPickReviewBatch(pool, cap);

    if (pool.length === 0) {
      vrCount.textContent = 'Hôm nay không có từ đến hạn. 🎉';
      vrList.innerHTML = '';
      return;
    }

    vrCount.textContent = 'Hôm nay có ' + pool.length + ' từ đến hạn' +
      (vsState.reviewBatch.length < pool.length ? ' — buổi này ôn ' + vsState.reviewBatch.length + ' từ yếu nhất trước' : '');
    vrList.innerHTML = '';
    vsState.reviewBatch.forEach(rec => {
      const row = document.createElement('button');
      row.className = 'vocab-row';
      row.innerHTML =
        '<span class="vocab-dot ' + vsDotClass(rec.item.id) + '"></span>' +
        '<span class="vocab-row-main">' +
          '<span class="vocab-row-jp">' + rec.item.jp + '</span>' +
        '</span>';
      // Bấm vào từ → mở lại đúng màn hình Học của từ đó; xong mới quay về danh sách ôn
      row.addEventListener('click', () => {
        startLearn(vsGetUnitById(VOCAB_INDEX.get(rec.item.id).unitId).id, 'review', [rec.item]);
      });
      vrList.appendChild(row);
    });
  }

  function startReviewSession(unitScope) {
    vsState.tierId = 'review';
    renderReviewScreen(unitScope || null);
    showScreen(vocabReviewScreen);
  }

  backFromVocabReviewBtn.addEventListener('click', () => {
    renderVocabHome();
    showScreen(vocabHomeScreen);
  });

  // ========================
  // Cài đặt học từ vựng
  // ========================

  function renderVocabSettings() {
    const settings = vsGetSettings();
    vsBtns.forEach(btn => {
      const key = btn.getAttribute('data-vs');
      const raw = btn.getAttribute('data-value');
      let value;
      if (raw === 'true') value = true;
      else if (raw === 'false') value = false;
      else if (/^-?\d+(\.\d+)?$/.test(raw)) value = Number(raw);
      else value = raw; // giá trị chuỗi (vd: 'horizontal')
      btn.classList.toggle('active', settings[key] === value);
    });
  }

  vsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-vs');
      const raw = btn.getAttribute('data-value');
      let value;
      if (raw === 'true') value = true;
      else if (raw === 'false') value = false;
      else if (/^-?\d+(\.\d+)?$/.test(raw)) value = Number(raw);
      else value = raw; // giá trị chuỗi (vd: 'horizontal')
      const settings = vsGetSettings();
      settings[key] = value;
      vsSaveSettings(settings);
      renderVocabSettings();
    });
  });

  backFromVocabSettingsBtn.addEventListener('click', () => {
    renderVocabHome();
    showScreen(vocabHomeScreen);
  });

  // Ẩn toàn bộ vocab screens lúc load (quiz.js đã điều phối màn hình chính)
  hideAllVocabScreens();
});
