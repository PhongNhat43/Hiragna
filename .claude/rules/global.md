# Global Rules

## Ngôn ngữ và giao tiếp
- Luôn trả lời bằng tiếng Việt, trừ khi người dùng yêu cầu khác.
- Gọi người dùng là "Nhật Phong sama".
- Ngắn gọn, rõ ràng, thực dụng. Không dài dòng.

---

## Nguyên tắc làm việc
- Hiểu đúng yêu cầu trước khi hành động. Nếu mơ hồ, hỏi lại.
- Thay đổi tối thiểu, đúng scope, dễ review.
- Không tự mở rộng scope. Không refactor ngoài yêu cầu.
- Không sửa `src/` ngoài yêu cầu rõ ràng.

---

## Quy trình theo loại yêu cầu

**Chỉ phân tích:** Không sửa file, không đề xuất patch trừ khi được yêu cầu.

**Bug fix / feature / refactor / flow change:**
- Không code ngay. Phân tích → xác định files bị ảnh hưởng → nêu rủi ro → đề xuất plan.
- Phân loại task size (nhỏ / vừa / lớn) trước khi quyết định xử lý. Chi tiết: `.claude/rules/task-sizing.md`
  - Task nhỏ: phân tích ngắn (files, rủi ro, mini-plan) → chờ người dùng xác nhận → implement. Không bắt buộc hồ sơ.
  - Task vừa/lớn: bắt buộc task folder + plan.md → chờ duyệt → implement.
- **Không được implement trước khi người dùng xác nhận**, bất kể task nhỏ hay lớn.

**Sau khi implement:**
1. Self-review (luôn bắt buộc) — mỗi check phải có bằng chứng, không được claim "pass" chỉ bằng suy đoán
2. Cập nhật `result.md` — ghi rõ đã verify bằng cách nào và phần nào còn chờ người dùng
3. Đề xuất người dùng verify (ghi rõ manual verify steps)

Chi tiết: `.claude/rules/self-test.md`

---

## Điều kiện archive task

Task chỉ được archive khi đủ cả 4 điều kiện:
1. Code implement xong
2. `result.md` đã cập nhật đầy đủ (gồm kết quả self-review và manual verify steps)
3. Người dùng đã verify
4. Người dùng xác nhận đóng task

Nếu còn issue mở → task ở lại `active/`.
Docs phải sync trước khi archive. Chi tiết: `.claude/rules/docs-sync.md`

---

## Xử lý bug phát sinh trong task

**Khi phát hiện bug (dù do mình tự phát hiện hay người dùng báo):**
1. **Không fix ngay.** Chuyển sang mode diagnosis-first.
2. Phân tích, xác định root cause, nêu bằng chứng mạnh nhất.
3. Đề xuất fix tối thiểu.
4. **Chờ người dùng xác nhận rõ trước khi implement.**

Diagnosis và implement là hai bước tách biệt. Không được vừa debug vừa tự sửa.

Chi tiết phân loại scope và quy trình: `.claude/rules/bug-handling.md`

---

## Grapuco — code graph tool

### Nguyên tắc
- Grapuco là bản đồ hỗ trợ, **không thay thế** việc đọc code thật.
- Với kết luận quan trọng hoặc trước khi sửa code → đối chiếu lại code nếu cần.
- Nếu codebase đã thay đổi đáng kể kể từ lần index cuối → nhắc người dùng cập nhật index.

### Khi nào dùng
- **Ưu tiên dùng:** project audit, impact analysis, dependency tracing, data flow tracing.
- **Dùng khi cần:** big-feature (phân tích trước khi lên plan), diagnose-bug (trace call chain).
- **Không bắt buộc:** task nhỏ, fix-bug, docs-sync, archive-task.

### Checklist khi dùng Grapuco
```
- [x] Đã dùng Grapuco (architecture / dependency / impact / flow)
- [x] Đã đối chiếu lại với code thật ở vùng liên quan
- [ ] Cần cập nhật Grapuco index trước khi tin vào kết quả
```

---

## Tài liệu tham chiếu
- Context & architecture: `docs/ai/core/`
- Current product state: `docs/ai/product/`
- Rules chi tiết: `.claude/rules/`
