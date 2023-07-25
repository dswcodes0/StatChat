import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import { User, Stats } from "./models/index.js";
import session from "express-session";

const app = express();
const userSecret = process.env.SESSION_SECRET;
const maximumAge = parseInt(process.env.SESSION_MAX_AGE);
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan("combined"));
app.use(
  session({
    secret: userSecret,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: maximumAge,
    },
  })
);

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a user by id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all stats, with associated users
app.get("/stats", async (req, res) => {
  try {
    const stats = await Stats.findAll({
      include: [{ model: User, as: "user" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUsers = await User.create(req.body);
    res.status(201).json(newUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users/login", async (req, res) => {
  const { Username, Password } = req.body;

  try {
    const user = await User.findOne({ where: { Username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.Password !== Password) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    req.session.userId = user.dataValues.id;
    console.log(req.session.userId);

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    const port = 3002;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
