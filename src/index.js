const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
app.use(cors());
app.use(express.json());

if (!global.users) global.users = [];

app.post('/api/register', async (req, res) => {
  console.log('Register body:', req.body); 
  const { name, email, password } = req.body;
  if (global.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: String(global.users.length + 1), name, email, password: hashed };
  global.users.push(user);
  res.status(201).json({ message: 'Registered successfully' });
});

app.listen(5000, () => console.log('API running on http://localhost:5000'));
