document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM đã sẵn sàng, bắt đầu khởi tạo...");

    // Kiểm tra và tạo các container nếu chưa tồn tại
    if (!document.getElementById('photos-container')) {
        console.log("Không tìm thấy photos-container, đang tạo mới");
        const container = document.createElement('div');
        container.id = 'photos-container';
        document.body.appendChild(container);
    }

    if (!document.getElementById('hearts-container')) {
        console.log("Không tìm thấy hearts-container, đang tạo mới");
        const container = document.createElement('div');
        container.id = 'hearts-container';
        document.body.appendChild(container);
    }

    if (!document.getElementById('messages-container')) {
        console.log("Không tìm thấy messages-container, đang tạo mới");
        const container = document.createElement('div');
        container.id = 'messages-container';
        document.body.appendChild(container);
    }

    // Lưu trữ thông tin vị trí đã sử dụng
    window.usedPositions = [];

    // Phát hiện thiết bị di động
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // Khởi tạo biến để theo dõi số lượng phần tử
    window.currentHearts = 0;
    window.currentPhotos = 0;
    window.currentMessages = 0;

    // Tạo ảnh test để xác nhận đường dẫn ảnh hoạt động
    createTestImage();

    // Phân chia màn hình thành lưới để phân bố đều các phần tử
    setupPositionGrid();

    // Giới hạn số lượng phần tử tối đa dựa trên loại thiết bị
    if (isSmallMobile) {
        // Điện thoại nhỏ - điều chỉnh số lượng phù hợp
        window.maxHearts = 100;
        window.maxPhotos = 40;
        window.maxMessages = 30;

        // Tạo phần tử ban đầu
        createHearts(50);
        createPhotos(20);
        createMovingMessages(15);
    } else if (isMobile) {
        // Điện thoại thông thường
        window.maxHearts = 150;
        window.maxPhotos = 60;
        window.maxMessages = 50;

        // Tạo phần tử ban đầu
        createHearts(80);
        createPhotos(30);
        createMovingMessages(25);
    } else {
        // Máy tính - số lượng nhiều hơn
        window.maxHearts = 300;
        window.maxPhotos = 100;
        window.maxMessages = 80;

        // Tạo phần tử ban đầu
        createHearts(150);
        createPhotos(50);
        createMovingMessages(40);
    }

    // Khoảng thời gian tạo thêm phần tử tùy theo thiết bị
    const heartInterval = isMobile ? 2000 : 1500;
    const photoInterval = isMobile ? 4000 : 3000;
    const messageInterval = isMobile ? 3000 : 2500;

    // Tạo thêm trái tim định kỳ nếu cần
    setInterval(() => {
        if (window.currentHearts < window.maxHearts) {
            createHearts(isMobile ? 5 : 8);
        }
    }, heartInterval);

    // Tạo thêm ảnh định kỳ nếu cần
    setInterval(() => {
        if (window.currentPhotos < window.maxPhotos) {
            createPhotos(isMobile ? 3 : 5);
        }
    }, photoInterval);

    // Tạo thêm lời chúc định kỳ nếu cần
    setInterval(() => {
        if (window.currentMessages < window.maxMessages) {
            createMovingMessages(isMobile ? 3 : 5);
        }
    }, messageInterval);

    // Thiết lập theo dõi animation để tạo hiệu ứng lặp lại
    setInterval(checkAndResetElements, 800);

    // Khởi tạo kiểm tra phần tử đầu tiên
    setTimeout(checkAndResetElements, 3000);

    // Xóa vị trí đã sử dụng sau một khoảng thời gian để tái sử dụng
    setInterval(() => {
        window.usedPositions = window.usedPositions.slice(-100); // Giữ 100 vị trí gần nhất
    }, 8000);

    // Thêm sự kiện để cập nhật các giới hạn khi người dùng xoay màn hình
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        const newIsSmallMobile = window.innerWidth <= 480;

        // Cập nhật lưới vị trí khi thay đổi kích thước màn hình
        setupPositionGrid();

        // Chỉ cập nhật nếu trạng thái thiết bị thay đổi
        if (newIsSmallMobile !== isSmallMobile || newIsMobile !== isMobile) {
            if (newIsSmallMobile) {
                window.maxHearts = 100;
                window.maxPhotos = 40;
                window.maxMessages = 30;
            } else if (newIsMobile) {
                window.maxHearts = 150;
                window.maxPhotos = 60;
                window.maxMessages = 50;
            } else {
                window.maxHearts = 300;
                window.maxPhotos = 100;
                window.maxMessages = 80;
            }
        }
    });

    // Đảm bảo tất cả các ảnh đều có sự kiện cảm ứng
    addTouchEventsToPhotos();
});

// Biến chứa trạng thái ứng dụng
window.usedPositions = [];
window.gridSystem = {
    initialized: false,
    columns: 0,
    rows: 0,
    cellWidth: 0,
    cellHeight: 0,
    grid: [],
    marginX: 20, // Khoảng cách giữa các cột
    marginY: 40 // Khoảng cách giữa các hàng
};

