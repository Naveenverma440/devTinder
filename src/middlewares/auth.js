const User = require("../models/user");
const jwt = require("jsonwebtoken")
const userAuth =async (req, res, next) => {
  try{
  const cookies = req.cookies;
  const {token} = cookies;
  if(!token){
    throw new Error("Invalid Token");
  }
 const decodedMessage = await jwt.verify(token,"DEV@Naveen787");
 const {_id} = decodedMessage;
 const user = await User.findById({_id})
   if(!user){
     throw new Error("user does not exist");
   }
   console.log("rrrrrrrrrrr",user)
   req.user= user
   next();
  }catch(err){
    res.status(400).send("Error:" + err.message);
    }
};

module.exports = { userAuth };
