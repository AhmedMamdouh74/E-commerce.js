document.addEventListener("DOMContentLoaded", function () {
  currentUser = JSON.parse(localStorage.getItem("user"));
    const productDetails = document.getElementById("product-details");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

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
                    
                 
                </div>
            `;

           
          
        })
        .catch(error => {
            productDetails.innerHTML = "<p>Error loading product details</p>";
        });
        
 
});
