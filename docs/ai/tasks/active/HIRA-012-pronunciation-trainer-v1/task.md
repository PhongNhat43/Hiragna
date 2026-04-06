# HIRA-012 — Pronunciation Trainer V1

## Mô tả
Thêm một learning flow mới "Luyện Phát Âm" theo mô hình Learn → Practice → Review.
User nghe phát âm (qua Web Speech API / TTS), nhại lại, tự đánh dấu những ký tự chưa chắc để ôn lại.

## Scope

### Trong scope (V1)
- Nút "Luyện Phát Âm" trên mode-selection-screen
- Chọn loại: Hiragana / Katakana (Kanji **không** trong V1)
- Chọn nhóm: dùng lại GROUP_CONFIG (All / Basic vowels / K-group / S-group)
- Sub-mode chọn: Learn / Practice / Review
- **Learn**: hiện ký tự, auto-play TTS, "Nghe lại", "Xem cách đọc" (reveal romaji), "Tiếp theo"
- **Practice**: hiện ký tự, user nhẩm đọc, "Nghe & Xem đáp án" → TTS + romaji, rồi "Biết rồi" / "Chưa chắc"
- **Review**: chỉ ôn các item đã đánh "Chưa chắc" trong Practice
- TTS: Web Speech API (`SpeechSynthesis`), `lang: 'ja-JP'`, speak kana character
- Fallback nếu TTS không available: ẩn nút nghe, vẫn show romaji bình thường
- Summary screen sau mỗi Practice / Review session (Total / Biết rồi / Chưa chắc)
- Không track progress vào localStorage trong V1
- Không session restore cho PT (reload → về home)

### Ngoài scope (V2+)
- Mic input / speech scoring
- Kanji pronunciation training
- Persistent PT progress (localStorage)
- Session restore cho PT screens
- Chunking "All" thành batch nhỏ 3-5 items
- Adaptive ordering

## Files bị ảnh hưởng
- `src/index.html` — 5 màn mới + 1 nút mới trên mode-selection-screen
- `src/style.css` — styles cho PT screens
- `src/quiz.js` — PT flow handlers, TTS logic, PT state fields

## Files KHÔNG bị ảnh hưởng
- `src/hiraganaData.js` — data shape `{ kana, romaji }` đã đủ, không cần thay đổi
- `src/progress.js` — không track PT trong V1

## Overlap với tính năng hiện có
- `quizState`: thêm 5 fields mới (`ptSubMode`, `ptItems`, `ptIndex`, `ptReviewItems`, `ptAnswerShown`) — không chạm fields hiện có
- `GROUP_CONFIG`: đọc (không ghi) để render PT group buttons
- `QUIZ_TYPE_CONFIG`: đọc để lấy data (không ghi)
- `mode-selection-screen`: thêm 1 nút mới — không sửa logic hiện có
- PT screens hoàn toàn tách biệt khỏi quiz/flashcard/weak-review flow
