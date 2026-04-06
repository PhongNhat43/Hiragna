# Result: HIRA-012 — Pronunciation Trainer V1

_Implement: 2026-04-06_

---

## Files đã thay đổi

| File | Loại thay đổi |
|---|---|
| `src/index.html` | +1 nút `#pt-btn` vào mode-selection-screen; +4 màn mới (pt-type, pt-lesson, pt-screen, pt-summary) |
| `src/style.css` | +~180 dòng styles cho tất cả PT elements |
| `src/quiz.js` | +10 PT state fields vào quizState; +`speakJapanese()` helper; +28 PT DOM refs; +8 PT functions; +13 PT event listeners; +4 dòng init block |

---

## Kết quả self-review

- [x] TTS guard — pass: `speakJapanese` line 1: `if (!window.speechSynthesis) return`; ptSpeakBtn hidden khi TTS unavailable
- [x] Learn auto-play — pass: `setTimeout(() => speakJapanese(item.kana), 300)` trong renderPTItem phase='learn'
- [x] Learn → Practice auto-transition — pass: `advancePT` khi `ptPhase==='learn'` và `ptIndex >= ptItems.length` → set phase='practice', shuffle `ptLearnItems.slice()`
- [x] Practice reveal flow — pass: `ptRevealBtn` click → `ptReading.style.display='block'`, `speakJapanese`, ẩn reveal, hiện Biết rồi/Chưa chắc (chỉ cho phase='practice')
- [x] Practice → Choose auto — pass: `advancePT` phase='practice': `if (ptUnsureItems.length > 0)` → phase='choose'
- [x] Practice → Summary khi không có unsure — pass: `else { showPTSummary() }`
- [x] Choose 4 options từ full dataset — pass: pool = `QUIZ_TYPE_CONFIG[quizType].data` (20 items), guard `attempts < pool.length * 4`
- [x] Choose correct/wrong highlight — pass: `handleChooseAnswer` → `.classList.add('correct'/'wrong')` + highlight correct btn nếu sai
- [x] ptUnsureItems tích đúng — pass: `ptUnsureBtn` handler: `if (!ptUnsureItems.find(i => i.kana === item.kana)) ptUnsureItems.push(item)`
- [x] ptWrongItems tích đúng — pass: `handleChooseAnswer`: `if (!ptWrongItems.find(i => i.kana === item.kana)) ptWrongItems.push(item)`
- [x] Summary 3 cases — pass: `wrong=0 && unsure=0` → "Xuất sắc!"; `wrong=0 && unsure>0` → "Tốt lắm!"; `wrong>0` → "Còn X ký tự"
- [x] "Ôn lại" chỉ hiện khi có wrong — pass: `ptRetryBtn.style.display = wrongCount > 0 ? 'inline-block' : 'none'`
- [x] Retry logic — pass: `ptRetryBtn` handler: `ptChooseTotal = ptWrongItems.length`, shuffle ptWrongItems, reset ptWrongItems=[]
- [x] Back navigation — pass: tất cả back handlers wired đúng (5 điểm thoát)
- [x] Lesson chỉ 3 bài — pass: `PT_LESSON_KEYS = ['basic_vowels', 'k_group', 's_group']`, không có 'all'
- [x] 4 PT screens ẩn trong init block — pass: thêm đúng 4 dòng trước `modeSelectionScreen.style.display = 'none'`
- [x] Regression quiz/flashcard/weak-review — pass: PT dùng `pt*` fields riêng biệt, không chạm `mode`, `questionSet`, `score`, `quizComplete`, `incorrectAnswers`

---

## Claim trạng thái

**Đã verify (self-review — code trace):**
- Toàn bộ flow logic: Learn → Practice → Choose → Summary
- TTS guard và fallback (ẩn nút nghe khi unavailable)
- Auto-transition giữa phases
- ptUnsureItems / ptWrongItems accumulation
- Summary 3 cases + retry loop
- Back navigation 5 điểm
- Init block hiding
- Không regression quiz/flashcard/weak-review

**Chờ người dùng verify (manual — cần mở browser):**
1. Mở app → click "Luyện Phát Âm" → vào pt-type-screen ✓
2. Chọn Hiragana → vào pt-lesson-screen với 3 bài ✓
3. Bài 1 Nguyên âm → vào Learn mode → TTS phát âm "あ" ✓
4. "Nghe lại" → TTS replay ✓
5. "Xem cách đọc" → reveal "a" + TTS ✓
6. "Tiếp →" qua hết 5 items → auto vào Practice ✓
7. Practice: "Nghe & Xem đáp án" → reveal + TTS → Biết rồi / Chưa chắc ✓
8. Mark ≥1 "Chưa chắc" → auto vào Choose phase ✓
9. Choose: TTS auto-play, 4 kana options, click đúng/sai → feedback ✓
10. Summary sau Choose → "Ôn lại" nếu có sai ✓
11. Back buttons từ mọi màn ✓
12. Chạy quiz Hiragana bình thường → không bị gãy ✓

---

## Ghi chú

- Kanji excluded khỏi V1 — ghi trong decisions.md khi archive
- Session restore cho PT không implement (reload → về home) — by design
- Progress tracking cho PT không implement — V2+
- TTS rate = 0.8 (chậm hơn default 1.0) để phát âm rõ hơn
