# Architecture

## 3-layer structure

| Layer | Files | Trách nhiệm |
|---|---|---|
| UI | `src/index.html`, `src/style.css` | Render interface, không chứa logic |
| Logic | `src/quiz.js` | Quản lý state, sinh câu hỏi, validate đáp án, điều phối flow |
| Data | `src/hiraganaData.js` | Dataset và config objects |
| Persistence | `src/progress.js` | localStorage (learning progress, weak items) + sessionStorage (session restore) |

---

## Data layer — config objects

### QUIZ_TYPE_CONFIG
Map quiz type sang dataset tương ứng.
```js
const QUIZ_TYPE_CONFIG = {
  hiragana: { label: "Hiragana", data: hiraganaData },
  katakana:  { label: "Katakana",  data: katakanaData },
  kanji:     { label: "Kanji",     data: kanjiData }
};
```

### GROUP_CONFIG
Groups per quiz type. Filter là mảng romaji/meaning values; `null` = toàn bộ dataset.
```js
const GROUP_CONFIG = {
  hiragana: { all, basic_vowels, k_group, s_group },
  katakana:  { all, basic_vowels, k_group, s_group },
  kanji:     { all, numbers, nature, people }
};
```

### DIFFICULTY_CONFIG
```js
const DIFFICULTY_CONFIG = {
  easy:   { totalQuestions: 10 },
  medium: { totalQuestions: 15 },
  hard:   { totalQuestions: 20 }
};
```

---

## Logic layer — quizState

Single source of truth. Mọi state đều sống trong object này.

```js
const quizState = {
  quizType: null,          // 'hiragana' | 'katakana' | 'kanji'
  mode: null,              // 'quiz' | 'flashcard' | 'weak-review'
  questionSet: null,       // dataset đang dùng (sau khi filter group)
  difficulty: null,
  totalQuestions: 10,
  questionCount: 0,
  score: 0,
  currentQuestion: null,   // { kana, correctRomaji, options }
  isAnswered: false,
  quizComplete: false,
  incorrectAnswers: [],    // câu sai và skip — dùng cho Review Mistakes
  questionHistory: [],     // toàn bộ câu đã trả lời — dùng cho Review All
  reviewIndex: 0,
  selectedGroup: 'all',
  autoAdvance: true,
  feedbackDelay: 800,
  reviewEnabled: true
};
```

---

## UI layer — screen flow

```
quiztype-screen → difficulty-screen → group-filter-screen → settings-screen → main-quiz
```

Group buttons trong `group-filter-screen` được render động bằng JS (`renderGroupButtons()`),
không hardcode trong HTML.

---

## Script load order (bắt buộc)

```html
<script src="hiraganaData.js"></script>  <!-- data layer -->
<script src="progress.js"></script>       <!-- persistence layer -->
<script src="quiz.js"></script>           <!-- logic layer -->
```

`quiz.js` phụ thuộc vào config objects từ `hiraganaData.js` và functions từ `progress.js` qua global scope.
