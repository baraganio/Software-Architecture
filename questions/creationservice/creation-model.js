const mongoose = require('mongoose');

// Crea la base de datos con las columnas especificadas
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    incorrectAnswer1: {
        type: String,
        required: true,
    },
    incorrectAnswer2: {
        type: String,
        required: true,
    },
    incorrectAnswer3: {
        type: String,
        required: true,
    },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question