const Joi = require('joi');

exports.validator = (schema) => {

    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        const valid = error == null;

        if(valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            res.status(422).json({ error: message });
        }
    }
}


exports.queryValidator = (schema) => {

    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        const valid = error == null;

        if(valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            res.status(422).json({ error: message });
        }
    }    
}

exports.socketValidator = (schema, property) => {

    return (req, res, next) => {
        const { error } = schema.validate(property);
        const valid = error == null;

        if(valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            res.status(422).json({ error: message });
        }
    }    
}