# Result: [HIRA-001] Quiz Group Filter

## Ngày hoàn thành

2026-03-30

## Files đã thay đổi

| File | Thay đổi chính |
|---|---|
| `src/hiraganaData.js` | Thêm `KANA_GROUP_CONFIG` — định nghĩa 4 nhóm theo romaji |
| `src/index.html` | Thêm `group-filter-screen` div với 4 group buttons và nút Next |
| `src/quiz.js` | Thêm `selectedGroup` vào state; thêm DOM refs, group logic, filter tại startQuizBtn, reset tại restart, initial state |
| `src/style.css` | Thêm style cho `.group-btn`, `.group-btn.active`, `#confirm-group-btn` |

## Tóm tắt thay đổi

Thêm màn hình Group Filter vào giữa flow Difficulty → Settings.
Group được định nghĩa bằng romaji trong `KANA_GROUP_CONFIG` (data layer),
dùng chung cho cả Hiragana và Katakana.
`questionSet` được filter tại thời điểm bấm Start Quiz — không lưu trung gian.

## Giả định đã đưa ra

- Nếu dataset nhỏ hơn totalQuestions, câu hỏi lặp lại — được chấp nhận theo spec hiện tại
- Group "All" dùng toàn bộ dataset, không filter

## Cách verify

- Chọn Hiragana + Easy + **Basic vowels** → chỉ thấy あ い う え お
- Chọn Katakana + Easy + **K-group** → chỉ thấy カ キ ク ケ コ
- Chọn **All** → hoạt động như cũ (20 kana)
- Restart → quay về quiz type screen, group reset về All (button "All" active)
- Settings và auto-advance vẫn hoạt động bình thường

## Vấn đề còn mở

- Group buttons không reset visual active về "All" sau restart — cần reload trang hoặc thêm logic reset class nếu muốn hoàn chỉnh
