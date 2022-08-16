//All event listeners

document.addEventListener("DOMContentLoaded", function(){
  getList();
});

document.getElementById("listOfTasks").addEventListener('click', selectTask);
document.getElementById("deleteBtn").addEventListener('click', deleteTask);
document.getElementById("editBtn").addEventListener('click', editTask);
document.getElementById("newTaskBtn").addEventListener('click', addTask);

//Function to generate a random ID for created tasks.

function getRandomKey(){
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

//Function to retrieve data from the JSON file on the server.

function getList(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      let listResponse = JSON.parse(this.responseText);
      let taskList = "";
      for(let item of listResponse.list){
        taskList = taskList + "<li task='" + String(item.task) + "' status='" + String(item.status) + "' id='" + listResponse.list.indexOf(item) + "'>" + String(item.task) + " - " + String(item.status) + "</li>";
      }
      document.getElementById("listOfTasks").innerHTML = taskList;
    }
    else{
      console.log("Waiting");
    }
  }
  xhttp.open("GET", "api/todo", true);
  xhttp.send();
}

//Function to clear selected task section.

function clearSelected(){
  document.getElementById("selectedId").value = "";
  document.getElementById("selectedTask").value = "";
  document.getElementById("selectedStatus").value = "";
}

//Function to clear add task section.

function clearAdd(){
  document.getElementById("newTask").value = "";
  document.getElementById("newStatus").value = "";
}

//Function to fill the selected task section on clicking a task from the list.

function selectTask(element){
  clearSelected();
  let itemIndex = element.target.id;
  if (itemIndex == "listOfTasks"){
    clearSelected();
  }
  else{
    let task = element.target.getAttribute("task");
    let status = element.target.getAttribute("status");
    document.getElementById("selectedId").value = itemIndex;
    document.getElementById("selectedTask").value = task;
    document.getElementById("selectedStatus").value = status;
  }
}

//Function for adding a new task to the list.

function addTask(){
  let id = getRandomKey();
  let newTask = document.getElementById("newTask").value;
  let newStatus = document.getElementById("newStatus").value;
  if (newTask == "" || newStatus ==""){
    alert("Missing fields");
  }
  else{
    let newItem = document.createElement('li');
    newItem.id = id;
    newItem.setAttribute("task", newTask);
    newItem.setAttribute("status", newStatus);
    newItem.innerText = newTask + " - " + newStatus;
    document.getElementById("listOfTasks").appendChild(newItem);
    clearAdd();
    saveList();
  }
}

//Function for deleting task to the list.

function deleteTask(){
  let id = document.getElementById("selectedId").value;
  if (id != ""){
    document.getElementById(id).remove();
    clearSelected();
    saveList();
  }
  else{
    alert("No task selected")
  }
}

//Function for editing a task to the list.

function editTask(){
  let id = document.getElementById("selectedId").value;
  if (id != ""){
    editItem = document.getElementById(id);
    let editTask = document.getElementById("selectedTask").value;
    let editStatus = document.getElementById("selectedStatus").value;
    if (editTask == "" || editStatus ==""){
    alert("Missing fields");
    }
    else{
      editItem.setAttribute("task", editTask);
      editItem.setAttribute("status", editStatus);
      editItem.innerText = editTask + " - " + editStatus;
      clearSelected();
      saveList();
    }
  }
  else{
    alert("No task selected");
  }
}

//Function for saving the list to the server (this function is set to run at the end of the add, delete and edit functions).

function saveList(){
  let taskList = document.getElementById("listOfTasks");
  var items = taskList.getElementsByTagName("li");
  let jsonObject = {};
  jsonObject.list = [];
  for (let index = 0; index < items.length; index++){
    let object = {};
    object.task = items[index].getAttribute("task");
    object.status = items[index].getAttribute("status");
    jsonObject.list.push(object);
  }
  let xhttp = new XMLHttpRequest();
  let url = "/api/todo";
  xhttp.onreadystatechange = function(){
    let msg = "No response";
    if (this.readyState == 4 && this.status == 200){
      msg = JSON.parse(this.responseText);
      alert(msg.message);
    }
  }
  xhttp.open("PUT", url, true);
  var data = JSON.stringify(jsonObject);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(data);
}