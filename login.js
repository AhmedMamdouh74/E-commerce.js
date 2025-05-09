window.addEventListener("load", function () {
  const form = document.getElementById("login-form");
  const fields = {
    email: form.querySelector('[name="email"]'),
    password: form.querySelector('[name="password"]'),
  };


  form.addEventListener("input", function (e) {
    const target = e.target;
    if (target.name === "email") {
      validateField(target, patterns.email);
    }
    if (target.name === "password") {
      validateField(target, patterns.password);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

   
    const validations = [
      validateField(fields.email, patterns.email),
      validateField(fields.password, patterns.password),
    ];

    if (!validations.every((valid) => valid)) {
      return;
    }

    const userData = {
      email: fields.email.value.trim().toLowerCase(),
      password: fields.password.value.trim(),
    };

    fetch("http://localhost:3000/users")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
       return  res.json();
      })
      .then((users) => {
      
        const user = users.find(
          (u) => u.email === userData.email && u.password === userData.password 
        );

        if (!user) {
          fields.email.classList.add("error");
          fields.password.classList.add("error");
          throw new Error("Invalid email or password");
        }

        localStorage.setItem("user", JSON.stringify(user));
        window.location.href =
          user.role === "admin"
            ? "/admin.html" 
            : user.role === "seller"
            ? "/seller/seller.html"
            : "/";
      })
      .catch((error) => {
       
        if (error.message.includes("Invalid")) {
          alert("Invalid email or password");
        } else {
          alert("Login failed. Please try again.");
        }
      });
  });
});
