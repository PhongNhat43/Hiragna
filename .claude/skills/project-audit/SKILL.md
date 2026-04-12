---
name: project-audit
description: Audit tổng thể hoặc một phần project — kiến trúc, dependency, data flow, blast radius. Ưu tiên Grapuco nếu repo đã index, đối chiếu code thật khi cần.
disable-model-invocation: true
---

> Legacy compatibility note: source of truth đã chuyển sang `docs/ai/playbooks/project-audit.md`. Giữ file này để migration an toàn.

Audit: $ARGUMENTS

**Bước 1 — Kiểm tra Grapuco:**
- Gọi `list_repositories` để xác nhận repo đã index và status COMPLETED.
- Nếu chưa index hoặc status không phải COMPLETED → fallback sang đọc code trực tiếp, thông báo cho người dùng.

**Bước 2 — Thu thập dữ liệu từ Grapuco (nếu có):**
Dùng các tool phù hợp với yêu cầu audit:
- `get_architecture` — tổng quan nodes, edges, files
- `get_dependencies` — dependency graph của node cụ thể
- `get_data_flows` — data flow traces end-to-end
- `get_impact_analysis` — blast radius khi sửa file cụ thể
- `search_code` — tìm function/class theo tên
- `semantic_search` — tìm theo concept

**Bước 3 — Đối chiếu code thật:**
- Với kết luận quan trọng → đọc code liên quan để xác nhận.
- Nếu Grapuco graph có thể cũ (codebase thay đổi nhiều kể từ lần index cuối) → nhắc người dùng cập nhật index.

**Bước 4 — Trình bày kết quả:**
- Ngắn gọn, có cấu trúc, trả lời đúng câu hỏi audit.
- Không đề xuất sửa code trừ khi người dùng yêu cầu.

Ràng buộc:
- Đây là phân tích — không sửa file
- Grapuco checklist: `.claude/rules/global.md` → mục Grapuco
