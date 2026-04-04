# Plan: HIRA-009 — Mixed Quiz Type (Phase 1)

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — current-features.md, current-flows.md, architecture.md, changelog.md, decisions.md

---

## Phân tích yêu cầu

Thêm quiz type "Hỗn Hợp" cho phép gộp ≥2 dataset (hiragana/katakana/kanji) thành một questionSet.
Phase 1 chỉ dùng "Tất Cả" cho mỗi type đã chọn, bỏ qua group filter phức tạp.
Dùng lại hoàn toàn quiz/flashcard engine hiện có — chỉ thay đổi cách build questionSet.

---

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/hiraganaData.js` | Thêm `mixed` vào QUIZ_TYPE_CONFIG và GROUP_CONFIG |
| `src/progress.js` | Thêm `mixed` bucket vào getDefaultProgress().byType và getDefaultWeakItems() |
| `src/index.html` | Thêm nút "Hỗn Hợp" vào quiztype-screen; thêm màn mix-type-screen |
| `src/style.css` | Style cho mix-type-screen (checkbox list, validate state) |
| `src/quiz.js` | Flow mới cho mixed: navigation, dataset builder, weak item guard, session persistence |

---

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Regression quiztype-screen | Trung bình | Thêm nút mới vào màn có flow phức tạp — cần test navigation hiện có không vỡ |
| Weak-review + mixed conflict | Cao | Không có `mixed` weak bucket → phải guard trước khi build questionSet |
| addToWeakItem crash khi mixed | Cao | `items['mixed']` là undefined → cần guard trong quiz.js |
| loadWeakItems merge logic | Thấp | Cần thêm `mixed` key vào merge trong loadWeakItems() |
| Session restore màn mix-type-screen | Trung bình | Cần lưu/restore `mixedTypes[]` trong sessionStorage |
| Progress dashboard render | Thấp | Row "Hỗn Hợp" cần `byType.mixed` tồn tại — sẽ có sau khi cập nhật getDefaultProgress() |

---

## Quyết định thiết kế

1. **mixed trong QUIZ_TYPE_CONFIG**: `{ label: "Hỗn Hợp", data: [] }` — data là placeholder vì dataset được build động lúc runtime, không tĩnh.
2. **mixed trong GROUP_CONFIG**: `{ all: { label: "Tất Cả", filter: null } }` — đảm bảo group-filter code không crash nếu nhận `quizType === 'mixed'`.
3. **quizState.mixedTypes**: mảng chứa các type đã chọn, ví dụ `['hiragana', 'katakana']`. Chỉ có nghĩa khi `quizType === 'mixed'`.
4. **Build questionSet**: `[...data_type1, ...data_type2, ...]` theo thứ tự types đã chọn. Không shuffle (shuffle nếu có thì engine đã xử lý).
5. **Guard weak items**: trong `addToWeakItem` và `removeFromWeakItem` ở quiz.js — bỏ qua (early return) khi `quizState.quizType === 'mixed'`.
6. **Weak-review + mixed**: Khi user chọn nút "Hỗn Hợp" trên quiztype-screen, nếu `quizState.mode === 'weak-review'` → hiện alert "Hỗn Hợp không hỗ trợ Ôn Tập Từ Yếu" → không chuyển màn.
7. **mix-type-screen validation**: Cần chọn ≥2 types mới được bấm "Bắt Đầu". Nút disable nếu chọn <2.
8. **Session persistence**: lưu `screen: 'mix-type-screen'` và `mixedTypes: [...]` vào sessionStorage. Khi restore, hiện mix-type-screen với các checkbox đã checked theo mixedTypes.

---

## Các bước thực hiện

### Bước 1 — `src/hiraganaData.js`
- Thêm vào `QUIZ_TYPE_CONFIG`: `mixed: { label: "Hỗn Hợp", data: [] }`
- Thêm vào `GROUP_CONFIG`: `mixed: { all: { label: "Tất Cả", filter: null } }`

### Bước 2 — `src/progress.js`
- `getDefaultProgress()`: thêm `mixed: { totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, wrongAnswers: 0 }` vào `byType`
- `getDefaultWeakItems()`: thêm `mixed: []`
- `loadWeakItems()`: thêm `mixed: parsed.mixed || def.mixed` vào merge block

### Bước 3 — `src/index.html`
- Trong quiztype-screen: thêm nút `<button id="mixed-btn">Hỗn Hợp</button>`
- Thêm màn `mix-type-screen` sau quiztype-screen:
  ```html
  <div id="mix-type-screen" class="screen hidden">
    <h2>Chọn loại kết hợp</h2>
    <p>Chọn ít nhất 2 loại</p>
    <div class="mix-type-options">
      <label><input type="checkbox" value="hiragana"> Hiragana</label>
      <label><input type="checkbox" value="katakana"> Katakana</label>
      <label><input type="checkbox" value="kanji"> Kanji</label>
    </div>
    <button id="start-mixed-btn" disabled>Bắt Đầu</button>
    <button id="back-from-mix-type-btn" class="back-btn">← Quay lại</button>
  </div>
  ```

### Bước 4 — `src/style.css`
- Style `.mix-type-options`: flex column, gap, padding
- Style `label` trong mix-type-options: cursor pointer, font size hợp lý
- `#start-mixed-btn:disabled`: opacity giảm, cursor not-allowed