// Thiết lập hệ thống lưới vị trí
function setupPositionGrid() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth <= 768;

    // Kích thước ô lưới
    const cellWidth = isMobile ? 60 : 100;
    const cellHeight = isMobile ? 60 : 100;

    // Tính số cột và hàng
    const columns = Math.floor(viewportWidth / (cellWidth + window.gridSystem.marginX));
    const rows = Math.floor(viewportHeight / (cellHeight + window.gridSystem.marginY));

    // Khởi tạo mảng lưới
    const grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < columns; col++) {
            grid[row][col] = {
                used: false,
                x: col * (cellWidth + window.gridSystem.marginX) + Math.random() * window.gridSystem.marginX,
                y: row * (cellHeight + window.gridSystem.marginY) + Math.random() * window.gridSystem.marginY
            };
        }
    }

    // Cập nhật gridSystem
    window.gridSystem = {
        initialized: true,
        columns: columns,
        rows: rows,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        grid: grid,
        marginX: window.gridSystem.marginX,
        marginY: window.gridSystem.marginY
    };

    console.log("Đã thiết lập lưới vị trí:", window.gridSystem);
}

// Tìm vị trí trống trong lưới
function findEmptyGridPosition() {
    if (!window.gridSystem.initialized) {
        setupPositionGrid();
    }

    // Tìm ngẫu nhiên ô lưới chưa sử dụng
    const availableCells = [];

    for (let row = 0; row < window.gridSystem.rows; row++) {
        for (let col = 0; col < window.gridSystem.columns; col++) {
            if (!window.gridSystem.grid[row][col].used) {
                availableCells.push({
                    row: row,
                    col: col,
                    x: window.gridSystem.grid[row][col].x,
                    y: window.gridSystem.grid[row][col].y
                });
            }
        }
    }

    // Nếu không còn ô trống, reset một số ô đã sử dụng
    if (availableCells.length === 0) {
        // Reset 20% ô ngẫu nhiên
        const totalCells = window.gridSystem.rows * window.gridSystem.columns;
        const cellsToReset = Math.max(5, Math.floor(totalCells * 0.2));

        for (let i = 0; i < cellsToReset; i++) {
            const randomRow = Math.floor(Math.random() * window.gridSystem.rows);
            const randomCol = Math.floor(Math.random() * window.gridSystem.columns);
            window.gridSystem.grid[randomRow][randomCol].used = false;
        }

        // Thử lại
        return findEmptyGridPosition();
    }

    // Chọn ngẫu nhiên một ô trống
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cell = availableCells[randomIndex];

    // Đánh dấu ô đã sử dụng
    window.gridSystem.grid[cell.row][cell.col].used = true;

    // Trả về tọa độ x ngẫu nhiên trong phạm vi cột
    return {
        x: cell.x,
        y: cell.y
    };
}

// Đánh dấu ô lưới là trống khi phần tử rời khỏi màn hình
function freeGridPosition(x, y) {
    if (!window.gridSystem.initialized) return;

    // Tìm ô gần nhất với tọa độ x, y
    let closestRow = -1;
    let closestCol = -1;
    let minDistance = Infinity;

    for (let row = 0; row < window.gridSystem.rows; row++) {
        for (let col = 0; col < window.gridSystem.columns; col++) {
            const cell = window.gridSystem.grid[row][col];
            const distance = Math.sqrt(
                Math.pow(cell.x - x, 2) +
                Math.pow(cell.y - y, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestRow = row;
                closestCol = col;
            }
        }
    }

    // Đánh dấu ô là trống
    if (closestRow >= 0 && closestCol >= 0) {
        window.gridSystem.grid[closestRow][closestCol].used = false;
    }
}

// Kiểm tra xem vị trí có trùng với vị trí khác không
function isPositionOverlapping(left, top, width, height, margin = 10) {
    // Mở rộng vùng kiểm tra bằng cách thêm margin
    const area = {
        left: left - margin,
        right: left + width + margin,
        top: top - margin,
        bottom: top + height + margin
    };

    // Kiểm tra có trùng với vị trí đã sử dụng không
    for (let pos of window.usedPositions) {
        // Kiểm tra xem hai hình chữ nhật có giao nhau không
        if (!(area.right < pos.left || area.left > pos.right ||
                area.bottom < pos.top || area.top > pos.bottom)) {
            return true; // Có giao nhau
        }
    }

    return false; // Không giao nhau
}

// Thêm vị trí vào danh sách đã sử dụng
function addUsedPosition(left, top, width, height) {
    window.usedPositions.push({
        left: left,
        right: left + width,
        top: top,
        bottom: top + height
    });
}

// Tìm vị trí ngẫu nhiên không bị trùng lắp
function findNonOverlappingPosition(width, height, fromTop) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Thử sử dụng lưới vị trí trước
    const gridPosition = findEmptyGridPosition();
    if (gridPosition) {
        // Điều chỉnh vị trí dựa trên hướng di chuyển
        let posY;
        if (fromTop) {
            posY = -height - Math.random() * 100; // Bắt đầu từ trên màn hình
        } else {
            posY = viewportHeight + Math.random() * 100; // Bắt đầu từ dưới màn hình
        }

        return { left: gridPosition.x, top: posY };
    }

    // Nếu không có lưới vị trí hoặc không tìm thấy vị trí trống, sử dụng phương pháp cũ
    let left, top;
    let attempts = 0;
    const maxAttempts = 20; // Giới hạn số lần thử

    do {
        // Tạo vị trí ngẫu nhiên
        left = Math.random() * (viewportWidth - width);

        if (fromTop) {
            top = -height - Math.random() * 100; // Bắt đầu từ trên màn hình
        } else {
            top = viewportHeight + Math.random() * 100; // Bắt đầu từ dưới màn hình
        }

        attempts++;
        // Nếu đã thử nhiều lần mà không tìm được vị trí phù hợp, giảm yêu cầu
        if (attempts > maxAttempts) {
            return { left: left, top: top }; // Trả về vị trí cuối cùng
        }
    } while (isPositionOverlapping(left, top, width, height));

    // Thêm vị trí này vào danh sách đã sử dụng
    addUsedPosition(left, top, width, height);

    return { left: left, top: top };
}

