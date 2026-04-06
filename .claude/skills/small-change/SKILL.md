---
name: small-change
description: Xử lý task nhỏ (1–2 file, không đổi flow, scope rõ). Phân tích ngắn → chờ xác nhận → implement → self-review. Không implement trước khi người dùng xác nhận.
disable-model-invocation: true
---

Task nhỏ: $ARGUMENTS

Thực hiện theo thứ tự — không bỏ bước, không implement trước khi được xác nhận:

**Bước 1 — Phân tích ngắn:**
- File(s) bị ảnh hưởng
- Rủi ro chính nếu có (regression, side effect)
- Mini-plan: các bước thay đổi cụ thể

**Bước 2 — Chờ người dùng xác nhận rõ ràng.**

**Bước 3 — Implement** theo đúng mini-plan đã duyệt.

**Bước 4 — Self-review:** đọc lại code đã sửa, trace logic, xác nhận không regression.

Ràng buộc:
- Không tạo task folder trừ khi người dùng yêu cầu
- Không sửa ngoài phạm vi yêu cầu
- Nếu scope phình ra → đề xuất nâng thành task vừa/lớn và dùng `/big-feature`
- Nếu phát sinh bug khi verify → dùng `/diagnose-bug`
- Grapuco: chỉ dùng khi cần xác định blast radius hoặc shared dependency; không bắt buộc
