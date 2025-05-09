const patterns = {
  name: /^[A-Za-z ]{3,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^.{6,}$/,
  role: /.+/
};

function getErrorMessage(fieldName) {
  const messages = {
      name: 'Must be at least 3 letters',
      email: 'Invalid email format',
      password: 'Minimum 6 characters required',
      role: 'Please select a role'
  };
  return messages[fieldName] || 'Invalid field';
}

function validateField(field, pattern) {
  const errorElement = field.parentElement.querySelector('.error-message');
  if (!errorElement) {
      console.error('Error element not found for:', field.name);
      return false;
  }
  
  const isValid = pattern.test(field.value.trim());
  const message = isValid ? '' : getErrorMessage(field.name);
  
  // Update error message first
  errorElement.textContent = message;
  
  // Then update field classes
  field.classList.toggle('error', !isValid);
  field.classList.toggle('valid', isValid);
  
  return isValid;
}
const API_URL = "http://localhost:3000";
 
 // Utils
 let fetchData = function (endpoint) {
  return fetch(`${API_URL}/${endpoint}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    })
    .catch((error) => console.error(error));
};

// Utils
let sendData = function (endpoint, data, method = "POST") {
  return fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function handleError(error) {
  console.error(error);
  showNotification(error.message || "Operation failed", "error");
}