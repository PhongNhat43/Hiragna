# Task: [HIRA-006] Adaptive Review System

## Ngày tạo
2026-04-02

## Mô tả
Thêm hệ thống weak items và chế độ Weak Review để người dùng ôn lại các ký tự hay bị sai.

## Phân tích overlap với HIRA-005

Một phần yêu cầu đã được hoàn thành trong HIRA-005:

| Yêu cầu | Trạng thái |
|---|---|
| Lưu learning progress vào localStorage | **Done (HIRA-005)** |
| Theo dõi total quizzes, questions, correct, wrong, accuracy | **Done (HIRA-005)** |
| Theo dõi progress theo quiz type | **Done (HIRA-005)** |
| Reset Progress | **Done (HIRA-005)** |
| Progress Dashboard | **Done (HIRA-005) — cần enhance** |
| Ghi weak items khi sai / skip | **NEW** |
| Weak Review Mode | **NEW** |
| Dashboard hiển thị số weak items | **NEW — enhance HIRA-005 dashboard** |
| Reset Weak Items | **NEW** |

Task này chỉ làm phần NEW. Không rebuild những gì đã có.

## Yêu cầu thực tế của task này

1. Khi người dùng trả lời sai hoặc skip → ghi kana vào weak items của quiz type đó
2. Khi trả lời đúng → nếu kana đó đang là weak item → xóa khỏi weak items (adaptive)
3. Weak items lưu vào localStorage, còn sau reload
4. Thêm "Weak Review" mode — chỉ quiz các ký tự đang là weak items
5. Weak Review hoạt động với Hiragana, Katakana, Kanji
6. Progress Dashboard: thêm weak items count theo quiz type
7. Thêm nút Reset Weak Items (riêng với Reset Progress)

## Phạm vi (scope)

**Files thay đổi:**
- `src/progress.js` — thêm weak items functions
- `src/quiz.js` — sửa handleAnswer + skipBtn; thêm startWeakReview(), mode branching
- `src/index.html` — thêm "Weak Review" button trên mode-selection-screen
- `src/style.css` — style cho button mới, empty state

**Files không thay đổi:**
- `src/hiraganaData.js`

**Ngoài scope:**
- Flashcard Mode weak items tracking (v1)
- Spaced repetition / scheduling (quá complex cho v1)
- Weak items per group (chỉ per quiz type trong v1)

## Task size
Lớn — 4 files, mode mới trong quizState, localStorage key mới, flow mới cần xử lý edge case (empty weak items).
