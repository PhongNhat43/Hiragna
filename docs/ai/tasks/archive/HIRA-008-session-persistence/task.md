# HIRA-008 — Session Persistence

## Mô tả
Khi người dùng bấm F5 (reload trang), app hiện tại luôn về mode-selection-screen. Task này thêm cơ chế lưu màn hình hiện tại vào sessionStorage, để khi reload, app khôi phục đúng màn hình và state tương ứng.

## Scope
Lưu và khôi phục các màn hình setup + progress. Không khôi phục mid-quiz hoặc mid-flashcard (state quá phức tạp, không có ý nghĩa).

### Màn hình ĐƯỢC khôi phục
- `mode-selection-screen`
- `quiztype-screen`
- `difficulty-screen`
- `group-filter-screen`
- `settings-screen`
- `progress-screen`

### Màn hình KHÔNG khôi phục (default về mode-selection)
- `main-quiz` (mid-quiz hoặc sau khi kết thúc)
- `flashcard-screen` (mid-session)

## Files bị ảnh hưởng
- `src/progress.js` — thêm sessionStorage functions
- `src/quiz.js` — thêm save/restore logic vào screen transitions

## Overlap với tính năng hiện có
- `progress.js` hiện có `localStorage` cho learning progress và weak items — không đụng vào
- Initialization flow trong `quiz.js` (cuối DOMContentLoaded) — thay đổi để kiểm tra session trước
