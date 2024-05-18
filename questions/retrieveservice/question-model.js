const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    correctAnswer: String,
    userAnswer: String
});

const QuestionAnswered = mongoose.model('QuestionAnswered', questionSchema);

module.exports = QuestionAnswered
