---
name: archive-task
description: Finalization skill — điều phối toàn bộ bước cuối task: kiểm tra điều kiện, sync docs nếu cần, rồi archive. Dùng khi task đã implement xong và user đã verify. Không dùng để code hay debug.
disable-model-invocation: true
---

Finalize task: $ARGUMENTS

## Bước 1 — Xác định task

Nếu `$ARGUMENTS` có tên task (vd: `HIRA-009`) → tìm trong `docs/ai/tasks/active/`.
Nếu không có argument → liệt kê task đang trong `docs/ai/tasks/active/` và hỏi task nào cần đóng.

Đọc `task.md`, `plan.md`, `result.md`.

---

## Bước 2 — Kiểm tra 4 điều kiện archive

| # | Điều kiện | Cách xác định |
|---|---|---|
| 1 | **Implement xong** | `result.md` có mô tả thay đổi thực tế, không còn TODO trong plan |
| 2 | **`result.md` đầy đủ** | Có đủ section: Trạng thái, Files changed, Self-review, Manual verify steps, Vấn đề còn mở |
| 3 | **Không còn open issues** | "Vấn đề còn mở" ghi "Không có" hoặc đã có task mới cho từng issue |
| 4 | **User đã verify và xác nhận đóng task** | Có xác nhận rõ từ người dùng trong conversation — không tự giả định |

Nếu bất kỳ điều kiện nào chưa đạt → liệt kê rõ, dừng lại, không tiến hành bước tiếp theo.

---

## Bước 3 — Kiểm tra và xử lý docs impact

Phân tích task để xác định docs nào cần sync. Kiểm tra từng file:

| File | Cần update khi |
|---|---|
| `docs/ai/product/current-features.md` | Task thêm, xóa, hoặc sửa behavior của feature |
| `docs/ai/product/current-flows.md` | Task thay đổi flow màn hình, navigation, state transition |
| `docs/ai/core/architecture.md` | Task thêm layer, đổi quizState, đổi script load, đổi storage |
| `docs/ai/history/changelog.md` | Mọi task — bắt buộc khi archive |
| `docs/ai/history/decisions.md` | Task có quyết định thiết kế đáng ghi lại |
| `CLAUDE.md` | Task thay đổi workflow cốt lõi, skills hiện có, rules vận hành, hoặc entry points AI cần biết |

Với mỗi file: nêu rõ **cần update / không cần / lý do**.

Sau đó sync những file cần update theo nguyên tắc **tối thiểu và an toàn**:
- Chỉ chỉnh đúng phần liên quan đến task — không rewrite toàn bộ section
- Nếu impact rõ ràng và nhỏ → tự sync
- Nếu impact lớn, mơ hồ, hoặc cần viết lại nhiều → dừng, trình bày đề xuất, chờ người dùng xác nhận trước khi sửa

---

## Bước 4 — Archive

Sau khi docs đã sync:
- Tóm tắt nhanh: tên task, files đã thay đổi, docs đã sync
- Chờ người dùng xác nhận lần cuối
- Move folder: `docs/ai/tasks/active/HIRA-XXX-...` → `docs/ai/tasks/archive/HIRA-XXX-...`

---

Ràng buộc:
- Không tự bỏ qua bất kỳ điều kiện nào ở Bước 2
- Không archive khi còn open issues chưa có task mới
- Không archive khi docs chưa sync xong
- Không sửa `src/`
- Không tự giả định user đã verify hoặc đã xác nhận đóng task
