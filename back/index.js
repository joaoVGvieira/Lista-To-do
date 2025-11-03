require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Task } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// 
app.use(cors());
app.use(express.json());


app.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'eh necessario um titulo' });
  }
  const task = await Task.create({ title, priority });
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) {
    return res.status(404).json({ error: 'tarefa nao encontrada' });
  }

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

app.put('/tasks/:id/priority', async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  if (!['urgente', 'asap', 'sometime'].includes(priority)) {
    return res.status(400).json({ error: 'Prioridade inválida' });
  }

  const task = await Task.findByPk(id);
  if (!task) {
    return res.status(404).json({ error: 'tarefa nao encontrada' });
  }

  task.priority = priority;
  await task.save();
  res.json(task);
});


app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) {
    return res.status(404).json({ error: 'tarefa nao encontrada' });
  }

  await task.destroy();
  res.status(204).send();
});


async function startServer() {
  try {
    await sequelize.sync(); 
    console.log('Database:.');
    app.listen(PORT, () => {
      console.log(`esta rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('erro no database:', error);
  }
}

startServer();