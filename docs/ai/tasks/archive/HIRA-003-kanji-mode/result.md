# Result: [HIRA-003] Kanji Mode

## Trạng thái

- **Implement:** hoàn thành
- **Verify:** chờ người dùng

## File đã thay đổi

| File | Thay đổi |
|---|---|
| `src/hiraganaData.js` | Thêm `kanjiData[]` (27 ký tự N5), đổi `KANA_GROUP_CONFIG` → `GROUP_CONFIG` per quiz type, thêm `kanji` vào `QUIZ_TYPE_CONFIG` |
| `src/index.html` | Thêm nút Kanji trong quiztype-screen, xóa hardcoded group buttons (để JS render) |
| `src/quiz.js` | Thay `groupBtns.forEach` bằng `renderGroupButtons()` động, gọi khi vào group screen, cập nhật filter dùng `GROUP_CONFIG[quizType]` |

## Thay đổi chính

- `kanjiData`: 27 ký tự N5 chia 3 nhóm (numbers 12, nature 8, people 7), dùng nghĩa tiếng Anh làm `romaji`
- `GROUP_CONFIG`: per quiz type — hiragana/katakana giữ nguyên 4 nhóm cũ, kanji có 4 nhóm mới (all, numbers, nature, people)
- `renderGroupButtons()`: render group buttons động từ `GROUP_CONFIG[quizType]`, thay thế hoàn toàn hardcoded HTML
- Không còn ref nào đến `KANA_GROUP_CONFIG`

## Giả định

- Nghĩa tiếng Anh được dùng làm field `romaji` để tận dụng toàn bộ logic quiz hiện tại mà không cần thay đổi
- Nhóm `all` luôn là key đầu tiên trong mỗi quiz type → được chọn mặc định khi render

## Cách verify

1. Chọn Hiragana/Katakana → group filter vẫn hiển thị đúng 4 nhóm cũ
2. Chọn Kanji → group filter hiển thị: All, Numbers, Nature, People
3. Chọn nhóm Numbers → quiz chỉ ra ký tự số (一〜千)
4. Chọn nhóm Nature → quiz chỉ ra ký tự thiên nhiên (山, 川, ...)
5. Restart → quay về quiz type screen bình thường
6. Toàn bộ flow: quiz type → difficulty → group → settings → quiz → result vẫn hoạt động với cả 3 chế độ

## Vấn đề còn mở

_(không có)_
