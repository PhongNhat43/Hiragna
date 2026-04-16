# Plan: [HIRA-017] Daily Lesson Tab (10 Vocab + 3 Kanji)

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — `current-features.md`, `current-flows.md`, `architecture.md`, `changelog.md`

---

## Audit — hiện trạng code

### Impacted files thực tế

| File | Loại thay đổi | Ghi chú |
|---|---|---|
| `src/index.html` | Sửa | Thêm nút `Học mỗi ngày` trên home + 3-4 screens mới cho Daily Lesson |
| `src/style.css` | Sửa | Styles riêng cho daily list, item cards, status badges, summary |
| `src/dailyLessonsData.js` | **Tạo mới** | Dataset ngày học, vocab, kanji, metadata theo lesson/day |
| `src/dailyLesson.js` | **Tạo mới** | `dlState` + toàn bộ flow Daily Lesson |
| `src/progress.js` | Sửa | Thêm localStorage helpers cho progress trạng thái từng ngày |

`src/quiz.js` — **không nên sửa logic chính** nếu Daily Lesson được tách như Number Trainer.  
`src/hiraganaData.js` — **không phù hợp** để nhét dataset Daily Lesson vì data shape khác (`vocab`, `meaning`, `kanji reading`, status theo ngày).

### Current navigation pattern

Home hiện tại:

```
mode-selection-screen
  → Quiz Mode
  → Flashcard Mode
  → Weak Review
  → View Progress
  → Luyện Phát Âm
  → Luyện Số
```

Hai flow học tách riêng hiện có:

```
PT: home → pt-type-screen → pt-lesson-screen → pt-screen → pt-summary-screen
NT: home → nt-lesson-screen → nt-screen → nt-summary-screen
```

Daily Lesson hợp với pattern tách file tương tự Number Trainer:

```
home → daily-overview-screen → daily-learn-screen → daily-practice-screen → daily-summary-screen
```

### Có nên thêm file mới?

**Có. Khuyến nghị mạnh:**

- `src/dailyLessonsData.js`
- `src/dailyLesson.js`

Lý do:
1. Flow mới độc lập hoàn toàn khỏi kana quiz.
2. `quiz.js` đã khá lớn và đang gánh quiz core + mixed + PT.
3. Data shape Daily Lesson khác hẳn:
   - vocab item
   - kanji item
   - lesson/day grouping
   - completion status theo ngày
4. Number Trainer đã tạo precedent tốt cho mô hình `data file + feature logic file` riêng.

### Có cần đụng `progress.js` không?

**Có, nên đụng.**

Lý do:
- `progress.js` đang là persistence layer chuẩn của repo cho `localStorage` / `sessionStorage`
- Daily Lesson cần lưu trạng thái từng ngày (`not_started` / `in_progress` / `completed`) sau reload
- nếu nhét localStorage logic vào `dailyLesson.js` sẽ phá ranh giới layer hiện tại

Khuyến nghị thêm key mới, tách biệt khỏi dashboard progress hiện có, ví dụ:

```js
const DAILY_LESSON_PROGRESS_KEY = 'hiragna_daily_lessons';
```

V1 chỉ cần lưu:
- status từng ngày
- lần học gần nhất (optional)
- completion timestamp (optional)

Không cần gộp vào `hiragna_progress` của quiz dashboard trong V1.

### Constraint dữ liệu thực tế

Current codebase chỉ có:
- kana datasets
- kanji quiz dataset nhỏ (`27` items, meaning-driven)
- number dataset riêng

Repo **chưa có** dataset vocab + kanji theo Minna no Nihongo bài 1–25.  
Vì vậy Daily Lesson V1 chắc chắn cần data file mới, và cần chốt rõ nguồn/format cho content.

---

## User Flow

### Flow đề xuất V1

```
mode-selection-screen
  → click "Học mỗi ngày"
  → daily-overview-screen
      - danh sách các ngày học
      - mỗi ngày hiển thị status: chưa học / đang học / hoàn thành
  → click Ngày X
  → daily-learn-screen
      Phase 1: Learn vocab block 1 (5 items)
      Phase 2: Learn vocab block 2 (5 items)
      Phase 3: Learn kanji (3 items)
  → daily-practice-screen
      Quick practice mixed cho 13 items vừa học
  → daily-summary-screen
      - kết quả phiên
      - cập nhật trạng thái ngày
      - chọn ngày khác / học lại / về trang chủ
```

### Behavior chính

