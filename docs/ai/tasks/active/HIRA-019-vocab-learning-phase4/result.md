# Result: HIRA-019 — Phase 4 Dựng khung chính + Học từ vựng

## Ngày hoàn thành
2026-11-10

## Files thay đổi

| File | Loại | Nội dung |
|---|---|---|
| `src/vocabData.js` | **MỚI** (~330 dòng) | Data layer từ vựng: `VOCAB_DECKS` (Hiragana/Katakana chunk 5 ký tự/bài, 20 bài/bảng), `VOCAB_MINNA_LESSONS` (7 bài × 4 nhóm = 165 từ, chính tả Kanji N5), `VOCAB_KANJI_INFO` (140 Kanji: số nét, bộ thủ, nghĩa) |
| `src/vocabStudy.js` | **MỚI** (~1200 dòng) | Logic + UI: menu chính 6 mục, 9 màn vocab, vòng Học → Luyện → Ôn, SRS, cài đặt |
| `src/index.html` | Sửa (+217 dòng) | Mode-selection thành 6 mục chính + khu "Chức năng hiện có (phase trước)" (id nút legacy giữ nguyên), 9 screens vocab mới + placeholder screen, thêm 2 script tags |
| `src/style.css` | Sửa (+654 dòng) | Style vocab: menu chính, danh sách dọc/ngang, chấm mức thuộc, thẻ lật, practice grid, mobile media query ≤480px |
| `docs/ai/tasks/active/HIRA-019-.../task.md, plan.md` | MỚI | Hồ sơ task |

**Không sửa**: `quiz.js`, `progress.js`, `hiraganaData.js`, `lessonsData.js`, `numberData.js`, `numberTrainer.js`, `dailyLesson.js`. Thứ tự script load: `hiraganaData → progress → numberData → lessonsData → vocabData → quiz → numberTrainer → dailyLesson → vocabStudy` (thêm 2 file mới cuối, không đổi thứ tự cũ).

## Trạng thái màn hình

### Xong (verify bằng browser thật)
1. **Menu chính**: 6 mục đúng thứ tự 1-6; 5 mục ngoài bấm vào hiện placeholder "Chức năng này sẽ làm ở phase sau", quay lại được, không lỗi.
2. **Vocab home**: chọn tầng bảng chữ / Minna, đếm từ đến hạn, "Ôn hôm nay" disabled khi 0.
3. **Danh sách bài**: 20 bài Hira + 20 bài Kata (5 ký tự/bài), 7 bài Minna; counter đã học.
4. **Danh sách từ**: dọc mặc định; ⇅ Dọc/Ngang đổi realtime; horizontal = 1 hàng/unit, lướt ngang.
5. **Chi tiết từ**: TTS + TTS chậm, ví dụ, cách dùng, Kanji card (số nét + bộ thủ + từ liên quan quét runtime), "Đánh dấu là từ khó" (doAt=now, nút đổi text), "Luyện ngay từ này" (inline quiz chấm ngay + giải thích + ghi SRS).
6. **Màn Học**: mặt trước chỉ chữ + 🔊 (đúng mặc định: không đọc, không nghĩa); lật → reading/nghĩa/ví dụ/cách dùng; Đã nhớ/Chưa nhớ → ghi SRS; tự phát âm mặc định bật.
7. **Màn Luyện**: 5 câu, 4 dạng xoay vòng (kana 3 dạng: bỏ fill), chấm ngay, không đổi đáp án được (click sau khi chấm bị từ chối), giải thích = usage; sai → câu retry với dạng KHÁC, cap 7 câu/buổi; sai cả retry + "ôn lỗi sai ngay" bật → mini thẻ Học trước summary; summary đếm đúng từ + số câu thực.
8. **Màn Ôn**: chỉ từ đến hạn (dueAt ≤ now), từ khó lên trước + pickWeighted ưu tiên yếu, cap maxPerSession (mặc định 10); bấm từ → mở đúng màn Học với phase label "🔁 Ôn — học lại từ", chấm Đã nhớ/Chưa nhớ mới quay lại danh sách; từ đã trả lời biến khỏi danh sách (doAt mới); xem không chấm không ảnh hưởng.
9. **Cài đặt**: 9 nhóm thiết lập, lưu `hiragna_vocab_settings`, giữ nguyên sau reload (đã test horizontal survive reload + áp dụng CSS thật).