// Kiểm tra và đặt lại vị trí các phần tử di chuyển ra khỏi màn hình
function checkAndResetElements() {
    console.log("Kiểm tra vị trí các phần tử...");
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const margin = 100; // Khoảng cách an toàn

    // Hàm kiểm tra từng loại phần tử
    function checkElementsOfType(selector, fromBottom = false) {
        const elements = document.querySelectorAll(selector);
        console.log(`Kiểm tra ${elements.length} phần tử ${selector}`);

        elements.forEach(element => {
            if (!element) return;

            const rect = element.getBoundingClientRect();

            // Kiểm tra phần tử có nằm ngoài màn hình không
            const isOffTop = rect.bottom < -margin;
            const isOffBottom = rect.top > viewportHeight + margin;
            const isOffLeft = rect.right < -margin;
            const isOffRight = rect.left > viewportWidth + margin;

            // Đặt lại vị trí nếu phần tử ra khỏi màn hình
            if (isOffTop || isOffBottom || isOffLeft || isOffRight) {
                console.log(`Đặt lại vị trí cho phần tử ${selector}`);
                resetElement(element, fromBottom);

                // Xóa lớp zoomed nếu là ảnh (để tránh ảnh phóng to khi di chuyển)
                if (element.classList.contains('photo') && element.classList.contains('zoomed')) {
                    element.classList.remove('zoomed');

                    // Xóa overlay nếu không còn ảnh nào được phóng to
                    if (!document.querySelector('.photo.zoomed')) {
                        const overlay = document.querySelector('.overlay');
                        if (overlay) overlay.remove();
                    }
                }
            }
        });
    }

    // Kiểm tra từng loại phần tử
    checkElementsOfType('.heart');
    checkElementsOfType('.photo');
    checkElementsOfType('.moving-message');

    // Tạo thêm phần tử mới nếu cần
    const isMobile = window.innerWidth <= 768;

    if (window.currentHearts < window.maxHearts * 0.7) {
        console.log("Tạo thêm trái tim");
        createHearts(isMobile ? 10 : 15);
    }

    if (window.currentPhotos < window.maxPhotos * 0.7) {
        console.log("Tạo thêm ảnh");
        createPhotos(isMobile ? 5 : 8);
    }

    if (window.currentMessages < window.maxMessages * 0.7) {
        console.log("Tạo thêm tin nhắn");
        createMovingMessages(isMobile ? 5 : 8);
    }
}

// Đặt lại vị trí phần tử khi di chuyển ra khỏi màn hình
function resetElement(element, fromBottom = false) {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 768;

    // Ẩn phần tử tạm thời
    element.classList.add('off-screen');

    // Dừng animation
    element.style.animationPlayState = 'paused';

    // Lấy kích thước của phần tử
    const rect = element.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // Đánh dấu vị trí hiện tại là trống trong lưới
    if (element.style.left && element.style.top) {
        const left = parseFloat(element.style.left);
        const top = parseFloat(element.style.top);
        if (!isNaN(left) && !isNaN(top)) {
            freeGridPosition(left, top);
        }
    }

    // Tìm vị trí mới từ lưới
    const gridPosition = findEmptyGridPosition();
    let left;

    if (gridPosition) {
        left = gridPosition.x;
    } else {
        // Nếu không tìm được vị trí trong lưới, tạo ngẫu nhiên
        left = Math.random() * (viewportWidth - elementWidth);
    }

    // Đặt vị trí trên/dưới màn hình
    let top;
    if (fromBottom) {
        top = viewportHeight + Math.random() * 100;
    } else {
        top = -elementHeight - Math.random() * 100;
    }

    // Đặt vị trí mới
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;

    // Xoay hình ảnh ngẫu nhiên nếu là ảnh
    if (element.classList.contains('photo')) {
        element.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        // Đảm bảo ảnh không ở trạng thái phóng to
        element.classList.remove('zoomed');
    }

    // Thêm hiệu ứng ngẫu nhiên cho trái tim
    if (element.classList.contains('heart')) {
        // Xóa tất cả các lớp hiệu ứng
        element.classList.remove('sparkle', 'spin', 'bounce');

        // Thay đổi màu sắc ngẫu nhiên
        const hue = Math.floor(Math.random() * 60 - 10);
        const saturation = 90 + Math.random() * 10;
        const lightness = 55 + Math.random() * 25;
        element.style.backgroundColor = `hsl(${330 + hue}, ${saturation}%, ${lightness}%)`;

        // Thêm hiệu ứng ngẫu nhiên
        const effects = ['heartbeat', 'none', 'floatUpDown', 'pulse', 'sparkle', 'spin', 'bounce'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];

        // Xóa animation cũ
        element.style.animation = '';

        // Thêm lớp hiệu ứng đặc biệt nếu có
        if (randomEffect === 'sparkle') {
            element.classList.add('sparkle');
        } else if (randomEffect === 'spin') {
            element.classList.add('spin');
        } else if (randomEffect === 'bounce') {
            element.classList.add('bounce');
        }
        // Thêm hiệu ứng mới
        else if (randomEffect !== 'none') {
            setTimeout(() => {
                if (randomEffect === 'heartbeat') {
                    element.style.animation = `heartbeat 1.5s infinite ease-in-out`;
                } else if (randomEffect === 'floatUpDown') {
                    element.style.animation = `floatUpDown 2s infinite ease-in-out`;
                } else if (randomEffect === 'pulse') {
                    element.style.animation = `pulse 2s infinite ease-in-out`;
                }
            }, 100);
        }
    }

    // Thêm hiệu ứng chuyển động ngẫu nhiên (60% dọc, 40% ngang)
    const useHorizontal = Math.random() > 0.6;

    // Xóa các lớp hiệu ứng cũ
    element.classList.remove('vertical-moving', 'horizontal-moving', 'reverse');

    // Đặt hướng di chuyển mới
    const animationClass = useHorizontal ? 'horizontal-moving' : 'vertical-moving';

    // Đặt thời gian animation ngẫu nhiên
    let animationDuration;

    if (element.classList.contains('heart')) {
        animationDuration = isMobile ? Math.random() * 15 + 10 : Math.random() * 20 + 15;
    } else if (element.classList.contains('photo')) {
        animationDuration = isMobile ? Math.random() * 20 + 15 : Math.random() * 25 + 20;
    } else {
        animationDuration = isMobile ? Math.random() * 20 + 15 : Math.random() * 25 + 20;
    }

    // Sử dụng setTimeout để đảm bảo các thay đổi CSS được áp dụng
    setTimeout(() => {
        // Xóa thuộc tính top để animation hoạt động đúng
        element.style.removeProperty('top');

        // Hiển thị lại phần tử
        element.classList.remove('off-screen');

        // Thêm lớp để bắt đầu animation
        element.classList.add(animationClass);

        // Hướng di chuyển dựa vào vị trí ban đầu
        if (fromBottom) {
            element.classList.add('reverse');
        }

        // Đặt các thông số animation
        element.style.animationDuration = `${animationDuration}s`;

        // Khởi động lại animation
        element.style.animationPlayState = 'running';
    }, 100);
}

