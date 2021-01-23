var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function() {
  var text = $(this).text();
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
  console.log(text);
});

  $(".list-group").on("blur", "textarea", function() {
  // Get the textarea's current value/text
    var text = $(this)
      .val()
      .trim();

  // Get the parent ul's id attribute
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");

  // Get the task's position in the list of other li elements
    var index = $(this)
      .closest(".list-group-item")
      .index();

    tasks[status][index].text = text;
    saveTasks();

  // Recreate p element
    var taskP = $("p")
      .addClass("m-1")
      .text(text);

  // Replace textarea with p element
    $(this).replaceWith(taskP);
  });

// Value of due date was changed
$(".list-group").on("change", "input[type='text']", function() {
  // Get current text
  var date = $(this)
    .val()
    .trim();

  // Get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // Get the task's position in the list of order li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // Update task in array and re-save to localStorage
  tasks[status][index].date = date;
  saveTasks();

  // Recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // Replace input with span element
  $(this).replaceWith(taskSpan);
});

// Due date was clicked
  $(".list-group").on("click", "span", function() {
  // Get current text
    var date = $(this)
      .text()
      .trim();

  // Create new input element
    var dateInput = $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .val(date);

  // Swap out elements
    $(this).replaceWith(dateInput);

    dateInput.datepicker({
      minDate: 1,
      onClose: function() {
        // When calendar is closed, force a "change" event on the dateInput
        $(this).trigger("change");
      }
    });

  // Automatically focus on new element
    dateInput.trigger("focus");
  });




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  
    
  $("#modalDueDate").datepicker({
    minDate: 1
  });


  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });


    saveTasks();
  }  
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// Make all main elements draggable
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function(event) {
    var tempArr = [];

    // Loop over current set of children in sortable list
    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

      // Add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });

    console.log(tempArr);

    // Trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // Update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
  }
});

$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    ui.draggable.remove();
    console.log("drop");
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});

// load tasks for the first time
loadTasks();


