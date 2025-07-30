const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
const app = express();

app.use(cors());
app.use(express.json());

const CONNECTION_URL = `mongodb+srv://rmkoushika3115:855UftapqqBZaLQ9@cluster0.wohvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(CONNECTION_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Backend running on port 5000'));

app.put('/tasks/:id', async (req, res) => {
  const { completed } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    if (!task) return res.status(404).send({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).send({ error: 'Update failed' });
  }
});
