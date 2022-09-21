const express = require('express');
const { body } = require('express-validator');
const userSchema = require('../model/User');

const router = express.Router();

const authController = require('../controller/auth');

router.post('/signup',
    body('email').trim().notEmpty().isEmail().normalizeEmail().withMessage("Invalid email").custom(value => userSchema.findOne({ email: value }).then(user => (user ? Promise.reject("Email already exist") : null))),
    body('name').trim().notEmpty().custom(value => value.includes(' ')).withMessage("Invalid full name"),
    authController.signUp);

module.exports = router;