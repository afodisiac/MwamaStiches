 // Thumbnail click functionality
 const thumbnails = document.querySelectorAll('.thumbnail');
 const mainImage = document.querySelector('.main-image');
 
 thumbnails.forEach(thumbnail => {
     thumbnail.addEventListener('click', function() {
         // Remove active class from all thumbnails
         thumbnails.forEach(t => t.classList.remove('active'));
         // Add active class to clicked thumbnail
         this.classList.add('active');
         // Update main image
         mainImage.src = this.src.replace('200', '800');
     });
 });
 
 // Color swatch selection
 const colorSwatches = document.querySelectorAll('.color-swatch');
 
 colorSwatches.forEach(swatch => {
     swatch.addEventListener('click', function() {
         // Remove active class from all swatches
         colorSwatches.forEach(s => s.classList.remove('active'));
         // Add active class to clicked swatch
         this.classList.add('active');
         // In a real implementation, you would update the product images here
         // based on the selected color (data-color attribute)
     });
 });
 
 // Size selection
 const sizeOptions = document.querySelectorAll('.size-option');
 
 sizeOptions.forEach(option => {
     option.addEventListener('click', function() {
         // Remove active class from all options
         sizeOptions.forEach(o => o.classList.remove('active'));
         // Add active class to clicked option
         this.classList.add('active');
     });
 });
 
 // Quantity selector
 const quantityInput = document.querySelector('.quantity-input');
 const minusBtn = document.querySelector('.quantity-btn:first-child');
 const plusBtn = document.querySelector('.quantity-btn:last-child');
 
 minusBtn.addEventListener('click', function() {
     let value = parseInt(quantityInput.value);
     if (value > 1) {
         quantityInput.value = value - 1;
     }
 });
 
 plusBtn.addEventListener('click', function() {
     let value = parseInt(quantityInput.value);
     quantityInput.value = value + 1;
 });
 
 // Wishlist button
 const wishlistBtn = document.querySelector('.wishlist-btn');
 const wishlistIcon = wishlistBtn.querySelector('i');
 
 wishlistBtn.addEventListener('click', function() {
     wishlistIcon.classList.toggle('far');
     wishlistIcon.classList.toggle('fas');
     if (wishlistIcon.classList.contains('fas')) {
         wishlistIcon.style.color = 'var(--accent)';
     } else {
         wishlistIcon.style.color = '';
     }
 });
 
 // Image zoom modal
 function openModal() {
     const modal = document.getElementById('imageModal');
     const modalImg = document.getElementById('modalImage');
     modal.style.display = 'flex';
     modalImg.src = mainImage.src;
 }
 
 function closeModal() {
     document.getElementById('imageModal').style.display = 'none';
 }
 
 // Close modal when clicking outside the image
 window.onclick = function(event) {
     const modal = document.getElementById('imageModal');
     if (event.target == modal) {
         modal.style.display = 'none';
     }
 }