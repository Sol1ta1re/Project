const express = require('express')

const app = express()

app.use(express.json());

let tasks = [
    {id: 1, name: 'John', done: false},
    {id: 2, name: 'Alex', done: true},
];

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name
    }

    tasks.push(newTask);

    res.json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const name = req.body.name;
    const done = req.body.done;
    const updatedTask = {
        id: id,
        name: name,
        done: done
    }

    tasks.push(updatedTask);
    res.json(updatedTask);
})

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    tasks = tasks.filter(task => task.id !== id);

    res.json({message: 'Task deleted'});
});

app.listen(3000, () => console.log('Server is running on port 3000'))