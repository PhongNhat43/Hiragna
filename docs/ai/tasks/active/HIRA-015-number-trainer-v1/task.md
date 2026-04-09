# Task: [HIRA-015] Number Trainer V1 (0–99)

## Thông tin

- **ID:** HIRA-015
- **Ngày tạo:** 2026-04-09
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Thêm mode học mới **Number Trainer** — luyện đọc số tiếng Nhật từ 0–99.
Flow độc lập hoàn toàn khỏi kana quiz hiện tại, theo hướng **Learn → Practice → Review**.

Nội dung chia làm 4 bài:
- **Lesson 1:** 0–10 (11 items — các số đơn cơ bản)
- **Lesson 2:** 11–19 (9 items — số teens, cấu trúc じゅう+đơn)
- **Lesson 3:** Hàng chục — 10, 20, 30... 90 (9 items — cấu trúc đơn+じゅう)
- **Lesson 4:** 21–99 trừ bội số 10 (72 items — ghép hai thành phần)

Mỗi bài gồm 3 phase:
1. **Learn** — xem số + reading + breakdown composition (vd: 24 = 20+4 = にじゅう+し)
2. **Practice** — số → chọn cách đọc đúng (forward MCQ 4 lựa chọn)
3. **Reverse** — cách đọc → chọn số đúng (reverse MCQ 4 lựa chọn)
4. **Review** — ôn lại câu sai/chưa chắc từ practice (nếu có)

## Tiêu chí hoàn thành

- [ ] Nút "Luyện Số" xuất hiện trên `mode-selection-screen`
- [ ] Màn hình chọn bài (`nt-lesson-screen`) hiển thị 4 bài với tên + số lượng items
- [ ] Learn phase: hiển thị số + reading + composition, có nút nghe nếu TTS khả dụng
- [ ] Practice forward: số → chọn cách đọc đúng (4 lựa chọn)
- [ ] Practice reverse: cách đọc → chọn số đúng (4 lựa chọn)
- [ ] Review phase chỉ xuất hiện khi có câu sai/chưa chắc
- [ ] Summary screen: tổng kết kết quả, nút chọn bài khác + về trang chủ
- [ ] Back navigation đúng từ mọi màn NT
- [ ] Không phá vỡ kana quiz, Flashcard, Weak Review, Pronunciation Trainer, Progress

## Không thuộc phạm vi

- Counters (một cái, hai cái, ...)
- Ngày tháng, giờ giấc
- Số > 99
- Mic / pronunciation scoring
- Adaptive learning (weighted selection)
- Tracking progress vào Progress Dashboard
- Lesson 4 sub-split (nếu 72 items quá dài có thể điều chỉnh sau V1)
