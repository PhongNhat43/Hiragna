# Plan: HIRA-019 — Phase 4 Khung chính + Học từ vựng

## Files thay đổi

| File | Thay đổi |
|---|---|
| `src/vocabData.js` | **MỚI** — data từ vựng 7 bài Minna dạng Kanji N5 (unit 5-7 từ), info Kanji (số nét, bộ thủ), deck bảng chữ chunk 5 |
| `src/vocabStudy.js` | **MỚI** — logic + UI vòng Học → Luyện → Ôn, SRS, settings |
| `src/index.html` | Mode-selection thành 6 mục chính (+ khu phụ chức năng hiện có), thêm 9 screens vocab, thêm 2 script tags cuối |
| `src/style.css` | Style mới cho vocab screens + menu chính (không đụng style cũ) |

Không sửa: `quiz.js`, `progress.js`, `hiraganaData.js`, `lessonsData.js`, `numberData.js`, `numberTrainer.js`, `dailyLesson.js`.

## Kiến trúc theo đúng pattern hiện có

- Script load order: thêm `vocabData.js` (sau `lessonsData.js`), `vocabStudy.js` (cuối). Không đổi thứ tự script cũ.
- State cục bộ `vsState` trong `vocabStudy.js` (pattern như `ntState`/`dlState`), tái dùng `speakJapanese()`, `loadItemStats()`, `updateItemStat()`, `pickWeighted()` từ layer có sẵn.
- localStorage key mới: `hiragna_vocab_settings` (thiết lập), `hiragna_vocab_srs` (lịch ôn per item). Giữ nguyên 4 key cũ.

## Data (`vocabData.js`)

- `VOCAB_DECKS`: bảng chữ Hiragana / Katakana — 98 ký tự mỗi bảng, chunk 5 ký tự/bài tại runtime (≈20 bài mỗi bảng).
- `VOCAB_MINNA_LESSONS`: 7 bài Minna, mỗi bài 4 unit × 5-7 từ. Mỗi từ: `{ id, jp (Kanji N5), reading, meaning, category, usage, example {jp, vi}, kanji[] }` — nội dung bám theo `lessonsData` hiện có, nâng chính tả sang Kanji.
- `VOCAB_KANJI_INFO`: `{ char: { strokes, radical, meaning } }` cho mọi Kanji xuất hiện. Từ liên quan dùng chung Kanji tính runtime (quét toàn bộ vocab). Lưu ý: không có stroke data trực quan (SVG) → hiển thị số nét + bộ thủ + hướng viết chuẩn text. Ghi thiếu vào result.md.

## Flow UI (screens mới)

```
mode-selection (6 mục chính)
  ├─ Học từ vựng → vocab-home (chọn tầng: Bảng chữ Hira/Kata, Minna 7 bài + Ôn hôm nay + Cài đặt)
  │    └─ vocab-lesson-list (danh sách bài)
  │         └─ vocab-list (các unit trong bài; dọc = 1 dòng/từ, ngang = 1 hàng/unit)
  │              ├─ vocab-detail (chi tiết từ: TTS + chậm, ví dụ, cách dùng, Kanji, 3 nút hành động)
  │              ├─ vocab-learn (thẻ lật: Đã nhớ / Chưa nhớ) ← cũng dùng cho ôn & lỗi sai
  │              ├─ vocab-practice (5→7 câu, 4 dạng xoay vòng, timer tuỳ chọn)
  │              └─ vocab-review (danh sách đến hạn, cap 10, pickWeighted ưu tiên yếu)
  ├─ 5 mục còn lại → placeholder-screen ("Chức năng này sẽ làm ở phase sau")
  └─ khu phụ: các chức năng hiện có (Quiz, Flashcard, Ôn Điểm Yếu, Tiến Trình, Phát Âm, Số, Học Theo Bài)
```

## Nghiệp vụ

### Màn Học
- Mặt trước: chữ Nhật + nút nghe (mặc định không đọc, không nghĩa). Lật: reading + nghĩa + ví dụ + usage.
- Đã nhớ / Chưa nhớ → cập nhật SRS. 3 toggle: auto-TTS (bật), hiện đọc mặt trước (tắt), hiện ví dụ mặt trước (tắt).
- Điều kiện mở Luyện: unit có ≥1 từ đã học (có SRS entry).

### Màn Luyện
- 5 câu (từ pool unit 5-7), dạng xoay vòng: jp→vi, vi→jp, nghe→chữ, điền từ vào câu (bảng chữ: 3 dạng đầu).
- Sai → lặp cuối buổi, tổng ≤ 7. Chấm ngay + giải thích = usage. Guard chống đổi đáp án.
- Timer 10s/câu (mặc định tắt), hết giờ = sai. Auto-next (bật). Ôn lỗi sai ngay (bật) → mini thẻ; ngược lại → dueAt = now cho màn Ôn.

### Màn Ôn + SRS (`hiragna_vocab_srs`)
- Entry: `{ dueAt, intervalDays, lastResult, difficult }`. Đúng: interval 1→3→7→14→30 ngày. Sai: dueAt = +10 phút, interval reset.
- Mức thuộc (chấm): xám = mới, vàng = đang học (<7 ngày), xanh = thuộc (≥7 ngày).
- Danh sách đến hạn: dueAt ≤ now; cap maxPerSession (mặc định 10); chọn batch bằng `pickWeighted` lặp (loại item đã pick mỗi vòng); từ khó flag lên trước.
- Bấm từ → mở màn Học của từ đó, bấm Đã nhớ/Chưa nhớ mới quay về danh sách. Xem không chấm → không cập nhật.

## Verify
- `bash scripts/verify.sh` (nếu áp dụng được cho docs task)
- Mở qua browser preview: chạy qua tiêu chí nghiệm thu 7 mục, kiểm console sạch, kiểm mobile viewport.
