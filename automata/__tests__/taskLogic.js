let tasks = [
    { id: 1, title: "Desain UI", status: "in-progress" },
    { id: 2, title: "Setup project", status: "todo" },
    { id: 3, title: "Deploy", status: "done" },
  ];
  
  let nextId = 4;
  
  const statusOrder = {
    "todo": 0,
    "in-progress": 1,
    "done": 2,
  };
  
  function addTask(title, status) {
    if (!title.trim()) throw new Error("Judul tidak boleh kosong!");
    const newTask = { id: nextId++, title, status };
    tasks.push(newTask);
    return newTask;
  }
  
  function updateTaskStatus(id, newStatus) {
    tasks = tasks.map(task => task.id === id ? { ...task, status: newStatus } : task);
  }
  
  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error("Task tidak ditemukan");
    tasks = tasks.filter(t => t.id !== id);
    return task;
  }
  
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
  }
  
  function getSortedTasks() {
    return [...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }
  
  function getTasks() {
    return tasks;
  }
  
  module.exports = {
    addTask,
    updateTaskStatus,
    editTask,
    deleteTask,
    getSortedTasks,
    getTasks
  };
  