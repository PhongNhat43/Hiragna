# Plan: HIRA-012 — Pronunciation Trainer V1

_Cập nhật: 2026-04-06 — Revise theo UX feedback_

## Thông tin
- **Task size:** lớn (3 files, flow mới hoàn toàn, 4 màn mới, state mới)
- **Docs impact:** có — current-features.md, current-flows.md, architecture.md, changelog.md, decisions.md

---

## Audit — kết quả đọc code

### Data shape
```js
// hiragana & katakana
{ kana: "あ", romaji: "a" }   // romaji = cách đọc → dùng được cho TTS + hiển thị

// kanji
{ kana: "一", romaji: "one" } // romaji = nghĩa tiếng Anh → KHÔNG phải pronunciation
```
→ **Kanji excluded khỏi V1**: data shape không phù hợp cho luyện phát âm. Sẽ làm V2+ khi có field `reading` riêng.  
→ **Hiragana + Katakana**: `kana` đủ để TTS phát âm chuẩn qua Web Speech API.

### TTS
- `window.speechSynthesis` available trên Chrome/Safari/Firefox
- `utterance.lang = 'ja-JP'`, `rate = 0.8` → phát âm tự nhiên
- Speak kana trực tiếp: `speak('あ')` → đúng âm "a"
- Không cần audio files

### Navigation pattern
- Screens = `div.quiz-container`, toggle `style.display = 'flex'/'none'`
- Event wired trong một `DOMContentLoaded` block trong `quiz.js`
- Init block cuối: ẩn hết screens → `restoreSession()`
- Screens mới cần được ẩn trong init block

### Files không thay đổi
- `hiraganaData.js` — data shape đã đủ
- `progress.js` — không track PT trong V1

---

## Flow UX (revised)

```
mode-selection-screen
  → [Luyện Phát Âm]
  → pt-type-screen        ← chọn bảng: Hiragana / Katakana
  → pt-lesson-screen      ← chọn bài: Bài 1 Nguyên âm / Bài 2 Nhóm K / Bài 3 Nhóm S
                             (5 ký tự/bài, không có "Tất Cả")
  [Tap vào bài → AUTO vào Learn]
  
  PHASE 1 — Learn (pt-screen, phase='learn')
    item by item: auto-play TTS, "Nghe lại", "Xem cách đọc" (reveal romaji), "Tiếp →"
  [Last item "Tiếp →" → AUTO sang Phase 2]
  
  PHASE 2 — Practice: Nhìn → Tự đọc → Reveal (pt-screen, phase='practice')
    item by item: hiện ký tự, "Nghe & Xem đáp án" → TTS + romaji, "Biết rồi ✓" / "Chưa chắc ?"
    → item "Chưa chắc" → push vào ptUnsureItems
  [Last item → nếu ptUnsureItems > 0 → AUTO sang Phase 3; else → Summary]
  
  PHASE 3 — Practice: Nghe → Chọn ký tự (pt-screen, phase='choose')
    chỉ ptUnsureItems, auto-play TTS, chọn kana đúng từ 4 options
    → sai → push vào ptWrongItems
  [Last item → Summary]
  
  → pt-summary-screen
    - Hiển thị: biết/chưa chắc (Phase 2) + đúng/sai (Phase 3 nếu có)
    - Nếu ptWrongItems > 0 → nút "Ôn lại" → loop Phase 3 với ptWrongItems
    - "Chọn bài khác" → pt-lesson-screen
    - "Về Trang Chủ" → mode-selection-screen
```

### Empty state
- Nếu Phase 2 không có item "Chưa chắc" → bỏ qua Phase 3, vào Summary với "Tuyệt vời! Không có gì cần luyện thêm."
- Nếu Phase 3 không có item sai → Summary clean, không có nút "Ôn lại"
- Review "Ôn lại" từ Summary: chạy lại Phase 3 với ptWrongItems; khi hết → Summary mới

---

## Lesson design

Dùng GROUP_CONFIG[type] nhưng:
- Loại bỏ key `all` — không phù hợp với session ngắn
- Đổi tên hiển thị thành lesson label có số thứ tự và item count

| Key | Label PT | Items |
|---|---|---|
| `basic_vowels` | Bài 1 — Nguyên âm | 5 (a i u e o) |
| `k_group` | Bài 2 — Nhóm K | 5 (ka ki ku ke ko) |
| `s_group` | Bài 3 — Nhóm S | 5 (sa shi su se so) |

