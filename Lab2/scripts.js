function renderShirts() {
    const container = document.getElementById('shirtsContainer');

    shirts.forEach(shirt => {
        const card = document.createElement('div');
        card.classList.add('shirt-card');

        const frontImage = shirt.colors?.white?.front || shirt.default.front;
        const name = shirt.name || "Unnamed Shirt";
        const colorsCount = Object.keys(shirt.colors || {}).length;

        card.innerHTML = `
            <img src="${frontImage}" alt="${name}">
            <h3>${name}</h3>
            <p>Available in ${colorsCount} color${colorsCount === 1 ? '' : 's'}</p>
            <button class="button" onclick="showQuickView('${name}', '${frontImage}', '${shirt.price}')">Quick View</button>
            <button class="button">See Page</button>
        `;

        container.appendChild(card);
    });
}

function showQuickView(name, img, price) {
    const quickView = document.getElementById('quickView');
    const quickViewContent = document.getElementById('quickViewContent');

    quickViewContent.innerHTML = `
        <img src="${img}" alt="${name}">
        <h2>${name}</h2>
        <p>${price}</p>
    `;
    quickView.style.display = 'block';
}

function closeQuickView() {
    document.getElementById('quickView').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", renderShirts);
