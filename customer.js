document.addEventListener('DOMContentLoaded',()=>{
  const nav= document.getElementById('nav')
  const user = JSON.parse( localStorage.getItem('user'))
  console.log(user);
  
  if (!user) {
    nav.innerHTML=`
                   <ul>
                    <li><a href="" class="nav-link active" data-section="products">Products</a></li>
                    <li><a href="./login.html" class="">Login</a></li>
                    <li><a href="./register.html" class="">Register</a></li>
                </ul>
    `
  }
  if(user.role==="customer"){
    nav.innerHTML=`
    <ul>
                    <li><a href="#" class="nav-link active" data-section="products">Products</a></li>
                    <li><a href="#" class="nav-link" data-section="orders">My Orders</a></li>
                    <li><a href="#" class="nav-link" data-section="profile">Profile</a></li>
                    <li>
                        <a href="#" id="cartToggle">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </li>
                </ul>`
  }
  if(user.role==="seller"){
    nav.innerHTML =`
    <ul>
                    <li><a href="#" class="nav-link active" data-section="products">Products</a></li>
                    <li><a href="#" class="nav-link" data-section="orders">My Orders</a></li>
                    <li><a href="#" class="nav-link" data-section="profile">Profile</a></li>
                    <li><a href="./seller/seller.html" class="">Dashboard</a></li>
                    <li>
                        <a href="#" id="cartToggle">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </li>
                </ul>
    
    `
  }
  else{
    nav.innerHTML =`
    <ul>
                    <li><a href="#" class="nav-link active" data-section="products">Products</a></li>
                    <li><a href="#" class="nav-link" data-section="orders">My Orders</a></li>
                    <li><a href="#" class="nav-link" data-section="profile">Profile</a></li>
                    <li><a href="./admin.html" class="">Dashboard</a></li>
                    <li>
                        <a href="#" id="cartToggle">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </li>
                </ul>
    
    `
  }

})

















