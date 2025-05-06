window.addEventListener("load", () => {
  // Handle tab switching
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll("section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sections.forEach((sec) => sec.classList.remove("active"));
      const targetId = tab.dataset.target;
      document.getElementById(targetId).classList.add("active");

      // Load data based on tab
      if (targetId === "users") {
        loadUsers();
      } else if (targetId === "products") {
        loadProducts();
      } else if (targetId === "orders") {
        loadorders();
      }
    });

    const usersTableBody = document.querySelector("#usersTable tbody");

    // Create and render user row
    const renderUser = (user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
     <td>
      ${
        user.role === "admin"
          ? ""
          : `<button class="edit-user" data-id="${user.id}">Edit</button>`
      }
      ${
        user.role === "admin"
          ? ""
          : `<button class="delete-user" data-id="${user.id}">Delete</button>`
      }
    </td>
    `;
      usersTableBody.appendChild(tr);
    };

    // Load all users from server
    const loadUsers = () => {
      usersTableBody.innerHTML = "";
      fetch("http://localhost:3000/users")
        .then((res) => {return res.json()})
        .then((users) => {
          users.forEach(renderUser);
        });
    };

    // delete button
    usersTableBody.addEventListener("click", function (e) {
      if (e.target.classList.contains("delete-user")) {
        const id = e.target.dataset.id;
        fetch(`http://localhost:3000/users/${id}`, {
          method: "DELETE",
        }).then(() => loadUsers());
        // edit user
      } else {
        if (e.target.classList.contains("edit-user")) {
          const id = e.target.dataset.id;
          fetch(`http://localhost:3000/users/${id}`)
            .then((res) =>{return res.json()})
            .then((user) => {
              const newUsername = prompt("Edit username:", user.username);
              const newEmail = prompt("Edit email:", user.email);
              const newRole = prompt("Edit role (seller/customer):", user.role);
              if (newUsername && newEmail && newRole) {
                fetch(`http://localhost:3000/users/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...user,
                    username: newUsername,
                    email: newEmail,
                    role: newRole,
                  }),
                }).then(() => loadUsers());
              }
            });
        }
      }
    });
    // add user
    const form = document.getElementById("register-form");
    const fields = {
      name: form.querySelector('[name="name"]'),
      email: form.querySelector('[name="email"]'),
      password: form.querySelector('[name="password"]'),
      role: form.querySelector('[name="role"]'),
    };
    let isSubmitting = false;

    // Real-time validation
    form.addEventListener("input", function (e) {
      const target = e.target;
      if (target.name in fields) {
        validateField(target, patterns[target.name]);
      }
    });

    // Form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (isSubmitting) return;
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      isSubmitting = true;

      // Validate all fields
      const validations = [
        validateField(fields.name, patterns.name),
        validateField(fields.email, patterns.email),
        validateField(fields.password, patterns.password),
        validateField(fields.role, patterns.role),
      ];

      if (!validations.every((valid) => valid)) {
        submitButton.disabled = false;
        isSubmitting = false;
        return;
      }

      const userData = {
        username: fields.name.value.trim(),
        email: fields.email.value.trim().toLowerCase(),
        password: fields.password.value.trim(),
        role: fields.role.value,
      };

      fetch("http://localhost:3000/users")
        .then((res) => {
          if (!res.ok) throw new Error("Network error");
          return res.json();
        })
        .then((users) => {
          if (users.some((u) => u.email === userData.email)) {
            throw new Error("User already exists");
          }
          return fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
        })
        .then((res) => {
          if (!res.ok) throw new Error("Registration failed");
          return res.json();
        })
        .catch((error) => {
          alert(
            error.message === "User already exists"
              ? "Email already registered!"
              : "Registration failed. Please try again."
          );
        })
        .finally(() => {
          isSubmitting = false;
          submitButton.disabled = false;
          loadUsers();
        });
    });
    // products=> Approve or reject products submitted by Sellers, Edit or delete existing products.
    const productsTableBody = document.querySelector("#productsTable tbody");

    // Create and render product row
    const renderproduct = (product) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.status}</td>
      <td>   ${
        product.status === "pending"
          ? `
        <button class="approve-product" data-id="${product.id}">Approve</button>
        <button class="reject-product" data-id="${product.id}">Reject</button>
      `
          : `
        <button class="edit-product" data-id="${product.id}">Edit</button>
        <button class="delete-product" data-id="${product.id}">Delete</button>
      `
      }</td>
    `;
      productsTableBody.appendChild(tr);
    };
    // Load all products from server
    const loadProducts = () => {
      productsTableBody.innerHTML = "";
      fetch("http://localhost:3000/products")
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

      // Approve
      else if (e.target.classList.contains("approve-product")) {
        fetch(`http://localhost:3000/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approved" }),
        }).then((res) =>
          res.json.then((updatedproduct) => {
            const row = document
              .querySelector(`[data-id="${id}"]`)
              .closest("tr");
            row.cells[3].textContent = updatedproduct.status; // Update status column

            // Swap approve/reject buttons for edit/delete buttons
            row.cells[4].innerHTML = `
          <button class="edit-product" data-id="${id}">Edit</button>
          <button class="delete-product" data-id="${id}">Delete</button>
        `;
          })
        );
      }

      // Reject
      else if (e.target.classList.contains("reject-product")) {
        fetch(`http://localhost:3000/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected" }),
        }).then(() => loadProducts());
      }

      // Edit
      else if (e.target.classList.contains("edit-product")) {
        fetch(`http://localhost:3000/products/${id}`)
          .then((res) => res.json())
          .then((product) => {
            const newName = prompt("Edit product name:", product.name);
            const newPrice = prompt("Edit product price:", product.price);
            if (newName && newPrice) {
              fetch(`http://localhost:3000/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...product,
                  name: newName,
                  price: parseFloat(newPrice),
                }),
              }).then(() => loadProducts());
            }
          });
      }
    });

    // orders
    const ordersTableBody = document.querySelector("#ordersTable tbody");

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

    loadUsers();
    loadProducts();
    loadorders();
  });
});
