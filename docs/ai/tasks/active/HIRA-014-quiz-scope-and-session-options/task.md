# Task: [HIRA-014] Quiz Scope & Session Options

## Thông tin

- **ID:** HIRA-014
- **Ngày tạo:** 2026-04-07
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Mở rộng quiz setup để người dùng có thể chọn:

1. **Content scope** (cho kana types): preset chọn nhóm nội dung thay vì chọn group thủ công từng hàng.
2. **Session options**: số câu hỏi rõ ràng (10/20/30 thay vì Easy/Medium/Hard) và timer mode.
3. Giữ nguyên behavior settings hiện có (auto-advance, feedback delay, review mistakes).

Yêu cầu tách rõ 3 nhóm cài đặt theo UX gọn, không nhồi vào một màn.

## Tính năng mới

### Content scope (kana only)
| Preset | Items | Mô tả |
|---|---|---|
| Basic only | 46 | あ〜ん + アーン |
| Basic + Dakuten | 71 | + が/ざ/だ/ば/ぱ行 |
| Full kana | 98 | Tất cả |
| Focus: Dakuten/Handakuten | 25 | Chỉ dakuten + handakuten |
| Focus: Yoon | 27 | Chỉ yoon |

### Session options (tất cả types)
- Question count: 10 / 20 / 30
- Timer mode: Off / 10s per question (auto-skip khi hết giờ)

### Behavior settings (giữ nguyên)
- Auto-advance, feedback delay, review mistakes

## Tiêu chí hoàn thành

- [ ] Kana quiz: scope-screen mới hiển thị 3 sections (Content / Questions / Timer)
- [ ] Kana quiz: group-filter-screen và difficulty-screen không còn xuất hiện trong kana flow
- [ ] Kanji/Mixed quiz: scope-screen hiển thị Questions + Timer (không có Content section)
- [ ] Timer mode hoạt động: countdown 10s, auto-skip khi hết giờ
- [ ] Settings screen giữ nguyên 3 behavior settings
- [ ] Back navigation đúng cho flow mới
- [ ] Session restore (F5) hoạt động với scope-screen
- [ ] Không phá vỡ Flashcard, Weak Review, Pronunciation Trainer, Progress

## Không thuộc phạm vi

- Timer cho Flashcard Mode
- Content scope cho Kanji
- Thay đổi timer duration (chỉ 10s trong V1)
- Granular group selection (16 groups riêng lẻ) trong kana flow — bị thay bởi content scope presets
