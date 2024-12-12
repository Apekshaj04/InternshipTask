const mongoose = require('mongoose')
const task  = new mongoose.Schema({
    title:{
        type:String,
        required:true 
    },
    description:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        required:true 
    },
    dueDate:{
        type:Date,
        required:true 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
}
)
module.exports = mongoose.model("Task",task);