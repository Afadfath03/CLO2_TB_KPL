const statusOrder = {
  "Incomplete": 0,
  "Completed": 1,
};

async function fetchTasks() {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let tasks = await response.json();

    tasks = tasks.sort((a, b) => a.status - b.status);

    console.log(tasks);
    renderTasks(tasks);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
}

function renderTasks(tasks) {
  const tasksList = document.getElementById("tasksList");
  tasksList.innerHTML = ""; // Kosongkan tabel sebelum menambahkan data baru


  console.log(tasks.deadline);
  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.name}</td>
      <td class="status" data-task-id="${task.id}" data-status="${task.status}">
        <span data-i18n="${task.status === 0 ? 'unfinished_task' : 'finished_task'}">
          ${task.status === 0 ? "Unfinished" : "Finished"}
        </span>
      </td>
      <td>${task.deadline}</td>
      <td>
        <button onclick="toggleStatus(${task.id})" data-i18n="toggle_status">Toggle Status</button>
        <button onclick="deleteTask(${task.id})" data-i18n="delete_btn">Delete</button>
      </td>
    `;
    tasksList.appendChild(row);
  });

  applyLanguage();
}

async function toggleStatus(taskId) {
  const statusElement = document.querySelector(`.status[data-task-id="${taskId}"]`);
  const currentStatus = parseInt(statusElement.getAttribute("data-status"), 10);
  const newStatus = currentStatus === 1 ? 0 : 1;

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update task status");
    }

    await fetchTasks();
  } catch (err) {
    console.error("Failed to toggle task status:", err);
    alert("Failed to update task status. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", fetchTasks);

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = e.target.querySelector('input[type="text"]');
  const deadlineInput = e.target.querySelector('input[type="datetime-local"]');

  const taskName = nameInput.value;
  const deadline = deadlineInput.value;

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: taskName, deadline })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    e.target.reset();
    await fetchTasks();
  } catch (err) {
    console.error("Failed to create task:", err);
  }
});

async function applyTranslations(lang) {
  try {
    const res = await fetch(`/i18n/lang_${lang}.json`);
    const translations = await res.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) el.textContent = translations[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) el.placeholder = translations[key];
    });
  } catch (err) {
    console.error("Gagal memuat translasi:", err);
  }
}

async function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  await applyTranslations(lang);
  document.getElementById("lang-btn-label").textContent = lang === "id" ? "Indonesia" : "English";
  document.getElementById("lang-menu").style.display = "none";
}

async function toggleStatus(taskId) {
  const statusElement = document.querySelector(`.status[data-task-id="${taskId}"]`);
  const currentStatus = statusElement.getAttribute("data-status") === "1";
  const newStatus = currentStatus ? 0 : 1;

  await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });

  await fetchTasks();
}

async function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete task");
    }

    await fetchTasks();
  } catch (err) {
    console.error("Failed to delete task:", err);
    alert("Failed to delete task. Please try again.");
  }
}

window.addEventListener("load", async () => {
  const lang = localStorage.getItem("lang") || "id";
  await applyTranslations(lang);
  await fetchTasks();
});
