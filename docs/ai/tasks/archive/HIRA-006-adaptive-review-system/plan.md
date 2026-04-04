# Plan: [HIRA-006] Adaptive Review System

## Phân tích kỹ thuật

### Weak items schema (localStorage key: `hiragna_weak_items`)

```js
{
  hiragana: ['あ', 'き', ...],  // mảng kana characters (unique per type)
  katakana:  ['ア', 'キ', ...],
  kanji:     ['山', '水', ...]
}
```

Lưu theo `kana` (ký tự hiển thị), không phải `romaji`, vì `kana` là identifier duy nhất trong mỗi type.
Dùng Array thay Set để JSON serialize được.

### Adaptive logic

Áp dụng trong **mọi quiz mode** (Quiz Mode và Weak Review Mode), không chỉ riêng Weak Review:
- Trả lời **đúng** → nếu kana đó đang trong weakItems[quizType] → xóa ra
- Trả lời **sai** → thêm vào weakItems[quizType] (nếu chưa có)
- **Skip** → thêm vào weakItems[quizType] (nếu chưa có)

### Weak Review flow

```
mode-selection-screen
  Click "Weak Review"
        ↓ quizState.mode = 'weak-review'
quiztype-screen (reuse)
        ↓ quizTypeBtns handler
  kiểm tra weakItems[quizType].length
    → 0: hiện thông báo "No weak items for this type", về quiztype-screen
    → > 0: startWeakReview()
        ↓
  questionSet = items từ dataset filtered theo weak kana list
  totalQuestions = questionSet.length (quiz hết toàn bộ, không giới hạn difficulty)
  → main-quiz (reuse hoàn toàn)
        ↓ showResult() như bình thường
```

Weak Review **bỏ qua** difficulty, group filter, settings screens.
`quizState.mode === 'weak-review'` cần handle ở `backToDifficultyBtn` (back về quiztype-screen).

### Mode-aware branches cần update

| Location | Xử lý thêm |
|---|---|
| `quizTypeBtns` handler | `'weak-review'`: check empty → startWeakReview() hoặc thông báo |
| `backToDifficultyBtn` | `'weak-review'`: back về quiztype-screen (không có difficulty screen) |
| `restartBtn` | không cần đổi — đã reset mode về null |
| `confirmGroupBtn` | không cần đổi — weak-review không đi qua group filter |

---

## Quyết định thiết kế

| Quyết định | Lựa chọn | Lý do |
|---|---|---|
| Separate localStorage key | `hiragna_weak_items` | Tách biệt với progress stats, reset độc lập |
| Adaptive trong mọi quiz mode | Có | Nhất quán — đúng trong bất kỳ mode nào cũng nên "học được" |
| totalQuestions trong weak review | = số weak items (không giới hạn) | Mục tiêu là clear hết weak items, không phải giới hạn số câu |
| Skip difficulty/group/settings | Có | Weak Review đã có questionSet cụ thể, không cần filter thêm |
| Empty state | Alert + stay on quiztype-screen | Đơn giản, không crash |

---

## Rủi ro

| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| handleAnswer hiện có nhiều side effects | Trung bình | Thêm weak items logic vào cuối handleAnswer, không đụng existing code |
| skipBtn: kana hiện tại có thể null | Thấp | Check `quizState.currentQuestion` trước khi gọi addToWeakItems |
| weakItems[quizType] undefined nếu schema cũ | Thấp | getDefaultWeakItems() trả về schema đầy đủ, merge khi load |
| Weak review với 0 items sau khi clear hết trong session | Trung bình | showResult() vẫn hiển thị bình thường, không loop lại |
| quizTypeBtns handler hiện không có async | Không risk | Check + alert là synchronous |

---

## Các bước thực hiện

### Slice A — Weak Items Infrastructure (không touch quiz flow)

**A1. `src/progress.js`** — thêm:
- `WEAK_ITEMS_KEY = 'hiragna_weak_items'`
- `getDefaultWeakItems()` → `{ hiragana: [], katakana: [], kanji: [] }`
- `loadWeakItems()` — đọc localStorage, merge với default nếu thiếu key
- `saveWeakItems(data)`
- `resetWeakItems()`
- `addToWeakItem(quizType, kana)` — load → push nếu chưa có → save
- `removeFromWeakItem(quizType, kana)` — load → splice → save

**A2. `src/quiz.js`** — sửa `handleAnswer()`:
```js
if (correct) {
  removeFromWeakItem(quizState.quizType, quizState.currentQuestion.kana);
} else {
  addToWeakItem(quizState.quizType, quizState.currentQuestion.kana);
}
```

Sửa `skipBtn` handler:
```js
addToWeakItem(quizState.quizType, quizState.currentQuestion.kana);
```

**A3. `src/quiz.js`** — `showProgressScreen()`:
- Load weak items, thêm dòng weak count vào mỗi type row trong bảng "By Type"
- Thêm nút "Reset Weak Items" vào `#progress-actions`

**A4. `src/index.html`** — thêm `reset-weak-items-btn` vào `#progress-actions`

**A5. `src/quiz.js`** — event listener `resetWeakItemsBtn`:
```js
if (window.confirm('Reset all weak items?')) {
  resetWeakItems();
  showProgressScreen(); // re-render
}
```