// Tạo ảnh test để kiểm tra đường dẫn
function createTestImage() {
    console.log("Tạo ảnh test để kiểm tra đường dẫn");

    // Thử tải ảnh đầu tiên trong danh sách
    const testImg = document.createElement('img');
    testImg.src = photoUrls[0];
    testImg.className = 'test-photo';
    testImg.style.position = 'fixed';
    testImg.style.top = '10px';
    testImg.style.right = '10px';
    testImg.style.width = '100px';
    testImg.style.height = '100px';
    testImg.style.zIndex = '9999';
    testImg.style.border = '2px solid red';
    testImg.style.borderRadius = '50%';

    // Xử lý lỗi ảnh
    testImg.onerror = function() {
        console.error("Lỗi tải ảnh test: " + this.src);
        this.style.backgroundColor = 'red';
        this.src = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ff1493"/><text x="50%" y="50%" font-size="16" text-anchor="middle" fill="white" dy=".3em">Lỗi ảnh</text></svg>';

        // Sửa các đường dẫn
        for (let i = 0; i < photoUrls.length; i++) {
            if (photoUrls[i].startsWith('images/')) {
                photoUrls[i] = './' + photoUrls[i];
                console.log("Đã sửa đường dẫn:", photoUrls[i]);
            }
        }
    };

    testImg.onload = function() {
        console.log("Ảnh test đã tải thành công:", this.src);
        setTimeout(() => {
            this.remove();
        }, 5000);
    };

    document.body.appendChild(testImg);
}

// Danh sách đường dẫn ảnh của người yêu từ thư mục images
const photoUrls = [
    './images/IMG_1696818135047_1696818172163.jpg',
    './images/IMG_1690986969340_1690991862781.jpg',
    './images/IMG_20240913_092348.jpg',
    './images/IMG_20240915_224625.jpg',
    './images/IMG_20240913_092123.jpg',
    './images/IMG_20240821_221955.jpg',
    './images/IMG_20240821_221952.jpg',
    './images/IMG_20230812_213854.jpg',
    './images/IMG_20230812_213847.jpg',
    './images/IMG_20230803_175901.jpg',
    './images/IMG_20230803_175855.jpg',
    './images/IMG_20230728_170806.jpg',
    './images/IMG_20230728_170748.jpg',
    './images/IMG_20230509_103053.jpg',
    './images/IMG_20230509_103031.jpg',
    './images/IMG_20230423_155256.jpg',
    './images/IMG_20230423_155242.jpg',
    './images/IMG_20230423_155234.jpg',
    './images/Messenger_creation_AAF2A2F1-E282-455E-BE94-F90CBE29F586.jpeg',
    './images/Messenger_creation_F4658D9C-FDD8-48E1-8817-3160C951AD88_0.jpeg',
    './images/Messenger_creation_BDC5DB5E-2A4D-4034-A713-D65F98E74B8A.jpeg'
];

// Danh sách các tin nhắn chúc mừng
const messages = [
    "Yêu em nhất ❤️",
    "Em là tình yêu của anh",
    "Em xinh nhất trần đời",
    "Cô gái dễ thương nhất",
    "Yêu em nhiều lắm",
    "Cưng của anh",
    "Baby của anh",
    "Princess của anh",
    "Nhớ em quá",
    "Thương em nhiều lắm",
    "Iu em vô cùng",
    "Em là số 1",
    "Yêu em mãi mãi",
    "Bé cưng của anh",
    "Anh nhớ em",
    "Người yêu của anh",
    "Điều tuyệt vời nhất",
    "Yêu em từng giây",
    "Chúc em vui vẻ",
    "Mãi bên em"
];

