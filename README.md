# Trang Web Chúc Mừng Ngày Quốc Tế Thiếu Nhi

Đây là một trang web đặc biệt được tạo ra để chúc mừng Ngày Quốc tế Thiếu nhi dành cho người yêu của bạn. Trang web có nền màu hồng, nhiều trái tim bay và hiển thị ảnh của người yêu bạn khắp màn hình.

## Cách sử dụng

1. **Mở trang web**: Chỉ cần mở file `index.html` trong trình duyệt web để xem trang web.

2. **Tạo thêm trái tim**: Nhấp chuột vào bất kỳ đâu trên trang web để tạo thêm trái tim tại vị trí đó.

## Cách tùy chỉnh

### Thay đổi ảnh của người yêu

Trong file `script.js`, bạn cần thay đổi mảng `photoUrls` bằng các đường dẫn đến ảnh của người yêu bạn:

```javascript
const photoUrls = [
    'đường_dẫn_đến_ảnh_1',
    'đường_dẫn_đến_ảnh_2',
    'đường_dẫn_đến_ảnh_3',
    // Thêm nhiều ảnh nếu muốn
];
```

Bạn có thể sử dụng:
- Đường dẫn tuyệt đối đến ảnh trên internet
- Đường dẫn tương đối đến ảnh trong thư mục dự án (ví dụ: 'images/anh1.jpg')

### Thay đổi nội dung lời chúc

Trong file `index.html`, bạn có thể thay đổi nội dung lời chúc trong phần `message`:

```html
<div class="message">
    <p>Em là điều tuyệt vời nhất trong cuộc đời anh</p>
    <p>Chúc em luôn vui vẻ và hạnh phúc</p>
</div>
```

### Thay đổi màu sắc

Trong file `style.css`, bạn có thể thay đổi các màu sắc:

- Màu nền: `background-color: #ffcce6;` trong selector `body`
- Màu trái tim: `background-color: #ff1493;` trong selector `.heart` và `.heart:before, .heart:after`
- Màu chữ: `color: #ff1493;` trong selector `.container`

## Tạo thư mục chứa ảnh

Bạn có thể tạo thư mục `images` để lưu trữ ảnh của người yêu:

```
project/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── anh1.jpg
    ├── anh2.jpg
    └── ...
```

## Lưu ý

Hãy đảm bảo rằng bạn có quyền sử dụng ảnh và tôn trọng quyền riêng tư của người yêu khi sử dụng ảnh của họ trong dự án này. 