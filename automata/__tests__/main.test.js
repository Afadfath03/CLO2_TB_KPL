function testAddTask() {
  let tasks = [];
  const nextId = 1;
  const newTask = { id: nextId, title: "Coba Testing", status: "todo" };
  tasks.push(newTask);

  if (tasks.length === 1 && tasks[0].title === "Coba Testing") {
    console.log("✅ testAddTask passed");
  } else {
    console.error("❌ testAddTask failed");
  }
}

testAddTask();
