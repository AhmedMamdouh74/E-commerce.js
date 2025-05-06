// auth.js (Registration)
window.addEventListener("load", function () {
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
      .then((newUser) => {
        localStorage.setItem("user", JSON.stringify(newUser));
        window.location.href =
          newUser.role === "seller" ? "seller.html" : "customer.html";
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert(
          error.message === "User already exists"
            ? "Email already registered!"
            : "Registration failed. Please try again."
        );
      })
      .finally(() => {
        isSubmitting = false;
        submitButton.disabled = false;
      });
  });
});
