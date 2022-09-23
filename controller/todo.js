const todoSchema = require('../model/Todo');
const { validationResult } = require('express-validator');

exports.getTodos = async (req, res, next) => {
    const allTodos = await todoSchema.find({ userId: req.userId });
    if (allTodos) return res.status(200).json({ allTodos });
};

exports.addTodo = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            const error = new Error(errors.errors[0].msg || "Validation failed, entered data is incorrect for todo.");
            error.statusCode = 422;
            throw error;
        }
        const todo = await todoSchema({ todo: req.body.todo, index: req.body.index, userId: req.userId }).save();
        if (todo) res.status(200).json({ message: "Todo Successfully added" });
        else {
            const error = new Error("Failed to save Todo");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        next(err);
    }
};

exports.changeIndex = async (req, res, next) => {
    try {
        const todoArray = req.body.todo;
        const deleteTodos = await todoSchema.deleteMany({ userId: req.userId });
        if (deleteTodos) {
            todoArray.forEach(async (val, i) => {
                try {
                    const addTodo = await todoSchema({ todo: val, index: i, userId: req.userId }).save();
                    if (!addTodo) {
                        const error = new Error("Failed to update");
                        error.statusCode = 401;
                        throw error;
                    }
                } catch (err) {
                    next(err);
                };

            });
        } else {
            const error = new Error('Failed to update todos');
            error.statusCode = 401;
            throw error;
        }
        return res.status(200).json({ message: "Updated todos successfully" });
    } catch (err) {
        next(err);
    }
};