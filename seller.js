//  || 1;

// // Load all data when page is ready
// document.addEventListener("load", () => {
//   loadDashboardStats(currentSellerId);
//   loadRecentOrders(currentSellerId);
//   loadProducts(currentSellerId);
//   loadOrders(currentSellerId);

// // ===================== DASHBOARD =====================
// function loadDashboardStats(sellerId) {
//   fetch(`http://localhost:3000/products?sellerId=${sellerId}`)
//     .then(res => res.json())
//     .then(products => {
//       document.getElementById("total-products").textContent = products.length;
//     });

//   fetch(`http://localhost:3000/orders?sellerId=${sellerId}`)
//     .then(res => res.json())
//     .then(orders => {
//       document.getElementById("total-orders").textContent = orders.length;
//       const pending = orders.filter(o => o.status === 'pending').length;
//       document.getElementById("pending-orders").textContent = pending;
//       const revenue = orders.reduce((acc, o) => acc + o.total, 0);
//       document.getElementById("total-revenue").textContent = `$${revenue.toFixed(2)}`;
//     });
// }

// function loadRecentOrders(sellerId) {
//   fetch(`http://localhost:3000/orders?sellerId=${sellerId}&_sort=date&_order=desc&_limit=5`)
//     .then(res => res.json())
//     .then(orders => {
//       const tbody = document.getElementById("recent-orders-list");
//       tbody.innerHTML = "";
//       orders.forEach(order => {
//         const row = `<tr>
//           <td>${order.id}</td>
//           <td>${order.customer}</td>
//           <td>$${order.total}</td>
//           <td>${order.status}</td>
//           <td>${order.date}</td>
//         </tr>`;
//         tbody.innerHTML += row;
//       });
//     });
// }

// // ===================== PRODUCT MANAGEMENT =====================
// function loadProducts(sellerId) {
//   fetch(`http://localhost:3000/products?sellerId=${sellerId}`)
//     .then(res => res.json())
//     .then(products => {
//       const tbody = document.getElementById("products-list");
//       tbody.innerHTML = "";
//       products.forEach(product => {
//         const row = `<tr>
//           <td><img src="${product.image}" width="50" /></td>
//           <td>${product.name}</td>
//           <td>$${product.price}</td>
//           <td>${product.category}</td>
//           <td>${product.status}</td>
//           <td>
//             <button onclick="fillEditForm(${product.id})">Edit</button>
//             <button onclick="deleteProduct(${product.id})">Delete</button>
//           </td>
//         </tr>`;
//         tbody.innerHTML += row;
//       });
//     });
// }

// // Fill edit form
// function fillEditForm(productId) {
//   fetch(`http://localhost:3000/products/${productId}`)
//     .then(res => res.json())
//     .then(product => {
//       const form = document.getElementById("edit-product-form");
//       form.id.value = product.id;
//       form.name.value = product.name;
//       form.image.value = product.image;
//       form.category.value = product.category;
//       form.price.value = product.price;
//     });
// }

// // Edit Product
// document.getElementById("edit-product-form")?.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const id = this.id.value;
//   const updatedProduct = {
//     name: this.name.value,
//     image: this.image.value,
//     category: this.category.value,
//     price: +this.price.value
//   };

//   fetch(`http://localhost:3000/products/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updatedProduct)
//   }).then(() => {
//     alert("Product updated.");
//     loadProducts(currentSellerId);
//   });
// });

// // Delete Product
// document.getElementById("delete-product-form")?.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const id = this.id.value;

//   fetch(`http://localhost:3000/products/${id}`, {
//     method: "DELETE"
//   }).then(() => {
//     alert("Product deleted.");
//     this.reset();
//     loadProducts(currentSellerId);
//   });
// });

// function deleteProduct(productId) {
//   if (confirm("Are you sure you want to delete this product?")) {
//     fetch(`http://localhost:3000/products/${productId}`, {
//       method: "DELETE"
//     }).then(() => {
//       alert("Product deleted.");
//       loadProducts(currentSellerId);
//     });
//   }
// }

// // ===================== ORDER MANAGEMENT =====================
// function loadOrders(sellerId) {
//   fetch(`http://localhost:3000/orders?sellerId=${sellerId}`)
//     .then(res => res.json())
//     .then(orders => {
//       const tbody = document.getElementById("orders-list");
//       tbody.innerHTML = "";
//       orders.forEach(order => {
//         const row = `<tr>
//           <td>${order.id}</td>
//           <td>${order.customer}</td>
//           <td>${order.products.map(p => p.name).join(", ")}</td>
//           <td>$${order.total}</td>
//           <td>${order.date}</td>
//           <td>${order.status}</td>
//           <td>
//             <select onchange="updateOrderStatus(${order.id}, this.value)">
//               <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
//               <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
//             </select>
//           </td>
//         </tr>`;
//         tbody.innerHTML += row;
//       });
//     });
// }

// function updateOrderStatus(orderId, newStatus) {
//   fetch(`http://localhost:3000/orders/${orderId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status: newStatus })
//   }).then(() => {
//     alert("Order status updated.");
//     loadOrders(currentSellerId);
//   });
// }
// });
const currentSeller = JSON.parse(localStorage.getItem("user"));

// if (currentSeller) {
//   const sellerObj = JSON.parse(currentSeller);
//   let sellerId = sellerObj.id;
//   console.log("Seller ID:", sellerId);
// } else {
//   console.error("No user found in localStorage");
// }

window.addEventListener("load", () => {
  console.log(localStorage.getItem("user")); // Check stored value

  // Handle tab switching
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll("section");
  const productsTableBody = document.querySelector("#productsTable tbody");
  const ordersTableBody = document.querySelector("#ordersTable tbody");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sections.forEach((sec) => sec.classList.remove("active"));
      const targetId = tab.dataset.target;
      document.getElementById(targetId).classList.add("active");

      // Load data based on tab
      if (targetId === "products") {
        loadProducts();
      } else if (targetId === "orders") {
        loadorders();
      }
    });

    // products=> Approve or reject products submitted by Sellers, Edit or delete existing products.

    // add product

    document
      .getElementById("add-product-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();      
          const product = {
            name:this .name.value,
            image: this.image.value,
            category: this.category.value,
            price: this.price.value,
            sellerId: currentSeller.id,
            status: "pending",
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
  });

  // Create and render product row
  const renderproduct = (product) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.status}</td>
      <td>   
        <button class="edit-product" data-id="${product.id}">Edit</button>
        <button class="delete-product" data-id="${product.id}">Delete</button>
      </td>
    `;
    productsTableBody.appendChild(tr);
  };
  // Load all products from server
  const loadProducts = () => {
    productsTableBody.innerHTML = "";
    fetch(`http://localhost:3000/products?sellerId=${currentSeller.id}`)
      .then((res) => res.json())
      .then((products) => {
        products.forEach(renderproduct);
      });
  };
  // actions
  productsTableBody.addEventListener("click", function (e) {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete-product")) {
      fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      }).then(() => loadProducts());
    }

    // Edit
    else if (e.target.classList.contains("edit-product")) {
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

  // orders

  // Create and render order row
  const renderorder = (order) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.userId}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
      <td><button class="delete-order" data-id="${order.id}">Delete</button></td>
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
  // Event delegation for delete buttons
  ordersTableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-order")) {
      const id = e.target.dataset.id;
      fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE",
      }).then(() => loadorders());
    }
  });
  loadProducts();
  loadorders();
});
