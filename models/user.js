const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");

connect.then(()=>{
    console.log("User Database connected Successfully");
})
.catch(()=>{
    console.log(" Database cannot be connected");
})

const LoginSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    } , 
    email : {
        type:String,
        require : true
    },
    isAdmin: {
        type:Boolean,
        default:false  
    }
});

const user = new mongoose.model("users",LoginSchema);

module.exports=user;