Lesson label và item count được render động từ GROUP_CONFIG + data, không hardcode.

---

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| TTS không available / không có Japanese voice | Trung bình | Guard `!window.speechSynthesis` → ẩn nút nghe, vẫn hoạt động với romaji visible |
| Phase 3 options pool nhỏ hơn 4 khi bài filter nhỏ | Thấp | Pool lấy từ full dataset của type (20 items), không chỉ 5 items của bài → luôn đủ 4 options |
| Auto-transition làm user bối rối | Thấp | Hiển thị phase label rõ ràng ("Học" / "Luyện — Nhìn & Đọc" / "Luyện — Nghe & Chọn") + brief transition message |
| Screen visibility conflict trong init | Thấp | Tất cả 4 PT screens cần thêm vào init block cuối quiz.js |
| Regression quiz/flashcard/weak-review | Thấp | PT dùng state fields riêng biệt, không chạm flow hiện có |

---

## Quyết định thiết kế

1. **Không có pt-submode-screen**: User không chọn phase — flow dẫn dắt tự động Learn → Practice → Choose. Giảm friction, tạo cảm giác "đang học" thay vì "đang cấu hình".
2. **Lesson thay vì group filter**: Không có "All" trong PT. 3 bài cố định (5 items/bài). Session size tự nhiên = 5 ký tự.
3. **2 practice phases**: Phase 2 (Nhìn → Reveal, self-assess) + Phase 3 (Nghe → Chọn, MC) — cả hai dạng active recall có mặt trong một session.
4. **Phase 3 options từ full dataset**: Distractors lấy từ tất cả 20 ký tự của type, không chỉ 5 items của bài — tránh MCQ quá dễ đoán.
5. **TTS qua Web Speech API**: Không cần audio files. Fallback graceful nếu TTS unavailable.
6. **Kanji excluded V1**: data.romaji là meaning (not pronunciation) → sai UX. Ghi nhận rõ trong decisions.md. V2 cần field `reading` riêng.
7. **Không progress tracking**: V1 không ghi vào localStorage. Transient state đủ cho mục tiêu.
8. **Không session restore**: Reload trong PT → về home. Đơn giản, acceptable.
9. **pt-screen dùng chung**: 1 màn cho 3 phases, render khác nhau. Tránh duplicate HTML.

---

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/index.html` | +1 nút (mode-selection-screen) + 4 màn mới |
| `src/style.css` | Styles cho 4 màn PT mới |
| `src/quiz.js` | PT state fields, TTS helper, 4 screen handlers, phase engine |

---

## Các bước thực hiện

### Bước 1 — `src/quiz.js`: thêm PT state fields vào quizState
```js
ptPhase: null,         // 'learn' | 'practice' | 'choose'
ptItems: [],           // items cho phase hiện tại
ptIndex: 0,            // index trong ptItems
ptUnsureItems: [],     // items đánh "Chưa chắc" trong phase='practice'
ptWrongItems: [],      // items trả lời sai trong phase='choose'
ptAnswerShown: false,  // answer đã reveal chưa (dùng trong phase='practice')
ptCurrentOptions: [],  // 4 kana options cho phase='choose'
ptLessonKey: null      // e.g. 'basic_vowels' — lesson đang học
```

### Bước 2 — `src/index.html`: thêm nút + 4 màn

**Nút mới trên mode-selection-screen:**
```html
<button id="pt-btn">Luyện Phát Âm</button>
```

**Màn 1 — pt-type-screen:**
```html
<div id="pt-type-screen" class="quiz-container" style="display: none;">
  <h2>Luyện Phát Âm</h2>
  <p class="pt-subtitle">Chọn bảng chữ</p>
  <div class="pt-type-options">
    <button class="pt-type-btn" data-type="hiragana">Hiragana<span class="pt-type-sub">あいうえお</span></button>
    <button class="pt-type-btn" data-type="katakana">Katakana<span class="pt-type-sub">アイウエオ</span></button>
  </div>
  <button id="back-from-pt-type-btn" class="back-btn">← Quay Lại</button>
</div>
```

**Màn 2 — pt-lesson-screen:**
```html
<div id="pt-lesson-screen" class="quiz-container" style="display: none;">
  <h2 id="pt-lesson-title">Chọn Bài</h2>
  <p class="pt-subtitle">Mỗi bài gồm 5 ký tự</p>
  <div id="pt-lesson-buttons"></div>
  <button id="back-from-pt-lesson-btn" class="back-btn">← Quay Lại</button>