function smoothScrollToSection(sectionElement) {
  sectionElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

window.addEventListener("load", () => {
  // DOM Elements
  const listProductHTML = document.querySelector(".listProduct");
  const cartSection = document.querySelector(".cart-items");
  const ordersSection = document.querySelector(".orders-list");
  const currentCustomer = JSON.parse(localStorage.getItem("user"));
  const cartToggle = document.getElementById("cartToggle");
  const closeCart = document.getElementById("closeCart");
  const cartSidebar = document.querySelector(".cart-sidebar");
  const cartCount = document.querySelector(".cart-count");
  const navLinks = document.querySelectorAll(".nav-link");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  
  // Section Configuration
  const sections = {
    products: document.getElementById("products-section"),
    orders: document.getElementById("orders-section"),
    profile: document.getElementById("profile-section")
  };

  // ======================
  // Section Management
  // ======================
  const switchSection = (sectionId) => {
    // Hide all sections
    Object.values(sections).forEach(section => {
      section.classList.remove("active-section");
    });
    
    // Remove active class from nav links
    navLinks.forEach(link => {
      link.classList.remove("active");
    });

    // Show selected section
    const targetSection = sections[sectionId];
    targetSection.classList.add("active-section");
    document.querySelector(`[data-section="${sectionId}"]`).classList.add("active");
    
    // Smooth scroll to section
    smoothScrollToSection(targetSection);
  };

  
  // Product Management
  
  const renderProducts = (products) => {
    listProductHTML.innerHTML = products.map(product => `
      <div class="product-card">
        <a href="product-details.html?id=${product.id}" class="product-link">
          <img src="${product.image || '/placeholder.svg'}" 
               alt="${product.name}" 
               class="product-image">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="product-price">$${product.price}</div>
          </div>
        </a>
        <button class="btn btn-primary add-to-cart-btn" 
                data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `).join("");
  };

  const loadProducts = () => {
    fetchData("products").then((products) => {
      const approvedProducts = products.filter(product => product.status === "approved");
      renderProducts(approvedProducts);
    });
  };


  // Search Functionality

  const searchProducts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    fetchData("products").then((products) => {
      const filteredProducts = products.filter(product => 
        product.status === "approved" && 
        (product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm))
      );
      renderProducts(filteredProducts);
    });
  };

  
  // Cart Management
 
  const updateCartCount = (count) => {
    if (!cartCount) {
      return
    }
    cartCount.textContent = count;
    cartCount.style.visibility = count > 0 ? 'visible' : 'hidden';
  };

  const addToCart = (productId) => {
    if (!currentCustomer) {
      alert('you not logged in')
      return
    }
    fetchData(`cart?userId=${currentCustomer?.id}`).then(carts => {
      const userCart = carts.find(c => c.userId === currentCustomer.id);
      
      if (!userCart) return createNewCart(productId);
      
      const existingProduct = userCart.products.find(p => p.productId == productId);
      existingProduct ? existingProduct.quantity++ : addNewProduct(userCart, productId);
      
      userCart.total = userCart.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
      sendData(`cart/${userCart.id}`, userCart, "PUT").then(loadCart);
    });
  };

  const createNewCart = (productId) => {
    fetchData(`products/${productId}`).then(product => {
      const newCart = {
        userId: currentCustomer.id,
        products: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }],
        total: product.price,
        createdAt: new Date().toISOString()
      };
      sendData("cart", newCart).then(loadCart);
    });
  };

  const addNewProduct = (userCart, productId) => {
    fetchData(`products/${productId}`).then(product => {
      userCart.products.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      userCart.total += product.price;
      sendData(`cart/${userCart.id}`, userCart, "PUT").then(loadCart);
    });
  };

  const loadCart = () => {
    fetchData(`cart?userId=${currentCustomer?.id}`).then(carts => {
      const userCart = carts.find(c => c.userId === currentCustomer.id);
      cartSection.innerHTML = '';

      if (!userCart?.products.length) {
        cartSection.innerHTML = "<p>Your cart is empty.</p>";
        updateCartCount(0);
        return;
      }

      userCart.products.forEach(product => {
        cartSection.insertAdjacentHTML('beforeend', `
          <div class="cart-item" data-id="${product.productId}">
            <img src="${product.image}" alt="${product.name}" class="cart-image">
            <div class="cart-info">
              <h3>${product.name}</h3>
              <p>$${product.price}</p>
              <div class="cart-item-quantity">
                <button class="quantity-btn minus">-</button>
                <span>${product.quantity}</span>
                <button class="quantity-btn plus">+</button>
              </div>
            </div>
            <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
          </div>
        `);
      });

      cartSection.insertAdjacentHTML('beforeend', `
        <div class="cart-summary">
          <h2>Total: $${userCart.total.toFixed(2)}</h2>
        </div>
      `);

      updateCartCount(userCart.products.reduce((acc, p) => acc + p.quantity, 0));
    });
  };

  const handleQuantityChange = (productId, change) => {
    fetchData(`cart?userId=${currentCustomer.id}`)
      .then(carts => {
        const userCart = carts.find(c => c.userId === currentCustomer.id);
        const product = userCart.products.find(p => p.productId == productId);

        product.quantity += change;
        if (product.quantity < 1) {
          userCart.products = userCart.products.filter(p => p.productId != productId);
        }

        userCart.total = userCart.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
        return sendData(`cart/${userCart.id}`, userCart, "PUT");
      })
      .then(loadCart)
      .catch(handleError);
  };

  const handleCartItemRemoval = (productId) => {
    fetchData(`cart?userId=${currentCustomer.id}`)
      .then(carts => {
        const userCart = carts.find(c => c.userId === currentCustomer.id);
        userCart.products = userCart.products.filter(p => p.productId != productId);
        userCart.total = userCart.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
        return sendData(`cart/${userCart.id}`, userCart, "PUT");
      })
      .then(loadCart)
      .catch(handleError);
  };

 
  // Checkout Process
  
  const handleCheckout = () => {
    fetchData(`cart?userId=${currentCustomer.id}`)
      .then(carts => {
        const userCart = carts.find(c => c.userId === currentCustomer.id);
        if (!userCart?.products.length) throw new Error("Cart is empty");

        return sendData("orders", {
          userId: currentCustomer.id,
          products: userCart.products,
          total: userCart.total,
          status: "pending",
          date: new Date().toISOString()
        }).then(() => {
          userCart.products = [];
          userCart.total = 0;
          return sendData(`cart/${userCart.id}`, userCart, "PUT");
        });
      })
      .then(() => {
        loadCart();
        cartSidebar.classList.remove("open");
        showNotification("Order placed successfully!");
        loadOrders();
      })
      .catch(handleError);
  };

  // Orders Section

  const loadOrders = () => {
    fetchData(`orders?userId=${currentCustomer?.id}`).then(orders => {
      ordersSection.innerHTML = orders.length > 0 
        ? orders.map(order => `
            <div class="order-item">
              <h4>Order #${order.id}</h4>
              <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
              <p>Total: $${order.total.toFixed(2)}</p>
              <p class="order-status ${order.status}">${order.status}</p>
            </div>
          `).join("")
        : `<div class="no-orders">No orders found</div>`;
    });
  };

  // Profile Section

  const loadProfile = () => {
    if (currentCustomer) {
      document.getElementById("fullName").value = currentCustomer.name || "";
      document.getElementById("email").value = currentCustomer.email || "";
      document.getElementById("phone").value = currentCustomer.phone || "";
      document.getElementById("address").value = currentCustomer.address || "";
    }
  };

  const saveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentCustomer,
      name: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value
    };

    if (document.getElementById("password").value) {
      updatedUser.password = document.getElementById("password").value;
    }

    sendData(`users/${currentCustomer.id}`, updatedUser, "PUT")
      .then(() => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        showNotification("Profile updated successfully!");
        document.getElementById("password").value = "";
      })
      .catch(handleError);
  };

 
  // Event Listeners

  document.querySelector("nav").addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      e.preventDefault();
      const section = e.target.dataset.section;
      switchSection(section);
      if (section === "orders") loadOrders();
    }
  });

  listProductHTML.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      addToCart(e.target.dataset.id);
    }
  });

  cartSection.addEventListener("click", (e) => {
    const cartItem = e.target.closest(".cart-item");
    if (!cartItem) return;
    
    const productId = cartItem.dataset.id;
    if (e.target.closest(".plus")) handleQuantityChange(productId, 1);
    if (e.target.closest(".minus")) handleQuantityChange(productId, -1);
    if (e.target.closest(".cart-item-remove")) handleCartItemRemoval(productId);
  });

  document.querySelector(".checkout-btn").addEventListener("click", handleCheckout);
  cartToggle?.addEventListener("click", () => cartSidebar.classList.add("open"));
  closeCart.addEventListener("click", () => cartSidebar.classList.remove("open"));
  document.getElementById("profile-form").addEventListener("submit", saveProfile);
  searchBtn.addEventListener("click", searchProducts);
  searchInput.addEventListener("input", searchProducts);

 
  // Initialization

  const initializePage = () => {
    loadProducts();
    loadCart();
    loadOrders();
    loadProfile();
    switchSection("products");
  };

  initializePage();
});