// Hàm tạo trái tim bay
function createHearts(count = 30) {
    const heartsContainer = document.getElementById('hearts-container');
    const isMobile = window.innerWidth <= 768;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Giới hạn số lượng trái tim tạo mới để không vượt quá maxHearts
    const numberOfHearts = Math.min(count, window.maxHearts - window.currentHearts);

    if (numberOfHearts <= 0) return; // Không tạo thêm nếu đã đạt giới hạn

    // Phân bố đều các trái tim trên màn hình
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Đặt kích thước ngẫu nhiên - nhỏ hơn trên điện thoại
        const size = isMobile ?
            Math.random() * 20 + 8 : // Kích thước nhỏ hơn trên di động
            Math.random() * 30 + 10; // Kích thước gốc trên desktop

        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        // Tìm vị trí không bị trùng lắp, phân bố đều trên màn hình
        const fromTop = Math.random() > 0.5;

        // Ưu tiên sử dụng lưới vị trí để phân bố đều
        const gridPosition = findEmptyGridPosition();
        let position;

        if (gridPosition) {
            position = {
                left: gridPosition.x,
                top: fromTop ? -size - Math.random() * 100 : viewportHeight + Math.random() * 100
            };
        } else {
            position = findNonOverlappingPosition(size, size, fromTop);
        }

        // Đặt vị trí
        heart.style.left = `${position.left}px`;
        heart.style.top = `${position.top}px`;

        // Đặt độ trong suốt ngẫu nhiên (nhưng vẫn ẩn ban đầu)
        heart.style.opacity = "0";

        // Đặt màu sắc ngẫu nhiên với nhiều hue hơn
        const hue = Math.floor(Math.random() * 60 - 10); // Nhiều màu hơn từ đỏ đến hồng
        const saturation = 90 + Math.random() * 10; // Độ bão hòa cao
        const lightness = 55 + Math.random() * 25; // Độ sáng thay đổi
        heart.style.backgroundColor = `hsl(${330 + hue}, ${saturation}%, ${lightness}%)`;

        // Thêm hiệu ứng ngẫu nhiên cho trái tim
        const effects = ['heartbeat', 'none', 'floatUpDown', 'pulse', 'sparkle', 'spin', 'bounce'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];

        // Thêm lớp hiệu ứng đặc biệt nếu có
        if (randomEffect === 'sparkle') {
            heart.classList.add('sparkle');
        } else if (randomEffect === 'spin') {
            heart.classList.add('spin');
        } else if (randomEffect === 'bounce') {
            heart.classList.add('bounce');
        }

        // Thêm hiệu ứng chuyển động ngẫu nhiên (60% dọc, 40% ngang)
        const useHorizontal = Math.random() > 0.6;
        const animationClass = useHorizontal ? 'horizontal-moving' : 'vertical-moving';

        // Đặt độ to/nhỏ khác nhau cho border-radius để tạo ra hình dáng khác nhau
        if (Math.random() > 0.7) {
            heart.style.borderRadius = `${Math.random() * 40 + 10}%`;
        }

        // Thêm vào DOM trước khi thêm animation
        heartsContainer.appendChild(heart);
        window.currentHearts++; // Tăng số lượng trái tim hiện có

        // Đặt thời gian animation ngẫu nhiên
        const animationDuration = Math.random() * 20 + 15;
        const animationDelay = Math.random() * 2; // Giảm thời gian delay

        // Thêm animation với độ trễ
        setTimeout(() => {
            // Xóa vị trí top ban đầu để animation hoạt động đúng
            heart.style.removeProperty('top');

            // Thêm lớp để bắt đầu animation
            heart.classList.add(animationClass);

            // Hướng di chuyển dựa vào vị trí ban đầu
            if (!fromTop) {
                heart.classList.add('reverse');
            }

            // Đặt các thông số animation
            heart.style.animationDuration = `${animationDuration}s`;
            heart.style.opacity = `${Math.random() * 0.7 + 0.3}`;

            // Thêm hiệu ứng nảy hoặc đập
            if (randomEffect === 'heartbeat') {
                heart.style.animation = `heartbeat 1.5s infinite ease-in-out, ${animationClass === 'horizontal-moving' ? (heart.classList.contains('reverse') ? 'moveRightToLeft' : 'moveLeftToRight') : (heart.classList.contains('reverse') ? 'moveBottomToTop' : 'moveTopToBottom')} ${animationDuration}s linear forwards`;
            } else if (randomEffect === 'floatUpDown') {
                heart.style.animation = `floatUpDown 2s infinite ease-in-out, ${animationClass === 'horizontal-moving' ? (heart.classList.contains('reverse') ? 'moveRightToLeft' : 'moveLeftToRight') : (heart.classList.contains('reverse') ? 'moveBottomToTop' : 'moveTopToBottom')} ${animationDuration}s linear forwards`;
            } else if (randomEffect === 'pulse') {
                heart.style.animation = `pulse 2s infinite ease-in-out, ${animationClass === 'horizontal-moving' ? (heart.classList.contains('reverse') ? 'moveRightToLeft' : 'moveLeftToRight') : (heart.classList.contains('reverse') ? 'moveBottomToTop' : 'moveTopToBottom')} ${animationDuration}s linear forwards`;
            }

            // Thêm độ xoay cho trái tim
            const rotation = Math.random() * 30 - 15;
            heart.style.transform = `rotate(${rotation}deg)`;
        }, animationDelay * 1000);
    }
}

