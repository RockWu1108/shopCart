

//用來驗證Post來的資料格式
const  Joi = require('@hapi/joi');
//Register Validation

const registerValidation = data => {
    const schema = {
        name : Joi.string()
            .required(),

        email : Joi.string()
            .min(6)
            .required()
            .email(),

        password : Joi.string()
            .min(6)
            .required(),

        repassword : Joi.string()
            .min(6)
            .required(),

        birthday : Joi.date()
            .required(),

        age : Joi.number()
            .required()
    };
    return Joi.validate(data , schema);
}

const loginValidation = data => {


    const schema = {

        email: Joi.string()
            .min(6)
            .required()
            .email(),

        password: Joi.string()
            .min(6)
            .required(),

    };
    return Joi.validate(data , schema);
}




module.exports.registerValidation = registerValidation ;
module.exports.loginValidation = loginValidation ;