# Verification Checklist

## Quiz Type Selection

- [ ] Hiragana, Katakana, Kanji buttons hiển thị và clickable
- [ ] Chọn type → chuyển sang difficulty screen

## Difficulty Selection

- [ ] Easy (10 câu), Medium (15 câu), Hard (20 câu)
- [ ] Chọn difficulty → chuyển sang group filter screen

## Group Filter

- [ ] Hiragana/Katakana: hiển thị All, Basic vowels, K-group, S-group
- [ ] Kanji: hiển thị All, Numbers, Nature, People
- [ ] Chọn group → active state đúng
- [ ] Chọn nhóm cụ thể → quiz chỉ ra câu hỏi từ nhóm đó
- [ ] Click Next → chuyển sang settings screen

## Settings Screen

- [ ] Auto-advance On/Off clickable, active state đúng
- [ ] Feedback delay 500ms/800ms/1200ms clickable
- [ ] Review mistakes On/Off clickable
- [ ] Start Quiz → bắt đầu quiz

## Trong Quiz

- [ ] Câu hỏi hiển thị đúng ký tự theo quiz type và group đã chọn
- [ ] 4 đáp án xuất hiện, có đúng 1 đáp án đúng
- [ ] Chọn đúng: highlight xanh
- [ ] Chọn sai: highlight đỏ + hiển thị đáp án đúng màu xanh
- [ ] autoAdvance On: tự động chuyển câu sau feedbackDelay
- [ ] autoAdvance Off: hiện nút Next sau feedbackDelay
- [ ] Click nhiều lần không submit nhiều lần
- [ ] Skip button hoạt động, không cộng điểm
- [ ] Progress bar và counter cập nhật đúng
- [ ] Score cập nhật đúng

## Kết thúc Quiz

- [ ] Hiển thị final score đúng
- [ ] "Review Mistakes" xuất hiện nếu reviewEnabled = true và có câu sai/skip
- [ ] "Review All" luôn xuất hiện
- [ ] Review Mistakes: hiển thị kana, đáp án người dùng, đáp án đúng
- [ ] Review All: hiển thị kana, đáp án người dùng, đáp án đúng, status Correct/Incorrect
- [ ] Navigate Previous/Next trong cả hai review mode hoạt động
- [ ] Restart → quay về quiz type screen, state reset hoàn toàn
- [ ] Sau restart: reviewBtn và reviewAllBtn ẩn đi
