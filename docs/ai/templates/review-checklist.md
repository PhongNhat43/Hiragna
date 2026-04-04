# Review Checklist

## Kiến trúc

- [ ] Quiz logic chỉ nằm trong `quiz.js`
- [ ] UI rendering tách biệt khỏi business logic
- [ ] Không có inline JavaScript trong HTML
- [ ] State mới được thêm vào `quizState`, không tạo biến global rời

## Code quality

- [ ] Functions nhỏ, đơn nhiệm
- [ ] Không có code trùng lặp giữa hiragana và katakana
- [ ] Event listeners được attach bằng `addEventListener`, không dùng `onclick`

## Tính tương thích

- [ ] Tính năng mới không phá vỡ tính năng cũ
- [ ] Thứ tự load script trong `index.html` không thay đổi
- [ ] Hoạt động khi mở trực tiếp bằng file (không cần server)
