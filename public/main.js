const statusOrder = {
  "Incomplete": 0,
  "Completed": 1,
};

async function fetchTasks() {
  const response = await fetch("/api/tasks");
  const tasks = await response.json();
  const tasksList = document.getElementById("tasksList");

  tasksList.innerHTML = "";

  const sortedTasks = [...tasks].sort(
    (a, b) =>
      statusOrder[a.status ? "Completed" : "Incomplete"] -
      statusOrder[b.status ? "Completed" : "Incomplete"]
  );

  sortedTasks.forEach((task) => {
    const row = `
      <tr>
        <td>${task.id}</td>
        <td>${task.name}</td>
        <td>
          <span 
            class="status" 
            data-status="${task.status}" 
            data-task-id="${task.id}" 
            onclick="toggleStatus(${task.id})"
          >
            ${task.status ? "Completed" : "Incomplete"}
          </span>
        </td>
        <td>${new Date(task.deadline).toLocaleString()}</td>
        <td>
          <button onclick="deleteTask(${task.id})" data-i18n="delete_btn">Delete</button>
        </td>
      </tr>
    `;
    tasksList.innerHTML += row;
  });
}

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = e.target.querySelector('input[type="text"]');
  const deadlineInput = e.target.querySelector('input[type="datetime-local"]');

  const taskName = nameInput.value;
  const deadline = deadlineInput.value;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: taskName, deadline })
  });

  e.target.reset();
  await fetchTasks();
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
  if (confirm("Are you sure?")) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE"
    });
    await fetchTasks();
  }
}

window.addEventListener("load", async () => {
  const lang = localStorage.getItem("lang") || "id";
  await applyTranslations(lang);
  await fetchTasks();
});