</div>
```

**Màn 3 — pt-screen (dùng chung cho 3 phases):**
```html
<div id="pt-screen" class="quiz-container" style="display: none;">
  <div id="pt-phase-label"></div>
  <div id="pt-progress"></div>

  <!-- Learn + Practice section -->
  <div id="pt-card-section">
    <div id="pt-character"></div>
    <div id="pt-reading" style="display: none;"></div>
  </div>

  <!-- Choose section -->
  <div id="pt-choose-section" style="display: none;">
    <div id="pt-listen-indicator">🔊</div>
    <div id="pt-choice-options"></div>
  </div>

  <div id="pt-actions">
    <button id="pt-speak-btn" style="display: none;">▶ Nghe lại</button>
    <button id="pt-reveal-btn" style="display: none;">Nghe & Xem đáp án</button>
    <button id="pt-knew-btn" style="display: none;">Biết rồi ✓</button>
    <button id="pt-unsure-btn" style="display: none;">Chưa chắc ?</button>
    <button id="pt-next-btn" style="display: none;">Tiếp →</button>
  </div>

  <button id="pt-exit-btn" class="back-btn">← Thoát</button>
</div>
```

**Màn 4 — pt-summary-screen:**
```html
<div id="pt-summary-screen" class="quiz-container" style="display: none;">
  <h2 id="pt-summary-title">Kết Quả</h2>
  <div id="pt-summary-content"></div>
  <div id="pt-summary-actions">
    <button id="pt-retry-btn" style="display: none;">Ôn lại →</button>
    <button id="pt-next-lesson-btn">Chọn bài khác</button>
    <button id="pt-pt-home-btn">Về Trang Chủ</button>
  </div>
</div>
```

### Bước 3 — `src/style.css`: styles cho PT screens
- `.pt-type-options`: flex row, gap 16px
- `.pt-type-btn`: lớn, có `.pt-type-sub` label nhỏ bên dưới hiển thị ký tự mẫu
- `#pt-lesson-buttons`: flex column, gap
- `.pt-lesson-btn`: full width, text trái, có lesson label + item count
- `#pt-phase-label`: badge nhỏ trên cùng, màu accent theo phase (learn=xanh lá, practice=xanh dương, choose=cam)
- `#pt-character`: font size lớn (3-4rem), tương tự `#hiragana-char`
- `#pt-reading`: font medium, màu accent, appear sau reveal
- `#pt-listen-indicator`: icon lớn, centered, khi phase='choose'
- `.pt-choice-btn`: nút vuông (kana lớn), 2x2 grid
- `.pt-choice-btn.correct`: green highlight
- `.pt-choice-btn.wrong`: red highlight
- `#pt-knew-btn`: màu xanh lá
- `#pt-unsure-btn`: màu cam

### Bước 4 — `src/quiz.js`: TTS + phase engine + handlers

**4a. TTS helper:**
```js
function speakJapanese(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  utt.rate = 0.8;
  window.speechSynthesis.speak(utt);
}
```

**4b. Lesson button renderer:**
```js
function renderPTLessons() {
  const PT_LESSON_KEYS = ['basic_vowels', 'k_group', 's_group']; // bỏ 'all'
  const groups = GROUP_CONFIG[quizState.quizType];
  const data = QUIZ_TYPE_CONFIG[quizState.quizType].data;
  ptLessonButtonsContainer.innerHTML = '';
  PT_LESSON_KEYS.forEach((key, idx) => {
    const group = groups[key];
    if (!group) return;
    const count = group.filter
      ? data.filter(item => group.filter.includes(item.romaji)).length
      : data.length;
    const btn = document.createElement('button');
    btn.className = 'pt-lesson-btn';
    btn.textContent = `Bài ${idx + 1} — ${group.label} (${count} ký tự)`;
    btn.addEventListener('click', () => startPTLearn(key));
    ptLessonButtonsContainer.appendChild(btn);
  });
}
```

