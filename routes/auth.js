const express = require('express')
const router = express.Router()
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const verify = require('./verifyToken');
const {registerValidation ,loginValidation} = require('../public/javascripts/validate');



router.get('/signUp' , async (req , res)=>{

    // const  token = req.header('auth-token');
    //     console.log(token)
    //     if(token!== null ){
    //         const verified = jwt.verify(token,process.env.TOKEN_SECRET);
    //         console.log("va"+verified);
    //         const user = await User.findOne({_id : req.user});
    //             if( verified !== null && token !==''){
    //                 res.render('User/signUp' , {
    //                     user : user ,
    //                     success: true
    //                 })
    //             }
    //     }

        // else{
            res.render('User/signUp' , {
                user: new User() ,
                success : false
            });
        // }

})

router.get('/login' , (req , res)=>{
    res.render('User/login' ,{success : false});
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


router.post('/login'  , async (req ,res) => {
    //validate the user data
    const{error} =  loginValidation(req.body);
    // 回傳驗證錯誤訊息
    if(error) res.status(404).send(error.details[0].message);

    // 判斷資料庫是否存在帳號
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Password or Email Error!!!");

    //驗證密碼
    const validPass = await bcrypt.compare(req.body.password ,user.password);
    if(!validPass) return res.status(400).send("password error !!");

    // Create and assign token
    const token = jwt.sign({ _id : user._id} , process.env.TOKEN_SECRET);
   // res.header('auth-token',token).send(token);

    res.cookie('authToken', token ,{
        expiresIn: '1 day',
        httpOnly : true
    }).redirect('/');

});
router.get('/logOut' ,(req , res) =>{
    res.clearCookie('authToken');
    res.redirect('/');
})


module.exports = router