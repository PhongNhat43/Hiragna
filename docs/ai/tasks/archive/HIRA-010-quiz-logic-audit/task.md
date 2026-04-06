# Task: HIRA-010 — Quiz Logic Audit

- **ID:** HIRA-010
- **Ngày tạo:** 2026-04-04
- **Trạng thái:** In Progress — audit xong, plan chờ duyệt
- **Loại:** Audit + Bug Fix

---

## Mô tả

Rà soát toàn bộ logic quiz engine trong `src/quiz.js` và `src/hiraganaData.js`. Mục tiêu tìm bugs xác nhận được, edge cases nguy hiểm, và điểm logic chưa chặt. Chưa implement — chỉ audit và lên plan.

---

## Scope

### Trong scope
- `generateQuestion()` — sinh câu hỏi, chọn options
- `validateAnswer()` — kiểm tra đáp án
- `handleAnswer()` — xử lý sau khi trả lời, weak item tracking
- `shuffle()` — trộn array
- `startWeakReview()`, `startFlashcard()`, `startQuizBtn` — khởi động quiz theo mode
- `restartBtn`, `backFromXxx` — reset state khi navigate
- Tương tác giữa quizType, mixed, group filter, questionSet
- State stale risks liên quan đến quiz flow

### Ngoài scope
- Flashcard logic thuần (fcIndex, fcKnew, fcNeedReview)
- Progress tracking và localStorage
- Session persistence / sessionStorage
- UI rendering ngoài optionsArea

---

## Files bị ảnh hưởng

| File | Vai trò |
|---|---|
| `src/quiz.js` | Toàn bộ quiz logic — file chính của audit |
| `src/hiraganaData.js` | QUIZ_TYPE_CONFIG, GROUP_CONFIG — data source |

---

## Overlap với tính năng hiện có

- HIRA-009 (mixed type): generateQuestion() dùng optionsPool fallback liên quan đến mixed
- HIRA-006 (weak review): startWeakReview() và addToWeakItem/removeFromWeakItem
- HIRA-008 (session persistence): restoreSession() restore questionSet
