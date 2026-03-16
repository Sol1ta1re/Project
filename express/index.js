const express = require('express')

const app = express()

app.use(express.json());

let users = [
    {id: 1, name: 'John'},
    {id: 2, name: 'Alex'},
];

app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    }

    users.push(newUser);

    res.json(newUser);
});

app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    users = users.filter(user => user.id !== id);

    res.json({message: 'User deleted'});
});

app.listen(3000, () => console.log('Server is running on port 3000'))