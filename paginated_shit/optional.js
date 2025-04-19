// Add this to your JavaScript
const productsPerPageSelect = document.getElementById('products-per-page');
if (productsPerPageSelect) {
    productsPerPageSelect.addEventListener('change', function() {
        productsPerPage = parseInt(this.value);
        renderProductGrid(products, gridId, paginationId, productsPerPage);
    });
}