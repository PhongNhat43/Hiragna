# Plan: [HIRA-005] Learning Progress Dashboard + localStorage Persistence

## Phân tích

### Data schema (localStorage key: `hiragna_progress`)

```js
{
  overall: {
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  },
  byType: {
    hiragana: { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 },
    katakana:  { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 },
    kanji:     { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 }
  }
}
```

Accuracy tính tại runtime: `correctAnswers / totalQuestions * 100`.
Group-level tracking không làm trong v1 — quá granular, tách task sau nếu cần.
Flashcard Mode không track trong task này — knew/review không ánh xạ sang correct/wrong.

### Trigger lưu progress
Chỉ sau Quiz Mode: hook vào `showResult()` trong `quiz.js`.
Lấy dữ liệu từ `quizState`: score (correct), totalQuestions - score (wrong), totalQuestions, quizType.

### Navigation
Từ `mode-selection-screen` thêm nút "View Progress" → mở `progress-screen`.
Từ `progress-screen` nút "Back" → về `mode-selection-screen`.
`progress-screen` render động khi mở (không cache DOM).

### Phòng ngừa lỗi localStorage
Wrap tất cả localStorage calls trong try/catch — localStorage có thể throw nếu đầy hoặc bị block (private mode một số browser). Fallback: in-memory object (progress không lưu được nhưng app không crash).

---

## Quyết định kiến trúc

| Quyết định | Lựa chọn | Lý do |
|---|---|---|
| Tách progress.js | Có | quiz.js không nên ôm localStorage logic |
| Key localStorage | `hiragna_progress` | Tên riêng tránh conflict với các app khác |
| Confirm trước reset | Có, dùng `window.confirm()` | Tránh xóa nhầm, không cần UI phức tạp |
| Track flashcard | Không (v1) | Metric khác biệt, tách task sau |
| Track by group | Không (v1) | Quá granular |

---

## Script load order sau task này

```html
<script src="hiraganaData.js"></script>
<script src="progress.js"></script>   <!-- mới, trước quiz.js -->
<script src="quiz.js"></script>
```

---

## Rủi ro

| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| localStorage throw (full/blocked) | Thấp | try/catch, fallback im lặng |
| Thêm button trên mode-selection làm layout lệch | Thấp | Kiểm tra CSS |
| showResult() không gọi sau skip/quit | Không có risk — app không có quit mid-quiz | — |
| Reset nhầm | Trung bình | window.confirm() trước khi xóa |
| Flashcard lỡ trigger saveProgress | Cần chú ý | Chỉ gọi saveProgress() trong showResult(), không gọi trong showFlashcardSummary() |

---

## Các bước thực hiện

### Bước 1 — Tạo `src/progress.js`
- `loadProgress()` — đọc từ localStorage, parse JSON, trả về object. Nếu không có hoặc lỗi → trả về schema mặc định.
- `saveProgress(data)` — JSON.stringify và ghi vào localStorage. Wrap try/catch.
- `resetProgress()` — xóa key `hiragna_progress` khỏi localStorage.
- `getDefaultProgress()` — trả về schema mặc định (helper nội bộ).

### Bước 2 — Sửa `src/quiz.js`
- Thêm DOM refs: `progressScreen`, `progressContent`, `resetProgressBtn`, `viewProgressBtn`, `backFromProgressBtn`
- Thêm `showProgressScreen()` — loadProgress() → render vào progressContent → hiện progressScreen
- Thêm `saveQuizProgress()` — lấy data từ quizState (score, totalQuestions, quizType) → cộng vào progress → saveProgress()
- Gọi `saveQuizProgress()` tại cuối `showResult()` (trước khi render UI)
- Thêm event listener: `viewProgressBtn` → ẩn mode-selection, hiện progress-screen
- Thêm event listener: `backFromProgressBtn` → ẩn progress-screen, hiện mode-selection
- Thêm event listener: `resetProgressBtn` → window.confirm() → resetProgress() → re-render

### Bước 3 — Sửa `src/index.html`
- Thêm `<button id="view-progress-btn">` vào `mode-selection-screen`
- Thêm `progress-screen` với: `#progress-content` (stats render ở đây), `#reset-progress-btn`, `#back-from-progress-btn`
- Thêm `<script src="progress.js"></script>` trước `quiz.js`

### Bước 4 — Sửa `src/style.css`
- Style cho `#progress-screen`
- Style cho `#view-progress-btn`
- Style cho stats table/section trong progress
- Style cho `#reset-progress-btn` (màu đỏ nhạt để phân biệt)

---

## Self-review plan (sau implement)
- [ ] loadProgress() trả về default khi localStorage rỗng
- [ ] saveProgress() cộng đúng vào overall và byType tương ứng
- [ ] showResult() gọi saveQuizProgress() — không gọi trong showFlashcardSummary()
- [ ] Accuracy = correctAnswers / totalQuestions * 100, xử lý edge case totalQuestions = 0
- [ ] Reset có confirm, xóa đúng key, re-render về 0
- [ ] Navigation: mode-selection ↔ progress-screen không phá flow quiz
- [ ] Script load order đúng trong HTML
- [ ] Không regression: Quiz Mode flow, Flashcard Mode flow vẫn hoạt động

---

## Docs impact
- `current-features.md` — thêm Progress Dashboard section
- `current-flows.md` — cập nhật Entry Flow (thêm nút View Progress), thêm Progress Screen flow
- `architecture.md` — cập nhật script load order, thêm progress.js vào layer description
- `history/decisions.md` — ghi quyết định tách progress.js, localStorage key, không track flashcard v1
- `changelog.md` — thêm entry HIRA-005 sau archive
