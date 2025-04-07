const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Email id is not present in DB");
    }

    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      const token = await user.getJWT()
      console.log("JWT token....", token);

      res.cookie("token", token,{
        expires : new Date(Date.now()+ 8 * 3600000)
      });
      res.send("Login sucessfull!");
    } else {
      throw new Error("password not valid");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/logout",async(req,res)=>{
  res.cookie("token", null,{
    expires : new Date(Date.now())
  });
  res.send("logout sucessfully");
})


module.exports = authRouter;