// Hàm tạo ảnh người yêu
function createPhotos(count = 20) {
    console.log("Bắt đầu tạo ảnh, số lượng:", count);
    const photosContainer = document.getElementById('photos-container');

    if (!photosContainer) {
        console.error("Không tìm thấy photos-container");
        return;
    }

    console.log("Container ảnh:", photosContainer);
    const isMobile = window.innerWidth <= 768;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Giới hạn số lượng ảnh tạo mới để không vượt quá maxPhotos
    const numberOfPhotos = Math.min(count, window.maxPhotos - window.currentPhotos);

    if (numberOfPhotos <= 0) return; // Không tạo thêm nếu đã đạt giới hạn

    // Sắp xếp ảnh theo lưới để không bị chồng lên nhau
    for (let i = 0; i < numberOfPhotos; i++) {
        const photo = document.createElement('img');
        photo.classList.add('photo');

        // Chọn ảnh ngẫu nhiên từ danh sách
        const randomIndex = Math.floor(Math.random() * photoUrls.length);
        const imgSrc = photoUrls[randomIndex];
        photo.src = imgSrc;
        console.log("Tạo ảnh với src:", imgSrc);

        // Thêm xử lý lỗi nếu ảnh không tải được
        photo.onerror = function() {
            console.error("Lỗi tải ảnh:", this.src);
            // Sử dụng data URI cho ảnh lỗi
            this.src = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ff1493"/><text x="50%" y="50%" font-size="16" text-anchor="middle" fill="white" dy=".3em">Ảnh lỗi</text></svg>';
        };

        // Đặt kích thước ngẫu nhiên
        const size = isMobile ?
            Math.random() * 40 + 60 : // Kích thước nhỏ hơn trên di động
            Math.random() * 60 + 70; // Kích thước gốc trên desktop

        photo.style.width = `${size}px`;
        photo.style.height = `${size}px`;
        photo.style.opacity = "0"; // Bắt đầu ẩn, sẽ hiển thị sau

        // Tìm vị trí không bị trùng lắp
        const fromTop = Math.random() > 0.5;

        // Sử dụng lưới vị trí để phân bố đều
        const gridPosition = findEmptyGridPosition();
        let position;

        if (gridPosition) {
            position = {
                left: gridPosition.x,
                top: fromTop ? -size - Math.random() * 100 : viewportHeight + Math.random() * 100
            };
        } else {
            position = findNonOverlappingPosition(size, size, fromTop);
        }

        // Đặt vị trí
        photo.style.left = `${position.left}px`;
        photo.style.top = `${position.top}px`;

        // Thêm hiệu ứng xoay nhẹ
        photo.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

        // Thêm hiệu ứng khung ảnh ngẫu nhiên
        if (Math.random() > 0.5) {
            const borderColors = ['#ff1493', '#ff69b4', '#ff6699', '#ff007f', '#ff66b2'];
            const borderColor = borderColors[Math.floor(Math.random() * borderColors.length)];
            photo.style.border = `4px solid ${borderColor}`;
            photo.style.boxShadow = `0 0 15px ${borderColor}`;
        }

        // Thêm hiệu ứng chuyển động ngẫu nhiên (70% dọc, 30% ngang)
        const useHorizontal = Math.random() > 0.7;
        const animationClass = useHorizontal ? 'horizontal-moving' : 'vertical-moving';

        // Thêm sự kiện click vào ảnh để phóng to
        photo.addEventListener('dblclick', function() {
            this.classList.toggle('zoomed');

            // Thêm overlay khi ảnh được phóng to
            if (this.classList.contains('zoomed')) {
                if (!document.querySelector('.overlay')) {
                    const overlay = document.createElement('div');
                    overlay.className = 'overlay';
                    document.body.appendChild(overlay);

                    overlay.addEventListener('click', function() {
                        document.querySelectorAll('.photo.zoomed').forEach(p => {
                            p.classList.remove('zoomed');
                        });
                        this.remove();
                    });
                }
            }
        });

        // Thêm vào DOM
        photosContainer.appendChild(photo);
        window.currentPhotos++; // Tăng số lượng ảnh hiện có

        // Đặt thời gian animation ngẫu nhiên
        const animationDuration = isMobile ?
            Math.random() * 20 + 15 : // Trên di động
            Math.random() * 25 + 20; // Trên desktop

        // Thêm animation ngay lập tức hoặc với độ trễ
        const animationDelay = Math.random() * 2; // Giảm thời gian delay

        // Thêm animation với độ trễ
        setTimeout(() => {
            // Xóa vị trí top ban đầu để animation hoạt động đúng
            photo.style.removeProperty('top');

            // Thêm lớp để bắt đầu animation
            photo.classList.add(animationClass);

            // Hướng di chuyển dựa vào vị trí ban đầu
            if (!fromTop) {
                photo.classList.add('reverse');
            }

            // Đặt các thông số animation
            photo.style.animationDuration = `${animationDuration}s`;
            photo.style.opacity = "1"; // Hiển thị ảnh
        }, animationDelay * 1000);
    }

    // Sau khi thêm tất cả ảnh mới, cập nhật sự kiện cảm ứng
    setTimeout(() => {
        addTouchEventsToPhotos();
    }, 100);
}

