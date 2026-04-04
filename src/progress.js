// src/progress.js
// localStorage persistence layer for learning progress
// Independent of quizState — only reads/writes to localStorage

const PROGRESS_KEY = 'hiragna_progress';

function getDefaultProgress() {
  return {
    overall: {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    },
    byType: {
      hiragana: { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 },
      katakana:  { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 },
      kanji:     { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 },
      mixed:     { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 }
    }
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw);
    const def = getDefaultProgress();
    // ensure all byType keys exist (migration for newly added types)
    Object.keys(def.byType).forEach(key => {
      if (!parsed.byType[key]) parsed.byType[key] = def.byType[key];
    });
    return parsed;
  } catch (e) {
    return getDefaultProgress();
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage unavailable (e.g. private mode quota exceeded) — fail silently
  }
}

function resetProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (e) {
    // fail silently
  }
}

// --- Weak Items ---

const WEAK_ITEMS_KEY = 'hiragna_weak_items';

function getDefaultWeakItems() {
  return { hiragana: [], katakana: [], kanji: [], mixed: [] };
}

function loadWeakItems() {
  try {
    const raw = localStorage.getItem(WEAK_ITEMS_KEY);
    if (!raw) return getDefaultWeakItems();
    const parsed = JSON.parse(raw);
    // merge with default to handle missing keys
    const def = getDefaultWeakItems();
    return {
      hiragana: parsed.hiragana || def.hiragana,
      katakana: parsed.katakana || def.katakana,
      kanji:    parsed.kanji    || def.kanji,
      mixed:    parsed.mixed    || def.mixed
    };
  } catch (e) {
    return getDefaultWeakItems();
  }
}

function saveWeakItems(data) {
  try {
    localStorage.setItem(WEAK_ITEMS_KEY, JSON.stringify(data));
  } catch (e) {
    // fail silently
  }
}

function resetWeakItems() {
  try {
    localStorage.removeItem(WEAK_ITEMS_KEY);
  } catch (e) {
    // fail silently
  }
}

function addToWeakItem(quizType, kana) {
  const items = loadWeakItems();
  if (!items[quizType].includes(kana)) {
    items[quizType].push(kana);
    saveWeakItems(items);
  }
}

function removeFromWeakItem(quizType, kana) {
  const items = loadWeakItems();
  const idx = items[quizType].indexOf(kana);
  if (idx !== -1) {
    items[quizType].splice(idx, 1);
    saveWeakItems(items);
  }
}

// --- Session ---

const SESSION_KEY = 'hiragna_session';

function saveSession(data) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (e) {
    // fail silently
  }
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // fail silently
  }
}
