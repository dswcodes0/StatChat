import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './database.js';
import { User, Stats } from './models/index.js';

const app = express();

app.use(cors())
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan('combined'))

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a user by id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all stats, with associated users
app.get('/stats', async (req, res) => {
  try {
    const stats = await Stats.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new post
app.post('/stats', async (req, res) => {
  try {
    const stats = await Stats.create(req.body);

    const statsWithUser = await Stats.findOne({
      where: { id: stats.id },
      include: [{ model: User, as: 'user' }]
    });

    res.status(201).json(statsWithUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

sequelize.sync({ alter: true })
  .then(() => {
    const port = 3002;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });