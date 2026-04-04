# Plan: [HIRA-001] Quiz Group Filter

## Phân tích yêu cầu

Dataset hiện tại (`hiraganaData`, `katakanaData`) không có thông tin nhóm.
Cần định nghĩa nhóm theo romaji vì romaji là chung giữa Hiragana và Katakana —
tránh logic trùng lặp, đúng với kiến trúc hiện tại.

Flow hiện tại:
```
Quiz Type → Difficulty → Settings → [Start Quiz]
```

Flow mới:
```
Quiz Type → Difficulty → Group Filter → Settings → [Start Quiz]
```

Group filter được đặt sau Difficulty (vì group ảnh hưởng dataset, tương tự difficulty ảnh hưởng số câu)
và trước Settings (vì settings là tuỳ chỉnh hành vi, không phải nội dung).

Tại thời điểm bấm "Start Quiz", `questionSet` được tính lại từ full dataset
rồi filter theo group đã chọn — không lưu trung gian, tránh state cũ ảnh hưởng.

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/hiraganaData.js` | Thêm `KANA_GROUP_CONFIG` — định nghĩa 4 nhóm |
| `src/index.html` | Thêm `group-filter-screen` div |
| `src/quiz.js` | 6 điểm sửa — xem chi tiết bên dưới |
| `src/style.css` | Thêm style tối thiểu cho group buttons (tái dùng pattern setting-btn) |

## Chi tiết thay đổi `quiz.js`

1. **`quizState`** — thêm field `selectedGroup: 'all'`
2. **DOM refs** — thêm `groupFilterScreen`, `groupBtns`, `confirmGroupBtn`
3. **Difficulty handler** — đổi transition: `difficultyScreen → groupFilterScreen` (thay vì → settingsScreen)
4. **Group filter logic** — `groupBtns` click cập nhật `quizState.selectedGroup` + visual active; `confirmGroupBtn` chuyển sang `settingsScreen`
5. **`startQuizBtn` handler** — filter `questionSet` theo group trước khi bắt đầu quiz
6. **`restartBtn` handler** — reset `selectedGroup = 'all'`, ẩn `groupFilterScreen`
7. **Initial state** — thêm `groupFilterScreen.style.display = 'none'`

## Chi tiết `KANA_GROUP_CONFIG` (thêm vào `hiraganaData.js`)

```js
const KANA_GROUP_CONFIG = {
  all:          { label: "All",          filter: null },
  basic_vowels: { label: "Basic vowels", filter: ["a","i","u","e","o"] },
  k_group:      { label: "K-group",      filter: ["ka","ki","ku","ke","ko"] },
  s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] }
};
```

`filter: null` có nghĩa là dùng toàn bộ dataset.

## Chi tiết filter logic (trong `startQuizBtn`)

```js
const group = KANA_GROUP_CONFIG[quizState.selectedGroup];
const fullData = QUIZ_TYPE_CONFIG[quizState.quizType].data;
quizState.questionSet = group.filter === null
  ? fullData
  : fullData.filter(item => group.filter.includes(item.romaji));
```

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Dataset quá nhỏ so với difficulty | Thấp | Đã được chấp nhận trong spec — câu hỏi lặp lại là allowed |
| `questionSet` bị stale từ lần chọn quiz type | Thấp | Tính lại tại `startQuizBtn`, không phụ thuộc vào giá trị cũ |
| Screen transition bị thiếu | Trung bình | `groupFilterScreen` phải được ẩn đúng trong restart và initial state |
| `KANA_GROUP_CONFIG` chưa có trong scope khi `quiz.js` chạy | Thấp | `hiraganaData.js` load trước `quiz.js` — đúng thứ tự script trong `index.html` |

## Các bước thực hiện

1. Thêm `KANA_GROUP_CONFIG` vào `hiraganaData.js`
2. Thêm `group-filter-screen` vào `index.html`
3. Thêm `selectedGroup: 'all'` vào `quizState`
4. Thêm DOM refs cho group filter screen
5. Đổi difficulty handler → chuyển sang `groupFilterScreen`
6. Thêm group filter logic (group buttons + confirm button)
7. Cập nhật `startQuizBtn` để filter `questionSet` theo group
8. Cập nhật `restartBtn` để reset group và ẩn screen
9. Thêm `groupFilterScreen` vào initial state
10. Thêm CSS tối thiểu cho group buttons

## Cách verify

- Chọn Hiragana + Easy + **Basic vowels** → chỉ thấy あ い う え お
- Chọn Katakana + Easy + **K-group** → chỉ thấy カ キ ク ケ コ
- Chọn **All** → hoạt động như cũ với 20 kana
- Restart → quay về quiz type screen, group reset về All
- Settings và auto-advance vẫn hoạt động bình thường sau khi thêm group filter
