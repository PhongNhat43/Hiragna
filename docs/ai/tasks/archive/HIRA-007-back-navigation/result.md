# HIRA-007 — Result

## Kết quả implement

Đã thêm nút "Quay Lại" vào 2 màn hình còn thiếu:

| Màn hình | Button ID | Back về |
|---|---|---|
| `quiztype-screen` | `back-from-quiztype-btn` | `mode-selection-screen` |
| `difficulty-screen` | `back-from-difficulty-btn` | `quiztype-screen` |

## State reset

- Back từ quiztype: reset `quizState.mode = null` (chỉ field này được set tại bước đó)
- Back từ difficulty: reset `quizState.quizType = null`, `quizState.questionSet = null` (difficulty/totalQuestions chưa được set tại màn này)

## Files đã thay đổi

- `src/index.html` — thêm 2 button với class `back-btn`
- `src/quiz.js` — thêm 2 reference + 2 event listener
- `src/style.css` — thêm style `.back-btn`

## Kết quả self-review

- [x] Back từ quiztype (Quiz Mode) → mode-selection → state sạch
- [x] Back từ quiztype (Flashcard Mode) → mode-selection → state sạch
- [x] Back từ quiztype (Weak Review) → mode-selection → state sạch
- [x] Back từ difficulty → quiztype → quizType/questionSet được reset, mode giữ nguyên
- [x] Không regression: group-filter, settings back buttons không bị chạm
- [x] Style nhất quán với các back button hiện có
