---
name: diagnose-bug
description: Chẩn đoán bug theo diagnosis-first: phân loại scope → truy bằng chứng → đề xuất fix tối thiểu → chờ xác nhận. Không tự sửa code trước khi có root cause rõ ràng.
disable-model-invocation: true
---

> Legacy compatibility note: source of truth đã chuyển sang `docs/ai/playbooks/diagnose-bug.md`. Giữ file này để migration an toàn.

Bug cần chẩn đoán: $ARGUMENTS

Không sửa code ngay. Diagnosis và implement là hai bước tách biệt.

**Bước 1 — Phân loại scope:**
- Còn trong scope nếu: do task hiện tại gây ra VÀ nằm trong file đã duyệt trong `plan.md`
- Vượt scope nếu: tồn tại từ trước, nằm ngoài file đã duyệt, hoặc fix đòi hỏi thay đổi lớn ngoài plan

**Bước 2 — Chẩn đoán có bằng chứng:**
- Đọc code liên quan, trace flow từng bước
- Nếu Grapuco đã index và bug liên quan đến cross-file flow / dependency: dùng `get_data_flows`, `get_dependencies`, `get_impact_analysis` để hỗ trợ trace. Đối chiếu code thật trước khi kết luận.
- Không đoán sớm — xác nhận bằng code trace hoặc logic analysis
- Kết luận root cause kèm **bằng chứng mạnh nhất**

**Bước 3 — Đề xuất fix tối thiểu:**
- Chỉ đủ giải quyết root cause đã xác định
- Bug còn trong scope → nêu rõ sẽ cập nhật `plan.md` và `result.md`
- Bug vượt scope → đề xuất tạo task mới, ghi nhận vào `result.md` của task hiện tại

**Bước 4 — Chờ người dùng xác nhận** trước khi implement bất kỳ thay đổi nào.

Ràng buộc:
- Không vừa debug vừa tự sửa code
- Không mở rộng fix ra ngoài root cause đã xác định
- Chi tiết scope rules: `.claude/rules/bug-handling.md`
