document.addEventListener('DOMContentLoaded', function () {
  const users = [{
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123" // Added password field to users array
  }];

  const userTable = document.getElementById('user-table').getElementsByTagName('tbody')[0];
  const userForm = document.getElementById('user-form');
  const userIdInput = document.getElementById('user-id');
  const userNameInput = document.getElementById('user-name');
  const userEmailInput = document.getElementById('user-email');
  const userPasswordInput = document.getElementById('user-password'); // Reference for password field

  // Function to render user data in the table
  function renderUserInfo() {
    userTable.innerHTML = '';
    const user = users[0];  // Only show the logged-in user info (index 0)
    const row = userTable.insertRow();
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.password}</td> <!-- Display password -->
      <td>
        <button class="edit" onclick="editUser()">Edit</button>
      </td>
    `;
  }

  // Handle form submit for update user data
  userForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim(); // Get the password input

    if (name && email && password) {
      // Update user data (only self)
      users[0].name = name;
      users[0].email = email;
      users[0].password = password; // Update password

      // Clear the form
      userNameInput.value = '';
      userEmailInput.value = '';
      userPasswordInput.value = ''; // Clear the password field

      renderUserInfo();
    }
  });

  // Edit user data (only self)
  window.editUser = function () {
    const user = users[0];
    userNameInput.value = user.name;
    userEmailInput.value = user.email;
    userPasswordInput.value = user.password; // Populate password field
  };

  // Go to Admin page
  window.goHome = function () {
    window.location.href = 'admin.html'; // Redirect to Admin page
  };

  // Initial render
  renderUserInfo();
});