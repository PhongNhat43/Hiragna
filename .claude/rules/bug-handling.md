> Legacy compatibility note: bug workflow hiện được map sang `docs/ai/playbooks/diagnose-bug.md` và `docs/ai/playbooks/fix-bug.md`. Giữ file này để đối chiếu trong migration.

# Bug Handling Rules

## Nguyên tắc chung

Không tự động fix ngay bug phát sinh trong khi đang làm task hoặc trong lúc verify.
Bước đầu tiên luôn là **diagnosis** — fix trước khi có root cause là vi phạm quy trình.

---

## Quy trình khi phát hiện bug

Áp dụng cho mọi trường hợp: bug tự phát hiện, bug người dùng báo, bug lộ ra trong lúc verify.

### Bước 1 — Diagnosis (bắt buộc, không được bỏ qua)

- Điều tra root cause theo hướng có bằng chứng, không đoán sớm.
- Xác định rõ: element/function/flow nào bị ảnh hưởng, tại sao, khi nào xảy ra.
- Nêu root cause kết luận kèm **bằng chứng mạnh nhất** (code trace, log, test case, v.v.).
- Không được vừa debug vừa tự sửa code.

### Bước 2 — Phân loại scope

Bug còn trong scope nếu:
- Trực tiếp do thay đổi của task này gây ra, **và**
- Nằm trong phạm vi file/module đã được duyệt trong `plan.md`

Bug vượt scope nếu:
- Tồn tại từ trước task, **hoặc**
- Nằm ở file/module ngoài `plan.md`, **hoặc**
- Fix đòi hỏi thay đổi đáng kể ngoài scope đã duyệt

### Bước 3 — Đề xuất fix

- Đề xuất fix **tối thiểu**: chỉ đủ giải quyết root cause đã xác định.
- Không mở rộng thêm ngoài phạm vi fix.
- Nếu có nhiều hướng fix, nêu rõ lý do chọn hướng nào.

### Bước 4 — Chờ xác nhận

**Không implement cho đến khi người dùng xác nhận rõ ràng.**
Diagnosis và implement là hai bước tách biệt.

---

## Khi fix trong task hiện tại (bug còn trong scope)

1. Cập nhật `plan.md` — bổ sung bước fix
2. Implement sau khi được duyệt
3. Cập nhật `result.md` — ghi rõ: bug gì, root cause, fix thế nào
4. Không mở rộng sang file khác ngoài scope đã duyệt

---

## Khi tách task mới (bug vượt scope)

1. Ghi nhận bug vào `result.md` của task hiện tại, mục **"Vấn đề còn mở"**
2. Tạo task mới trong `docs/ai/tasks/active/` theo đúng workflow
3. Trong `task.md` của task mới, ghi rõ: **"Phát sinh từ: HIRA-XXX"**
4. Task hiện tại vẫn có thể archive nếu đủ điều kiện

---

## Điều kiện archive khi có bug liên quan

- Bug **trong scope và đã fix** → đủ điều kiện archive bình thường
- Bug **vượt scope, đã ghi nhận vào result.md, và đã tạo task mới** → đủ điều kiện archive
- Bug **chưa ghi nhận hoặc chưa có task mới** → **không được archive**