// Hàm tạo thông điệp di chuyển
function createMovingMessages(count = 10) {
    console.log("Bắt đầu tạo tin nhắn, số lượng:", count);
    const messagesContainer = document.getElementById('messages-container');

    if (!messagesContainer) {
        console.error("Không tìm thấy messages-container, đang tạo mới");
        const container = document.createElement('div');
        container.id = 'messages-container';
        document.body.appendChild(container);
    }

    console.log("Container tin nhắn:", messagesContainer);
    const isMobile = window.innerWidth <= 768;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Giới hạn số lượng tin nhắn tạo mới
    const numberOfMessages = Math.min(count, window.maxMessages - window.currentMessages);

    if (numberOfMessages <= 0) return; // Không tạo thêm nếu đã đạt giới hạn

    // Phân bố đều các tin nhắn trên màn hình
    for (let i = 0; i < numberOfMessages; i++) {
        const message = document.createElement('div');
        message.classList.add('moving-message');

        // Chọn tin nhắn ngẫu nhiên
        const randomIndex = Math.floor(Math.random() * messages.length);
        message.textContent = messages[randomIndex];
        message.style.opacity = "0"; // Bắt đầu ẩn, sẽ hiển thị sau

        // Đặt kích thước phù hợp với thiết bị
        const fontSize = isMobile ?
            Math.random() * 6 + 12 : // Nhỏ hơn trên di động
            Math.random() * 8 + 16; // Lớn hơn trên desktop

        message.style.fontSize = `${fontSize}px`;

        // Tính toán chiều rộng dự kiến của tin nhắn
        const estimatedWidth = message.textContent.length * (fontSize * 0.6);
        const estimatedHeight = fontSize * 2.5; // Bao gồm padding

        // Đa dạng hóa kiểu hiển thị tin nhắn
        if (Math.random() > 0.7) {
            // Tạo một số tin nhắn với background khác nhau
            const bgColors = [
                'rgba(255, 192, 203, 0.9)', // pink
                'rgba(255, 255, 224, 0.9)', // lightyellow
                'rgba(230, 230, 250, 0.9)', // lavender
                'rgba(240, 255, 240, 0.9)', // honeydew
                'rgba(255, 228, 225, 0.9)' // mistyrose
            ];
            const borderColors = [
                '#ff1493', '#ff69b4', '#ff6699', '#ff007f', '#ff66b2'
            ];

            message.style.backgroundColor = bgColors[Math.floor(Math.random() * bgColors.length)];
            message.style.borderColor = borderColors[Math.floor(Math.random() * borderColors.length)];
            message.style.borderWidth = '2px';
            message.style.borderStyle = 'solid';
        }

        // Thêm hiệu ứng chuyển động ngẫu nhiên (60% dọc, 40% ngang)
        const useHorizontal = Math.random() > 0.6;
        const animationClass = useHorizontal ? 'horizontal-moving' : 'vertical-moving';

        // Tìm vị trí không bị trùng lắp, ưu tiên lưới để phân bố đều
        const fromTop = Math.random() > 0.5;

        // Sử dụng lưới vị trí để phân bố đều
        const gridPosition = findEmptyGridPosition();
        let position;

        if (gridPosition) {
            position = {
                left: gridPosition.x,
                top: fromTop ? -estimatedHeight - Math.random() * 100 : viewportHeight + Math.random() * 100
            };
        } else {
            position = findNonOverlappingPosition(estimatedWidth, estimatedHeight, fromTop);
        }

        // Đặt vị trí
        message.style.left = `${position.left}px`;
        message.style.top = `${position.top}px`;

        // Thêm vào DOM
        messagesContainer.appendChild(message);
        window.currentMessages++; // Tăng số lượng tin nhắn hiện có

        // Đặt thời gian animation ngẫu nhiên
        const animationDuration = isMobile ?
            Math.random() * 20 + 15 : // Trên di động
            Math.random() * 25 + 20; // Trên desktop

        // Thêm animation ngay lập tức hoặc với độ trễ
        const animationDelay = Math.random() * 2; // Giảm thời gian delay

        // Thêm animation với độ trễ
        setTimeout(() => {
            // Xóa vị trí top ban đầu để animation hoạt động đúng
            message.style.removeProperty('top');

            // Thêm lớp để bắt đầu animation
            message.classList.add(animationClass);

            // Hướng di chuyển dựa vào vị trí ban đầu
            if (!fromTop) {
                message.classList.add('reverse');
            }

            // Đặt các thông số animation
            message.style.animationDuration = `${animationDuration}s`;
            message.style.opacity = "1"; // Hiển thị tin nhắn
        }, animationDelay * 1000);
    }
}

