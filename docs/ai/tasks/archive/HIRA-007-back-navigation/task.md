# HIRA-007 — Back Navigation

## Mô tả
Rà soát toàn bộ màn hình, thêm nút "Quay Lại" vào các màn hình đang thiếu cơ chế back.

## Scope
Thêm back button vào 2 màn hình đang thiếu:
- `quiztype-screen` → back về `mode-selection-screen`
- `difficulty-screen` → back về `quiztype-screen`

## Files bị ảnh hưởng
- `src/index.html` — thêm button HTML
- `src/quiz.js` — thêm event listener + logic

## Overlap với tính năng hiện có
- `group-filter-screen` đã có back button (về difficulty hoặc quiztype theo mode) — không thay đổi
- `settings-screen` đã có back button (về group-filter) — không thay đổi
- `progress-screen` đã có back button — không thay đổi
- Các màn hình main-quiz và flashcard-screen có "Làm Lại" về trang chủ — không thay đổi

## Ngoài scope
- Không thêm back mid-quiz (main-quiz đang chạy)
- Không thêm back mid-flashcard (flashcard-screen đang chạy)
