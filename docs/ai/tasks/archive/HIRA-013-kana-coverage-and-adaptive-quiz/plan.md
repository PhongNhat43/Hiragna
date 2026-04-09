# Plan: [HIRA-013] Kana Coverage & Adaptive Quiz

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — `current-features.md`, `current-flows.md` (nếu flow đổi), `architecture.md` (per-item stats storage mới), `changelog.md`

---

## Phân tích yêu cầu

Hai nhóm thay đổi độc lập nhưng có thứ tự ưu tiên:

- **Data layer** (Phase 1, 3, 4): chỉ thêm vào `hiraganaData.js`, không đổi logic.
- **Logic layer** (Phase 2): thay `generateQuestion()` + thêm per-item stats vào `progress.js`. Đây là thay đổi có rủi ro cao nhất.

Hai nhóm này có thể implement và verify độc lập.

---

## Phase 1 — Hoàn thiện basic kana (46 hiragana + 46 katakana)

### Scope

Thêm các hàng còn thiếu vào `hiraganaData` và `katakanaData`, đồng thời bổ sung GROUP_CONFIG tương ứng.

**Các hàng cần thêm (hiragana):**

| Hàng | Ký tự | Romaji |
|---|---|---|
| な行 | な、に、ぬ、ね、の | na, ni, nu, ne, no |
| は行 | は、ひ、ふ、へ、ほ | ha, hi, fu, he, ho |
| ま行 | ま、み、む、め、も | ma, mi, mu, me, mo |
| や行 | や、ゆ、よ | ya, yu, yo |
| ら行 | ら、り、る、れ、ろ | ra, ri, ru, re, ro |
| わ行 + ん | わ、を、ん | wa, wo, n |

Katakana: mirror đúng từng ký tự — ナ、ニ、ヌ、ネ、ノ, v.v.

**GROUP_CONFIG mới (cho cả hiragana lẫn katakana):**

```
na_group:   ["na","ni","nu","ne","no"]
ha_group:   ["ha","hi","fu","he","ho"]
ma_group:   ["ma","mi","mu","me","mo"]
ya_group:   ["ya","yu","yo"]
ra_group:   ["ra","ri","ru","re","ro"]
wa_group:   ["wa","wo","n"]
ta_group:   ["ta","chi","tsu","te","to"]   ← hiện có data nhưng thiếu GROUP_CONFIG
```

Lưu ý: `ta_group` hiện đã có data (た行 đã có trong 20 ký tự gốc) nhưng không có GROUP_CONFIG entry — sẽ thêm luôn.

### Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/hiraganaData.js` | Thêm items vào `hiraganaData`, `katakanaData`; thêm entries vào `GROUP_CONFIG` |

### Rủi ro Phase 1

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Group filter screen overflow nếu quá nhiều buttons | Thấp | Hiện dùng flex wrap — cần visual check |
| PT_LESSON_KEYS trong quiz.js hardcode `['basic_vowels','k_group','s_group']` | Thấp | PT chỉ dùng 3 lessons hardcode, không tự động pick GROUP_CONFIG — không bị ảnh hưởng |
| Romaji trùng (vd: "n" — ん/N) conflict với logic options | Thấp | "n" là romaji duy nhất, không trùng item nào khác |
| "fu" dễ nhầm với "hu" | Rất thấp | Data dùng chuẩn Hepburn — "fu" là đúng |

### Acceptance criteria Phase 1

- [ ] `hiraganaData` có đúng 46 entries
- [ ] `katakanaData` có đúng 46 entries
- [ ] GROUP_CONFIG hiragana và katakana có đủ group: `all`, `basic_vowels`, `k_group`, `s_group`, `t_group`, `n_group`, `h_group`, `m_group`, `y_group`, `r_group`, `w_group`
- [ ] Quiz mode "All" load đủ 46 items không lỗi
- [ ] Group filter screen hiển thị đủ buttons không vỡ layout
- [ ] Flashcard với group mới hoạt động bình thường
- [ ] `generateQuestion()` không loop vô tận với dataset mới (maxAttempts guard đã có)

---

## Phase 2 — Adaptive Quiz V1

### Scope

Thay thế sequential pick bằng weighted random selection. Thêm per-item stats storage.

### 2A — Per-item stats (progress.js)

Thêm localStorage key `hiragna_item_stats` với schema:

```json
{
  "hiragana": {
    "あ": { "correct": 8, "wrong": 1, "lastSeenTs": 1712345678000, "streak": 3 },
    "か": { "correct": 0, "wrong": 0, "lastSeenTs": null, "streak": 0 }
  },
  "katakana": { ... },
  "kanji": { ... },
  "mixed": { ... }
}
```