**4c. startPTLearn — entry point khi user chọn lesson:**
```js
function startPTLearn(lessonKey) {
  const group = GROUP_CONFIG[quizState.quizType][lessonKey];
  const fullData = QUIZ_TYPE_CONFIG[quizState.quizType].data;
  const items = group.filter
    ? fullData.filter(item => group.filter.includes(item.romaji))
    : fullData.slice();

  quizState.ptLessonKey = lessonKey;
  quizState.ptPhase = 'learn';
  quizState.ptItems = items.slice(); // không shuffle Learn — sequential giúp ghi nhớ thứ tự
  quizState.ptIndex = 0;
  quizState.ptUnsureItems = [];
  quizState.ptWrongItems = [];
  quizState.ptAnswerShown = false;

  ptLessonScreen.style.display = 'none';
  ptScreen.style.display = 'flex';
  renderPTItem();
}
```

**4d. renderPTItem — render theo phase:**
```js
function renderPTItem() {
  const item = quizState.ptItems[quizState.ptIndex];
  ptProgress.textContent = `${quizState.ptIndex + 1} / ${quizState.ptItems.length}`;
  quizState.ptAnswerShown = false;

  if (quizState.ptPhase === 'learn') {
    ptPhaseLabel.textContent = 'Học';
    ptCardSection.style.display = 'block';
    ptChooseSection.style.display = 'none';
    ptCharacter.textContent = item.kana;
    ptReading.textContent = item.romaji;
    ptReading.style.display = 'none';
    ptSpeakBtn.style.display = window.speechSynthesis ? 'inline-block' : 'none';
    ptRevealBtn.textContent = 'Xem cách đọc';
    ptRevealBtn.style.display = 'inline-block';
    ptKnewBtn.style.display = 'none';
    ptUnsureBtn.style.display = 'none';
    ptNextBtn.style.display = 'inline-block';
    setTimeout(() => speakJapanese(item.kana), 300);

  } else if (quizState.ptPhase === 'practice') {
    ptPhaseLabel.textContent = 'Luyện — Nhìn & Đọc';
    ptCardSection.style.display = 'block';
    ptChooseSection.style.display = 'none';
    ptCharacter.textContent = item.kana;
    ptReading.textContent = item.romaji;
    ptReading.style.display = 'none';
    ptSpeakBtn.style.display = 'none';
    ptRevealBtn.textContent = 'Nghe & Xem đáp án';
    ptRevealBtn.style.display = 'inline-block';
    ptKnewBtn.style.display = 'none';
    ptUnsureBtn.style.display = 'none';
    ptNextBtn.style.display = 'none';

  } else if (quizState.ptPhase === 'choose') {
    ptPhaseLabel.textContent = 'Luyện — Nghe & Chọn';
    ptCardSection.style.display = 'none';
    ptChooseSection.style.display = 'block';
    ptSpeakBtn.style.display = 'none';
    ptRevealBtn.style.display = 'none';
    ptKnewBtn.style.display = 'none';
    ptUnsureBtn.style.display = 'none';
    ptNextBtn.style.display = 'none';
    renderChooseOptions(item);
    setTimeout(() => speakJapanese(item.kana), 300);
  }
}
```

**4e. renderChooseOptions:**
```js
function renderChooseOptions(item) {
  const pool = QUIZ_TYPE_CONFIG[quizState.quizType].data;
  const options = [item.kana];
  let attempts = 0;
  while (options.length < 4 && attempts < pool.length * 4) {
    const rand = pool[getRandomInt(pool.length)].kana;
    if (!options.includes(rand)) options.push(rand);
    attempts++;
  }
  shuffle(options);
  quizState.ptCurrentOptions = options;

  ptChoiceOptionsContainer.innerHTML = '';
  options.forEach(kana => {
    const btn = document.createElement('button');
    btn.className = 'pt-choice-btn';
    btn.textContent = kana;
    btn.addEventListener('click', () => handleChooseAnswer(kana, btn, item));
    ptChoiceOptionsContainer.appendChild(btn);
  });
}
```

**4f. handleChooseAnswer:**
```js
function handleChooseAnswer(selected, btn, item) {
  // disable all buttons
  ptChoiceOptionsContainer.querySelectorAll('.pt-choice-btn').forEach(b => b.disabled = true);
  const correct = selected === item.kana;
  if (correct) {
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    ptChoiceOptionsContainer.querySelectorAll('.pt-choice-btn').forEach(b => {
      if (b.textContent === item.kana) b.classList.add('correct');
    });
    if (!quizState.ptWrongItems.find(i => i.kana === item.kana)) {
      quizState.ptWrongItems.push(item);
    }
  }
  speakJapanese(item.kana); // nghe lại âm đúng sau khi chọn
  setTimeout(() => advancePT(), 800);
}
```

