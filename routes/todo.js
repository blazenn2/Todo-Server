const express = require('express');

const router = express.Router();

const { body } = require('express-validator');


const todoController = require('../controller/todo');
const jwtVerification = require('../middlewares/is-auth');

router.post('/add-todo', body('todo').trim().notEmpty().withMessage("Empty todo"), jwtVerification, todoController.addTodo);

router.post('/change-index', jwtVerification, todoController.changeIndex);

router.get('/get-todos', jwtVerification, todoController.getTodos)

module.exports = router;