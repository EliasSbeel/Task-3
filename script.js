const addTask = document.getElementById('add');
const taskTitle = document.getElementById('taskTitle');
const taskDes = document.getElementById('taskDes');
const tasksDiv = document.getElementById('tasksDiv');
const searchInput = document.getElementById('searchInput');
let editingTaskId = null;


let arrayOfTasks = [];

if (localStorage.getItem('tasks')) {
  arrayOfTasks = JSON.parse(localStorage.getItem('tasks'));
}

getDataFromStorage();

// Add Task
addTask.onclick = () => {
  // if (taskTitle.value !== "" && taskDes.value !== "") {
  //   console.log(taskTitle.value, taskDes.value);

  //   addTaskToArray(taskTitle.value, taskDes.value);
  //   taskTitle.value = "";
  //   taskDes.value = "";
  //   closeModal();
  // }
  if (taskTitle.value !== "" && taskDes.value !== "") {
    if (editingTaskId) {
      // 🔹 Update existing task
      arrayOfTasks = arrayOfTasks.map(task => {
        if (task.id == editingTaskId) {
          return {
            ...task,
            title: taskTitle.value,
            des: taskDes.value,
          };
        }
        return task;
      });

      addTasksToStorage(arrayOfTasks);
      addTasksToPage(arrayOfTasks);

      editingTaskId = null;
      closeModal();
      taskTitle.value = "";
      taskDes.value = "";
    } else {
      // 🔹 Add new task
      addTaskToArray(taskTitle.value, taskDes.value);
      taskTitle.value = "";
      taskDes.value = "";
      closeModal();
    }
  }
}

tasksDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('del')) {
    const taskEl = e.target.closest('.task');
    const taskId = taskEl.dataset.id;

    deleteTaskWithId(taskId);
    taskEl.remove();
  }

  if (e.target.classList.contains('edit')) {
    const taskEl = e.target.closest('.task');
    const taskId = taskEl.dataset.id;

    editTaks(taskId);
  }

  if (e.target.closest('.favorite')) {
    const taskEl = e.target.closest('.task');
    const taskId = taskEl.dataset.id;

    arrayOfTasks = arrayOfTasks.map(task => {
      if (task.id == taskId) {
        return { ...task, favorite: !task.favorite };
      }
      return task;
    });

    addTasksToStorage(arrayOfTasks);
    addTasksToPage(arrayOfTasks);
  }

})

function addTaskToArray(taskTitle, taskDes) {
  const task = {
    id: Date.now(),
    title: taskTitle,
    des: taskDes,
    completed: false,
    date: new Date().toISOString(),
    favorite: false,
  }

  arrayOfTasks.push(task);
  addTasksToPage(arrayOfTasks);
  addTasksToStorage(arrayOfTasks);
}

function addTasksToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let div = document.createElement('div');
    div.className = 'task';
    div.setAttribute('data-id', task.id);
    const dateObj = new Date(task.date);
    const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    div.innerHTML += `
      <div class="bg-[#fff] border-t-4 border-blue-500">
        <h3
          class="px-4 py-2 bg-indigo-100 text-1xl font-semibold m-4 w-[50%] rounded-2xl text-blue-500"
        >
          ${task.title}
        </h3>
        <p class="px-5 pb-2 text-[#888]">${task.des}...</p>
        <p class="px-5 pb-2 font-semibold">Date: ${formattedDate} </p>
        <div class="px-5 flex justify-between items-center py-3">
          <span class="favorite cursor-pointer">
            ${task.favorite
        ? '<i class="fa-solid fa-heart transition-transform duration-300 hover:scale-125" style="color:red"></i>'
        : '<i class="fa-regular fa-heart transition-transform duration-300 hover:scale-125"></i>'
      }
          </span>
          <div class="flex gap-5">
            <span class="transition-transform duration-300 hover:scale-125"
              ><i
                class="fa-solid fa-pen-to-square edit"
                style="color: blue"
              ></i
            ></span>
            <span class="transition-transform duration-300 hover:scale-125"
              ><i class="fa-solid fa-trash del" style="color: red"></i
            ></span>
          </div>
        </div>
      </div>
    `
    tasksDiv.appendChild(div);

  });
}

function addTasksToStorage(arrayOfTasks) {
  localStorage.setItem('tasks', JSON.stringify(arrayOfTasks))
}

function getDataFromStorage() {
  let data = localStorage.getItem('tasks');
  if (data) {
    let tasks = JSON.parse(data);
    console.log(tasks);
    addTasksToPage(tasks);

  }
}

function editTaks(taskId) {
  const task = arrayOfTasks.find(t => t.id == taskId);

  if (task) {
    openModal();
    taskTitle.value = task.title;
    taskDes.value = task.des;

    editingTaskId = taskId;
  }
}


searchInput.addEventListener('input', (e) => {
  const searchValue = e.target.value.toLowerCase();

  const filteredTasks = arrayOfTasks.filter(task =>
    task.title.toLowerCase().includes(searchValue)
  );

  addTasksToPage(filteredTasks);
});


function deleteTaskWithId(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addTasksToStorage(arrayOfTasks);
}

function deleteAll() {
  tasksDiv.innerHTML = "";
  localStorage.removeItem('tasks');
}

function openModal() {
  document.getElementById('modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}





