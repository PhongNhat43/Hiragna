# Plan: [HIRA-004] Flashcard Mode

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — `current-features.md`, `current-flows.md`, `changelog.md`

## Phân tích yêu cầu

Flashcard Mode là chế độ học mới chạy song song với Quiz Mode. Điểm quan trọng:
- Tái sử dụng toàn bộ: quiz type selection, group filter, dataset
- Bỏ qua: difficulty screen, settings screen
- Thêm mới: mode-selection-screen, flashcard-screen (với show/answer flow), summary

Flow mới:
```
[mode-selection-screen]        ← MỚI
  Chọn: Quiz Mode | Flashcard Mode
        ↓
[quiztype-screen]              ← dùng lại
        ↓
[group-filter-screen]          ← dùng lại
        ↓
  Quiz Mode → [difficulty-screen] → [settings-screen] → [main-quiz]
  Flashcard Mode → [flashcard-screen]                  ← MỚI
```

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/index.html` | Thêm `mode-selection-screen`, `flashcard-screen` |
| `src/quiz.js` | Thêm `mode` vào quizState, flashcard logic, điều chỉnh flow transitions |
| `src/style.css` | Thêm styles cho flashcard screen |

## Thiết kế quizState

Thêm các field sau vào `quizState`:
```js
mode: null,              // 'quiz' | 'flashcard'
fcIndex: 0,              // vị trí card hiện tại
fcKnew: 0,               // đếm "I knew it"
fcNeedReview: 0,         // đếm "Need review"
fcAnswerShown: false     // trạng thái show/hide answer
```

`questionSet` và `selectedGroup` dùng chung với quiz mode — không cần thêm gì.

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Mode-selection chen vào trước quiztype-screen | Trung bình | Phải điều chỉnh initial state và restart flow |
| Restart từ flashcard phải về mode-selection, không về quiztype | Trung bình | Cần xử lý riêng restartBtn cho từng mode |
| Group filter dùng chung: confirmGroupBtn phải biết đi đâu tiếp | Trung bình | Rẽ nhánh dựa vào `quizState.mode` |
| Flashcard shuffle dataset | Thấp | Dùng lại hàm `shuffle()` có sẵn |

## Các bước thực hiện

### Bước 1 — `quiz.js`: Thêm flashcard fields vào quizState
```js
mode: null,
fcIndex: 0,
fcKnew: 0,
fcNeedReview: 0,
fcAnswerShown: false
```

### Bước 2 — `index.html`: Thêm mode-selection-screen
```html
<div id="mode-selection-screen" class="quiz-container">
  <h2>Select Mode</h2>
  <div id="mode-buttons">
    <button class="mode-btn" data-mode="quiz">Quiz Mode</button>
    <button class="mode-btn" data-mode="flashcard">Flashcard Mode</button>
  </div>
</div>
```

### Bước 3 — `index.html`: Thêm flashcard-screen
```html
<div id="flashcard-screen" class="quiz-container" style="display:none;">
  <div id="fc-progress"></div>
  <div id="fc-card">
    <div id="fc-character"></div>
    <div id="fc-answer" style="display:none;"></div>
  </div>
  <div id="fc-buttons">
    <button id="fc-show-btn">Show Answer</button>
    <button id="fc-knew-btn" style="display:none;">I knew it</button>
    <button id="fc-review-btn" style="display:none;">Need review</button>
  </div>
  <button id="fc-restart-btn">Restart</button>
</div>
```

### Bước 4 — `quiz.js`: Mode selection logic
- Khai báo DOM refs cho mode-selection-screen, mode-btn
- Event listeners: set `quizState.mode`, chuyển sang quiztype-screen

### Bước 5 — `quiz.js`: Điều chỉnh confirmGroupBtn
Rẽ nhánh sau group filter:
```js
confirmGroupBtn.addEventListener('click', () => {
  groupFilterScreen.style.display = 'none';
  if (quizState.mode === 'flashcard') {
    startFlashcard();
  } else {
    settingsScreen.style.display = 'flex';
  }
});
```

### Bước 6 — `quiz.js`: Flashcard logic
- `startFlashcard()`: shuffle questionSet, reset fc state, render card đầu tiên
- `renderFlashcard()`: hiển thị ký tự, ẩn answer, ẩn knew/review btn, hiện show btn
- `showFlashcardAnswer()`: hiện answer, ẩn show btn, hiện knew/review btn
- `handleFlashcardResult(knew)`: cập nhật fcKnew/fcNeedReview, advance hoặc showFlashcardSummary
- `showFlashcardSummary()`: hiển thị total/knew/need review

### Bước 7 — `quiz.js`: Restart từ flashcard
`fc-restart-btn`: reset fc state, ẩn flashcard-screen, hiện mode-selection-screen

### Bước 8 — `quiz.js`: Điều chỉnh initial state và restartBtn chính
- Initial state: hiện mode-selection-screen thay vì quiztype-screen
- `restartBtn` (trong main-quiz): về mode-selection-screen

### Bước 9 — `style.css`: Thêm styles cho flashcard

### Bước 10 — `quiz.js`: Reset fc fields trong startFlashcard và restart

## Self-review plan

- [ ] Flow Quiz Mode không thay đổi sau khi thêm mode-selection
- [ ] Flow Flashcard end-to-end đúng với cả 3 quiz type
- [ ] confirmGroupBtn rẽ nhánh đúng theo mode
- [ ] Restart từ flashcard về mode-selection, restart từ quiz về mode-selection
- [ ] fc state reset sạch giữa các session

## Runtime verify plan

_Điều kiện: app đang chạy + browser automation khả dụng_

- [ ] Quiz Mode: mode-selection → quiz type → difficulty → group → settings → quiz — không vỡ
- [ ] Flashcard Mode: mode-selection → quiz type → group → flashcard session
- [ ] Show Answer → I knew it / Need review → advance đúng
- [ ] Summary hiển thị đúng số liệu
- [ ] Restart flashcard → về mode-selection
- [ ] Restart quiz → về mode-selection
