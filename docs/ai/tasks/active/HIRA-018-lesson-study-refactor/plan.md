# Plan: [HIRA-018] Refactor Học Mỗi Ngày thành Học Theo Bài

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — `docs/ai/product/current-features.md`, `docs/ai/product/current-flows.md`, `docs/ai/history/changelog.md`, `docs/ai/tasks/active/HIRA-018-lesson-study-refactor/result.md`

## Phân tích yêu cầu

Đây là refactor đổi mô hình dữ liệu và flow nghiệp vụ của feature học riêng hiện tại. Thay đổi chính gồm:

1. Đổi đơn vị học từ `day` sang `lesson -> section`.
2. Loại bỏ kanji và cơ chế chia `vocab 1/2`, chỉ giữ `learn-vocab` và `practice`.
3. Đổi overview từ danh sách phẳng sang danh sách phân cấp theo lesson.
4. Đổi persistence từ `dayId` sang `sectionId`.
5. Viết lại thuật toán distractor để hỗ trợ section ngắn bằng cách quét ngược section trước trong cùng lesson.

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/index.html` | Sửa label/nội dung UI từ Daily sang Lesson Study, giữ screen structure hiện có nhưng đổi copy nếu cần |
| `src/style.css` | Sửa/đổi tên tối thiểu các style liên quan overview phân cấp và label mới |
| `src/dailyLessonsData.js` | Thay thế bằng file mới `src/lessonsData.js` theo schema `lessonsData` |
| `src/dailyLesson.js` | Refactor lớn state, render overview, learn flow, practice flow, distractor algorithm |
| `src/progress.js` | Giữ persistence layer nhưng đổi semantics sang progress theo `sectionId`; cân nhắc rename helper hoặc giữ compat shim |
| `docs/ai/product/current-features.md` | Sync feature mới |
| `docs/ai/product/current-flows.md` | Sync flow mới |
| `docs/ai/history/changelog.md` | Ghi nhận thay đổi |
| `docs/ai/tasks/active/HIRA-018-lesson-study-refactor/result.md` | Ghi kết quả sau implement |

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| `src/index.html` load order gãy khi đổi file data | Cao | `lessonsData.js` phải load trước `dailyLesson.js` |
| Regression flow do state cũ còn dư `dayId`, `kanjiItems`, `learn-vocab-a/b` | Cao | Cần thu gọn state sạch, bỏ nhánh cũ hoàn toàn |
| Persistence cũ dùng `dayId` có thể để lại data legacy trong localStorage | Vừa | Có thể giữ cùng key storage nhưng semantics mới theo `sectionId`; UI mới sẽ bỏ qua data cũ |
| Distractor algorithm cho section ngắn tạo duplicate hoặc thiếu option | Cao | Cần viết hàm chọn pool theo thứ tự: current section -> previous sections in same lesson -> unique by meaning |
| CSS/UI overview phân cấp bị lệch do đang thiết kế cho list phẳng | Vừa | Ưu tiên tái dùng class cũ, thêm class mới ít nhất cần thiết |

## Giả định

- Có thể thay `src/dailyLessonsData.js` bằng `src/lessonsData.js` và cập nhật script tag tương ứng.
- Có thể giữ `localStorage` key hiện tại `hiragna_daily_lessons` nếu chỉ đổi nội dung record theo `sectionId`, tránh migration rộng không cần thiết.
- Section cuối `lesson07` sẽ được mock với 6 từ để verify thuật toán distractor.
- Không cần chuyển feature này sang ES module; vẫn chạy theo global scope/script tag để khớp kiến trúc hiện tại.

## Các bước thực hiện

1. Tạo dataset mới `src/lessonsData.js` với 7 lessons, mỗi lesson có 2 sections, mỗi section có 12-15 vocab hoặc ít hơn theo yêu cầu.
2. Cập nhật `src/index.html` để đổi copy UI, script load order, và các label đặc thù từ `Học Mỗi Ngày` sang `Học Theo Bài`.
3. Refactor `src/dailyLesson.js`:
   - state mới theo `lessonId`, `sectionId`, `currentSection`, `phase`, `currentItems`, `practiceResults`
   - render overview phân cấp lesson/section
   - learn flow 1 phase duy nhất `learn-vocab`
   - practice flow cố định `jp -> meaning`
   - summary theo section
4. Viết thuật toán distractor mới:
   - lấy candidate trong current section trước
   - nếu thiếu, lấy thêm vocab từ các section đứng trước trong cùng lesson
   - loại trùng `id` và trùng `meaning`
   - chỉ render các option thật, không fallback hard-code placeholder
5. Cập nhật `src/progress.js` để helper đọc/ghi status hoạt động đúng với `sectionId` và `completedAt`.
6. Chạy self-check:
   - syntax check các file JS đã sửa
   - đọc diff và rà logic state transition
7. Sync docs tối thiểu và ghi `result.md`.

## Self-review plan

Sau khi implement, sẽ kiểm tra:
- [ ] Dataset mới đủ 7 bài, đúng cấu trúc `lesson -> sections -> vocabularies`
- [ ] Overview hiển thị đúng lesson titles, section titles, status badges
- [ ] Start section set `in_progress`, finish section set `completed`
- [ ] Progress counter dùng tổng số từ thật của section, không hard-code 5/10/3
- [ ] Practice format luôn là `jp -> meaning`, `secondary = reading`
- [ ] Distractor algorithm không sinh placeholder, không duplicate option, hoạt động với `lesson07 sectionB` 6 từ
- [ ] Regression: script order đúng, feature không chạm `src/quiz.js`

## Runtime verify plan

_Điều kiện: app đang chạy + browser automation khả dụng_

Sẽ kiểm tra:
- [ ] Flow: home → Học Theo Bài → overview lesson/section → learn-vocab → practice → summary
- [ ] Case: section thường 12-15 từ render progress và practice đủ 4 lựa chọn
- [ ] Case: section ngắn cuối `lesson07` vẫn đủ 4 lựa chọn nhờ quét ngược section trước trong cùng lesson
- [ ] Case: reload sau hoàn thành vẫn giữ badge `Hoàn thành`
- [ ] Case: mở lại section đã hoàn thành vẫn học lại bình thường
