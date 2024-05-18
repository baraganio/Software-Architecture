const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Question = require('./questionshistory-model');

let mongoServer;
let app;

async function addQuestion(question){
  const newQuestion = new Question({
    question: question.question,
  correctAnswer: question.correctAnswer,
  incorrectAnswer1: question.incorrectAnswer1,
  incorrectAnswer2: question.incorrectAnswer2,
  incorrectAnswer3: question.incorrectAnswer3,
  });

  await newQuestion.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./retrieve-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Retrieve Service', () => {

  it('should add a new game on POST /addgame', async () => {
    const newGame = ({
      username: "testUsername",
      duration: "23",
      questions: [{question: "¿Cual es la capital de España?", answers: "Madrid", useranswer: "Madrid"}],
      percentage: 38,
      totalQuestions: 1,
      correctAnswers: 1,
      incorrectAnswers: 0
    })
    const response = await request(app).post('/addgame').send(newGame);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe( "Partida guardada exitosamente");
  });

  it('error on savind a new game /addgame', async () => {
    const newGame = ({
      username: "testUsername2",
      duration: "23",
      questions: 8,
      percentage: 38,
      totalQuestions: 1,
      correctAnswers: 1,
      incorrectAnswers: 0
    })
    const response = await request(app).post('/addgame').send(newGame);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it('should get the scoreBoard on GET /getquestionshistory', async () => {
    const quest1 = {
      question: "Cual es la capital de España",
      correctAnswer: "Madrid",
      incorrectAnswer1: "Londres",
      incorrectAnswer2: "Berlin",
      incorrectAnswer3: "Rabat",
    };
    
    const quest2 = {
      question: "Cual es la capital de Alemania",
      correctAnswer: "Berlin",
      incorrectAnswer1: "Beijin",
      incorrectAnswer2: "Angola",
      incorrectAnswer3: "Mexico",
    };
    addQuestion(quest1);
    addQuestion(quest2);
    const response = await request(app).get('/getquestionshistory');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([["Cual es la capital de España", "Madrid", "Londres", "Berlin", "Rabat"], 
      ["Cual es la capital de Alemania", "Berlin", "Beijin", "Angola", "Mexico"]]);
  });

  it('should get the game history of a specific user on GET /getgamehistory/:username', async () => {
    const username = "testUsername"
    //const response = (await request(app).get('/getgamehistory/:username').query({username: "testUsername"}));
    const response = await request(app).get(`/getgamehistory/${username}`);
    expect(response.status).toBe(200);
    expect(response.body[0].username).toBe("testUsername");
    expect(response.body[0].duration).toBe(23);
    expect(response.body[0].totalQuestions).toBe(1);
    expect(response.body[0].correctAnswers).toBe(1);
  });

  it('should get the scoreBoard on GET /getScoreBoard', async () => {
    const response = await request(app).get('/getScoreBoard');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([{"points":15,"totalCorrect":1,"totalIncorrect":0,"username":"testUsername"}]);
  });

  
});