**4g. Reveal handler (learn + practice):**
```js
ptRevealBtn.addEventListener('click', () => {
  const item = quizState.ptItems[quizState.ptIndex];
  ptReading.style.display = 'block';
  quizState.ptAnswerShown = true;

  if (quizState.ptPhase === 'learn') {
    speakJapanese(item.kana);
    // "Tiếp →" đã hiển thị sẵn

  } else if (quizState.ptPhase === 'practice') {
    speakJapanese(item.kana);
    ptRevealBtn.style.display = 'none';
    ptKnewBtn.style.display = 'inline-block';
    ptUnsureBtn.style.display = 'inline-block';
  }
});
```

**4h. Speak button (Learn only):**
```js
ptSpeakBtn.addEventListener('click', () => {
  const item = quizState.ptItems[quizState.ptIndex];
  speakJapanese(item.kana);
});
```

**4i. Knew / Unsure handlers:**
```js
ptKnewBtn.addEventListener('click', () => advancePT());

ptUnsureBtn.addEventListener('click', () => {
  const item = quizState.ptItems[quizState.ptIndex];
  if (!quizState.ptUnsureItems.find(i => i.kana === item.kana)) {
    quizState.ptUnsureItems.push(item);
  }
  advancePT();
});
```

**4j. Next button (Learn only):**
```js
ptNextBtn.addEventListener('click', () => advancePT());
```

**4k. advancePT — auto-transition logic:**
```js
function advancePT() {
  quizState.ptIndex++;
  if (quizState.ptIndex < quizState.ptItems.length) {
    renderPTItem();
    return;
  }

  // Phase completed — decide next
  if (quizState.ptPhase === 'learn') {
    // → auto start Practice
    quizState.ptPhase = 'practice';
    quizState.ptItems = shuffle(
      // same items as learn, shuffled for practice
      GROUP_CONFIG[quizState.quizType][quizState.ptLessonKey].filter
        ? QUIZ_TYPE_CONFIG[quizState.quizType].data.filter(
            item => GROUP_CONFIG[quizState.quizType][quizState.ptLessonKey].filter.includes(item.romaji)
          )
        : QUIZ_TYPE_CONFIG[quizState.quizType].data.slice()
    );
    quizState.ptIndex = 0;
    renderPTItem();

  } else if (quizState.ptPhase === 'practice') {
    if (quizState.ptUnsureItems.length > 0) {
      // → auto start Choose phase with unsure items
      quizState.ptPhase = 'choose';
      quizState.ptItems = shuffle(quizState.ptUnsureItems.slice());
      quizState.ptIndex = 0;
      renderPTItem();
    } else {
      showPTSummary();
    }

  } else if (quizState.ptPhase === 'choose') {
    showPTSummary();
  }
}
```

**4l. showPTSummary:**
```js
function showPTSummary() {
  ptScreen.style.display = 'none';

  const practiceTotal = /* tổng số items trong practice phase */ quizState.ptUnsureItems.length + (quizState.ptItems.length - quizState.ptUnsureItems.length);
  // Dùng biến rõ ràng hơn:
  const learnTotal = // → lưu vào ptLearnTotal khi startPTLearn
  
  // Tính từ state
  const unsureCount = quizState.ptUnsureItems.length;
  const wrongCount = quizState.ptWrongItems.length;
  const hadChoosePhase = quizState.ptPhase === 'choose' || wrongCount > 0 || (quizState.ptPhase === 'practice' && unsureCount === 0);

  ptSummaryTitle.textContent = 'Kết Quả';

  let html = '';
  if (wrongCount === 0 && unsureCount === 0) {
    html = '<p class="pt-summary-perfect">Xuất sắc! Bạn nhớ hết rồi 🎉</p>';
  } else {
    if (unsureCount > 0) {
      html += `<p>Luyện — Nhìn & Đọc: <span class="pt-count-wrong">${unsureCount} chưa chắc</span></p>`;
    }
    if (wrongCount > 0) {
      html += `<p>Luyện — Nghe & Chọn: <span class="pt-count-wrong">${wrongCount} sai</span></p>`;
    }
  }
  ptSummaryContent.innerHTML = html;

  ptRetryBtn.style.display = wrongCount > 0 ? 'inline-block' : 'none';
  ptSummaryScreen.style.display = 'flex';
}
```

