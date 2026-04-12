> Legacy compatibility note: task sizing rule tóm tắt đã được map vào `AGENTS.md`, còn workflow theo loại task sống trong `docs/ai/playbooks/small-change.md` và `docs/ai/playbooks/big-feature.md`.

# Task Sizing Rules

## Tiêu chí phân loại

### Task nhỏ
Đủ tất cả các điều kiện sau:
- Thay đổi 1 file, hoặc 2 file nhưng rất cục bộ
- Không đổi flow màn hình, không đổi state structure
- Scope rõ ràng, rủi ro regression thấp
- Có thể mô tả đầy đủ trong 2-3 câu

**Xử lý:** Bắt buộc theo thứ tự:
1. Phân tích ngắn — nêu rõ file bị ảnh hưởng, rủi ro chính nếu có, mini-plan
2. Chờ người dùng xác nhận rõ ràng
3. Implement

Không tạo task folder. Không tạo record trừ khi người dùng yêu cầu.
**Không được tự interpret "yêu cầu rõ" là có thể implement ngay.**
Chỉ implement khi người dùng xác nhận sau khi đã đọc mini-plan.

---

### Task vừa
Ít nhất một trong các điều kiện sau:
- Thay đổi 2-3 file
- Có đổi flow màn hình hoặc thêm state mới vào `quizState`
- Có rủi ro regression ở tính năng liên quan
- Cần thiết kế trước (data structure, config, thứ tự thực hiện)

**Xử lý:** Bắt buộc tạo task folder + `task.md` + `plan.md`. Chờ duyệt plan trước khi implement.

---

### Task lớn
Ít nhất một trong các điều kiện sau:
- Thay đổi 4+ file hoặc nhiều layer cùng lúc (UI + Logic + Data)
- Đổi kiến trúc, thêm config object mới, đổi script load order
- Ảnh hưởng đến toàn bộ flow chính
- Có quyết định thiết kế cần ghi vào `decisions.md`

**Xử lý:** Bắt buộc tạo task folder đầy đủ. Plan phải có phân tích rủi ro. Sau archive phải cập nhật `decisions.md`.

---

## Tóm tắt

| | Task nhỏ | Task vừa | Task lớn |
|---|---|---|---|
| Task folder | Không bắt buộc | Bắt buộc | Bắt buộc |
| plan.md | Không | Bắt buộc | Bắt buộc |
| Chờ duyệt plan | Không | Bắt buộc | Bắt buộc |
| result.md | Chỉ khi user yêu cầu | Bắt buộc | Bắt buộc |

---

## Nguyên tắc khi không chắc

Nếu không phân loại được rõ → **ưu tiên lên mức cao hơn**.
Xử lý task vừa như lớn không gây hại. Xử lý task lớn như nhỏ thì nguy hiểm.
