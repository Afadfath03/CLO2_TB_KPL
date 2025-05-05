const {
  addTask,
  updateTaskStatus,
  editTask,
  deleteTask,
  getSortedTasks
} = require("./taskLogic");

function renderTasks() {
  const taskListEl = document.getElementById("task-list");
  taskListEl.innerHTML = "";

  const sortedTasks = getSortedTasks();

  sortedTasks.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${task.title}</td>
      <td>
        <select onchange="handleStatusChange(${task.id}, this.value)">
          <option value="todo" ${task.status === "todo" ? "selected" : ""}>📝 Todo</option>
          <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>⏳ In Progress</option>
          <option value="done" ${task.status === "done" ? "selected" : ""}>✅ Done</option>
        </select>
      </td>
      <td class="action-btns">
        <button onclick="handleEdit(${task.id})">Edit</button>
        <button onclick="handleDelete(${task.id})">Delete</button>
      </td>
    `;
    taskListEl.appendChild(row);
  });
}

function handleAdd() {
  const title = document.getElementById("task-title").value.trim();
  const status = document.getElementById("task-status").value;

  try {
    addTask(title, status);
    document.getElementById("task-title").value = "";
    document.getElementById("task-status").value = "todo";
    renderTasks();
  } catch (err) {
    alert(err.message);
  }
}

function handleEdit(id) {
  try {
    const task = editTask(id);
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-status").value = task.status;
    renderTasks();
  } catch (err) {
    alert(err.message);
  }
}

function handleDelete(id) {
  if (confirm("Yakin ingin menghapus tugas ini?")) {
    deleteTask(id);
    renderTasks();
  }
}

function handleStatusChange(id, newStatus) {
  updateTaskStatus(id, newStatus);
  renderTasks();
}

// expose ke global (karena HTML inline handler)
window.handleAdd = handleAdd;
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;
window.handleStatusChange = handleStatusChange;

document.addEventListener("DOMContentLoaded", renderTasks);
