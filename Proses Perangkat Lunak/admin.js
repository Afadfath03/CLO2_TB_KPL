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
  function renderUsers() {
    userTable.innerHTML = '';
    users.forEach((user, index) => {
      const row = userTable.insertRow();
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.password}</td> <!-- Display password -->
        <td>
          <button class="edit" onclick="editUser(${index})">Edit</button>
          <button class="delete" onclick="deleteUser(${index})">Delete</button>
        </td>
      `;
    });
  }

  // Handle form submit for create/update user data
  userForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim(); // Get the password input

    if (name && email && password) {
      const userId = userIdInput.value;
      if (userId) {
        // Update user
        users[userId].name = name;
        users[userId].email = email;
        users[userId].password = password; // Update password
      } else {
        // Add new user
        users.push({ name, email, password });
      }

      // Clear the form
      userNameInput.value = '';
      userEmailInput.value = '';
      userPasswordInput.value = ''; // Clear the password field
      userIdInput.value = '';

      renderUsers();
    }
  });

  // Edit user data
  window.editUser = function (index) {
    const user = users[index];
    userNameInput.value = user.name;
    userEmailInput.value = user.email;
    userPasswordInput.value = user.password; // Populate password field
    userIdInput.value = index;
  };

  // Delete user
  window.deleteUser = function (index) {
    users.splice(index, 1);
    renderUsers();
  };

  // Go to User page
  window.goHome = function () {
    window.location.href = 'index.html'; // Redirect to User page
  };

  // Initial render
  renderUsers();
});