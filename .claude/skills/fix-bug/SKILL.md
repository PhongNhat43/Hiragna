---
name: fix-bug
description: Thực thi bug fix sau khi đã có root cause rõ và người dùng đã đồng ý hướng sửa. Không dùng để chẩn đoán bug từ đầu — dùng diagnose-bug trước. Chỉ gọi khi đã có kết luận root cause + fix được duyệt.
disable-model-invocation: true
---

> Legacy compatibility note: source of truth đã chuyển sang `docs/ai/playbooks/fix-bug.md`. Giữ file này để migration an toàn.

Implement bug fix: $ARGUMENTS

## Bước 0 — Kiểm tra điều kiện trước khi sửa

Dừng lại và yêu cầu người dùng quay lại `/diagnose-bug` nếu bất kỳ điều kiện nào dưới đây chưa đạt:

- [ ] Bug đã được chẩn đoán với root cause rõ ràng và bằng chứng cụ thể
- [ ] Hướng sửa cụ thể đã được người dùng xác nhận
- [ ] Đã xác định rõ bug còn trong scope task hiện tại hay đã được tách thành bug task riêng

**Không implement nếu còn mơ hồ về root cause hoặc chưa có xác nhận.**

---

## Bước 1 — Đọc context

**Nếu bug còn trong scope task hiện tại:**
- Đọc `docs/ai/tasks/active/<task-folder>/task.md` — scope đã duyệt
- Đọc `plan.md` — files và bước đã duyệt
- Đọc `result.md` nếu có — kết quả và vấn đề đã ghi nhận

**Nếu bug đã được tách thành bug task riêng:**
- Đọc `docs/ai/tasks/active/<bug-task-folder>/task.md`
- Đọc `plan.md` của bug task — hướng sửa đã duyệt

**Nếu không có task folder** (bug task nhỏ, không có folder):
- Dùng root cause và hướng sửa đã được xác nhận trong conversation làm context

---

## Bước 2 — Xác định file bị ảnh hưởng

Liệt kê các file sẽ chỉnh sửa. Dừng nếu:
- File nằm ngoài scope đã duyệt trong `plan.md`
- Cần thêm file mới không có trong plan → đề xuất cập nhật plan, chờ duyệt

---

## Bước 3 — Implement fix tối thiểu

- Chỉ sửa đúng root cause đã xác định — không refactor vùng xung quanh
- Không mở rộng sang file khác ngoài scope bug
- Không thêm feature, không cải tiến ngoài yêu cầu

---

## Bước 4 — Self-review

Sau khi sửa, đọc lại code đã thay đổi và xác nhận:
- [ ] Fix đúng root cause đã chẩn đoán
- [ ] Không tạo regression rõ ràng ở logic liên quan
- [ ] Không sửa ngoài phạm vi bug

---

## Bước 5 — Cập nhật tài liệu

**Nếu có task folder:**
- Cập nhật `result.md`: ghi rõ bug gì, root cause, fix thế nào
- Nếu bug còn trong scope → cập nhật `plan.md` nếu cần bổ sung bước

**Nếu không có task folder:** bỏ qua bước này.

---

## Bước 6 — Đưa ra manual verify steps

Liệt kê rõ các bước người dùng cần tự kiểm tra trên browser để xác nhận bug đã được fix.

---

Ràng buộc:
- Không tự chẩn đoán lại root cause — nếu cần diagnosis thêm, dùng `/diagnose-bug`
- Không archive task — đó là việc của `/archive-task`
- Không sửa `src/` ngoài phạm vi bug đang fix
- Không sửa skills khác, rules, hoặc task không liên quan