Các hàm mới trong `progress.js`:
- `loadItemStats()` — load từ localStorage, merge default nếu thiếu key
- `saveItemStats(data)` — save toàn bộ object
- `updateItemStat(type, kana, isCorrect)` — cập nhật correct/wrong/streak/lastSeenTs cho item
- `resetItemStats()` — xóa key (gắn vào reset progress flow)

Lưu ý: `mixed` type không track per-item vì kana có thể thuộc hiragana hoặc katakana — sẽ không update item stats cho mixed mode trong V1.

### 2B — Weighted selection (quiz.js)

**Thay đổi trong `quizState`:** Thêm field `recentItems: []` (size tối đa 6 — track kana string các câu gần nhất).

**Thay thế logic trong `generateQuestion()`:**

```
// CŨ:
const correctIdx = quizState.questionCount % dataSet.length;
const correct = dataSet[correctIdx];

// MỚI:
const correct = pickWeighted(dataSet, quizState.quizType, quizState.recentItems);
```

**Hàm `pickWeighted(dataSet, type, recentItems)`:**

```
Với mỗi item trong dataSet:
  stats = getItemStats(type, item.kana)  // load từ localStorage
  accuracy = stats.correct / (stats.correct + stats.wrong)  // default 0.5 nếu chưa gặp
  
  accuracy_mult:
    never seen (correct+wrong == 0) → 1.5   (new item bonus)
    accuracy < 0.50 → 3.0
    accuracy < 0.70 → 2.0
    accuracy < 0.85 → 1.0
    accuracy < 0.95 → 0.4
    accuracy >= 0.95 → 0.15

  recency_mult:
    item.kana trong recentItems[0..2] (3 câu gần nhất) → 0.05
    item.kana trong recentItems[3..5] (4–6 câu gần nhất) → 0.3
    không có trong recentItems → 1.0

  absence_mult (cross-session):
    lastSeenTs == null → 1.5
    days_since > 14 → 1.6
    days_since > 7  → 1.3
    otherwise → 1.0

  weight = max(accuracy_mult * recency_mult * absence_mult, 0.05)

Tổng hợp cumulative weights → chọn random → return item.
```

**Thay đổi trong `handleAnswer()` và `skipBtn`:**
- Gọi `updateItemStat(type, kana, isCorrect)` sau mỗi câu trả lời
- Cập nhật `quizState.recentItems`: unshift kana mới vào đầu, giới hạn length 6
- Không gọi `updateItemStat` cho mixed mode (V1)

**Giữ nguyên:**
- `addToWeakItem` / `removeFromWeakItem` — binary weak list vẫn hoạt động song song
- `startWeakReview()` — dùng weak items làm questionSet, sau đó chạy weighted selection thay vì sequential. Item trong weak list sẽ có accuracy thấp → tự nhiên có weight cao hơn.
- `startFlashcard()` — không dùng weighted selection, giữ nguyên sequential
- `quizState.questionCount` — vẫn tăng sau mỗi câu để track progress, nhưng không dùng làm index nữa

**Xóa:**
- `const correctIdx = quizState.questionCount % dataSet.length;` — dòng này bị xóa
- Pre-shuffle tại `startQuizBtn` (`quiz.js:510`) — không cần nữa vì selection là random

### Files bị ảnh hưởng Phase 2

| File | Loại thay đổi |
|---|---|
| `src/progress.js` | Thêm item stats API (4 hàm mới + key mới) |
| `src/quiz.js` | Thay `generateQuestion()`, sửa `handleAnswer()`, `skipBtn`, thêm `recentItems` vào `quizState`, xóa pre-shuffle |

### Rủi ro Phase 2

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Weight calculation bug → một item bị pick liên tục | Cao | Cần test kỹ edge case: dataset 1 item, dataset < 4, all items có cùng weight |
| Xóa pre-shuffle → quiz bắt đầu lần đầu không đủ random | Thấp | Weighted random tự nhiên đã random hơn shuffle tuần tự |
| `recentItems` không reset khi restart quiz | Trung bình | Phải thêm `recentItems: []` vào restart handler |
| `updateItemStat` gọi khi mixed mode → data type sai | Thấp | Guard `if (type !== 'mixed')` đơn giản là đủ |
| localStorage quota exceeded với nhiều kana | Rất thấp | ~100 kana × ~50 bytes = ~5KB, rất nhỏ |

### Acceptance criteria Phase 2

