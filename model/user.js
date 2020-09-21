const mongoose  = require('mongoose');

const  UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        max : 255
    },
    email : {
        type : String,
        required : true,
        min : 6 ,
        max : 255
    },
    password :{
        type : String ,
        required: true ,
        min: 6 ,
        max:1024
    },
    repassword :{
        type : String ,
        required: true ,
        min: 6 ,
        max:1024
    },
    birthday :{
        type : Date ,
        required: true ,
        default : Date.now
    },
    age :{
        type : Number,
        required : true
    }


});


module.exports = mongoose.model('User' , UserSchema);