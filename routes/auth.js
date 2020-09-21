const express = require('express')
const router = express.Router()
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const {registerValidation ,loginValidation} = require('../public/javascripts/validate');



router.get('/signUp' , (req , res)=>{
    res.render('User/signUp' , { user: new User()});
})

router.get('/login' , (req , res)=>{
    res.render('User/login');
})



router.post('/signUp' , async (req , res ) => {
// validate the user data
     const{error} =  registerValidation(req.body);

     // 回傳驗證錯誤訊息
     if(error) res.status(404).send(error.details[0].message);

    // 判斷資料庫是否已存在帳號
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send("Email Exist!!!");

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password , salt);

    if(req.body.password !== req.body.repassword) return res.status(400).send("check Password");

    else{

        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hashPassword,
            repassword : hashPassword,
            birthday : new Date(req.body.birthday),
            age : req.body.age
        })

        try {
            //寫進資料庫
            const newUser= await user.save();
            console.log(newUser);
            res.redirect('/');

        }
        catch (e) {
            console.log(e);
            res.send("Error signUp")
        }

    }
});


router.post('/login' ,async (req ,res) => {
    //validate the user data
    const{error} =  loginValidation(req.body);
    // 回傳驗證錯誤訊息
    if(error) res.status(404).send(error.details[0].message);

    // 判斷資料庫是否存在帳號
    const user = await User.findOne({email : req.body.email});
    if(!emailExist) return res.status(400).send("Password or Email Error!!!");

    console.log("User :" + user);

    //驗證密碼
    const validPass = await bcrypt.compare(req.body.password ,user.password);
    if(!validPass) return res.status(400).send("password error !!");
    res.send("Login Success!!!")
});


module.exports = router