# HIRA-009 — Mixed Quiz Type (Phase 1)

## Mô tả
Thêm quiz type "Hỗn Hợp" cho phép người dùng chọn gộp nhiều dataset (hiragana, katakana, kanji) thành một questionSet duy nhất. Dùng lại quiz/flashcard engine hiện có. Phase 1 chưa xử lý group filter phức tạp — chỉ dùng "Tất Cả".

## Scope

### Trong scope (phase 1)
- Thêm nút "Hỗn Hợp" vào quiztype-screen
- Màn chọn loại kết hợp (`mix-type-screen`): chọn ≥2 types từ hiragana/katakana/kanji
- Build questionSet bằng cách concat datasets đã chọn
- Dùng lại quiz engine và flashcard engine hiện có
- Group filter: bỏ qua, dùng "Tất Cả" mặc định
- Progress tracking: thêm bucket `mixed` vào byType
- Weak items: không track cho mixed (skip addToWeakItem/removeFromWeakItem khi quizType === 'mixed')
- Weak Review mode: mixed không hỗ trợ, hiện alert

### Ngoài scope (phase 2+)
- Group filter phức tạp cho mixed
- Weak item tracking theo từng sub-type trong mixed
- Mix có thể gộp với group filter

## Files bị ảnh hưởng
- `src/hiraganaData.js` — thêm mixed vào QUIZ_TYPE_CONFIG và GROUP_CONFIG
- `src/progress.js` — thêm mixed bucket vào getDefaultProgress() và getDefaultWeakItems()
- `src/index.html` — thêm nút Mixed vào quiztype-screen, thêm mix-type-screen
- `src/style.css` — style cho mix-type-screen
- `src/quiz.js` — flow mới, mixed dataset builder, skip weak items cho mixed

## Overlap với tính năng hiện có
- `QUIZ_TYPE_CONFIG`: thêm entry `mixed` — data là dynamic, khác với 3 types hiện tại
- `GROUP_CONFIG`: thêm `mixed: { all }` — đủ để group-filter không crash nếu cần
- `quizState.quizType`: sẽ có giá trị `'mixed'` — cần guard ở weak item calls
- Session persistence: mix-type-screen cần được save/restore
- Progress dashboard: cần render thêm row Hỗn Hợp
