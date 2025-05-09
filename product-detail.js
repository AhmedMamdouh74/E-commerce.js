document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("product-details")) {
      const productDetails = document.getElementById("product-details");
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');
  
      if (!productId) {
        productDetails.innerHTML = "<p>Product not found</p>";
        return;
      }
  
      fetchData(`products/${productId}`)
        .then(product => {
          productDetails.innerHTML = `
            <div class="product-detail-card">
              <img src="${product.image}" 
                   alt="${product.name}" 
                   class="product-detail-image">
              <h1>${product.name}</h1>
              <p class="product-category">Category: ${product.category}</p>
              <p class="product-price">Price: $${product.price}</p>
              <p class="product-description">${product.description}</p>
              <button class="btn btn-primary add-to-cart-btn" 
                      data-id="${product.id}">
                Add to Cart
              </button>
            </div>
          `;
          
          // Add to cart button in details page
          document.querySelector(".add-to-cart-btn").addEventListener("click", function() {
            const productId = this.dataset.id;
            // Use the addToCart function from main page logic
            window.opener.addToCart(productId);
            showNotification("Product added to cart!");
          });
        })
        .catch(error => {
          productDetails.innerHTML = "<p>Error loading product details</p>";
        });
    }
  });