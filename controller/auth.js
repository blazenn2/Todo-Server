const userSchema = require('../model/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            const error = new Error(errors.errors[0].msg || "Validation failed, entered data is incorrect.");
            error.statusCode = 422;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = await userSchema({ name: req.body.name, email: req.body.email, password: hashedPassword }).save();
        if (user) return res.status(201).json({ message: "User successfully created!", data: user });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await userSchema.findOne({ email: req.body.email });
        if (user) {
            const comparePassword = await bcrypt.compare(req.body.password, user.password);
            if (comparePassword) {
                const token = jwt.sign({ userId: user._id.toString() }, 'thisistopsecretkey', { expiresIn: '1d' });
                if (token) {
                    return res.status(200).json({ message: "Login successfully", token: token });
                }
            } else {
                const error = new Error("Invalid password");
                error.statusCode = 401;
            }
        } else {
            const error = new Error("Invalid email");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        next(err);
    }
};