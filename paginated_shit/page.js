document.addEventListener('DOMContentLoaded', function() {
    // Sample product data - in a real app, this would come from your backend
    const products = [
        { id: 1, title: "Summer floral shirt", price: 20, image: "afodisiac/IMG-20231128-WA0224.jpg" },
        { id: 2, title: "Summer floral shirt", price: 20, image: "afodisiac/IMG-20231128-WA0219.jpg" },
        { id: 3, title: "Summer floral shirt", price: 20, image: "afodisiac/IMG-20240130-WA0123.jpg" },
        { id: 4, title: "Summer floral shirt", price: 20, image: "afodisiac/IMG-20240130-WA0131.jpg" },
        { id: 5, title: "Summer floral shirt", price: 20, image: "afodisiac/IMG_20240317_124807.jpg" },
        { id: 6, title: "Denim Jacket", price: 35, image: "path/to/image6.jpg" },
        { id: 7, title: "Cotton T-Shirt", price: 15, image: "path/to/image7.jpg" },
        // Add more products as needed
    ];

    // Configuration
    const productsPerPage = 5; // Number of products per page
    const gridContainers = [
        { grid: 'most-liked-grid', pagination: 'most-liked-pagination' },
        { grid: 'new-additions-grid', pagination: 'new-additions-pagination' },
        { grid: 'new-to-you-grid', pagination: 'new-to-you-pagination' }
    ];

    // Initialize all product grids
    gridContainers.forEach(container => {
        if (document.getElementById(container.grid)) {
            renderProductGrid(products, container.grid, container.pagination, productsPerPage);
        }
    });

    // Product grid rendering function
    function renderProductGrid(products, gridId, paginationId, productsPerPage) {
        const grid = document.getElementById(gridId);
        const pagination = document.getElementById(paginationId);
        
        if (!grid || !pagination) return;
        
        const pageCount = Math.ceil(products.length / productsPerPage);
        let currentPage = 1;
        
        // Function to display products for a specific page
        function displayProducts(page) {
            grid.innerHTML = '';
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const paginatedProducts = products.slice(start, end);
            
            paginatedProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <h3 class="product-title">${product.title}</h3>
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="product-info">
                        <div class="price">$${product.price}</div>
                        <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
                grid.appendChild(productCard);
            });
        }
        
        // Function to render pagination buttons
        function renderPagination() {
            pagination.innerHTML = '';
            
            if (pageCount <= 1) return;
            
            // Previous button
            if (currentPage > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.innerHTML = '&laquo;';
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    displayProducts(currentPage);
                    renderPagination();
                });
                pagination.appendChild(prevBtn);
            }
            
            // Page buttons
            for (let i = 1; i <= pageCount; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                if (i === currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    displayProducts(currentPage);
                    renderPagination();
                });
                pagination.appendChild(pageBtn);
            }
            
            // Next button
            if (currentPage < pageCount) {
                const nextBtn = document.createElement('button');
                nextBtn.innerHTML = '&raquo;';
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    displayProducts(currentPage);
                    renderPagination();
                });
                pagination.appendChild(nextBtn);
            }
        }
        
        // Initial display
        displayProducts(currentPage);
        renderPagination();
    }
    
    // Add event delegation for add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
    });
    
    // Mock add to cart function
    function addToCart(productId) {
        console.log(`Product ${productId} added to cart`);
        // In a real app, you would update the cart count in the navbar
        // and potentially show a notification
    }
});