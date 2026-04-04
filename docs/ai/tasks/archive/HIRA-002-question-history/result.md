# Result: [HIRA-002] Question History

## Trạng thái

- **Implement:** hoàn thành
- **Verify:** chờ người dùng

## File đã thay đổi

| File | Thay đổi |
|---|---|
| `src/index.html` | Thêm `#review-all-btn` vào button-row |
| `src/quiz.js` | Thêm `questionHistory[]` vào quizState, push trong handleAnswer + skipBtn, thêm showReviewAll/renderReviewAllQuestion, event listener, reset trong startQuizBtn + restartBtn + initial state |

## Thay đổi chính

- `quizState.questionHistory`: mảng mới track toàn bộ câu hỏi (đúng, sai, skip)
- `handleAnswer()`: push entry `{ kana, correctRomaji, userAnswer, isCorrect }` sau mỗi câu trả lời
- `skipBtn`: push entry với `userAnswer: null, isCorrect: false`
- `showResult()`: luôn hiển thị `reviewAllBtn` (không gated bởi `reviewEnabled`)
- `showReviewAll()` + `renderReviewAllQuestion()`: hiển thị từng entry với kana, đáp án chọn, đáp án đúng, trạng thái Correct/Incorrect
- Reset `questionHistory = []` và ẩn `reviewAllBtn` trong cả `startQuizBtn` và `restartBtn`

## Giả định

- `reviewAllBtn` dùng inline style `display:none` trong HTML giống `reviewBtn`, không cần thêm class CSS riêng
- Status badge dùng inline style để tối thiểu thay đổi CSS

## Cách verify

1. Chạy quiz đến kết thúc
2. Kiểm tra nút "Review All" xuất hiện (dù có hay không có lỗi)
3. Click "Review All" → xem lần lượt từng câu, kiểm tra kana/đáp án/status đúng
4. Câu đúng hiển thị "Correct" nền xanh, câu sai/skip hiển thị "Incorrect" nền đỏ
5. Restart → "Review All" ẩn đi, history xóa sạch
6. Kiểm tra "Review Mistakes" vẫn hoạt động bình thường (chỉ hiện khi có lỗi và reviewEnabled=true)

## Vấn đề còn mở

_(không có)_
