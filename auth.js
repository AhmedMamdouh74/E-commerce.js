window.addEventListener("load", function () {
  let namePattern = /^[A-Za-z]{3,}$/;
  let emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  let passwordPattern = /^.{6,}$/;

  const form = document.getElementById("register-form");

  form.addEventListener(
    "blur",
    function (e) {
      const target = e.target;

      if (target.name === "name") checkValid(target, namePattern);
      if (target.name === "email") checkValid(target, emailPattern);
      if (target.name === "password") checkValid(target, passwordPattern);
    },
    true
  );
  // Submission
  document
    .getElementById("register-form")
    .addEventListener("submit", function (e) {
      const username = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim().toLowerCase();
      const password = form.querySelector('input[name="password"]').value.trim();
      const role = form.querySelector('select[name="role"]').value;
      e.preventDefault();
      let registerdUser = {
        username,
        email,
        password,
        role,
      };
      fetch("http://localhost:3000/users")
        .then((res) => res.json())
        .then((users) => {
          const userExists = users.some((u) => u.email === email);

          if (userExists) {
            alert("User already exists in database");
            return; 
          }

          // Only proceed with registration if user doesn't exist
          return fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registerdUser),
          });
        })
        .then((res) => {
           res.json();
        })
        .then((newUser) => {
          localStorage.setItem("user", JSON.stringify(newUser));
          if (newUser.role === "seller") location.href = "seller.html";
          else location.href = "customer.html";
        })
        .catch((error) => {
          console.log(error);
        });
    });

  document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
    });
});
