# Risk Zones

## quiz.js — DOMContentLoaded closure

Toàn bộ UI logic và render functions nằm trong một closure duy nhất.
Thêm function mới phải đặt đúng bên trong closure này, không phải ngoài.

---

## quiz.js — quizState mutation

`quizState` là nguồn sự thật duy nhất.
Không được đặt state mới ngoài object này — không dùng biến global rời.

---

## hiraganaData.js — global scope dependency

`QUIZ_TYPE_CONFIG` và các data arrays được load qua script tag, không phải module.
`quiz.js` phụ thuộc vào thứ tự load script trong `index.html` (`hiraganaData.js` trước `quiz.js`).

---

## index.html — script load order

```html
<script src="hiraganaData.js"></script>  <!-- phải đứng trước -->
<script src="quiz.js"></script>
```

Đảo thứ tự sẽ khiến `QUIZ_TYPE_CONFIG` undefined khi `quiz.js` chạy.
