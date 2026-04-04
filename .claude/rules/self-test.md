# Self-Test Rules

## Hai loại kiểm tra

### Self-review
Rà soát tĩnh bằng phân tích — không chạy app:
- Đọc code, trace logic, kiểm tra flow trên file
- Xác nhận đúng scope, không regression rõ ràng
- Kiểm tra stale reference trong docs

**Luôn bắt buộc.** Phải thực hiện trước runtime verify.

---

### Runtime verify

> **STATUS: TẠM VÔ HIỆU HÓA** — Không thực hiện cho đến khi được kích hoạt lại bởi Nhật Phong sama.
> Nội dung dưới đây được giữ nguyên để tái kích hoạt khi sẵn sàng.

Chạy app thật, thao tác thật trên browser:
- Mở app, đi qua flow chính
- Kiểm tra các case quan trọng
- Đọc console errors nếu có

**Bắt buộc khi đủ điều kiện** _(chỉ áp dụng khi đã kích hoạt lại)._

---

## Điều kiện runtime verify _(pending — chưa áp dụng)_

**Đủ điều kiện khi đồng thời:**
1. App đang chạy và có thể truy cập (local server hoặc URL khả dụng)
2. Có browser automation tool khả dụng (Playwright, Puppeteer, hoặc tương đương)

**Cách kiểm tra:**
```bash
# Kiểm tra server
curl -s -o /dev/null -w "%{http_code}" http://localhost:5500

# Kiểm tra browser automation
npx playwright --version 2>/dev/null || npx puppeteer --version 2>/dev/null
```

Nếu thiếu một trong hai điều kiện → fallback sang self-review, ghi rõ lý do trong `result.md`.

---

## Thứ tự bắt buộc

```
Implement xong
    ↓
1. Self-review (luôn làm)
    ↓
2. Runtime verify — TẠM VÔ HIỆU HÓA (bỏ qua cho đến khi kích hoạt lại)
    ↓
3. Ghi kết quả vào result.md
    ↓
4. Đề xuất người dùng verify
```

---

## Theo loại task

### UI / flow change
- Self-review: trace flow mới trong code, kiểm tra state transitions, regression
- Runtime verify: đi qua flow mới end-to-end, kiểm tra flow liên quan không vỡ

### Bug fix
- Self-review: xác nhận fix đúng root cause, không tạo regression
- Runtime verify: reproduce bug gốc → xác nhận đã fix, kiểm tra flow liên quan

### Data / config change
- Self-review: kiểm tra config mới load đúng, các component phụ thuộc không vỡ
- Runtime verify: kiểm tra các option/nhóm mới hiển thị và hoạt động đúng

### Docs / workflow change
- Self-review: `bash scripts/verify.sh`, kiểm tra stale references
- Runtime verify: không áp dụng

---

## Ghi vào result.md

Bắt buộc có 2 mục:

**Self-review:**
```
## Kết quả self-review
- [x] <check> — pass
- [ ] <check> — fail: <mô tả>
```

**Runtime verify** _(bỏ qua cho đến khi kích hoạt lại — không cần ghi mục này vào result.md)_

Có check fail → ghi vào **Vấn đề còn mở** → task ở lại `active/`.
