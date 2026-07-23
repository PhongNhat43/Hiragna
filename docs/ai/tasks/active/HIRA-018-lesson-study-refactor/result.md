# Result: [HIRA-018] Refactor Học Mỗi Ngày thành Học Theo Bài

## Trạng thái

Done

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/index.html` | Đổi copy UI sang `Học Theo Bài`, cập nhật script load `lessonsData.js`, giữ screen ids để tránh ảnh hưởng lan |
| `src/style.css` | Bổ sung style overview phân cấp theo lesson/section |
| `src/progress.js` | Giữ persistence key cũ nhưng semantics chuyển sang progress theo `sectionId` |
| `src/lessonsData.js` | Tạo dataset mới theo `lesson -> sections -> vocabularies` cho 7 bài đầu |
| `src/dailyLesson.js` | Viết lại state và flow học theo section, bỏ kanji, bỏ chia đôi vocab, thêm distractor algorithm quét ngược |
| `docs/ai/product/current-features.md` | Ghi nhận learning mode mới |
| `docs/ai/product/current-flows.md` | Ghi nhận flow Học Theo Bài |
| `docs/ai/history/changelog.md` | Ghi nhận thay đổi task |

---

## Thay đổi chính

Feature cũ `Học Mỗi Ngày` đã được refactor thành `Học Theo Bài`, dùng data model `lesson -> section -> vocabularies`. Mỗi section là đơn vị học/persistence mới, trạng thái lưu theo `sectionId`. Overview nay hiển thị theo bài lớn, bên trong có các section con và badge trạng thái riêng.

Learn flow được rút gọn thành 2 pha chính:
- `learn-vocab`: học lần lượt toàn bộ từ trong section
- `practice`: quick practice cùng format `jp -> meaning`, `secondary = reading`

Thuật toán distractor mới không dùng placeholder hard-code. Khi section hiện tại không đủ từ để sinh 3 đáp án nhiễu khác nhau, hệ thống quét ngược các section trước trong cùng lesson để bổ sung đáp án.

---

## Self-review

- [x] Dataset mới đủ 7 bài và có section cuối `lesson07` chỉ 6 từ để test fallback
- [x] Flow mới bỏ hoàn toàn kanji và `learn-vocab-a/b`
- [x] Progress counter dùng tổng số từ thực tế của section
- [x] Persistence set `in_progress` khi vào section và `completed` sau practice
- [x] Script order đổi sang `lessonsData.js` trước `dailyLesson.js`
- [x] Không chạm `src/quiz.js`

## Verify

- Syntax check JS cốt lõi sau refactor
- Đọc logic state transition và algorithm distractor trên diff

## Còn chờ manual verify

- Mở app và đi hết flow section thường
- Mở `lesson07 / sectionB` để xác nhận distractor fallback đủ 4 lựa chọn
- Reload sau completion để xác nhận badge persisted đúng
