const express = require("express");
const router = express.Router();
const fs = require("fs");
 const { getSchema, schema } = require("../validation");
const {
  addTodo,
  removeTodo,
  getTodos,
  markDone,
  markUndone
} = require("../controllers/todoController");
let tasks = JSON.parse(fs.readFileSync("todo.json")) || [];

router
  .route("/")
  .get(getTodos)
  .post(addTodo);
  // .post(schema.getSchema, addTodo); // doesn't work

router
  .route("/:id")
  .get(getTodos)
  .delete(removeTodo);

 router
 .route("/:id")
 .put(markDone);

 router
 .route("/:id")
 .put(markUndone);

module.exports = router;