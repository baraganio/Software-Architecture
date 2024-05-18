const mongoose = require('mongoose');

// Crea la base de datos con las columnas especificadas
const questionSchema = new mongoose.Schema({
    question: String,
    correctAnswer: String,
    incorrectAnswer1: String,
    incorrectAnswer2: String,
    incorrectAnswer3: String
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question