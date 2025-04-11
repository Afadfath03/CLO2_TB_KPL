async function fetchTasks() {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();
    const tasksList = document.getElementById("tasksList");

    tasksList.innerHTML = "";

    tasks.forEach(task => {
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
                ${task.status ? 'Completed' : 'Incomplete'}
            </span>
            </td>
            <td>${new Date(task.deadline).toLocaleString()}</td>
            <td>
            <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        </tr>
        `;
        ;
        tasksList.innerHTML += row;
    });
}

document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskName = e.target.taskName.value;
    const deadline = e.target.deadline.value;
    await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: taskName, deadline: deadline })
    });
    e.target.reset();
    await fetchTasks();
});

async function toggleStatus(taskId) {
    const statusElement = document.querySelector(
        `.status[data-task-id="${taskId}"]`
    );
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

window.onload = () => fetchTasks();