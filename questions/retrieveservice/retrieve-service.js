const express = require('express');
const mongoose = require('mongoose');
const Question = require('./questionshistory-model')
const Game = require('./playedGame-model')
const QuestionAnswered = require('./question-model')

const app = express();
app.disable('x-powered-by');
const port = 8004;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questiondb';
mongoose.connect(mongoUri);


app.get('/getquestionshistory', async (req, res) => {
  const questions = await Question.find({});
  
  var solution = [];
  questions.forEach(row => {
    solution.push([row.question,row.correctAnswer,row.incorrectAnswer1,row.incorrectAnswer2,row.incorrectAnswer3]);
  });

  res.status(200).json(solution);
});

app.post('/addgame', async (req, res) => {
  try {
      // Obtener los datos del juego desde el cuerpo de la solicitud
      const gameData = req.body;

      // Convertir las preguntas del juego en ObjectId
      const questionIds = await Promise.all(gameData.questions.map(async (question) => {
          const existingQuestion = await QuestionAnswered.findOne({
              question: question.question,
              correctAnswer: question.correctAnswer,
              userAnswer: question.userAnswer
          });
          if (existingQuestion) {
              return existingQuestion._id;
          } else {
              const newQuestion = new QuestionAnswered(question);
              await newQuestion.save();
              return newQuestion._id;
          }
      }));

      // Reemplazar las preguntas en el juego con sus ObjectId
      gameData.questions = questionIds;

      // Crear una nueva instancia del modelo de juego con los datos proporcionados
      const newGame = new Game(gameData);

      // Guardar el nuevo juego en la base de datos
      await newGame.save();

      // Enviar una respuesta de éxito
      res.status(200).json({ message: "Partida guardada exitosamente" });
  } catch (error) {
      // Manejar errores y enviar una respuesta de error con el mensaje de error
      console.error("Error al guardar el juego:", error);
      res.status(400).json({ error: error.message });
  }
});



app.get('/getgamehistory/:username', async (req, res) => {
  try {
      const username = req.params.username;
      console.log("Se está intentando encontrar el historial del usuario " + username);
      // Buscar las partidas asociadas al nombre de usuario proporcionado
      const games = await Game.find({ username }).populate('questions');
      console.log("Se encontraron los juegos para " + username + ": ", games);
      res.json(games);
  } catch (error) {
      res.status(400).json({
          error: error.message
      });
  }
});
app.get('/getScoreBoard', async (req, res) => {
  try {
    // Obtener todas las partidas
    const games = await Game.find({});
    
    // Objeto para almacenar el scoreboard
    const scoreboard = {};

    // Calcular el scoreboard para cada usuario
    games.forEach(game => {
      if (!scoreboard[game.username]) {
        scoreboard[game.username] = {
          username: game.username,
          totalCorrect: 0,
          totalIncorrect: 0,
          points: 0
        };
      }

      // Sumar el número total de preguntas acertadas y falladas
      scoreboard[game.username].totalCorrect += game.correctAnswers;
      scoreboard[game.username].totalIncorrect += game.incorrectAnswers;

      // Calcular los puntos totales
      scoreboard[game.username].points += (game.correctAnswers * 15) - (game.incorrectAnswers * 5);
    });

    // Convertir el objeto de scoreboard en un array de objetos
    const scoreboardArray = Object.values(scoreboard);

    // Enviar la respuesta con el scoreboard
    res.json(scoreboardArray);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});


const server = app.listen(port, () => {
  console.log(`Creation Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  mongoose.connection.close();
});

module.exports = server;
