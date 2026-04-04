# Current Flows

_Cập nhật lần cuối: 2026-04-02 (sau HIRA-006)_

---

## Entry Flow

```
[mode-selection-screen]
  Chọn: Quiz Mode | Flashcard Mode | Weak Review | View Progress
        ↓               ↓                ↓               ↓
[quiztype-screen]  [quiztype-screen] [quiztype-screen] [progress-screen]
        ↓               ↓                ↓
  [difficulty]    [group-filter]   check weak items
        ↓               ↓           empty → alert
  [group-filter] [flashcard-screen] → [main-quiz]
        ↓
  [settings] → [main-quiz]
```

---

## Quiz Mode Flow

```
[difficulty-screen]
  Chọn: Easy | Medium | Hard
        ↓ (renderGroupButtons() gọi tại đây)
[group-filter-screen]
  Chọn group → Click "Next"
        ↓
[settings-screen]
  Cấu hình: autoAdvance, feedbackDelay, reviewEnabled
  → Click "Start Quiz"
        ↓ (filter questionSet theo group, reset state)
[main-quiz]
  Loop: renderQuestion → handleAnswer / skipBtn
        ↓ (questionCount === totalQuestions)
  showResult()
        ↓
  - Nút "Review Mistakes" (nếu reviewEnabled && incorrectAnswers.length > 0)
  - Nút "Review All" (luôn hiển thị)
  - Nút "Restart" → mode-selection-screen
```

---

## Flashcard Mode Flow

```
[group-filter-screen]
  Chọn group → Click "Next"
        ↓ startFlashcard(): filter + shuffle questionSet, reset fc state
[flashcard-screen]
  renderFlashcard(): hiện ký tự, ẩn answer
        ↓ Click "Show Answer"
  showFlashcardAnswer(): hiện answer, hiện knew/review btn
        ↓ Click "I knew it" | "Need review"
  handleFlashcardResult(): fcKnew++ / fcNeedReview++, fcIndex++
        ↓ còn card → renderFlashcard()
        ↓ hết card → showFlashcardSummary()
  Summary: Total / I knew it / Need review
  Nút "Restart" → mode-selection-screen
```

---

## Progress Screen Flow

```
[mode-selection-screen]
  Click "View Progress"
        ↓ showProgressScreen(): loadProgress() → render stats
[progress-screen]
  Hiển thị: Overall stats + By Type breakdown
  "Reset Progress" → window.confirm() → resetProgress() → re-render
  "Back" → mode-selection-screen
```

Progress được lưu sau mỗi Quiz Mode `showResult()`. Flashcard Mode không trigger save progress.

---

## Weak Review Flow

```
[mode-selection-screen]
  Click "Weak Review" → quizState.mode = 'weak-review'
        ↓
[quiztype-screen]
  Chọn quiz type
        ↓ kiểm tra weakItems[type].length
    → 0: alert "No weak items...", stay on quiztype-screen
    → ≥ 1: startWeakReview()
        ↓
  questionSet = fullData filtered by weak kana list (shuffled)
  totalQuestions = questionSet.length
  Bỏ qua: difficulty, group-filter, settings
        ↓
[main-quiz] — reuse hoàn toàn
  handleAnswer: đúng → remove from weak; sai/skip → add to weak
        ↓ showResult() → saveQuizProgress()
  Nút "Restart" → mode-selection-screen
```

---

## Session Persistence (F5 Reload)

Khi reload trang (F5), app khôi phục màn hình cuối cùng qua `sessionStorage` (key: `hiragna_session`).

| Màn hình | Hành vi sau F5 |
|---|---|
| `quiztype-screen` | Khôi phục đúng màn, restore `mode` |
| `difficulty-screen` | Khôi phục đúng màn, restore `mode`, `quizType` |
| `group-filter-screen` | Khôi phục đúng màn, render group buttons |
| `settings-screen` | Khôi phục đúng màn, re-apply active states |
| `progress-screen` | Khôi phục đúng màn, reload data từ localStorage |
| `main-quiz` / `flashcard-screen` | Về `mode-selection-screen` (mid-session không restore) |

Session bị clear khi: Restart, Làm Lại, Back về trang chủ.

---

## Back Button Behavior

| Màn hình | Back đến |
|---|---|
| quiztype-screen (mọi mode) | mode-selection-screen |
| difficulty-screen | quiztype-screen |
| group-filter (Quiz Mode) | difficulty-screen |
| group-filter (Flashcard Mode) | quiztype-screen |
| group-filter (Weak Review) | quiztype-screen |
| settings-screen | group-filter-screen |
| progress-screen | mode-selection-screen |

---

## Restart Flow

```
Restart (từ main-quiz hoặc flashcard-screen) →
  Ẩn màn hình hiện tại
  Hiện mode-selection-screen
  Reset toàn bộ quizState:
    mode, quizType, questionSet, difficulty,
    score, questionCount, incorrectAnswers, questionHistory,
    selectedGroup, autoAdvance, feedbackDelay, reviewEnabled,
    fcIndex, fcKnew, fcNeedReview, fcAnswerShown
```

---

## Answer Flow (trong Quiz Mode)

```
User click answer →
  isAnswered === true? → bỏ qua
  validateAnswer() → đúng/sai
  push vào questionHistory
  Nếu sai → push vào incorrectAnswers
  disableOptions() → Highlight buttons → renderScore()
  autoAdvance On  → setTimeout(advanceToNextQuestion, feedbackDelay)
  autoAdvance Off → setTimeout(show nextBtn, feedbackDelay)
```

---

## Skip Flow (trong Quiz Mode)

```
User click Skip →
  isAnswered === true? → bỏ qua
  isAnswered = true
  push vào incorrectAnswers (userAnswer: null)
  push vào questionHistory (isCorrect: false)
  disableOptions()
  setTimeout(advanceToNextQuestion, feedbackDelay)
```
