const userSchema = require('../model/User');
const { validationResult } = require('express-validator');

exports.signUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            const error = new Error(errors.errors[0].msg || "Validation failed, entered data is incorrect.");
            error.statusCode = 422;
            throw error;
        }

        const user = await userSchema({ name: req.body.name, email: req.body.email, password: req.body.password }).save();
        if (user) return res.status(201).json({ message: "User successfully created!", data: user });
    } catch (err) {
        next(err);
    }
};

