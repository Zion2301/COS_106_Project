/* =========================================================
   planner.js – Academic Planner (interactive task manager)

   How it works:
   - All tasks live in ONE array of objects called `tasks`.
   - Every change (add / toggle / delete / filter) updates the
     array, saves it to localStorage, then calls renderTasks()
     which rebuilds the list in the DOM.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. State ---------- */

  // Key used to save tasks in the browser's localStorage
  const STORAGE_KEY = "cos106-planner-tasks";

  // Array of task objects, e.g.
  // { id: 1712345678901, title: "Read chapter 3", course: "COS 106",
  //   dueDate: "2026-10-20", completed: false, createdAt: "2026-10-09T..." }
  let tasks = [];

  // Current filter: "all", "active" or "completed"
  let currentFilter = "all";


  /* ---------- 2. DOM references ---------- */
  const taskForm = document.getElementById("task-form");
  const titleInput = document.getElementById("task-title");
  const courseInput = document.getElementById("task-course");
  const dueInput = document.getElementById("task-due");
  const titleError = document.getElementById("task-title-error");
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const counter = document.getElementById("task-counter");
  const progressBar = document.getElementById("task-progress");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clear-completed");

  // Stop here if this script is loaded on a page without the planner
  if (!taskForm || !taskList) {
    return;
  }


  /* ---------- 3. localStorage helpers ---------- */

  // Load saved tasks (returns an empty array if nothing is saved)
  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // Storage may be blocked (e.g. private mode) – start with no tasks
      return [];
    }
  }

  // Save the current tasks array as a JSON string
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      // If storage is unavailable the planner still works for this visit
    }
  }


  /* ---------- 4. Task operations (array functions) ---------- */

  // Create a new task object and add it to the array
  function addTask(title, course, dueDate) {
    const newTask = {
      id: Date.now(),
      title: title,
      course: course,
      dueDate: dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }

  // Flip a task between completed and not completed
  function toggleTask(id) {
    tasks = tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });

    saveTasks();
    renderTasks();
  }

  // Remove a task from the array using filter()
  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });

    saveTasks();
    renderTasks();
  }

  // Remove every completed task
  function clearCompleted() {
    tasks = tasks.filter(function (task) {
      return !task.completed;
    });

    saveTasks();
    renderTasks();
  }

  // Return only the tasks that match the current filter
  function getFilteredTasks() {
    if (currentFilter === "active") {
      return tasks.filter(function (task) { return !task.completed; });
    }
    if (currentFilter === "completed") {
      return tasks.filter(function (task) { return task.completed; });
    }
    return tasks;
  }


  /* ---------- 5. Date helpers ---------- */

  // Today's date as "YYYY-MM-DD" (local time) for comparing due dates
  function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + month + "-" + day;
  }

  // Turn "2026-10-20" into a friendly label like "20 Oct 2026"
  function formatDate(dateString) {
    const parts = dateString.split("-");
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  // A task is overdue if it has a due date before today and isn't done
  function isOverdue(task) {
    return Boolean(task.dueDate) && !task.completed && task.dueDate < todayString();
  }


  /* ---------- 6. Rendering (DOM manipulation) ---------- */

  // Build one <li> element for a task using createElement
  function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = task.id;

    if (task.completed) {
      item.classList.add("completed");
    }
    if (isOverdue(task)) {
      item.classList.add("overdue");
    }

    // Checkbox to mark the task complete
    const checkboxId = "task-" + task.id;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.id = checkboxId;
    checkbox.checked = task.completed;

    // Title + meta information (course code and due date)
    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("label");
    title.className = "task-title";
    title.htmlFor = checkboxId;
    title.textContent = task.title;       // textContent keeps user input safe
    content.appendChild(title);

    if (task.course || task.dueDate) {
      const meta = document.createElement("div");
      meta.className = "task-meta";

      if (task.course) {
        const course = document.createElement("span");
        course.textContent = task.course;
        meta.appendChild(course);
      }

      if (task.dueDate) {
        const due = document.createElement("span");
        if (isOverdue(task)) {
          due.className = "meta-overdue";
          due.textContent = "Overdue: " + formatDate(task.dueDate);
        } else {
          due.className = "meta-due";
          due.textContent = "Due " + formatDate(task.dueDate);
        }
        meta.appendChild(due);
      }

      content.appendChild(meta);
    }

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete task: " + task.title);
    deleteBtn.textContent = "🗑";

    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(deleteBtn);

    return item;
  }

  // Update the "X of Y tasks completed" text and the progress bar
  function updateCounter() {
    const total = tasks.length;
    const done = tasks.filter(function (task) { return task.completed; }).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    counter.textContent = done + " of " + total + " task" + (total === 1 ? "" : "s") + " completed";
    progressBar.value = percent;
    progressBar.textContent = percent + "%";

    clearCompletedBtn.disabled = done === 0;
  }

  // Show a helpful message when the (filtered) list is empty
  function updateEmptyState(visibleCount) {
    if (visibleCount > 0) {
      emptyState.hidden = true;
      return;
    }

    emptyState.hidden = false;
    if (tasks.length === 0) {
      emptyState.textContent = "No tasks yet. Add your first task above.";
    } else if (currentFilter === "active") {
      emptyState.textContent = "Nothing left to do. All tasks are completed! 🎉";
    } else {
      emptyState.textContent = "No completed tasks yet.";
    }
  }

  // Main render function: clears the list and rebuilds it from the array
  function renderTasks() {
    const visibleTasks = getFilteredTasks();

    taskList.innerHTML = "";               // clear old items
    visibleTasks.forEach(function (task) {
      taskList.appendChild(createTaskElement(task));
    });

    updateCounter();
    updateEmptyState(visibleTasks.length);
  }


  /* ---------- 7. Validation ---------- */

  // Show or clear the error under the task title field
  function showTitleError(message) {
    const group = titleInput.closest(".form-group");
    titleError.textContent = message;
    group.classList.toggle("has-error", message !== "");
    titleInput.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  }


  /* ---------- 8. Event handling ---------- */

  // SUBMIT: add a new task (empty titles are rejected)
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const course = courseInput.value.trim().toUpperCase();
    const dueDate = dueInput.value;

    if (title === "") {
      showTitleError("Please enter a task before adding it.");
      titleInput.focus();
      return;
    }

    showTitleError("");
    addTask(title, course, dueDate);

    taskForm.reset();
    titleInput.focus();
  });

  // INPUT: clear the error as soon as the user starts typing
  titleInput.addEventListener("input", function () {
    if (titleInput.value.trim() !== "") {
      showTitleError("");
    }
  });

  // CHANGE: a checkbox was ticked or unticked (event delegation on the list)
  taskList.addEventListener("change", function (event) {
    if (event.target.classList.contains("task-checkbox")) {
      const id = Number(event.target.closest(".task-item").dataset.id);
      toggleTask(id);
    }
  });

  // CLICK: a delete button was pressed (event delegation on the list)
  taskList.addEventListener("click", function (event) {
    const deleteBtn = event.target.closest(".delete-btn");
    if (deleteBtn) {
      const id = Number(deleteBtn.closest(".task-item").dataset.id);
      deleteTask(id);
    }
  });

  // CLICK: filter buttons (All / Active / Completed)
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.dataset.filter;

      filterButtons.forEach(function (btn) {
        const isActive = btn === button;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      renderTasks();
    });
  });

  // CLICK: remove all completed tasks
  clearCompletedBtn.addEventListener("click", clearCompleted);


  /* ---------- 9. Start-up ---------- */
  tasks = loadTasks();
  renderTasks();
})();
