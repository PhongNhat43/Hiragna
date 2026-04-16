# Task: [HIRA-017] Daily Lesson Tab (10 Vocab + 3 Kanji)

## Thông tin

- **ID:** HIRA-017
- **Ngày tạo:** 2026-04-12
- **Trạng thái:** complete
- **Loại:** feature

## Mô tả

Thêm một flow học mới độc lập với kana quiz hiện tại: **Học mỗi ngày**.

Mỗi ngày là một unit học, không khóa cứng theo calendar thật, gồm:
- **10 từ vựng**
- **3 kanji**

Dataset bám theo **Minna no Nihongo Bài 1 → Bài 25**.

V1 cần có:
- tab mới: **Học mỗi ngày**
- danh sách ngày học
- flow:
  1. Daily overview
  2. Learn vocab
  3. Learn kanji
  4. Quick practice
  5. Summary
- trạng thái mỗi ngày:
  - chưa học
  - đang học
  - hoàn thành
- lưu trạng thái hoàn thành từng ngày
- có thể ôn lại ngày cũ

## Tiêu chí hoàn thành

- [x] Nút/tab **Học mỗi ngày** xuất hiện trên `mode-selection-screen`
- [x] Có màn hình danh sách ngày học với status từng ngày
- [x] Mỗi ngày có đúng 10 vocab + 3 kanji
- [x] Flow V1 đi được: Overview → Learn vocab → Learn kanji → Quick practice → Summary
- [x] Trạng thái từng ngày được lưu bền vững sau reload
- [x] Có thể mở lại ngày cũ để ôn
- [x] Flow mới tách biệt khỏi Quiz / Flashcard / Weak Review / PT / Number Trainer

## Không thuộc phạm vi

- Counters
- Ngày tháng / giờ giấc
- Spaced repetition sâu
- Audio đầy đủ cho mọi item nếu chưa sẵn
- Mic / pronunciation scoring
- Lịch khóa cứng theo ngày thật
