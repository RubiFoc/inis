const targets = document.querySelectorAll('.target');

let draggingElement = null;
let offsetX = 0;
let offsetY = 0;
let isStickyDragging = false;
let originalPosition = { x: 0, y: 0 };
let lastTapTime = 0;

const MIN_SIZE = 30;

function moveElement(x, y) {
    if (draggingElement) {
        draggingElement.style.left = `${x - offsetX}px`;
        draggingElement.style.top = `${y - offsetY}px`;
    }
}

targets.forEach(target => {
    target.addEventListener('mousedown', e => {
        if (isStickyDragging) return;

        draggingElement = target;
        saveOriginalPos(target);

        offsetX = e.clientX - target.offsetLeft;
        offsetY = e.clientY - target.offsetTop;

        document.addEventListener('mousemove', mouseMove);
    });

    target.addEventListener('dblclick', e => {
        if (isStickyDragging) return;

        draggingElement = target;
        isStickyDragging = true;
        saveOriginalPos(target);

        offsetX = target.offsetWidth / 2;
        offsetY = target.offsetHeight / 2;

        target.style.backgroundColor = 'blue';

        document.addEventListener('mousemove', mouseMove);
    });
});

function mouseMove(e) {
    moveElement(e.clientX, e.clientY);
}

document.addEventListener('mouseup', () => {
    if (draggingElement && !isStickyDragging) {
        draggingElement = null;
        document.removeEventListener('mousemove', mouseMove);
    }
});

document.addEventListener('click', () => {
    if (isStickyDragging) {
        stopStickyMode();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && draggingElement) {
        cancelAction();
    }
});

targets.forEach(target => {
    target.addEventListener('touchstart', e => {
        e.preventDefault();
        const touch = e.touches[0];

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < 300 && tapLength > 0) {
            if (!isStickyDragging) {
                draggingElement = target;
                isStickyDragging = true;

                saveOriginalPos(target);

                offsetX = target.offsetWidth / 2;
                offsetY = target.offsetHeight / 2;

                target.style.backgroundColor = 'blue';
            }
        } else {
            if (!isStickyDragging) {
                draggingElement = target;

                saveOriginalPos(target);

                const rect = target.getBoundingClientRect();
                offsetX = touch.clientX - rect.left;
                offsetY = touch.clientY - rect.top;
            }
        }

        lastTapTime = currentTime;
    });

    target.addEventListener('touchmove', e => {
        e.preventDefault();
        if (draggingElement && !isStickyDragging) {
            const touch = e.touches[0];
            moveElement(touch.clientX, touch.clientY);
        }
    });

    target.addEventListener('touchend', e => {
        if (draggingElement && !isStickyDragging) {
            draggingElement = null;
        }
    });
});

document.addEventListener('touchstart', e => {
    if (isStickyDragging) {
        const touch = e.touches[0];
        moveElement(touch.clientX, touch.clientY);
    }

    if (e.touches.length === 2 && draggingElement) {
        cancelAction();
    }
});

document.addEventListener('touchmove', e => {
    if (isStickyDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        moveElement(touch.clientX, touch.clientY);
    }
});

document.addEventListener('touchend', e => {
    if (isStickyDragging && e.touches.length === 0) {
        const touch = e.changedTouches[0];
        const tapX = touch.clientX;
        const tapY = touch.clientY;

        const centerX = draggingElement.offsetLeft + draggingElement.offsetWidth / 2;
        const centerY = draggingElement.offsetTop + draggingElement.offsetHeight / 2;
        const dx = Math.abs(centerX - tapX);
        const dy = Math.abs(centerY - tapY);

        if (dx < 5 && dy < 5) {
            stopStickyMode();
        }
    }
});

let resizingElement = null;
let resizeStart = { x: 0, y: 0 };
let initialSize = { width: 0, height: 0 };

targets.forEach(target => {
    target.addEventListener('contextmenu', e => e.preventDefault()); // Отключить меню ПКМ

    target.addEventListener('mousedown', e => {
        if (e.button === 2) { // Правая кнопка мыши
            e.preventDefault();
            resizingElement = target;

            resizeStart = { x: e.clientX, y: e.clientY };
            initialSize = { width: target.offsetWidth, height: target.offsetHeight };

            document.addEventListener('mousemove', resizeMove);
            document.addEventListener('mouseup', stopResize);
        }
    });

    target.addEventListener('touchstart', e => {
        if (e.touches.length === 2) {
            resizingElement = target;

            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            resizeStart = {
                x: Math.abs(touch1.clientX - touch2.clientX),
                y: Math.abs(touch1.clientY - touch2.clientY)
            };

            initialSize = {
                width: target.offsetWidth,
                height: target.offsetHeight
            };

            document.addEventListener('touchmove', resizeTouchMove);
            document.addEventListener('touchend', stopResize);
        }
    });
});

function resizeMove(e) {
    if (!resizingElement) return;

    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;

    const newWidth = Math.max(initialSize.width + dx, MIN_SIZE);
    const newHeight = Math.max(initialSize.height + dy, MIN_SIZE);

    resizingElement.style.width = `${newWidth}px`;
    resizingElement.style.height = `${newHeight}px`;
}

function resizeTouchMove(e) {
    if (!resizingElement || e.touches.length !== 2) return;

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const dx = Math.abs(touch1.clientX - touch2.clientX);
    const dy = Math.abs(touch1.clientY - touch2.clientY);

    const diffX = dx - resizeStart.x;
    const diffY = dy - resizeStart.y;

    const newWidth = Math.max(initialSize.width + diffX, MIN_SIZE);
    const newHeight = Math.max(initialSize.height + diffY, MIN_SIZE);

    resizingElement.style.width = `${newWidth}px`;
    resizingElement.style.height = `${newHeight}px`;
}

function stopResize() {
    resizingElement = null;
    document.removeEventListener('mousemove', resizeMove);
    document.removeEventListener('touchmove', resizeTouchMove);
}

function saveOriginalPos(element) {
    originalPosition = {
        x: parseInt(element.style.left),
        y: parseInt(element.style.top)
    };
}

function cancelAction() {
    if (!draggingElement) return;

    draggingElement.style.left = `${originalPosition.x}px`;
    draggingElement.style.top = `${originalPosition.y}px`;

    stopStickyMode();
    draggingElement = null;
}

function stopStickyMode() {
    if (!draggingElement) return;

    isStickyDragging = false;
    draggingElement.style.backgroundColor = 'red';
    document.removeEventListener('mousemove', mouseMove);
}
