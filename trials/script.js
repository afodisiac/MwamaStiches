// Event listener for color options
const colorButtons = document.querySelectorAll('.color-option');
const productImage = document.getElementById('product-image');

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.getAttribute('data-color');
        productImage.src = `product-${color}.jpg`; // Change to the correct image based on color
    });
});
