document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const productsPerPage = 5;
    const gridContainers = [
        { grid: 'most-liked-grid', pagination: 'most-liked-pagination', endpoint: '/api/products/most-liked' },
        { grid: 'new-additions-grid', pagination: 'new-additions-pagination', endpoint: '/api/products/new' },
        { grid: 'new-to-you-grid', pagination: 'new-to-you-pagination', endpoint: '/api/products/recommended' }
    ];

    // Initialize all product grids
    gridContainers.forEach(container => {
        if (document.getElementById(container.grid)) {
            initializeProductGrid(container.grid, container.pagination, container.endpoint, productsPerPage);
        }
    });

    // Initialize product grid with backend data
    async function initializeProductGrid(gridId, paginationId, endpoint, productsPerPage) {
        const grid = document.getElementById(gridId);
        const pagination = document.getElementById(paginationId);
        
        if (!grid || !pagination) return;
        
        // Show loading state
        grid.innerHTML = '<div class="loading">Loading products...</div>';
        
        try {
            // First fetch to get total count for pagination
            const countResponse = await fetch(`${endpoint}/count`);
            const { total } = await countResponse.json();
            const pageCount = Math.ceil(total / productsPerPage);
            
            // Render initial page
            renderPagination(pagination, pageCount, (page) => {
                loadProducts(grid, endpoint, page, productsPerPage);
            });
            
            // Load first page
            await loadProducts(grid, endpoint, 1, productsPerPage);
        } catch (error) {
            console.error('Error loading products:', error);
            grid.innerHTML = '<div class="error">Error loading products. Please try again.</div>';
        }
    }

    // Load products from backend
    async function loadProducts(grid, endpoint, page, perPage) {
        grid.innerHTML = '<div class="loading">Loading...</div>';
        
        try {
            const response = await fetch(`${endpoint}?page=${page}&limit=${perPage}`);
            const products = await response.json();
            
            renderProducts(grid, products);
        } catch (error) {
            console.error('Error loading products:', error);
            grid.innerHTML = '<div class="error">Error loading products. Please try again.</div>';
        }
    }

    // Render products to grid
    function renderProducts(grid, products) {
        grid.innerHTML = '';
        
        if (products.length === 0) {
            grid.innerHTML = '<div class="no-products">No products found</div>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <h3 class="product-title">${product.title}</h3>
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <div class="price">
                        $${product.price}
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    </div>
                    <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(productCard);
        });
    }

    // Render pagination controls
    function renderPagination(pagination, pageCount, onPageChange) {
        pagination.innerHTML = '';
        
        if (pageCount <= 1) return;
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&laquo; Previous';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                onPageChange(currentPage);
                renderPagination(pagination, pageCount, onPageChange);
            }
        });
        pagination.appendChild(prevBtn);
        
        // Page buttons
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            const firstPageBtn = document.createElement('button');
            firstPageBtn.textContent = '1';
            firstPageBtn.addEventListener('click', () => {
                currentPage = 1;
                onPageChange(currentPage);
                renderPagination(pagination, pageCount, onPageChange);
            });
            pagination.appendChild(firstPageBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
                pageBtn.disabled = true;
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                onPageChange(currentPage);
                renderPagination(pagination, pageCount, onPageChange);
            });
            pagination.appendChild(pageBtn);
        }
        
        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
            
            const lastPageBtn = document.createElement('button');
            lastPageBtn.textContent = pageCount;
            lastPageBtn.addEventListener('click', () => {
                currentPage = pageCount;
                onPageChange(currentPage);
                renderPagination(pagination, pageCount, onPageChange);
            });
            pagination.appendChild(lastPageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = 'Next &raquo;';
        nextBtn.disabled = currentPage === pageCount;
        nextBtn.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                onPageChange(currentPage);
                renderPagination(pagination, pageCount, onPageChange);
            }
        });
        pagination.appendChild(nextBtn);
    }
    
    // Current page tracker
    let currentPage = 1;
    
    // Add event delegation for add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
    });
    
    // Add to cart function
    async function addToCart(productId) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                updateCartCount(result.totalItems);
                showNotification('Product added to cart!');
            } else {
                showNotification('Failed to add to cart: ' + (result.message || 'Unknown error'), true);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Network error. Please try again.', true);
        }
    }
    
    function updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = count;
        });
    }
    
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : 'success'}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});