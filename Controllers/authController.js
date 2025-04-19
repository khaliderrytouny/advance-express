const User= require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const register = async (req,res)=>{
     const {first_name,last_name,email,password} = req.body ;
     if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({message : "All fields are required"});
     }
     const UserEmail = await User.findOne({email}).exec();
     if (UserEmail) {
        return res.status(401).json({message : "User Already exists"});
     }
     const passwordHashin = await bcrypt.hash(password,10);
     const newUser = await User.create({
        first_name,
        last_name,
        email,
        password: passwordHashin
     });
     const accessToken = jwt.sign({
         UserInfo :{
            id : newUser._id

         }
     },process.env.ACCESS_TOKEN,{expiresIn:100});
     const refreshToken = jwt.sign({
      UserInfo :{
         id : newUser._id

      }
     },process.env.REFRICH_TOKEN,{expiresIn:"7d"}) ;
     res.cookie("jwt",refreshToken,{
      httpOnly : true ,
      secure : true ,
      sameSite : "None",
      maxAge : 7 * 24 * 60 * 60 * 1000 
     })
     res.json({
      accessToken,
      email:newUser.email,
      first_name:newUser.first_name,
      last_name:newUser.last_name
   })
};
const login = async (req, res)=>{
   const {email,password} = req.body ;
   if (!email || !password) {
      return res.status(400).json({message : "All fields are required"});
   }
   const foundUser = await User.findOne({email}).exec();
   if (!foundUser) {
      return res.status(401).json({message : "User does not exists"});
   }
   const match = await bcrypt.compare(password,foundUser.password);
   if (!match) {
      return res.status(401).json({message : "Wrong password"});
   }
   const accessToken = jwt.sign({
      UserInfo :{
         id : foundUser._id

      }
  },process.env.ACCESS_TOKEN,{expiresIn: 100});
  const refreshToken = jwt.sign({
   UserInfo :{
      id : foundUser._id

   }
  },process.env.REFRICH_TOKEN,{expiresIn:"7d"}) ;
  res.cookie("jwt",refreshToken,{
   httpOnly : true ,
   secure : true ,
   sameSite : "None",
   maxAge : 7 * 24 * 60 * 60 * 1000 
  })
  res.json({
   accessToken,
   email:foundUser.email,
})
};
const refresh = (req,res)=>{
   const cookies = req.cookies;
   if(!cookies?.jwt){
      return res.status(401).json({message : 'Unauthorized'});
   }
   const refreshToken = cookies.jwt ;
   jwt.verify(
      refreshToken,
      process.env.REFRICH_TOKEN,
      async (err,decoded) =>{ 
         if(err) {return res.status(403).json({message : "Forbidden"});}
         const foundUser = await User.findById(decoded.UserInfo.id).exec();
         if (!foundUser){return res.status(401).json({message : 'Unauthorized'})};
      const accessToken = jwt.sign({
            UserInfo :{
            id :foundUser._id
      
            }
        },process.env.ACCESS_TOKEN,{expiresIn: 100});
        res.json({accessToken});
      }
   )

};

const logout = (req,res)=>{
   const cookies = req.cookies;
   if(!cookies?.jwt){
      return res.sendStatus(204);
   }
   res.clearCookie("jwt",{
      httpOnly : true ,
      secure : true ,
      sameSite : "None"
   });
   res.json({message : 'cookie clear'})
};

module.exports = {
   register,
   login,
   refresh,
   logout
}