- Mỗi ngày là một unit cố định, không phụ thuộc ngày thật
- User có thể mở lại ngày cũ bất cứ lúc nào
- `in_progress` được set khi đã vào học nhưng chưa complete
- `completed` được set khi xong Summary

---

## Data Model Cho Daily Lesson

### File đề xuất: `src/dailyLessonsData.js`

```js
const DAILY_LESSONS = [
  {
    id: 'day01',
    minnaLesson: 1,
    label: 'Ngày 1',
    vocab: [
      { jp: 'わたし', reading: 'わたし', pronunciationVi: 'watashi', meaning: 'tôi' },
      ...
    ],
    kanji: [
      { kanji: '日', reading: 'にち', meaning: 'ngày / mặt trời' },
      ...
    ]
  }
];
```

### Ghi chú model

- vocab và kanji nên tách riêng trong mỗi day
- vocab có thể mở rộng với `category`, `pronunciationVi`, `note`, `audioText`, `example`
- item practice nên có field đủ để render prompt + answer
- V1 chưa cần metadata sâu như tags, JLPT level, audio URL

### Quick practice model

Quick practice có thể reuse item normalized:

```js
{
  id: 'day01-vocab-01',
  type: 'vocab',
  prompt: 'わたし',
  answer: 'tôi',
  altAnswers: []
}
```

và

```js
{
  id: 'day01-kanji-01',
  type: 'kanji',
  prompt: '日',
  answer: 'にち',
  secondary: 'ngày / mặt trời'
}
```

V1 nên chốt **một kiểu quick practice đơn giản** thay vì nhiều dạng mixed challenge.

---

## State Cần Có

### File đề xuất: `src/dailyLesson.js`

```js
const dlState = {
  dayId: null,
  phase: null,            // 'overview' | 'learn-vocab-a' | 'learn-vocab-b' | 'learn-kanji' | 'practice' | 'summary'
  vocabItems: [],
  kanjiItems: [],
  practiceItems: [],
  currentItems: [],
  currentIndex: 0,
  practiceResults: [],
  answerSelected: false
};
```

### Persisted state trong `progress.js`

```js
{
  day01: { status: 'not_started' },
  day02: { status: 'in_progress' },
  day03: { status: 'completed', completedAt: 1710000000000 }
}
```

Status enum đề xuất:
- `not_started`
- `in_progress`
- `completed`

UI label vẫn hiển thị:
- chưa học
- đang học
- hoàn thành

---

## Risks

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Dataset Minna no Nihongo 1–25 chưa có sẵn trong repo | Cao | Cần chốt nguồn, format, và mức coverage ngay từ đầu |
| Quick practice quá tham nếu ôm nhiều loại câu hỏi | Trung bình | V1 nên chốt 1 format practice đơn giản |
| Gộp persistence vào dashboard progress hiện tại làm scope phình | Trung bình | Nên dùng key mới trong `progress.js`, không gộp dashboard V1 |
| Nhét logic vào `quiz.js` làm file quá nặng | Cao | Nên tách `dailyLesson.js` riêng |
| Kanji item cần reading + meaning, khác dataset kanji hiện tại | Cao | Không nên reuse trực tiếp current kanji quiz dataset |
| Daily flow có nhiều screen hơn NT/PT | Thấp | Nhưng pattern screen toggle hiện tại đủ để support |

---

## Acceptance Criteria

- Có nút `Học mỗi ngày` trên home
- Có daily overview list với status rõ ràng
- Mỗi day hiển thị đúng `10 vocab + 3 kanji`
- Flow chạy đủ: overview → learn vocab → learn kanji → quick practice → summary
- Completion state từng ngày được lưu sau reload
- User có thể mở lại ngày cũ
- Flow mới không phá các mode hiện có

---

## Assumptions

- Daily Lesson là flow học độc lập, không cần reuse adaptive quiz engine hiện tại
- V1 không cần session restore giữa chừng
- V1 không cần tích hợp vào progress dashboard hiện tại
- Kanji trong Daily Lesson có thể cần cả reading lẫn meaning, nên dataset riêng là hợp lý

---

## Đề xuất triển khai sau khi duyệt

1. Tạo `src/dailyLessonsData.js` với dataset schema rõ ràng
2. Tạo `src/dailyLesson.js` với state + navigation riêng
3. Thêm screens và entry button vào `src/index.html`
4. Thêm styles riêng trong `src/style.css`
5. Thêm persistence helpers cho daily status vào `src/progress.js`
