const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    duration: Number,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionAnswered' }],
    date: { type: Date, default: Date.now } ,
    percentage: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    incorrectAnswers: Number
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

