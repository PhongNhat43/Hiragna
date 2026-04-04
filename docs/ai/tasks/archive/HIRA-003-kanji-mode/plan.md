# Plan: [HIRA-003] Kanji Mode

## Phân tích vấn đề thiết kế

### Vấn đề cốt lõi: KANA_GROUP_CONFIG dùng chung

Hiện tại `KANA_GROUP_CONFIG` là object phẳng dùng chung cho tất cả quiz type.
Kanji cần nhóm khác (numbers, nature, people) — không thể dùng chung.

**Giải pháp:** Đổi thành `GROUP_CONFIG` per quiz type:

```js
const GROUP_CONFIG = {
  hiragana: { all: {...}, basic_vowels: {...}, k_group: {...}, s_group: {...} },
  katakana:  { all: {...}, basic_vowels: {...}, k_group: {...}, s_group: {...} },
  kanji:     { all: {...}, numbers: {...}, nature: {...}, people: {...} }
};
```

Group buttons trong `group-filter-screen` sẽ được render động bằng JS thay vì hardcode HTML.

---

## Phạm vi thay đổi

| File | Loại thay đổi |
|---|---|
| `src/hiraganaData.js` | Thêm `kanjiData[]`, đổi `KANA_GROUP_CONFIG` → `GROUP_CONFIG` per type, thêm kanji vào `QUIZ_TYPE_CONFIG` |
| `src/quiz.js` | Render group buttons động, cập nhật filter logic dùng `GROUP_CONFIG[quizType]` |
| `src/index.html` | Thêm nút Kanji, xóa group buttons hardcode → để JS render |

---

## Các bước thực hiện

### Bước 1 — `hiraganaData.js`: Thêm kanjiData

```js
const kanjiData = [
  // Numbers
  { kana: "一", romaji: "one" },
  { kana: "二", romaji: "two" },
  { kana: "三", romaji: "three" },
  { kana: "四", romaji: "four" },
  { kana: "五", romaji: "five" },
  { kana: "六", romaji: "six" },
  { kana: "七", romaji: "seven" },
  { kana: "八", romaji: "eight" },
  { kana: "九", romaji: "nine" },
  { kana: "十", romaji: "ten" },
  { kana: "百", romaji: "hundred" },
  { kana: "千", romaji: "thousand" },
  // Nature
  { kana: "山", romaji: "mountain" },
  { kana: "川", romaji: "river" },
  { kana: "木", romaji: "tree" },
  { kana: "火", romaji: "fire" },
  { kana: "水", romaji: "water" },
  { kana: "土", romaji: "earth" },
  { kana: "日", romaji: "sun" },
  { kana: "月", romaji: "moon" },
  // People
  { kana: "人", romaji: "person" },
  { kana: "口", romaji: "mouth" },
  { kana: "女", romaji: "woman" },
  { kana: "男", romaji: "man" },
  { kana: "子", romaji: "child" },
  { kana: "父", romaji: "father" },
  { kana: "母", romaji: "mother" }
];
```

---

### Bước 2 — `hiraganaData.js`: Đổi KANA_GROUP_CONFIG → GROUP_CONFIG

```js
const GROUP_CONFIG = {
  hiragana: {
    all:          { label: "All",          filter: null },
    basic_vowels: { label: "Basic vowels", filter: ["a","i","u","e","o"] },
    k_group:      { label: "K-group",      filter: ["ka","ki","ku","ke","ko"] },
    s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] }
  },
  katakana: {
    all:          { label: "All",          filter: null },
    basic_vowels: { label: "Basic vowels", filter: ["a","i","u","e","o"] },
    k_group:      { label: "K-group",      filter: ["ka","ki","ku","ke","ko"] },
    s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] }
  },
  kanji: {
    all:     { label: "All",     filter: null },
    numbers: { label: "Numbers", filter: ["one","two","three","four","five","six","seven","eight","nine","ten","hundred","thousand"] },
    nature:  { label: "Nature",  filter: ["mountain","river","tree","fire","water","earth","sun","moon"] },
    people:  { label: "People",  filter: ["person","mouth","woman","man","child","father","mother"] }
  }
};
```

---

### Bước 3 — `hiraganaData.js`: Thêm kanji vào QUIZ_TYPE_CONFIG

```js
const QUIZ_TYPE_CONFIG = {
  hiragana: { label: "Hiragana", data: hiraganaData },
  katakana:  { label: "Katakana",  data: katakanaData },
  kanji:     { label: "Kanji",     data: kanjiData }
};
```

---

### Bước 4 — `index.html`: Thêm nút Kanji, xóa group buttons hardcode

```html
<!-- quiztype-screen: thêm nút -->
<button class="quiztype-btn" data-quiztype="kanji">Kanji</button>

<!-- group-filter-screen: xóa hardcoded group buttons, để div trống để JS render -->
<div id="group-buttons"></div>
```

---

### Bước 5 — `quiz.js`: Render group buttons động

Thay toàn bộ logic `groupBtns.forEach(...)` hiện tại bằng hàm render động:

```js
function renderGroupButtons() {
  const groups = GROUP_CONFIG[quizState.quizType];
  groupButtonsContainer.innerHTML = '';
  Object.entries(groups).forEach(([id, group], index) => {
    const btn = document.createElement('button');
    btn.className = 'group-btn' + (index === 0 ? ' active' : '');
    btn.setAttribute('data-group', id);
    btn.textContent = group.label;
    btn.addEventListener('click', () => {
      quizState.selectedGroup = id;
      groupButtonsContainer.querySelectorAll('.group-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
    });
    groupButtonsContainer.appendChild(btn);
  });
  quizState.selectedGroup = Object.keys(groups)[0]; // default = 'all'
}
```

Gọi `renderGroupButtons()` khi chuyển sang `groupFilterScreen`.

---

### Bước 6 — `quiz.js`: Cập nhật filter logic trong startQuizBtn

```js
const group = GROUP_CONFIG[quizState.quizType][quizState.selectedGroup];
```

Thay `KANA_GROUP_CONFIG[quizState.selectedGroup]` → `GROUP_CONFIG[quizState.quizType][quizState.selectedGroup]`

---

## Rủi ro

| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| Xóa `KANA_GROUP_CONFIG` làm vỡ quiz.js | Cao | Rename trong cùng commit, cập nhật tất cả ref |
| Group buttons hardcode bị xóa nhưng JS chưa render | Cao | Kiểm tra `renderGroupButtons()` được gọi trước khi screen hiển thị |
| Kanji dataset < 4 items trong một nhóm → không đủ options | Thấp | Dataset đủ lớn (12 numbers, 8 nature, 7 people) |
