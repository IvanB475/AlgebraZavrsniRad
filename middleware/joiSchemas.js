const Joi = require('joi');

const schema = {
    login: Joi.object().keys({
        username: Joi.string().regex(/^[\w\-\s]+$/).required(),
        password: Joi.string().alphanum().min(6).max(36).required().strip(),
        _csrf: Joi.string(),
    }),
    forgotPW: Joi.object().keys({
        email: Joi.string().email().required(),
        _csrf: Joi.string(),
    }),
    signup: Joi.object().keys({
        username: Joi.string().regex(/^[\w\-\s]+$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).max(36).required().strip(),
        _csrf: Joi.string(),
    }),
    settings: Joi.object().keys({
        email: Joi.string().email().required(),
        _csrf: Joi.string(),
    }).unknown(),
    findFriends: Joi.object().keys({
        search: Joi.string().regex(/^[\w-A-ZČ-Ža-ž\s]+$/),
        _csrf: Joi.string()
    }),
    changeUsername: Joi.object().keys({
        username: Joi.string().regex(/^[\w\-\s]+$/).required()
    })
}


module.exports = schema;