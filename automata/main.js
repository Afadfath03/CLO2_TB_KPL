const statusOrder = {
    "todo": 0,
    "in-progress": 1,
    "done": 2,
  };
  
  let tasks = [
    { id: 1, title: "Desain UI", status: "in-progress" },
    { id: 2, title: "Setup project", status: "todo" },
    { id: 3, title: "Deploy", status: "done" },
  ];
  
  const taskListEl = document.getElementById("task-list");
  
  function renderTasks() {
    taskListEl.innerHTML = "";
  
    // Urutkan berdasarkan status
    const sortedTasks = [...tasks].sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );
  
    sortedTasks.forEach(task => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";
  
      const title = document.createElement("span");
      title.textContent = task.title;
  
      const select = document.createElement("select");
      select.innerHTML = `
        <option value="todo">📝 Todo</option>
        <option value="in-progress">⏳ In Progress</option>
        <option value="done">✅ Done</option>
      `;
      select.value = task.status;
      select.addEventListener("change", (e) => {
        updateTaskStatus(task.id, e.target.value);
      });
  
      taskItem.appendChild(title);
      taskItem.appendChild(select);
      taskListEl.appendChild(taskItem);
    });
  }
  
  function updateTaskStatus(id, newStatus) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    renderTasks(); // langsung render ulang dengan sorting baru
  }
  
  renderTasks(); // Initial render
  