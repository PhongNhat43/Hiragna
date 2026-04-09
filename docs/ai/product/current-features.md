# Current Features

_Cập nhật lần cuối: 2026-04-07 (sau HIRA-013)_

---

## Learning Modes

| Mode | Mô tả |
|---|---|
| Quiz Mode | Trắc nghiệm 4 lựa chọn, có scoring và review |
| Flashcard Mode | Xem ký tự, tự đánh giá knew it / need review |

---

## Quiz Types (dùng chung cho cả hai mode)

| Type | Dataset | Câu hỏi hiển thị | Đáp án |
|---|---|---|---|
| Hiragana | 98 ký tự (46 basic + 25 dakuten/handakuten + 27 yoon) | Ký tự kana | Romaji |
| Katakana | 98 ký tự (46 basic + 25 dakuten/handakuten + 27 yoon) | Ký tự kana | Romaji |
| Kanji | 27 ký tự N5 | Ký tự kanji | Nghĩa tiếng Anh |

---

## Group Filter (dùng chung cho cả hai mode)

Mỗi quiz type có nhóm riêng:

**Hiragana / Katakana** (16 groups mỗi type):
- All
- Basic vowels, K-group, S-group, T-group, N-group, H-group, M-group, Y-group, R-group, W-group+N
- GA-group, ZA-group, DA-group, BA-group, PA-group (dakuten/handakuten)
- Yoon (basic), Yoon (voiced)

**Kanji:**
- All, Numbers (一〜千), Nature (山〜月), People (人〜母)

Group buttons được render động theo quiz type đã chọn.

---

## Quiz Mode — Difficulty

| Level | Số câu |
|---|---|
| Easy | 10 |
| Medium | 15 |
| Hard | 20 |

## Quiz Mode — Settings

| Setting | Giá trị | Mặc định |
|---|---|---|
| Auto-advance | On / Off | On |
| Feedback delay | 500ms / 800ms / 1200ms | 800ms |
| Review mistakes | On / Off | On |

## Quiz Mode — Trong Quiz

- Progress bar + question counter (X / Total)
- Score tracking (cập nhật realtime)
- Answer highlighting: đúng = xanh, sai = đỏ + hiển thị đáp án đúng màu xanh
- Skip button: bỏ qua, không tính điểm
- Next button: chỉ hiển thị khi autoAdvance = Off
- Câu hỏi được chọn theo **adaptive weighted selection**: item yếu (accuracy thấp) xuất hiện nhiều hơn, item vừa gặp bị giảm tạm, item đã thành thạo vẫn được ôn duy trì (weight floor 0.05)

## Quiz Mode — Sau Quiz

- **Review Mistakes**: hiển thị nếu `reviewEnabled = true` và có câu sai/skip
- **Review All**: luôn hiển thị, kèm status Correct/Incorrect từng câu
- **Restart**: về màn hình mode selection

---

## Flashcard Mode

- Hiển thị 1 ký tự mỗi lần (shuffle theo group đã chọn)
- Nút "Show Answer" → hiện đáp án
- Sau khi xem: "I knew it" hoặc "Need review"
- Cuối session: summary (Total / I knew it / Need review)
- Restart: về màn hình mode selection

---

## Learning Progress Dashboard

- Nút "View Progress" trên mode-selection-screen → mở progress-screen
- Thống kê **Overall**: Quizzes, Questions, Correct, Wrong, Accuracy %
- Thống kê **By Type**: breakdown riêng cho Hiragana / Katakana / Kanji (Quizzes, Correct, Wrong, Accuracy, Weak items count)
- Dữ liệu lưu vào `localStorage` (key: `hiragna_progress`), còn sau khi reload trang
- Progress cập nhật tự động sau mỗi Quiz Mode completion
- Nút "Reset Progress" (có confirm dialog) xóa toàn bộ progress stats
- Nút "Reset Weak Items" (có confirm dialog) xóa toàn bộ weak items
- Nút "Back" quay về mode-selection-screen
- Flashcard Mode không track trong Progress Dashboard (v1)

---

## Weak Items & Adaptive Review

- Khi trả lời **sai** hoặc **skip** → ký tự đó được ghi vào weak items của quiz type tương ứng
- Khi trả lời **đúng** → nếu ký tự đang là weak item → tự động xóa khỏi danh sách (adaptive)
- Weak items lưu vào `localStorage` (key: `hiragna_weak_items`), còn sau khi reload trang
- Áp dụng trong mọi quiz mode (Quiz Mode và Weak Review)
- **Per-item stats** (từ HIRA-013): mỗi ký tự lưu `{correct, wrong, lastSeenTs, streak}` vào `localStorage` (key: `hiragna_item_stats`). Dùng cho adaptive weighted selection. Không áp dụng cho mixed mode (V1).
- Reset Progress xóa cả progress stats lẫn item stats

### Weak Review Mode

- Nút "Weak Review" trên mode-selection-screen → chọn quiz type → quiz chỉ các ký tự yếu
- Bỏ qua difficulty, group filter, settings screens
- Nếu không có weak items cho quiz type đó → alert thân thiện, không vào quiz
- Nếu weak items < 4 → options lấy từ full dataset của quiz type (câu hỏi vẫn là weak items)
- Flashcard Mode không track weak items (v1)