- [ ] Item chưa bao giờ gặp xuất hiện trong quiz (không bị bỏ đói)
- [ ] Item sai 3 lần gần nhất xuất hiện nhiều hơn item đúng 3 lần gần nhất trong cùng session (kiểm tra bằng questionHistory)
- [ ] Item vừa gặp câu trước không xuất hiện ngay câu tiếp theo (trừ khi dataset quá nhỏ < 4)
- [ ] Quiz với dataset 1 item không crash
- [ ] Quiz với dataset 3 item không loop vô tận
- [ ] `restartBtn` reset `recentItems` đúng
- [ ] `weak-review` vẫn hoạt động — chỉ pick trong weak items
- [ ] Flashcard không bị ảnh hưởng
- [ ] `resetProgress` xóa luôn item stats

---

## Phase 3 — Dakuten & Handakuten

### Scope

Thêm data vào `hiraganaData`, `katakanaData` và GROUP_CONFIG. Không đổi logic.

| Nhóm | Ký tự (hiragana) | Romaji |
|---|---|---|
| Dakuten が行 | が、ぎ、ぐ、げ、ご | ga, gi, gu, ge, go |
| Dakuten ざ行 | ざ、じ、ず、ぜ、ぞ | za, ji, zu, ze, zo |
| Dakuten だ行 | だ、ぢ、づ、で、ど | da, di, du, de, do |
| Dakuten ば行 | ば、び、ぶ、べ、ぼ | ba, bi, bu, be, bo |
| Handakuten ぱ行 | ぱ、ぴ、ぷ、ぺ、ぽ | pa, pi, pu, pe, po |

GROUP_CONFIG thêm: `ga_group`, `za_group`, `da_group`, `ba_group`, `pa_group`.

### Acceptance criteria Phase 3

- [ ] 25 ký tự dakuten + handakuten có trong data
- [ ] GROUP_CONFIG có đủ groups mới
- [ ] Quiz "All" load đúng tổng số items
- [ ] Tính năng hiện có không vỡ

---

## Phase 4 — Yoon

### Scope

Thêm data yoon vào `hiraganaData`, `katakanaData` và GROUP_CONFIG.

Yoon là tổ hợp âm ghép (vd: きゃ = kya). Cần cân nhắc:
- Romaji của yoon là 2–3 ký tự ("kya", "shu", "cho") — không conflict với romaji hiện tại
- Kana của yoon là 2 ký tự (きゃ) — `item.kana` sẽ là string 2 ký tự

Các tổ hợp cần thêm (9 hàng × 3 = 27 ký tự):

| Hàng | ゃ | ゅ | ょ |
|---|---|---|---|
| き | きゃ/kya | きゅ/kyu | きょ/kyo |
| し | しゃ/sha | しゅ/shu | しょ/sho |
| ち | ちゃ/cha | ちゅ/chu | ちょ/cho |
| に | にゃ/nya | にゅ/nyu | にょ/nyo |
| ひ | ひゃ/hya | ひゅ/hyu | ひょ/hyo |
| み | みゃ/mya | みゅ/myu | みょ/myo |
| り | りゃ/rya | りゅ/ryu | りょ/ryo |
| ぎ | ぎゃ/gya | ぎゅ/gyu | ぎょ/gyo |
| じ | じゃ/ja | じゅ/ju | じょ/jo |

GROUP_CONFIG thêm: `yoon_basic` (き/し/ち/に/ひ/み/り), `yoon_dakuten` (ぎ/じ).

Lưu ý: yoon phụ thuộc Phase 3 đã xong cho các hàng dakuten.

### Acceptance criteria Phase 4

- [ ] 27 ký tự yoon có trong data
- [ ] GROUP_CONFIG có groups yoon
- [ ] Item stats tracking hoạt động đúng với kana 2 ký tự
- [ ] Tính năng hiện có không vỡ

---

## Self-review plan (chung cho tất cả phases)

Sau khi implement từng phase:
- [ ] Đọc lại toàn bộ thay đổi, trace logic, không claim pass bằng suy đoán
- [ ] Đếm số items trong data array khớp với số kỳ vọng
- [ ] Kiểm tra GROUP_CONFIG filter arrays khớp đúng với romaji trong data
- [ ] Regression: `generateQuestion()` không crash với dataset nhỏ (< 4 items)
- [ ] Regression: `weak-review` vẫn filter và load đúng
- [ ] Regression: `restoreSession()` không bị ảnh hưởng

## Runtime verify plan

> **STATUS: TẠM VÔ HIỆU HÓA** — Bỏ qua cho đến khi được kích hoạt lại.
