# Glossary

## Thuật ngữ tiếng Nhật

- **kana**: Ký tự Nhật (hiragana và katakana)
- **hiragana**: Bộ ký tự viết tay (あ い う...)
- **katakana**: Bộ ký tự góc cạnh (ア イ ウ...)
- **kanji**: Ký tự Hán-Nhật (山 川 人...)
- **romaji**: Phiên âm Latin của ký tự Nhật (a, i, u, ka, shi...)

---

## Thuật ngữ codebase

- **quizState**: Object duy nhất lưu toàn bộ trạng thái quiz
- **questionSet**: Mảng data đang dùng cho phiên quiz (sau khi filter theo group)
- **QUIZ_TYPE_CONFIG**: Map quiz type → dataset
- **GROUP_CONFIG**: Map quiz type → nhóm ký tự tương ứng (per type)
- **DIFFICULTY_CONFIG**: Map difficulty → số câu hỏi
- **isAnswered**: Flag ngăn submit câu trả lời nhiều lần
- **incorrectAnswers**: Mảng câu sai và skip — dùng cho Review Mistakes
- **questionHistory**: Mảng toàn bộ câu đã trả lời — dùng cho Review All
- **reviewIndex**: Con trỏ vị trí hiện tại trong review mode
- **selectedGroup**: Group ID đang được chọn trong group filter screen
- **autoAdvance**: Bật/tắt tự động chuyển câu sau khi trả lời
- **feedbackDelay**: Thời gian hiển thị feedback trước khi chuyển câu (ms)
- **reviewEnabled**: Bật/tắt chế độ Review Mistakes sau quiz
