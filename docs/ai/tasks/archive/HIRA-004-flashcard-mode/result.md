# Result: [HIRA-004] Flashcard Mode

## Ngày hoàn thành

2026-03-31

## Files đã thay đổi

| File | Thay đổi chính |
|---|---|
| `src/index.html` | Thêm `mode-selection-screen`, `flashcard-screen`; quiztype-screen đổi về hidden |
| `src/quiz.js` | Thêm fc fields vào quizState, mode selection logic, flashcard functions, rẽ nhánh confirmGroupBtn và backToDifficultyBtn theo mode, restart về mode-selection |
| `src/style.css` | Thêm styles cho `.mode-btn`, `#flashcard-screen`, `#fc-*` |

## Tóm tắt thay đổi

- Thêm `mode-selection-screen` làm màn hình đầu tiên (Quiz Mode / Flashcard Mode)
- Flashcard Mode tái sử dụng quiz type selection và group filter — không tạo engine riêng
- `confirmGroupBtn` rẽ nhánh: quiz → settings screen, flashcard → `startFlashcard()`
- `backToDifficultyBtn` rẽ nhánh: quiz → difficulty, flashcard → quiz type screen
- 5 field mới trong quizState: `mode`, `fcIndex`, `fcKnew`, `fcNeedReview`, `fcAnswerShown`
- Cả `restartBtn` (quiz) và `fcRestartBtn` đều reset về `mode-selection-screen`

## Giả định đã đưa ra

- `shuffle()` nhận bản copy của filtered array — không mutate dataset gốc
- Summary hiển thị ngay trong `#fc-progress` thay vì tạo màn hình riêng

---

## Kết quả self-review

- [x] Mode selection screen hiện đầu tiên, quiz type screen ẩn
- [x] Quiz Mode flow không thay đổi (mode → quiztype → difficulty → group → settings → quiz)
- [x] Flashcard Mode bỏ qua difficulty và settings (mode → quiztype → group → flashcard)
- [x] backToDifficultyBtn mode-aware: quiz → difficulty, flashcard → quiztype
- [x] confirmGroupBtn rẽ nhánh đúng theo quizState.mode
- [x] startFlashcard() filter + shuffle đúng, không mutate gốc
- [x] Flashcard cycle: show answer → knew/review → advance → summary
- [x] restartBtn và fcRestartBtn đều về mode-selection, reset đủ fields
- [x] Regression: Quiz Mode — không có thay đổi logic, chỉ thêm mode-selection trước

---

## Kết quả runtime verify

**Môi trường:** localhost:5500 / Playwright khả dụng nhưng không resolve được module trong môi trường này

**Không chạy được runtime verify:** Playwright CLI available (`npx playwright --version` = 1.58.2) nhưng module `playwright` không có trong local `node_modules` và không resolve được từ `node -e`. Runtime verify cần Nhật Phong sama verify thủ công.

---

## Docs updated

- [ ] `current-features.md`
- [ ] `current-flows.md`
- [ ] `changelog.md`

---

## Vấn đề còn mở

- Runtime verify chưa chạy được tự động — cần Nhật Phong sama verify thủ công trên localhost:5500
