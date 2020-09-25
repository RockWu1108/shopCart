const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../model/user');




router.get('/'  ,async (req , res ) => {

    const token = req.cookies.authToken;
        console.log("Token "+token);

        if(token){
            const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
            console.log("decode:" +decoded._id)
            const user = await User.findOne({ _id : decoded._id});

                    res.render('index' , {
                        name : user.name,
                        success: true
                    })

        }
        else{
            res.render('index' , {
                success : false
            });
        }
});


module.exports = router