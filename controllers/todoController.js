const express = require("express");
const fs = require("fs");
let todos = JSON.parse(fs.readFileSync("todo.json", "utf-8")) || [];

module.exports = {

  addTodo: (req, res) => {
    const newTodo = {
      title: req.body.title,
      completed: req.body.completed ? req.body.completed : false
    };

    fs.writeFile("todo.json", `${JSON.stringify(todos)}`, data => {});
  },

  removeTodo: (req, res) => {
    todos = tasks.filter(task => task.id !== req.params.id);
    fs.writeFile("todo.json", `${JSON.stringify(todos)}`, data => {});
  },

  getTodos: (req, res) => {
    if (req.params.id !== undefined) {
      res.status(200);
      res.json(todos.filter(todo => todo.id === parseInt(req.params.id)));
    } else {
      res.status(200).json(todos);
    }
  },

  markDone: (req, res) => {
    todos.map(task => {
      if (todo.id === parseInt(req.params.id)) {
        todo.completed = true;
        res.json({ message: `Task ${req.params.id} was completed`, todo });
      }
    });
    fs.writeFile("todo.json", `${JSON.stringify(todos)}`, data => {});
  },

  markUndone: (req, res) => {
    todos.map(todo => {
      if (todo.id === parseInt(req.params.id)) {
        todo.done = false;
        res.json({ message: `Task ${req.params.id} is not completed yet`, todo });
      }
    });
    fs.writeFile("todo.json", `${JSON.stringify(todos)}`, data => {});
  },
};