const express = require('express');
const app = express();

app.use(express.json());

// Users data
let users = [
  { id: 1, name: "Pavani", email: "pavani@gmail.com" },
  { id: 2, name: "Ravi", email: "ravi@gmail.com" }
];

// Test route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// GET all users (search + sort)
app.get('/users', (req, res) => {
  let result = users;

  if (req.query.search) {
    const searchText = req.query.search.toLowerCase();
    result = result.filter(user =>
      user.name.toLowerCase().includes(searchText)
    );
  }

  if (req.query.sort) {
    const field = req.query.sort;
    const order = req.query.order === 'desc' ? -1 : 1;

    result = result.sort((a, b) => {
      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });
  }

  res.json(result);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// POST create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// ✅ DELETE user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);

  res.json({ message: "User deleted successfully" });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});