### Bước 5 — `src/quiz.js`

**5a. quizState — thêm field:**
```js
mixedTypes: []  // ['hiragana','katakana'] — chỉ dùng khi quizType === 'mixed'
```

**5b. DOM refs — thêm:**
```js
const mixedBtn = document.getElementById('mixed-btn');
const mixTypeScreen = document.getElementById('mix-type-screen');
const startMixedBtn = document.getElementById('start-mixed-btn');
const backFromMixTypeBtn = document.getElementById('back-from-mix-type-btn');
const mixTypeCheckboxes = document.querySelectorAll('.mix-type-options input[type="checkbox"]');
```

**5c. mixedBtn click handler:**
```js
mixedBtn.addEventListener('click', () => {
  if (quizState.mode === 'weak-review') {
    alert('Hỗn Hợp không hỗ trợ Ôn Tập Từ Yếu.');
    return;
  }
  quizState.quizType = 'mixed';
  quizState.mixedTypes = [];
  // reset checkboxes
  mixTypeCheckboxes.forEach(cb => cb.checked = false);
  startMixedBtn.disabled = true;
  showScreen(mixTypeScreen);
  saveSession({ screen: 'mix-type-screen', quizType: 'mixed', mixedTypes: [] });
});
```

**5d. Checkbox change handler (validate ≥2):**
```js
mixTypeCheckboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const selected = [...mixTypeCheckboxes].filter(c => c.checked).map(c => c.value);
    quizState.mixedTypes = selected;
    startMixedBtn.disabled = selected.length < 2;
    saveSession({ screen: 'mix-type-screen', quizType: 'mixed', mixedTypes: selected });
  });
});
```

**5e. startMixedBtn click handler:**
```js
startMixedBtn.addEventListener('click', () => {
  // build questionSet
  const combined = quizState.mixedTypes.flatMap(type => QUIZ_TYPE_CONFIG[type].data);
  quizState.questionSet = combined;
  quizState.group = 'all';
  // navigate to difficulty-screen (hoặc trực tiếp quiz nếu không cần chọn difficulty)
  showScreen(difficultyScreen);
  saveSession({ screen: 'difficulty-screen', quizType: 'mixed', mixedTypes: quizState.mixedTypes });
});
```

**5f. backFromMixTypeBtn click handler:**
```js
backFromMixTypeBtn.addEventListener('click', () => {
  quizState.quizType = null;
  quizState.mixedTypes = [];
  showScreen(quiztypeScreen);
  saveSession({ screen: 'quiztype-screen' });
});
```

**5g. Guard weak items — trong addToWeakItem/removeFromWeakItem calls:**
Tìm các chỗ gọi `addToWeakItem(...)` và `removeFromWeakItem(...)` trong quiz.js, thêm guard:
```js
if (quizState.quizType !== 'mixed') {
  addToWeakItem(quizState.quizType, item.kana);
}
```

**5h. Session restore — thêm case `mix-type-screen`:**
Trong `restoreSession()`, thêm case xử lý `screen === 'mix-type-screen'`:
- Set `quizState.quizType = 'mixed'`
- Set `quizState.mixedTypes = session.mixedTypes || []`
- Check lại các checkbox theo mixedTypes
- Update startMixedBtn.disabled
- showScreen(mixTypeScreen)

---

## Self-review plan

Sau khi implement, sẽ kiểm tra:
- [ ] QUIZ_TYPE_CONFIG và GROUP_CONFIG có key `mixed`
- [ ] getDefaultProgress().byType.mixed tồn tại
- [ ] getDefaultWeakItems().mixed tồn tại
- [ ] loadWeakItems() merge có `mixed` key
- [ ] mixedBtn → nếu weak-review mode → alert, không chuyển màn
- [ ] mixedBtn → nếu không phải weak-review → vào mix-type-screen
- [ ] Checkbox ít hơn 2 → startMixedBtn disabled
- [ ] Checkbox ≥2 → startMixedBtn enabled
- [ ] startMixedBtn → questionSet = concat đúng datasets
- [ ] addToWeakItem / removeFromWeakItem không gọi khi quizType === 'mixed'
- [ ] Session restore: mix-type-screen hiện đúng, checkbox đúng state
- [ ] Back từ mix-type-screen → quiztype-screen, state reset đúng
- [ ] Flow hiragana/katakana/kanji thông thường không bị ảnh hưởng (regression check)

---

## Docs impact (sau khi implement)

| File | Cần update |
|---|---|
| `docs/ai/product/current-features.md` | Thêm feature Mixed Quiz Type |
| `docs/ai/product/current-flows.md` | Thêm flow mix-type-screen và navigation |
| `docs/ai/core/architecture.md` | Thêm mixedTypes vào quizState, thêm mixed vào config objects |
| `docs/ai/history/changelog.md` | Bắt buộc — thêm entry HIRA-009 |
| `docs/ai/history/decisions.md` | Ghi quyết định: mixed data là dynamic (không tĩnh trong QUIZ_TYPE_CONFIG), skip weak items |
| `CLAUDE.md` | Không cần — không thay đổi workflow |
