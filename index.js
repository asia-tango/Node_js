const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const fs = require('fs').promises;
const todoController = require('./controllers/todoController');
const helmet = require('helmet');
const taskRoutes = require("./routes/methods");
const validation = require('./validation');

const app = express();
const port = 4004;
app.use(bodyParser.json());
app.use(helmet());
app.use("/todo", taskRoutes);


const fileName = 'todo.json';
const initialTodo = [];

//joi validation
const schema = Joi.object().keys({ 
    "title": Joi.string().required(),
    "completed": Joi.string().required()
  });

const store = {
    async read() {
        try {
            await fs.access(fileName);
            this.todo = JSON.parse((await fs.readFile(fileName)).toString());
        } catch (e) {
            this.todo = initialTodo;
        }
        return this.todo;
    },

    async save() {
        try{
            await fs.writeFile(fileName, JSON.stringify(this.todo));
        } catch (e) {
            console.log('error', e);
        }
        
    },

    async getIndexById(id) {
        try {
            const todo = await this.read();
            return todo.findIndex(todos => todos.id === +id);
        } catch (e) {
            console.log(e);
        }
    },

    async getNextTodoId() {
        let maxId = 0;
        const todo = await this.read();
        todo.forEach(todos => {
            if (todos.id > maxId) maxId = todos.id;
        });
        return maxId + 1;
    },
    todo: []
};

app.get('/todo', async (req, res) => {
    // store.save();
    res.json(await store.read());
});

app.get('/todo/:id', async (req, res) => {
    const todo = await store.read();
    const todos = todo.find(todos => todos.id === +req.params.id);
    res.json(todos);
});

// const { check, validationResult } = require('express-validator')

app.post('/todo', validation(schema), async (req, res) => {
    const todos = req.body;
    todos.id = await store.getNextTodoId();
    store.todo.push(todos);
    await store.save();
    res.json('ok'); 
    
    const middleware = (schema, property) => { 
        return (req, res, next) => { 
            const { value, error } = Joi.validate(req.body, schema);
            if (error) {
                return res.status(400).json(error);   
            }
            return res.json(value);
        } 
    } 
    module.exports = middleware;
});

app.put('/todo/:id', async (req, res) => {
    const index = await store.getIndexById(req.params.id);
    const { title, completed } = req.body;
    // store.todo[index] = req.body;
    const todos = store.todo[index];
    todos.title = title;
    todos.completed = completed;
    // store.todo[index].id = req.params.id;
    await store.save();
    res.json('ok');
});

app.delete('/todo/:id', async (req, res) => {
    const index = await store.getIndexById(req.params.id);
    store.todo.splice(index, 1);
    await store.save();
    res.json('ok');
});

//static files
app.use('/assets', express.static('.public'));


//Authorization
app.use('', (req, res, next) => {
    if(req.headers.authorization === '123') {
        console.log('AUTH SUCCESS');
        next();
    } else {
        console.log('AUTH FAILED');
        next({status: 403, error: 'ERROR AUTH'});
    }
    next();
});

app.use("", (err, req, res, next) => {
    if (err !== "Authorization error") {
      res.status(400).json({ message: `${err}` });
    } else {
      res.status(403).json({ message: `${err}` });
    }
});

//fire controllers
// todoController(app);

//listen to port
app.listen(process.env.port || port, function() {
    console.log('now listening for requests');
});