_Lưu ý: cần thêm `ptLearnTotal` vào state hoặc compute lại từ lesson key — sẽ xử lý clean lúc implement._

**4m. Summary button handlers:**
```js
ptRetryBtn.addEventListener('click', () => {
  // Ôn lại: Phase 3 với ptWrongItems
  ptSummaryScreen.style.display = 'none';
  quizState.ptPhase = 'choose';
  quizState.ptItems = shuffle(quizState.ptWrongItems.slice());
  quizState.ptWrongItems = [];
  quizState.ptIndex = 0;
  ptScreen.style.display = 'flex';
  renderPTItem();
});

ptNextLessonBtn.addEventListener('click', () => {
  ptSummaryScreen.style.display = 'none';
  ptScreen.style.display = 'none';
  renderPTLessons();
  ptLessonScreen.style.display = 'flex';
});

ptPtHomeBtn.addEventListener('click', () => {
  ptSummaryScreen.style.display = 'none';
  modeSelectionScreen.style.display = 'flex';
  clearSession();
});
```

**4n. Exit button (trong pt-screen):**
```js
ptExitBtn.addEventListener('click', () => {
  ptScreen.style.display = 'none';
  renderPTLessons();
  ptLessonScreen.style.display = 'flex';
  // reset phase state
  quizState.ptPhase = null;
  quizState.ptItems = [];
  quizState.ptIndex = 0;
  quizState.ptUnsureItems = [];
  quizState.ptWrongItems = [];
});
```

**4o. Init — thêm PT screens vào block ẩn cuối quiz.js:**
```js
ptTypeScreen.style.display = 'none';
ptLessonScreen.style.display = 'none';
ptScreen.style.display = 'none';
ptSummaryScreen.style.display = 'none';
```

**4p. Back navigation:**
- pt-type-screen → back → mode-selection-screen
- pt-lesson-screen → back → pt-type-screen
- pt-screen "Thoát" → pt-lesson-screen (reset phase state)
- pt-summary-screen → "Chọn bài khác" → pt-lesson-screen; "Về Trang Chủ" → mode-selection-screen

---

## Self-review plan (sẽ thực hiện sau implement)

- [ ] TTS guard: `!window.speechSynthesis` → nút "Nghe lại" ẩn, không crash
- [ ] Learn: auto-play khi vào item, "Nghe lại" replay, "Xem cách đọc" reveal romaji, "Tiếp →" advance
- [ ] Learn → Practice: auto-transition sau item cuối, items shuffle
- [ ] Practice: hiện ký tự, "Nghe & Xem đáp án" → TTS + romaji + Biết rồi/Chưa chắc
- [ ] Practice → Choose: auto nếu ptUnsureItems > 0, skip nếu = 0
- [ ] Choose: auto-play TTS, 4 kana options từ full dataset, correct/wrong highlight, auto-advance 800ms
- [ ] ptUnsureItems tích đúng trong practice phase
- [ ] ptWrongItems tích đúng trong choose phase
- [ ] Summary: count đúng, "Ôn lại" ẩn nếu wrongCount = 0
- [ ] "Ôn lại": start choose phase với ptWrongItems, reset ptWrongItems
- [ ] Empty state: không có unsure → bỏ choose phase, summary với "Xuất sắc!"
- [ ] Back navigation: pt-type → home, pt-lesson → pt-type, pt-screen exit → pt-lesson
- [ ] Lesson buttons render đúng: chỉ 3 bài (basic_vowels/k_group/s_group), không có all
- [ ] All 4 PT screens ẩn trong init block
- [ ] Hiragana quiz flow không bị regression
- [ ] Flashcard / Weak Review không bị ảnh hưởng

---

## Docs impact (sau khi implement)

| File | Nội dung |
|---|---|
| `docs/ai/product/current-features.md` | Thêm Pronunciation Trainer V1 |
| `docs/ai/product/current-flows.md` | Thêm PT flow |
| `docs/ai/core/architecture.md` | Thêm ptPhase và các pt* fields vào quizState |
| `docs/ai/history/changelog.md` | Entry HIRA-012 |
| `docs/ai/history/decisions.md` | TTS vs audio files; Kanji excluded; không có pt-submode-screen; lesson thay group filter |
