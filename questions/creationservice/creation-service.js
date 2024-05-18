const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const crypto = require('crypto');
const Question = require('./creation-model');

const app = express();
app.disable('x-powered-by');
const port = 8005;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questiondb';
mongoose.connect(mongoUri);

const optionsNumber = 4;

// It will be the questionObject
var questionObject= "";
// It will be the correct answer
var correctOption = "";
// It will be the different options for the answers
var answerOptions = [];

var randomQuerySelector; 
// Array of the possible queries
var queries = ['SELECT DISTINCT ?questionObject ?questionObjectLabel ?answer ?answerLabel WHERE { ?questionObject wdt:P31 wd:Q6256. ?questionObject wdt:P36 ?answer. SERVICE wikibase:label {bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".}}',
  'SELECT DISTINCT ?questionObject ?questionObjectLabel ?answer ?answerLabel WHERE { ?questionObject wdt:P31 wd:Q11344; wdt:P1086 ?answer. SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".}}',
  'SELECT ?questionObject ?questionObjectLabel ?answer ?answerLabel WHERE { ?questionObject wdt:P31 wd:Q6256; wdt:P1082 ?answer. SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".}}'];
// Array of the possible questions
var questions = ["¿Cuál es la capital de ","¿Cuál es el número atómico del ", "¿Cuántos habitantes tiene "];

// Recieves the information of the query and select wich data use on the question
function getQuestionInfo(info){
  answerOptions = [];
  var fourRows = [];
  const numEles = info.length;

  // Select 4 random rows of the data
  for (let i = 0; i<optionsNumber; i++){
    //let indexRow = Math.floor(Math.random() * numEles);
    let indexRow = crypto.randomInt(0,numEles);
    if(info[indexRow].answerLabel.value.charAt(0)=='Q' || info[indexRow].questionObjectLabel.value.charAt(0)=='Q'){
      i = i - 1;
    }else{
      fourRows.push(info[indexRow]);
      // Store the 4 posible answers
      answerOptions.push(info[indexRow].answerLabel.value);
    }
  }
  
  // Select the row where it will extract the country and capital
  //var indexQuestion = Math.floor(Math.random() * optionsNumber);
  var indexQuestion = crypto.randomInt(0,optionsNumber);
  // Store the country choosen and its capital
  questionObject= questions[randomQuerySelector] + fourRows[indexQuestion].questionObjectLabel.value + "?";
  correctOption = fourRows[indexQuestion].answerLabel.value;
}

function selectRandomQuery(){
  //randomQuerySelector = Math.floor(Math.random() * queries.length);
  randomQuerySelector = crypto.randomInt(0,queries.length);
}

async function saveQuestion(){
    var incorrectAnswers=[];
    answerOptions.forEach(e => {
        if(e!=correctOption)
        incorrectAnswers.push(e);
    });

    try {
        const newQuestion = new Question({
            question: questionObject,
            correctAnswer: correctOption,
            incorrectAnswer1: incorrectAnswers[0],
            incorrectAnswer2: incorrectAnswers[1],
            incorrectAnswer3: incorrectAnswers[2]
        });
        await newQuestion.save();

    }catch (error){
        console.error("Error al guardar la pregunta: " + error);
    }
}

app.get('/createquestion', async (req, res) => {
  selectRandomQuery();
  const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(queries[randomQuerySelector])}&format=json`;

  try {
    // Makes the petition to the url
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if everything was good on the petition
    if (!response.ok) {
      console.error('Error al realizar la consulta a Wikidata:', response.statusText);
      return;
    }

    // Parse the response 
    const data = await response.json();

    // Send the parsed response to be selected
    getQuestionInfo(data.results.bindings);

    // Declare what will be return 
    solution = {
      responseQuestionObject : questionObject,
      responseCorrectOption : correctOption,
      responseAnswerOptions : answerOptions
    };

    saveQuestion();
    
    // Return the resoult with a 200 status
    res.status(200).json(solution);
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const server = app.listen(port, () => {
  console.log(`Creation Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  mongoose.connection.close();
});

module.exports = server;
