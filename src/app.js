const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  console.log("reqqqqqqqqqqqqqqqqq", req.body);
  try {
    //validation of data
    validateSignUpData(req);
    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user created");
  } catch (err) {
    // res.status(400).send("Error :-", err.message);
    res.send("Error:" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Email id is not present in DB");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "DEV@Naveen787", {
        expiresIn: "1d",
      });
      console.log("JWT token....", token);

      res.cookie("token", token,{httpOnly:true});
      res.send("Login sucessfull!");
    } else {
      throw new Error("password not valid");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

app.post("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("qqqqqqqqqqqqqqqqq");
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending connection request");

  res.send(user.firstName + " sent the connection request!");
});

//get user by email
app.get("/user", userAuth, async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(400).send("Error:", err);
  }
});
app.get("/feed", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted sucessfully");
  } catch (err) {
    res.status(400).send("somthing went wrong", err);
  }
});

// update data form database
app.patch("/user/userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more then 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("user updated sucessfully");
  } catch (err) {
    res.status(400).send("Update failed" + err);
  }
});

connectDB()
  .then((result) => {
    console.log("database connected");

    app.listen(3001, () => {
      console.log("listening on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
