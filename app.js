const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const alert = require('alert')

mongoose.connect("mongodb://localhost:27017/todo");

const taskSchema = new mongoose.Schema({
  task:String
})

const taskModel = new mongoose.model('taskModel',taskSchema);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()) 

app.get("/", async (req, res) => {
  const taskArray = await taskModel.find()
  res.render("list", { taskArray: taskArray });
});

app.post("/", async (req, res) => {
  const taskname = req.body.task;
  console.log(taskname);
  const checkIf_DB_HasSameTask = await taskModel.find({task:taskname})
  
  if(checkIf_DB_HasSameTask.length > 0){
    alert('A task with same name already present');
    return res.redirect('/')
  }

  const task = await taskModel.create({
    task:taskname
  }) 
  res.redirect("/"); 
});

app.post("/:id", async (req,res) => {
  const name = req.params.id;
  
  let task = await taskModel.findOneAndDelete({task:name}) 


  res.redirect('/')
})

app.listen(4000, () => {
  console.log("server is running");
});
