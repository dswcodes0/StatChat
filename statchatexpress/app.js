import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import { User, UserGame, PrevUser } from "./models/index.js";
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

app.get("/users/check", (req, res) => {
  if (req.session.userId) {
    res.json({ isSignedIn: true });
  } else {
    res.json({ isSignedIn: false });
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

app.post("/users/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying session:", err);
      return res.status(500).json({ message: "Failed to sign out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Successfully signed out" });
  });
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
        userGame.Platform = platform;
        userGame.GameName = gameName;
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

app.get("/users/profile", async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = User.findByPk(userId);
    if (user) {
      const userGame = await UserGame.findOne({ where: { UserId: userId } });
      if (userGame) {
        res.json({
          gamertag: userGame.Gamertag,
          platform: userGame.Platform,
          gameName: userGame.GameName,
        });
      } else {
        res.status(404).json({ message: "No saved info found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/users/prevUser", async (req, res) => {
  try {
    const { gamertag, platform, gameName } = req.body;
    const userId = req.session.userId;

    const user = await User.findByPk(userId);

    if (user) {
      await PrevUser.create({
        gamertag: gamertag,
        platform: platform,
        gameName: gameName,
        UserId: userId,
      });

      res.json({ message: "PrevUser added successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
//gets a list of all the previous users sorted by the creation time in descending order
app.get("/users/getPrevUsersById", async (req, res) => {
  try {
    const userId = req.session.userId;

    const user = await User.findByPk(userId, {
      include: { model: PrevUser },
      //gets the first added prevuser by the time it was created
      order: [[PrevUser, "createdAt", "ASC"]],
    });

    if (user) {
      res.json(user.PrevUsers);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/users/getAllPrevUsers", async (req, res) => {
  try {
    const allPrevUsers = await PrevUser.findAll({
      // Gets the prevusers sorted by createdAt in ascending order
      order: [["createdAt", "ASC"]],
    });

    res.json(allPrevUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving prevusers" });
  }
});

app.get("/users/getTopSuggestedUsers", async (req, res) => {
  try {
    const allPrevUsers = await PrevUser.findAll({
      order: [["createdAt", "ASC"]],
    });

    // .reduce(countMap, prevUser) iterates over every value of prevuser and "reduces" it to countmap initially it is just new Map()
    //but as it iterates through, it adds the keys and values until prevuser is empty
    const userCounts = allPrevUsers.reduce((countMap, prevUser) => {
      const key = `${prevUser.gamertag}-${prevUser.platform}-${prevUser.gameName}`;
      //example key: Avid QQ-Xbox-Rainbow Six Siege;
      //this creates a new key value pair and initalizes the value to 1 or increases the current value by 1
      countMap.set(key, (countMap.get(key) || 0) + 1);
      return countMap;
    }, new Map());

    // sorts the entries based on their occurrence count in descending order
    const sortedEntries = userCounts
      .entries()
      //creates an array based on the key and value of every entry in userCounts
      .map(([key, value]) => [key, value])
      //sorts the values by comparing the values of each array and if b - a is positive then b should come first ex. 4 - 2 means b is greater than 2
      .sort((a, b) => b[1] - a[1]);

    // topsuggestedusers slices the top 3 entries of sorted entries which means they are the most frequently searched.
    const topSuggestedUsers = sortedEntries.slice(0, 3).map(([key]) => {
      const [gamertag, platform, gameName] = key.split("-");
      //returns the gamertag, platform and gamename by splitting it by - which was the key's seperation.
      return { gamertag, platform, gameName };
    });

    res.json(topSuggestedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving top suggested users" });
  }
});

app.delete("/users/prevUser/:prevUserId", async (req, res) => {
  try {
    const prevUserId = req.params.prevUserId;

    const prevUser = await PrevUser.findByPk(prevUserId);

    if (prevUser) {
      await prevUser.destroy();
      res.json({ message: "PrevUser deleted successfully" });
    } else {
      res.status(404).json({ message: "PrevUser not found" });
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
