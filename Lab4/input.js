const targets = document.querySelectorAll('.target');

let draggingElement = null;
let offsetX = 0;
let offsetY = 0;
let isStickyDragging = false;
let originalPosition = { x: 0, y: 0 };

function moveElementToCursor(e) {
    if (draggingElement) {
        draggingElement.style.left = `${e.clientX - offsetX}px`;
        draggingElement.style.top = `${e.clientY - offsetY}px`;
    }
}

targets.forEach(target => {
    target.addEventListener('mousedown', e => {
        if (isStickyDragging) return;
        draggingElement = target;

        originalPosition = {
            x: parseInt(target.style.left),
            y: parseInt(target.style.top)
        };

        offsetX = e.clientX - draggingElement.offsetLeft;
        offsetY = e.clientY - draggingElement.offsetTop;

        document.addEventListener('mousemove', moveElementToCursor);
    });

    target.addEventListener('dblclick', e => {
        if (isStickyDragging) return;

        draggingElement = target;
        isStickyDragging = true;

        originalPosition = {
            x: parseInt(target.style.left),
            y: parseInt(target.style.top)
        };

        draggingElement.style.backgroundColor = 'green';

        offsetX = draggingElement.offsetWidth / 2;
        offsetY = draggingElement.offsetHeight / 2;

        document.addEventListener('mousemove', moveElementToCursor);
    });
});

document.addEventListener('mouseup', () => {
    if (draggingElement && !isStickyDragging) {
        draggingElement = null;
        document.removeEventListener('mousemove', moveElementToCursor);
    }
});

document.addEventListener('click', () => {
    if (isStickyDragging) {
        isStickyDragging = false;
        draggingElement.style.backgroundColor = 'red';
        draggingElement = null;
        document.removeEventListener('mousemove', moveElementToCursor);
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && draggingElement) {
        draggingElement.style.left = `${originalPosition.x}px`;
        draggingElement.style.top = `${originalPosition.y}px`;

        if (isStickyDragging) {
            isStickyDragging = false;
            draggingElement.style.backgroundColor = 'red';
        }

        draggingElement = null;
        document.removeEventListener('mousemove', moveElementToCursor);
    }
});
