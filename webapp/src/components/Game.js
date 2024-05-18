import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import './Game.css';
import '../index.css';
import '../Timer.css';

const colorPreguntas= '#4c8dbf';
const colorOnMousePreguntas= 'rgba(28, 84, 106, 0.764)';

const Game = () => {
  const navigate = useNavigate();
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  // Configuración del juego
  const location = useLocation();
  const { gameConfig } = location.state ?? { gameConfig: { numQuestions: 5, timePerQuestion: 10 } }; // Valor por defecto para gameConfig

  const [questionObject, setQuestionObject] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);
  const [correctCounter, setCorrectCounter] = useState(0);

  const [questionCounter, setQuestionCounter] = useState(0);
  const [incorrectCounter, setIncorrectCounter] = useState(0);

  const [numberOfQuestions] = useState(gameConfig.numQuestions);
  const [questionsToAnswer, setQuestionsToAnswer] = useState(gameConfig.numQuestions);



  const [isFinished, setFinished] = useState(false);

  // Porcentaje de aciertos
  const [percentage, setPercentage] = useState(0);


  //para el final de partida 
  const [gameUserOptions, setGameUserOptions] = useState([]);
  const [gameCorrectOptions, setGameCorrectOptions] = useState([]);
  const [gameQuestions, setGameQuestions] = useState([]);

  const [seconds, setSeconds] = useState(0);




  // Temporizador
  const [time, setTime] = useState(gameConfig.timePerQuestion);
  const [isTimedOut, setTimedOut] = useState(false);


  // Estado para controlar si el temporizador está activo o no
  const [isTimerActive, setIsTimerActive] = useState(true);



  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setIsTimerActive(false);
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setIsTimerActive(true);
    setOpenDialog(false);
    runTimer();
  };
  

  const runTimer = () => {
    // Calcular el tiempo restante para el temporizador
    const remainingTime = time; 
    setTime(remainingTime);
    setIsTimerActive(true);
  };

  
  useEffect(() => {
    if (openDialog) {
      stopTimer();
    } else {
      runTimer();
    }
  });


  

 
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setTimedOut(true);
          const buttons = document.querySelectorAll('button[title="btnsPreg"]');
          buttons.forEach(button => {
            button.disabled = true;
            button.onmouse = null;
          });
          clearInterval(id); // Clear the interval when the time runs out
        }
      });
    }, 1000);
  
    return () => clearInterval(id); // Clear the interval on component unmount
  }, [isTimerActive, isTimedOut]);
  


  // Calcular el porcentaje de tiempo transcurrido para el círculo del temporizador
  const percentageTime = ((gameConfig.timePerQuestion - time) / gameConfig.timePerQuestion) * 100;


  // Detener el temporizador
  const stopTimer = () => {
    setIsTimerActive(false);
  };


  


  // Activar el temporizador
  const restartTimer = () => {
    setTime(gameConfig.timePerQuestion); // Reiniciar el tiempo
    setIsTimerActive(true);
    setTimedOut(false);
  };



  useEffect(() => {
    handleShowQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //console.log("eyou");
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  
  useEffect(() => {
    if (isGameFinished() && !isFinished){
      setTimeout(() => {
        finishGame();
        setFinished(true);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctCounter]);

  useEffect(() => {
    if (isGameFinished() && !isFinished){
      setTimeout(() => {
        finishGame();
        setFinished(true);
      }, 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incorrectCounter]);
  
  // This method will call the create question service
  const  handleShowQuestion = async () => {
    try{
      setIsTimerActive(false);
      
      // It makes a petition to the api and store the response
      const response = await axios.get(`${apiEndpoint}/createquestion`, { });
      // Extract all the info of the response and store it
      setQuestionObject(response.data.responseQuestionObject);
      setCorrectOption(response.data.responseCorrectOption);
      setAnswerOptions(response.data.responseAnswerOptions);

      //guardar para el final 
      // Actualizar las preguntas del juego
      setGameQuestions(prevQuestions => [...prevQuestions, response.data.responseQuestionObject]);
      // Actualizar las opciones correctas del juego
      setGameCorrectOptions(prevCorrectOptions => [...prevCorrectOptions, response.data.responseCorrectOption]);


      const buttons = document.querySelectorAll('button[title="btnsPreg"]');
      buttons.forEach(button => {
        button.name = "sinContestar";
        button.disabled = false;
        button.style.backgroundColor = colorPreguntas;
        button.onmouse = colorOnMousePreguntas;
      });

      setQuestionCounter(qc => qc + 1);
     

    }catch (error){
      console.error('Error:', error);
    }  

    // Poner temporizador a tiempo inicial
    restartTimer();
    

  }

  // Method that checks if the answer clicked is the correct one
  const handleAnswerClick = (option, index) => {
    // Detener el temporizador
    setIsTimerActive(false);

    // Almacenar la opción seleccionada por el usuario en gameUserOptions
    setGameUserOptions(prevUserOptions => [...prevUserOptions, option]);
    if(option === correctOption) {
      const buttonId = `button_${index}`;
      const correctButton = document.getElementById(buttonId);
      if (correctButton) {
        correctButton.style.backgroundColor = "rgba(79, 141, 18, 0.726)";
        setCorrectCounter(correct => correct + 1);
      }
    }else{
      const buttonId = `button_${index}`;
      const incorrectButton = document.getElementById(buttonId);
      incorrectButton.style.backgroundColor = "rgba(208, 22, 22, 0.952)";

      // mostrar la correcta
      for (let correctIndex = 0; correctIndex < 4; correctIndex++){
        const buttonIdCorrect = `button_${correctIndex}`;
        const correctButton = document.getElementById(buttonIdCorrect);

        if (correctButton.textContent === correctOption) {
          correctButton.style.backgroundColor = "rgba(79, 141, 18, 0.726)";
        }
      }

      setIncorrectCounter(incorrect => incorrect + 1);
    }

    const buttons = document.querySelectorAll('button[title="btnsPreg"]');
    buttons.forEach(button => {
      button.disabled = true;
      button.onmouse = null;
    });
    
    setQuestionsToAnswer(toAnswer => toAnswer - 1);

    if (!isGameFinished()) {
      setTimeout(() => {
        handleShowQuestion();
      }, 1000);
    }
  }

  const isGameFinished = () => {
    return questionCounter >= numberOfQuestions;
  }
  const handleMainPage = () => {
    let path= '/mainPage';
    navigate(path);
};

const getQuestions = () => {
  const questionsList = [];

  // Iterar sobre cada pregunta generada dinámicamente y agregarla a la lista
  for (let i = 0; i < gameQuestions.length; i++) {
    const questionObject = gameQuestions[i];
    const correctAnswer = gameCorrectOptions[i];
    const userAnswer = gameUserOptions[i] || ''; // Establecer la respuesta del usuario como cadena vacía si no hay respuesta
    questionsList.push({ question: questionObject, correctAnswer, userAnswer });
  }

  return questionsList;
};




  const finishGame = () => {
    const buttons = document.querySelectorAll('button[title="btnsPreg"]');
    buttons.forEach(button => {
      button.disabled = true;
      button.onmouse = null;
    });
    //console.log("finishGame " + correctCounter);
    var correctas = (correctCounter / numberOfQuestions) * 100;
    //console.log("corr1 " + correctas);
    if (!Number.isInteger(correctas)){
      correctas = correctas.toFixed(2);
      //console.log("dentro " + correctas);
    }
    //console.log("corr2 " + correctas);
    setPercentage(correctas);
    
    //a partir de aqui guardar la partida 
    const username=localStorage.getItem('username');
    const newGame = {
      username: username, 
      duration: seconds, 
      questions: getQuestions() ,
      percentage: correctas,
     totalQuestions: numberOfQuestions,
      correctAnswers: correctCounter,
      incorrectAnswers: numberOfQuestions-correctCounter
    };  
  
    axios.post(`${apiEndpoint}/addgame`, newGame)
  .then(response => {
    console.log("Respuesta del servidor:", response.data);
  })
  .catch(error => {
    console.error("Error al enviar la solicitud:", error);
  });
  }
 
  useEffect(() => {
    if (isTimedOut && !isFinished) {
      // mostrar la respuesta correcta
      for (let correctIndex = 0; correctIndex < 4; correctIndex++){
        const buttonIdCorrect = `button_${correctIndex}`;
        const correctButton = document.getElementById(buttonIdCorrect);

        if (correctButton.textContent === correctOption) {
          correctButton.style.backgroundColor = "rgba(79, 141, 18, 0.726)";
        }
      }

      setIncorrectCounter(incorrect => incorrect + 1);
      setQuestionsToAnswer(toAnswer => toAnswer - 1);

      setTimeout(() => {
        if (!isGameFinished()) {
          setTimeout(() => {
            handleShowQuestion();          
          }, 1000);
        }

      }, 2000);

      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimedOut]);


  return (


    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      {!isFinished && (
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography component="h2" className='main-title animate__animated animate__backInLeft animate__tada' variant="h4" sx={{ textAlign: 'center' }}>
          Saber y Ganar Juego
        </Typography>

        <div className="button-container">
  {!isFinished && (
    <Button title="contador" onMouseEnter={null} variant="contained" color="primary" disabled={true}>
      Preguntas restantes: {questionsToAnswer}
    </Button>
  )}
  {!isFinished && (
    <Button title="contador" onMouseEnter={null} variant="contained" color="primary" disabled={true}>
      Correctas: {correctCounter}
    </Button>
  )}
  {!isFinished && (
    <Button title="contador" onMouseEnter={null} variant="contained" color="primary" disabled={true}>
      Incorrectas: {incorrectCounter}
    </Button>
  )}
</div>


        {!isFinished && (
        <Typography variant="h4" gutterBottom>
          <div>
          </div>


          <div className="Timer" data-testid="Timer">
            <div className="container">
              <div className="text">{time}</div>

              <svg>
                <circle cx="70" cy="70" r="70" />
                <circle
                  strokeDashoffset={(440 - (percentageTime / 100) * 440).toFixed(2)}

                  cx="70"
                  cy="70"
                  r="70"
                />
              </svg>
            </div>

          </div>
        </Typography>

      )}

        <Typography variant="body1" className='game-question' paragraph>
          <h2><strong>Pregunta {questionCounter}:</strong> {questionObject}</h2>
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', marginTop: '2em' }}>
          {answerOptions.map((option, index) => (
            <Button id={`button_${index}`} title="btnsPreg" key={index} variant="contained" color="primary" onClick={() => { 
              
              stopTimer();
              handleAnswerClick(option, index);
              
              }}>
            {option}
          </Button>
          
          ))}
        </div>


      </Paper>
     )}

      




      


      

      {isFinished && (
        <div>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Partida finalizada. ¡Gracias por jugar!
          </Typography>
          <div>
            <Button title='puntuacion' onMouseEnter={null} variant="contained" color="primary" disabled={true}>
              Puntuación: {percentage} % 
            </Button>
          </div>


        </Paper>
        <div>
          <Button title="volver" onClick={handleMainPage} variant="contained">
          Volver al menú principal</Button>
        </div>
        </div>
      )}

      {!isGameFinished() && !isFinished &&(
      <div>
        <Button title="volver" onClick={handleDialogOpen} variant="contained">
        Volver al menú principal</Button>
      </div>
      )}


      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas volver al menú principal? Perderás el progreso actual de la partida.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleMainPage} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    
    </Container>
  );
};

export default Game;