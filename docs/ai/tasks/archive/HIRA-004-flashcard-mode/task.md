# Task: [HIRA-004] Flashcard Mode

## Thông tin

- **ID:** HIRA-004
- **Ngày tạo:** 2026-03-31
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Thêm Flashcard Mode như một chế độ học song song với Quiz Mode hiện tại.
Người dùng chọn chế độ ngay từ đầu flow. Flashcard tái sử dụng quiz type, group filter,
và dataset hiện có — không tạo engine riêng.

Trong flashcard session: hiển thị 1 ký tự, người dùng tự đánh giá (knew it / need review),
cuối session hiển thị summary đơn giản.

## Tiêu chí hoàn thành

- [ ] Màn hình chọn mode xuất hiện đúng vị trí trong flow (trước quiz type)
- [ ] Chọn Quiz Mode → flow hiện tại không thay đổi
- [ ] Chọn Flashcard Mode → đi qua quiz type → group filter → flashcard session
- [ ] Flashcard hiển thị 1 ký tự, có nút "Show Answer"
- [ ] Sau khi show answer: có nút "I knew it" và "Need review"
- [ ] Cuối session: summary (total, knew it, need review)
- [ ] Hoạt động với Hiragana, Katakana, Kanji
- [ ] Restart từ flashcard quay về màn hình mode selection
- [ ] Không phá vỡ Quiz Mode hiện tại

## Không thuộc phạm vi

- Không có spaced repetition hay algorithm học thông minh
- Không lưu progress giữa các session
- Không thêm difficulty screen cho flashcard (không cần)
- Không thêm settings screen cho flashcard
