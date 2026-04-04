# Result: [HIRA-006] Adaptive Review System

## Ngày hoàn thành
2026-04-02

## Files đã thay đổi

| File | Thay đổi chính |
|---|---|
| `src/progress.js` | Thêm weak items layer: WEAK_ITEMS_KEY, getDefaultWeakItems, loadWeakItems, saveWeakItems, resetWeakItems, addToWeakItem, removeFromWeakItem |
| `src/quiz.js` | handleAnswer + skipBtn gọi weak item functions; startWeakReview(); weakReviewBtn listener; quizTypeBtns nhánh weak-review; backToDifficultyBtn update; showProgressScreen thêm weak count; resetWeakItemsBtn listener |
| `src/index.html` | Thêm #weak-review-btn vào mode-buttons; thêm #reset-weak-items-btn vào progress-actions |
| `src/style.css` | Style cho #weak-review-btn, #reset-weak-items-btn |

## Tóm tắt thay đổi

- Weak items lưu vào localStorage key `hiragna_weak_items`, schema `{ hiragana, katakana, kanji }` — mỗi type là mảng kana strings
- Adaptive logic trong mọi quiz mode: đúng → xóa khỏi weak; sai/skip → thêm vào weak
- Weak Review mode: chọn quiz type → filter questionSet theo weak items → quiz trực tiếp (bỏ qua difficulty/group/settings)
- Empty state: alert thân thiện, không navigate vào quiz
- Dashboard: cột "Weak" thêm vào bảng By Type; nút "Reset Weak Items" độc lập với "Reset Progress"

## Kết quả self-review

- [x] addToWeakItem không duplicate — pass
- [x] removeFromWeakItem không crash nếu kana không tồn tại — pass
- [x] handleAnswer: correct → remove, wrong → add — không phá highlight logic — pass
- [x] skipBtn: add to weak trước disableOptions — pass
- [x] startWeakReview: questionSet chỉ gồm weak items của type đã chọn — pass
- [x] Empty state: alert + return, quizTypeScreen không bị ẩn — pass
- [x] backToDifficultyBtn: 'weak-review' → quizTypeScreen — pass
- [x] Progress Dashboard: weak count load đúng, reset weak items re-render — pass
- [x] Quiz Mode và Flashcard Mode flow không bị ảnh hưởng — pass

## Bug phát sinh trong task: Weak Review button không có action

### Hiện tượng
Click "Weak Review" không có visual change. CSS fix (flex-wrap) không giải quyết được.

### Root cause kết luận (sau điều tra)
Browser caching `quiz.js`. Server PID 16273 (gốc, start trước HIRA-006) đang phục vụ với `Last-Modified` header. Browser dùng cached quiz.js không có weakReviewBtn listener → button không có handler.

Secondary: nếu element null vì bất kỳ lý do gì, `weakReviewBtn.addEventListener` (line 207) crash toàn DOMContentLoaded callback silently — mọi listener sau đó không được attach.

### Fix đề xuất (chờ người dùng duyệt)
1. Hard refresh browser (Cmd+Shift+R)
2. Thêm null-safety check cho weakReviewBtn listener trong quiz.js

## Bug 2: Weak Review crash khi weak items < 4

**Root cause:** `generateQuestion()` dùng `while (options.length < 4)` pull options từ `dataSet`. Nếu `dataSet.length < 4` (user chỉ có 1–3 weak items), vòng lặp không thoát được → infinite loop → crash.

**Fix:** Thêm `optionsPool` trong `generateQuestion()`. Khi `dataSet.length < 4`, dùng full dataset của quiz type làm option pool thay vì chỉ dùng weak items. Câu hỏi vẫn lấy từ weak items.

**File thay đổi:** `src/quiz.js` — 1 dòng thêm, 1 dòng sửa trong `generateQuestion()`.

## Vấn đề còn mở

- Flashcard Mode không track weak items (v1 — có thể tách task sau)
- Spaced repetition / scheduling chưa có (ngoài scope v1)
- Weak items per group chưa có (chỉ per quiz type)

## Docs updated

- [x] `current-features.md` — thêm Weak Items & Adaptive Review, cập nhật Progress Dashboard
- [x] `current-flows.md` — thêm Weak Review Flow, cập nhật Entry Flow và Back Button table
- [x] `architecture.md` — thêm `mode: 'weak-review'` vào quizState
- [x] `history/decisions.md` — 3 quyết định: adaptive mọi mode, skip screens, optionsPool fallback
- [x] `changelog.md` — thêm entry HIRA-006
