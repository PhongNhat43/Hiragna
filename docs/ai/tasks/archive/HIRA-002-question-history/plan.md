# Plan: [HIRA-002] Question History

## Phạm vi thay đổi

| File | Loại thay đổi |
|---|---|
| `src/quiz.js` | Thêm field, push history, thêm hàm render, reset state |
| `src/index.html` | Thêm nút `review-all-btn` vào `main-quiz` |
| `src/style.css` | Thêm style tối thiểu cho `#review-all-btn` nếu cần |

## Các bước thực hiện

### Bước 1 — `src/quiz.js`: Thêm `questionHistory` vào quizState

```js
questionHistory: []
```

Thêm vào object `quizState`, sau `reviewIndex`.

---

### Bước 2 — `src/quiz.js`: Push entry vào `questionHistory` trong `handleAnswer()`

Sau khi gọi `validateAnswer(option)`, push entry:

```js
quizState.questionHistory.push({
  kana: quizState.currentQuestion.kana,
  correctRomaji: quizState.currentQuestion.correctRomaji,
  userAnswer: option,
  isCorrect: correct
});
```

---

### Bước 3 — `src/quiz.js`: Push entry trong `skipBtn` handler

```js
quizState.questionHistory.push({
  kana: quizState.currentQuestion.kana,
  correctRomaji: quizState.currentQuestion.correctRomaji,
  userAnswer: null,
  isCorrect: false
});
```

---

### Bước 4 — `src/quiz.js`: Thêm `reviewAllBtn` reference và hàm `showReviewAll()`

Trong phần khai báo DOM refs (đầu DOMContentLoaded):
```js
const reviewAllBtn = document.getElementById('review-all-btn');
```

Thêm hàm `showReviewAll()` và `renderReviewAllQuestion()`:
- Hiển thị từng entry trong `questionHistory`
- Format: kana, đáp án chọn (hoặc "Skipped"), đáp án đúng, trạng thái (Correct / Incorrect)
- Navigation prev/next tương tự `renderReviewQuestion()`

---

### Bước 5 — `src/quiz.js`: Hiển thị `reviewAllBtn` trong `showResult()`

```js
reviewAllBtn.style.display = 'inline-block';
```

Không gated bởi `reviewEnabled` hay `incorrectAnswers.length`.

---

### Bước 6 — `src/quiz.js`: Reset trong `startQuizBtn` và `restartBtn`

Thêm vào cả hai chỗ:
```js
quizState.questionHistory = [];
```

Và ẩn nút:
```js
reviewAllBtn.style.display = 'none';
```

---

### Bước 7 — `src/index.html`: Thêm `review-all-btn`

Thêm vào `button-row` trong `main-quiz`, cạnh `review-btn`:

```html
<button id="review-all-btn" style="display:none;">Review All</button>
```

---

### Bước 8 — `src/style.css` (nếu cần)

Nếu `review-all-btn` cần style riêng, thêm tối thiểu. Có thể tái sử dụng class `.review-nav-btn` hoặc style tương tự `#next-btn`.

## Rủi ro

- `reviewAllBtn` reference phải được khai báo trước khi dùng trong `showResult()` và `restartBtn` → đảm bảo thứ tự trong DOMContentLoaded
- Không được xóa reset `questionHistory = []` trong `startQuizBtn` — nếu thiếu, history bị cộng dồn giữa các lần chơi