---

### Slice B — Weak Review Mode (thêm flow mới)

**B1. `src/index.html`** — thêm button vào mode-selection-screen:
```html
<button id="weak-review-btn">Weak Review</button>
```

**B2. `src/quiz.js`** — thêm DOM ref: `weakReviewBtn`

**B3. `src/quiz.js`** — `weakReviewBtn` event listener:
```js
quizState.mode = 'weak-review';
modeSelectionScreen.style.display = 'none';
quizTypeScreen.style.display = 'flex';
```

**B4. `src/quiz.js`** — sửa `quizTypeBtns` handler, thêm nhánh `'weak-review'`:
```js
if (quizState.mode === 'weak-review') {
  const weakItems = loadWeakItems();
  if (weakItems[type].length === 0) {
    alert('No weak items for ' + QUIZ_TYPE_CONFIG[type].label + '. Keep practicing!');
    return;
  }
  startWeakReview();
}
```

**B5. `src/quiz.js`** — thêm `startWeakReview()`:
```js
function startWeakReview() {
  const type = quizState.quizType;
  const weakItems = loadWeakItems();
  const fullData = QUIZ_TYPE_CONFIG[type].data;
  const weakKanaSet = new Set(weakItems[type]);
  quizState.questionSet = shuffle(fullData.filter(item => weakKanaSet.has(item.kana)));
  quizState.totalQuestions = quizState.questionSet.length;
  quizState.score = 0;
  quizState.questionCount = 0;
  quizState.isAnswered = false;
  quizState.quizComplete = false;
  quizState.incorrectAnswers = [];
  quizState.reviewIndex = 0;
  quizState.questionHistory = [];
  quizTypeScreen.style.display = 'none';
  mainQuiz.style.display = 'flex';
  reviewBtn.style.display = 'none';
  reviewAllBtn.style.display = 'none';
  reviewArea.style.display = 'none';
  renderQuestion();
}
```

**B6. `src/quiz.js`** — sửa `backToDifficultyBtn`:
```js
if (quizState.mode === 'flashcard' || quizState.mode === 'weak-review') {
  quizTypeScreen.style.display = 'flex';
} else {
  difficultyScreen.style.display = 'flex';
}
```

**B7. `src/style.css`** — style `#weak-review-btn` (màu amber/vàng để phân biệt với Quiz/Flashcard)

---

## Bug điều tra: Weak Review button không có action

### Hiện tượng
Click "Weak Review" → không có visual change nào xảy ra. CSS/flex fix trước đó không giải quyết được.

### Phân tích theo hướng debug thực tế

**Element tồn tại trong DOM?**
✓ `<button id="weak-review-btn">` ở line 15 index.html. Selector `getElementById('weak-review-btn')` đúng.

**Event listener có được attach?**
Code gọi `weakReviewBtn.addEventListener` tại line 207 quiz.js — sau `modeBtns.forEach` (line 198–205). Nếu `weakReviewBtn` null tại đây → TypeError → crash callback → mọi listener sau line 207 đều không attach.

**JS error / selector mismatch?**
Không có typo trong selector. Không có code nào giữa modeBtns.forEach và weakReviewBtn.addEventListener có thể throw.

**Flow render / timing?**
Server PID 16273 (gốc) đang phục vụ — không phải PID 16333 (thất bại vì port already in use). Server gốc start trước HIRA-006. Python http.server gửi `Last-Modified` header → browser có thể dùng cached quiz.js.

### Root cause kết luận
**Browser caching quiz.js** — HTML mới (có button) được load, JS cũ (không có weakReviewBtn listener) được lấy từ cache. Button hiển thị nhưng không có handler → không có action.

Secondary issue: nếu element null vì bất kỳ lý do gì, `weakReviewBtn.addEventListener` crash toàn callback silently.

### Fix được đề xuất
1. User hard refresh (Cmd+Shift+R) để clear cache
2. Code: thêm null-safety check cho weakReviewBtn listener tránh silent crash

## Self-review plan (sau implement)

- [ ] addToWeakItem: không duplicate, lưu đúng quiz type
- [ ] removeFromWeakItem: xóa đúng kana, không crash nếu không tồn tại
- [ ] handleAnswer + skip gọi đúng hàm, không break highlight logic
- [ ] startWeakReview: questionSet chỉ gồm weak items của type đã chọn
- [ ] Empty state: alert hiện, không navigate đến main-quiz
- [ ] backToDifficultyBtn: mode 'weak-review' về quiztype-screen
- [ ] Progress Dashboard: weak count hiển thị đúng, reset weak items hoạt động
- [ ] Weak Review không đi qua difficulty/group/settings screens
- [ ] Quiz Mode flow không bị ảnh hưởng bởi các thay đổi

---

## Docs impact

- `current-features.md` — thêm Weak Items và Weak Review Mode section
- `current-flows.md` — thêm Weak Review flow, cập nhật Back Button table
- `architecture.md` — cập nhật quizState (thêm mode: 'weak-review')
- `history/decisions.md` — ghi quyết định adaptive logic cho mọi mode, weak-review skip difficulty/group/settings
- `changelog.md` — thêm entry HIRA-006 sau archive
