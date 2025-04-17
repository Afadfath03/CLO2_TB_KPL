document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized access. Please login.");
    window.location.href = "login.html";
    return;
  }

  console.log("Token:", token); // Debug token
  console.log("User role:", JSON.parse(atob(token.split(".")[1])).role); // Debug user role

  const userTable = document.getElementById("user-table").getElementsByTagName("tbody")[0];
  const userForm = document.getElementById("user-form");
  const userIdInput = document.getElementById("user-id");
  const userNameInput = document.getElementById("user-name");
  const userEmailInput = document.getElementById("user-email");
  const userPasswordInput = document.getElementById("user-password");
  const userRoleInput = document.getElementById("user-role");

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Pastikan formatnya benar
        },
      });

      if (response.status === 403) {
        console.error("Forbidden. You do not have admin access.");
        alert("Access denied. Admin privileges are required.");
        return;
      }

      const users = await response.json();
      console.log(users);
      renderUser(users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }

  function renderUser(users) {
    const userTable = document.getElementById("userTableBody");
    userTable.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button onclick="editUser(${user.id})">Edit</button>
          <button onclick="deleteUser(${user.id})">Delete</button>
        </td>
      `;
      userTable.appendChild(row);
    });
  }

  window.editUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();

      userIdInput.value = user.id;
      userNameInput.value = user.name;
      userEmailInput.value = user.email;
      userRoleInput.value = user.role;
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  window.deleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`/api/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const name = userNameInput.value;
    const email = userEmailInput.value;
    const password = userPasswordInput.value;
    const strrole = userRoleInput.value;
    const role = strrole === "Admin" ? 0 : 1;
    
    console.log("Form submitted:", { id, name, email, password, role }); // Debug form submission

    try {
      if (id) {
        // Update user
        await fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, password, role }),
        });
      } else {
        // Create user
        await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, password, role }),
        });
      }

      userForm.reset();
      fetchUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  });

  fetchUsers();
});