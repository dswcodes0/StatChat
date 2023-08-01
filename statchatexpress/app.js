import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import { User, UserGame } from "./models/index.js";
import session from "express-session";

const app = express();
const userSecret = process.env.SESSION_SECRET;
const maximumAge = parseInt(process.env.SESSION_MAX_AGE);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan("combined"));
app.use(
  session({
    secret: userSecret,
    //this saveUninitialized line will save a session in the browser even if the user does not do anything like login
    saveUninitialized: true,
    //setting resave to false tells the server to check if anything has changed on the session before saving, this saves resources by not saving empty changes
    resave: false,
    cookie: {
      httpOnly: false,
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
    req.session.save(function () {
      res.json({ message: "Login successful" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users/profile", async (req, res) => {
  try {
    const { gamertag, platform, gameName } = req.body;
    const userId = req.session.userId;

    const user = await User.findByPk(userId);

    if (user) {
      let userGame = await UserGame.findOne({
        where: { UserId: userId },
      });
      if (!userGame) {
        userGame = await UserGame.create({
          Gamertag: gamertag,
          Platform: platform,
          GameName: gameName,
          UserId: userId,
        });
      } else {
        userGame.Gamertag = gamertag;
        await userGame.save();
      }

      res.json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
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
