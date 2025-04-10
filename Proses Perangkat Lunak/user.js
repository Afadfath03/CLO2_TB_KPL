document.addEventListener('DOMContentLoaded', function () {
    const users = [{
      name: "John Doe",
      email: "john.doe@example.com"
    }];
    
    const userTable = document.getElementById('user-table').getElementsByTagName('tbody')[0];
    const userForm = document.getElementById('user-form');
    const userIdInput = document.getElementById('user-id');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
  
    // Function to render user data in the table
    function renderUserInfo() {
      userTable.innerHTML = '';
      const user = users[0];  // Only show the logged-in user info (index 0)
      const row = userTable.insertRow();
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
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
  
      if (name && email) {
        // Update user data (only self)
        users[0].name = name;
        users[0].email = email;
  
        // Clear the form
        userNameInput.value = '';
        userEmailInput.value = '';
  
        renderUserInfo();
      }
    });
  
    // Edit user data (only self)
    window.editUser = function () {
      const user = users[0];
      userNameInput.value = user.name;
      userEmailInput.value = user.email;
    };
  
    // Go to Admin page
    window.goHome = function () {
      window.location.href = 'admin.html'; // Redirect to Admin page
    };
  
    // Initial render
    renderUserInfo();
  });  