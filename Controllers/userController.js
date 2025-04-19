const User = require('../Models/User');

const getAllusers = async (req,res)=>{
    const allUsers = await User.find().select('-password').lean();
    if(!allUsers.length){
        return res.status(400).json({message : "No Users found"});
    }
    res.json(allUsers);
};

module.exports = {
    getAllusers,

}