### Placeholder (đúng spec)
- Học ngữ pháp, Ôn tập, Luyện tập, Theo dõi tiến độ, Tìm kiếm / tra cứu.

## Thuật toán tái dùng + gaps đã xử lý

- ✅ Tái dùng `speakJapanese()` (rate 0.8) — thêm `speakJapaneseSlow()` (rate 0.5) local cho nghe chậm.
- ✅ Tái dùng `updateItemStat()` với bucket mới `'vocab'` trong `hiragna_item_stats` (verify: ghi đúng per item).
- ✅ Tái dùng `pickWeighted()` cho batch ôn — wrap item `{ kana: itemId, _rec }` vì hàm đọc `item.kana`.
- ⚠️ **Gap**: `hiragna_item_stats` không có `dueAt`/`intervalDays` → không đủ cho spaced repetition → thêm key **mới** `hiragna_vocab_srs`: `{ dueAt, intervalDays, lastResult, difficult, updatedAt }`; interval đúng 1→3→7→14→30 ngày, sai = +10 phút và reset. Key cũ không đụng.
- ⚠️ **Gap**: không có stroke data (SVG) trong dự án → Kanji hiển thị số nét + bộ thủ + nghĩa + từ liên quan, KHÔNG có thứ tự nét trực quan.

## Bug phát hiện & sửa trong lúc verify

1. **`Number('horizontal') = NaN`** → bấm "Ngang"/"Dọc" trong Cài đặt ghi `listOrientation: null`. Sửa: parse chỉ khi numeric, chuỗi giữ nguyên; thêm guard bỏ giá trị null khi merge với default (chống dữ liệu hỏng đã lưu).
2. **`vdQuiz.innerHTML = ''` trong openDetail xóa cấu trúc tĩnh** (vd-quiz-question/options/explain nằm bên trong #vd-quiz) → "Luyện ngay từ này" die sau lần mở chi tiết thứ 2. Sửa: reset từng phần con thay vì xóa sạch container.

## Đã verify bằng cách nào

- `node --check` cả 2 file JS mới: pass.
- Data check bằng node: 165 từ / 7 bài / unit 5-7 / không trùng id / đủ info cho mọi Kanji dùng trong từ.
- Chạy thật trong Chromium qua `python3 -m http.server`: toàn bộ flow trên (menu → placeholder → học → luyện 3 kịch bản: all-correct / sai-1-retry-đúng / sai-2-retry-sai → mini thẻ → ôn → cài đặt → reload → Minna detail → inline quiz → fill-type) — **console errors: 0** trong suốt phiên.
- `bash scripts/verify.sh`: 36 OK / 0 MISSING.
- Legacy buttons: Chế Độ Quiz, Luyện Số, Học Theo Bài mở đúng màn cũ, không lỗi.

## Chờ user manual verify

1. Âm thanh TTS trên máy thật (browser headless test chỉ xác nhận nút không lỗi, không nghe được giọng).
2. Trải nghiệm mobile thật (CSS ≤480px đã parse đúng nhưng chưa xem trên điện thoại).
3. Cảm nhận nội dung: nghĩa/cách dùng/ví dụ của 165 từ Minna là bản viết mới nâng cấp từ lessonsData (kana → Kanji N5), nên đọc lướt để chỉnh câu chữ nếu muốn.

## Việc còn lại (không thuộc scope task này)

- 5 mục placeholder: Học ngữ pháp, Ôn tập, Luyện tập, Theo dõi tiến độ, Tìm kiếm / tra cứu → phase sau.
- Stroke order SVG cho Kanji → cần stroke data bên ngoài.
- "Ôn cả từ đã thuộc lâu" hiện gộp từ mastered vào pool bất kể dueAt — đang mặc định TẮT; cân nhắc tách tab riêng khi làm phase sau.
- N4/N3 và phần Kanji sâu hơn → phase sau.
