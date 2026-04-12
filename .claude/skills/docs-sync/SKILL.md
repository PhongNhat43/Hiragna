---
name: docs-sync
description: Phân tích task vừa thực hiện và xác định tài liệu nào trong docs/ai/ cần cập nhật để phản ánh current truth. Dùng sau khi implement xong, trước hoặc khi archive. Không sửa src/, không archive task.
disable-model-invocation: true
---

> Legacy compatibility note: source of truth đã chuyển sang `docs/ai/playbooks/docs-sync.md`. Giữ file này để migration an toàn.

Đồng bộ tài liệu sau thay đổi: $ARGUMENTS

## Bước 1 — Xác định nguồn context

**Nếu có task folder** (`docs/ai/tasks/active/HIRA-XXX-...`):
- Đọc `task.md` — scope và files bị ảnh hưởng
- Đọc `plan.md` — quyết định thiết kế, docs impact đã dự kiến
- Đọc `result.md` nếu có — kết quả thực tế

**Nếu là task nhỏ** (không có task folder):
- Dùng mô tả từ `$ARGUMENTS` làm context

## Bước 2 — Phân tích docs impact

Với từng file docs bên dưới, xác định: **cần update / không cần / cần kiểm tra thêm**.

| File | Cần update khi |
|---|---|
| `docs/ai/product/current-features.md` | Thêm, xóa, hoặc sửa behavior của feature |
| `docs/ai/product/current-flows.md` | Thay đổi flow màn hình, navigation, state transition |
| `docs/ai/core/architecture.md` | Thêm layer mới, đổi quizState, đổi script load, đổi storage |
| `docs/ai/history/changelog.md` | Bắt buộc khi archive — mọi task |
| `docs/ai/history/decisions.md` | Có quyết định thiết kế quan trọng không rõ ràng từ code |

## Bước 3 — Trình bày kết quả phân tích

Với mỗi file, nêu rõ:
- **Cần update:** phần nào, nội dung đề xuất cụ thể
- **Không cần update:** lý do ngắn gọn

## Bước 4 — Thực hiện

Cập nhật các file đã xác định là cần update. Chỉ chỉnh phần liên quan trực tiếp đến task — không mở rộng.

Ràng buộc:
- Không sửa `src/`
- Không archive task, không đóng task
- Không cập nhật docs ngoài `docs/ai/`
- Nếu không chắc một file có cần update không → nêu rõ để người dùng quyết định
