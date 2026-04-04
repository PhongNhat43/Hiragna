# HIRA-007 — Plan

## Impacted files
- `src/index.html`
- `src/quiz.js`

## Risks
- **State stale khi back:** Khi quay lại màn trước, cần reset state liên quan để tránh leak
  - Back từ quiztype → mode-selection: reset `quizState.mode = null`
  - Back từ difficulty → quiztype: reset `quizState.quizType`, `quizState.questionSet`, `quizState.difficulty`
- **Back từ quiztype trong Weak Review mode:** quiztype-screen được dùng cho cả 3 mode (quiz, flashcard, weak-review) → back button phải hoạt động đúng trong cả 3 trường hợp (đều về mode-selection)

## Quyết định thiết kế
- Button "Quay Lại" dùng style nhất quán với các màn hình hiện tại
- `quiztype-screen`: thêm 1 nút "Quay Lại" đứng riêng phía dưới các quiz type buttons (không có button pair)
- `difficulty-screen`: thêm 1 nút "Quay Lại" đứng riêng phía dưới các difficulty buttons (không có button pair)
- Không dùng `.button-row` vì không có button pair — dùng wrapper riêng hoặc standalone

## Các bước implement

### index.html
1. Thêm `<button id="back-from-quiztype-btn">Quay Lại</button>` vào `quiztype-screen`
2. Thêm `<button id="back-from-difficulty-btn">Quay Lại</button>` vào `difficulty-screen`

### quiz.js
3. Lấy reference 2 button mới trong `DOMContentLoaded`
4. Thêm event listener `back-from-quiztype-btn`:
   - `quizTypeScreen.style.display = 'none'`
   - `quizState.mode = null`
   - `modeSelectionScreen.style.display = 'flex'`
5. Thêm event listener `back-from-difficulty-btn`:
   - `difficultyScreen.style.display = 'none'`
   - `quizState.quizType = null`
   - `quizState.questionSet = null`
   - `quizState.difficulty = null`
   - `quizTypeScreen.style.display = 'flex'`

## Self-review plan
- [ ] Trace back từ quiztype (Quiz Mode) → mode-selection → chọn lại mode khác → flow đúng
- [ ] Trace back từ quiztype (Flashcard Mode) → mode-selection → chọn lại → flow đúng
- [ ] Trace back từ quiztype (Weak Review) → mode-selection → chọn lại → flow đúng
- [ ] Trace back từ difficulty → quiztype → chọn lại quiz type → difficulty → flow đúng
- [ ] Kiểm tra không regression: group-filter, settings back buttons vẫn đúng

## Docs impact
- Cập nhật `docs/ai/product/current-flows.md` — bổ sung vào bảng "Back Button Behavior"
- Cập nhật `docs/ai/history/changelog.md` sau khi archive
