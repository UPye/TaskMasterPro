var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// Create array to hold tasks for saving
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
// Check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

// Reset for fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

// Check if task is new or one being edited by seeing if it has a data-task-id attribute
    var isEdit = formEl.hasAttribute("data-task-id");

// Has data attribute, so get task id and call function to complete edit
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

// No data attribute, so create object as normal and pass to createTaskEl
    else {
    // Package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
    // Sent it as an argument to createTaskEL
        createTaskEl(taskDataObj);
    }

};

var createTaskEl = function (taskDataObj) {
// Create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        console.log(taskDataObj);
        console.log(taskDataObj.status);
    
// Add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        listItemEl.setAttribute("draggable", "true");
    
// Create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = 
            "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
        listItemEl.appendChild(taskInfoEl);
    
        var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);

        switch (taskDataObj.status) {
            case "to do":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
              tasksToDoEl.append(listItemEl);
              break;
            case "in progress":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
              tasksInProgressEl.append(listItemEl);
              break;
            case "completed":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
              tasksCompletedEl.append(listItemEl);
              break;
            default:
              console.log("Something went wrong!");
          }
    
// Save task as an object with name, type, status, and id properties then push it into tasks array
taskDataObj.id = taskIdCounter;

tasks.push(taskDataObj);

// Saves tasks to localStorage
saveTasks();

// Increase task counter for next unique id
    taskIdCounter++;
};

    


 var createTaskActions = function(taskId) {
// Create div to act as a container for the other elements
     var actionContainerEl = document.createElement("div");
     actionContainerEl.className = "take-actions";

// Create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

// Create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

// Create change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i <statusChoices.length; i++) {
    // Create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[1]);
        statusOptionEl.textContent = statusChoices[i];

    // Append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
// Find the matching task list item
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
// Set new values
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;
    
        debugger;
// Loop through tasks array and task object with new content
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === parseInt(taskId)) {
                tasks[i].name = taskName;
                tasks[i].type = taskType;
            }
            debugger;
        };

        alert("Task Updated!");

        saveTasks();
    
        formEl.removeAttribute("data-task-id");
        document.querySelector("#save-task").textContent = "Add Task";
    };
    

var taskButtonHandler = function(event) {
// Get target element from event
    var targetEl = event.target;

// Edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
    // Get element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

// Delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
    // Get element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
// Get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

// Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// Get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();


    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

// Update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        };
    }
    console.log(tasks);

    saveTasks();
};
    


var editTask = function(taskId) {
    console.log(taskId);
// Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// Get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

// Write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

// Set data attribute to the form with a value of the task's id, so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);

// Update form's button to reflect editing a task rather than creating a new one
    document.querySelector("#save-task").textContent = "Save Task";
};


var deleteTask = function(taskId) {
    console.log(taskId);

// Find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

// Create new array to hold updated list of tasks
    var updatedTaskArr = [];

// Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
    // If tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
      if (tasks[i].id !== parseInt(taskId)) {
          updatedTaskArr.push(tasks[i]);
      }  
    }

// Reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();

    alert("Task deleted!");
};

var dropTaskHandler = function(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZone = event.target.closest(".task-list");

// Set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    var statusType = dropZone.id;

    switch (statusType) {
        case "tasks-to-do":
            statusSelectEl.selectedIndex = 0;
            break;
        case "tasks-in-progress":
            statusSelectEl.selectedIndex = 1;
            break;
        case "tasks-completed":
            statusSelectEl.selectedIndex = 2;
            break;
        default:
            console.log("Something went wrong!");
    }


    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }

    }

    saveTasks();

    dropZone.removeAttribute("style");
    dropZone.appendChild(draggableElement);    
};

// Defines the drop zone area
var dropZonDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};


var dragTaskHandler = function(event) {
    if (event.target.matches("li.task-item")) {
        var taskId = event.target.getAttribute("data-task-id");
        event.dataTransfer.setData("text/plain", taskId);
    }
};



var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");

    if (taskListEl) {
        event.target.closest(".task-list").removeAttribute("style");
    }
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("tasks saved");
};

var loadTasks = function() {
     var savedTasks = localStorage.getItem("tasks");
    console.log(loadTasks);

    if (!savedTasks) {
        return false;
    };

    console.log("Saved tasks found!");

    savedTasks = JSON.parse(savedTasks);
    console.log(savedTasks);

// Loop through savedTasks array
    for (var i = 0; i< savedTasks.length; i++) {
    // Pass each task object into the 'createTaskEl()' function
        createTaskEl(savedTasks[i]);
    }
};


// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// For edit and delete buttons 
pageContentEl.addEventListener("click", taskButtonHandler);

// For changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("load", loadTasks);


// For dragging
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZonDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();