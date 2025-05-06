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