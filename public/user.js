document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized access. Please login.");
    window.location.href = "login.html";
    return;
  }

  const userTable = document.getElementById("user-table").getElementsByTagName("tbody")[0];
  const userForm = document.getElementById("user-form");
  const userNameInput = document.getElementById("user-name");
  const userEmailInput = document.getElementById("user-email");
  const userPasswordInput = document.getElementById("user-password");

  // user.js
  async function fetchUserProfile() {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage atau sumber lain
    if (!token) {
      console.error("Token tidak ditemukan");
      return;
    }

    try {
      const response = await fetch('/api/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Sertakan token di header
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        console.error("Akses ditolak: Anda tidak memiliki izin.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profil bang ", data);
      renderUserProfile(data);
    } catch (error) {
      console.error("Error saat mengambil profil pengguna:", error);
    }
  }

  function renderUserProfile(user) {
    userTable.innerHTML = ""; // Clear existing rows

    const row = userTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.textContent = user.name;
    cell2.textContent = user.email;
    cell3.textContent = user.password; // Display password (for demo purposes only)
    cell4.innerHTML = `<button class="btn btn-primary" onclick="editUser()">Edit</button>`;
  }

  window.editUser = function () {
    const row = userTable.rows[0]; // Assuming only one user profile is displayed
    userNameInput.value = row.cells[0].textContent;
    userEmailInput.value = row.cells[1].textContent;
    userPasswordInput.value = row.cells[2].textContent; // For demo purposes only
  }

  // Handle form submission for updating user data
  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }

      alert("Profile updated successfully.");
      fetchUserProfile();
    } catch (err) {
      console.error("Failed to update user profile:", err);
      alert("Failed to update user profile. Please try again.");
    }
  });

  // Initial fetch
  await fetchUserProfile();
});