// Thêm hỗ trợ cho sự kiện cảm ứng
document.addEventListener('touchstart', function(event) {
    // Ngăn chặn hành vi mặc định của trình duyệt
    if (event.target.tagName !== 'IMG') {
        event.preventDefault();
    }

    // Kiểm tra xem có phải tap vào ảnh hoặc lời chúc không
    if (event.target.classList.contains('photo') ||
        event.target.classList.contains('moving-message')) {
        return; // Không tạo tim khi tap vào ảnh hoặc lời chúc
    }

    // Lấy vị trí chạm
    const touch = event.touches[0];

    // Tạo nhiều trái tim cùng lúc khi chạm
    for (let i = 0; i < 5; i++) { // Tạo 5 trái tim trên thiết bị cảm ứng
        const heartsContainer = document.getElementById('hearts-container');
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Đặt kích thước
        const size = Math.random() * 25 + 10; // Điều chỉnh kích thước trên thiết bị cảm ứng
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        // Đặt vị trí xung quanh vị trí chạm
        const offsetX = Math.random() * 40 - 20;
        const offsetY = Math.random() * 40 - 20;
        heart.style.left = `${touch.clientX - size/2 + offsetX}px`;
        heart.style.top = `${touch.clientY - size/2 + offsetY}px`;

        // Đặt màu sắc ngẫu nhiên
        const hue = Math.floor(Math.random() * 30);
        heart.style.backgroundColor = `hsl(${330 + hue}, 100%, 60%)`;

        // Thêm hiệu ứng ngẫu nhiên
        const effects = ['heartbeat', 'bounce', 'floatUpDown'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];

        // Thêm hiệu ứng chuyển động ngẫu nhiên
        const animations = ['vertical-moving', 'horizontal-moving'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

        // Thêm vào container
        heartsContainer.appendChild(heart);

        // Hiển thị ngay lập tức với hiệu ứng
        setTimeout(() => {
            // Đặt độ trong suốt
            heart.style.opacity = Math.random() * 0.7 + 0.3;

            // Thêm hiệu ứng nảy hoặc đập
            if (randomEffect === 'bounce') {
                heart.classList.add('bounce');
            } else if (randomEffect === 'heartbeat') {
                heart.style.animation = 'heartbeat 1.5s infinite ease-in-out';
            } else if (randomEffect === 'floatUpDown') {
                heart.style.animation = 'floatUpDown 2s infinite ease-in-out';
            }

            // Thêm hiệu ứng di chuyển
            heart.classList.add(randomAnimation);

            // Xác định hướng di chuyển (50% từ trên xuống, 50% từ dưới lên)
            if (Math.random() > 0.5) {
                heart.classList.add('reverse');
            }

            // Đặt thời gian animation ngẫu nhiên
            const animationDuration = Math.random() * 12 + 8; // Giảm thời gian trên thiết bị cảm ứng
            heart.style.animationDuration = `${animationDuration}s`;
        }, 10); // Độ trễ rất nhỏ để đảm bảo hiệu ứng mượt mà
    }
});

// Thêm hàm để tạo ảnh với sự kiện cảm ứng đúng
function addTouchEventsToPhotos() {
    const photos = document.querySelectorAll('.photo');

    photos.forEach(photo => {
        // Xử lý sự kiện cảm ứng
        photo.addEventListener('touchstart', function(e) {
            // Ngăn chặn các hành vi mặc định như kéo
            e.preventDefault();

            // Toggle phóng to ảnh
            this.classList.toggle('zoomed');

            // Nếu ảnh được phóng to, thêm overlay để đảm bảo người dùng có thể đóng lại
            if (this.classList.contains('zoomed')) {
                // Tạo overlay nếu chưa có
                if (!document.querySelector('.overlay')) {
                    const overlay = document.createElement('div');
                    overlay.className = 'overlay';
                    document.body.appendChild(overlay);

                    // Thêm sự kiện nhấp vào overlay để đóng ảnh
                    overlay.addEventListener('touchstart', function(e) {
                        // Ngăn chặn hành vi mặc định
                        e.preventDefault();

                        // Xóa lớp zoomed từ tất cả ảnh
                        document.querySelectorAll('.photo.zoomed').forEach(p => {
                            p.classList.remove('zoomed');
                        });

                        // Xóa overlay
                        this.remove();
                    });
                }
            } else {
                // Xóa overlay nếu không còn ảnh nào được phóng to
                if (!document.querySelector('.photo.zoomed')) {
                    const overlay = document.querySelector('.overlay');
                    if (overlay) overlay.remove();
                }
            }
        });
    });
}

// Tạo thêm trái tim khi người dùng nhấp vào trang (cho máy tính)
document.addEventListener('click', function(event) {
    // Kiểm tra xem có phải click vào ảnh hoặc lời chúc không
    if (event.target.classList.contains('photo') ||
        event.target.classList.contains('moving-message')) {
        return; // Không tạo tim khi click vào ảnh hoặc lời chúc
    }

    // Tạo nhiều trái tim cùng lúc khi click
    for (let i = 0; i < 8; i++) {
        const heartsContainer = document.getElementById('hearts-container');
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Đặt kích thước
        const size = Math.random() * 30 + 15;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        // Đặt vị trí xung quanh vị trí click
        const offsetX = Math.random() * 60 - 30;
        const offsetY = Math.random() * 60 - 30;
        heart.style.left = `${event.clientX - size/2 + offsetX}px`;
        heart.style.top = `${event.clientY - size/2 + offsetY}px`;

        // Đặt màu sắc ngẫu nhiên
        const hue = Math.floor(Math.random() * 30);
        heart.style.backgroundColor = `hsl(${330 + hue}, 100%, 60%)`;

        // Thêm hiệu ứng ngẫu nhiên
        const effects = ['heartbeat', 'bounce', 'floatUpDown'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];

        // Thêm hiệu ứng chuyển động ngẫu nhiên
        const animations = ['vertical-moving', 'horizontal-moving'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

        // Thêm vào container
        heartsContainer.appendChild(heart);

        // Hiển thị ngay lập tức với hiệu ứng
        setTimeout(() => {
            // Đặt độ trong suốt
            heart.style.opacity = Math.random() * 0.7 + 0.3;

            // Thêm hiệu ứng nảy hoặc đập
            if (randomEffect === 'bounce') {
                heart.classList.add('bounce');
            } else if (randomEffect === 'heartbeat') {
                heart.style.animation = 'heartbeat 1.5s infinite ease-in-out';
            } else if (randomEffect === 'floatUpDown') {
                heart.style.animation = 'floatUpDown 2s infinite ease-in-out';
            }

            // Thêm hiệu ứng di chuyển
            heart.classList.add(randomAnimation);

            // Xác định hướng di chuyển (50% từ trên xuống, 50% từ dưới lên)
            if (Math.random() > 0.5) {
                heart.classList.add('reverse');
            }

            // Đặt thời gian animation ngẫu nhiên
            const animationDuration = Math.random() * 15 + 10;
            heart.style.animationDuration = `${animationDuration}s`;
        }, 10); // Độ trễ rất nhỏ để đảm bảo hiệu ứng mượt mà
    }
});