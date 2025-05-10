

window.addEventListener("load", () => {
  const currentSeller = JSON.parse(localStorage.getItem("user"));
 console.log(JSON.parse(localStorage.getItem("user")))
  const productGrid = document.getElementById("productGrid"); 
  const ordersTableBody = document.getElementById("ordersTableBody");
   const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll("section");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      sections.forEach(sec => sec.style.display = "none");
      document.getElementById(tab.dataset.target).style.display = "block";
    });
  });
  // add product

  document
    .getElementById("add-product-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const product = {
        name: this.name.value,
        image: this.image.value,
        category: this.category.value,
        price: this.price.value,
        sellerId: currentSeller.id,
        status: "pending",
        rating: 0,
      };
      fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      }).then(() => {
        alert("Product added and pending approval.");
        this.reset();
        loadProducts(currentSeller);
      });
    });

  // Create and render product row
  const renderproduct = (product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>${product.category}</p>
              <p>${product.status}</p>
              <p class="price">$${product.price}</p>
              <div class="button-group">
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
              </div>
            `;
    productGrid.appendChild(card);
  };
  // Load all products from server
  const loadProducts = () => {
    productGrid.innerHTML = "";
    fetch(`http://localhost:3000/products?sellerId=${currentSeller.id}`)
      .then((res) => res.json())
      .then((products) => {
        products.forEach(renderproduct);
      });
  };
  // actions
  productGrid.addEventListener("click", function (e) {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
      fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      }).then(() => loadProducts());
    }

    // Edit
    else if (e.target.classList.contains("edit-btn")) {
      fetch(`http://localhost:3000/products/${id}`)
        .then((res) => res.json())
        .then((product) => {
          const newName = prompt("Edit product name:", product.name);
          const newPrice = prompt("Edit product price:", product.price);
          const newCategory = prompt(
            "Edit product category:",
            product.category
          );
          if (newName && newPrice && newCategory) {
            fetch(`http://localhost:3000/products/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...product,
                name: newName,
                price: parseFloat(newPrice),
                category: newCategory,
              }),
            }).then(() => loadProducts());
          }
        });
    }
  });

  

  // Create and render order row
  const renderorder = (order) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.userId}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
  <td>   ${order.status === "pending"
        ? `
        <button class="deliverd-order" data-id="${order.id}">deliverd</button>
        <button class="shipped-order" data-id="${order.id}">shipped</button>
      `
        : ""
      }</td>
    `;
   
    ordersTableBody.appendChild(tr);
  };
  // Load all products from server
  const loadorders = () => {
    ordersTableBody.innerHTML = "";
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((orders) => {
        orders.forEach(renderorder);
      });
  };
  // Event delegation for order actions
  ordersTableBody.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
       if (e.target.classList.contains("shipped-order")) {
      fetch(`http://localhost:3000/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "shipped" }),
      }).then((res) =>
        res.json.then((updatedproduct) => {
         loadorders();
        })
      );

    }
     else if (e.target.classList.contains("deliverd-order")) {
      fetch(`http://localhost:3000/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "deliverd" }),
      }).then((res) =>
        res.json.then(() => {
         loadorders();
        })
      );
    }
  });// end of order actions
 
   document.getElementById('logoutBtn').addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      }
    });
  loadProducts();
  loadorders();
});
