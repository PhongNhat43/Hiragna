# Project Audit Playbook

Dùng khi cần audit tổng thể hoặc một phần repo: kiến trúc, dependency, data flow, blast radius.

## Mục tiêu

- Trả lời câu hỏi audit bằng bằng chứng
- Không sửa file
- Dùng Grapuco nếu hữu ích, nhưng không thay thế việc đọc code thật

## Quy trình

1. Xác định câu hỏi audit và vùng code liên quan
2. Nếu repo đã có Grapuco index hợp lệ, dùng để lấy architecture / dependencies / impact / data flows
3. Đối chiếu lại code thật ở các kết luận quan trọng
4. Tóm tắt findings ngắn gọn, đúng câu hỏi, không đề xuất patch nếu chưa được yêu cầu

## Grapuco Guidance

- Ưu tiên cho impact analysis, dependency tracing, data flow tracing
- Nếu graph có thể cũ, nêu rõ mức độ tin cậy
- Checklist:
  - đã dùng graph khi phù hợp
  - đã đối chiếu code thật ở điểm kết luận
  - đã nêu nếu cần re-index

## Output Mong Muốn

- audit ngắn
- key findings
- impacted areas / files
- assumptions hoặc confidence level nếu có
