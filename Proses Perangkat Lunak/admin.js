document.addEventListener('DOMContentLoaded', function () {
  const users = [];
  const userTable = document.getElementById('user-table').getElementsByTagName('tbody')[0];
  const userForm = document.getElementById('user-form');
  const userIdInput = document.getElementById('user-id');
  const userNameInput = document.getElementById('user-name');
  const userEmailInput = document.getElementById('user-email');

  // Function to render users in the table
  function renderUsers() {
    userTable.innerHTML = '';
    users.forEach((user, index) => {
      const row = userTable.insertRow();
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button class="edit" onclick="editUser(${index})">Edit</button>
          <button class="delete" onclick="deleteUser(${index})">Delete</button>
        </td>
      `;
    });
  }

  // Handle form submit for create/update user
  userForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (name && email) {
      const userId = userIdInput.value;
      if (userId) {
        // Update user
        users[userId].name = name;
        users[userId].email = email;
      } else {
        // Add new user
        users.push({ name, email });
      }

      // Clear the form
      userNameInput.value = '';
      userEmailInput.value = '';
      userIdInput.value = '';

      renderUsers();
    }
  });

  // Edit user
  window.editUser = function (index) {
    const user = users[index];
    userNameInput.value = user.name;
    userEmailInput.value = user.email;
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