const mongoose=require('mongoose')
const user  = new mongoose.Schema({
    name: {
        type:String,
        required:true 
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    phoneNumber : {
        type:String,
        required:true 
    },
    mail:{
        type:String,
        required:true 
    },
    tasks:[{
    type:mongoose.Schema.Types.ObjectId,
      ref:"Task"
    }]
})
module.exports=mongoose.model("User", user);
