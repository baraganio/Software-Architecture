// MainPage.js
import React, { createContext, useContext, useState } from 'react';
import { Container, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

import Navbar from './Navbar';
import Footer from './Footer';

// Definición del contexto para la configuración del juego
const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const MainPage = () => {
    const navigate = useNavigate();

    // Configuración de la partida
    const [open, setOpen] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5);
    const [timePerQuestion, setTimePerQuestion] = useState(10);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseDialog = () => {
        // Validar que el valor de preguntas sea al menos 5 y el tiempo por pregunta sea al menos 10
        if (numQuestions < 5 || timePerQuestion < 10) {
            setError('El número de preguntas debe ser al menos 5 y el tiempo por pregunta debe ser al menos 10 segundos.');
            setOpenSnackbar(true);
            return;
        }

        setOpen(false);
    };

    const handleShowGame = () => {
        let path = '/Game';

        // Configuración del juego
        const gameConfig = {
            numQuestions: numQuestions,
            timePerQuestion: timePerQuestion
        };

        navigate(path, { state: { gameConfig } });
    };

    // Valor del contexto para la configuración del juego
    const configValue = {
        numQuestions,
        timePerQuestion,
        updateNumQuestions: setNumQuestions,
        updateTimePerQuestion: setTimePerQuestion,
    };


    return (
        <ConfigContext.Provider value={configValue}>
            <Navbar />

            <div title='main-title'>
                <Typography component="h1" className='main-title' variant="h5" sx={{ textAlign: 'center' }}>
                    ¡Bienvenido a
                </Typography>
                <Typography component="h2" className='main-title animate__animated animate__backInLeft animate__tada' variant="h5" sx={{ textAlign: 'center' }}>
                    WIQ 2024!
                </Typography>
            </div>

            <Container component="main" maxWidth="md" sx={{ marginTop: 4, marginBottom: 10 }}>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <div className="img-container">
                            <img src='/questions-illustration.png' alt='Imagen de prueba' className="img-fluid" style={{ width: '80%', height: 'auto' }} />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div title='main'>
                            <Button variant="contained" color="primary" fullWidth onClick={handleShowGame}  >
                                Nuevo juego
                            </Button>
                            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/ScoreBoard')}  >
                                Ranking
                            </Button>
                            <Button variant="contained" color="primary" fullWidth onClick={() => setOpen(true)}  >
                                Configuración
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={open} onClose={handleCloseDialog}>
                <div className="dialogContainer">
                    <DialogTitle className="dialogTitle">
                        <h2>Configuración del juego</h2>
                    </DialogTitle>
                    <DialogContent className="dialogContent">
                        <div className="dialogImage">
                            <img src="./questions-illustration.png" alt="Descripción de la imagen" />
                        </div>
                        <Typography variant="body1">Ingrese el número de preguntas:</Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="numQuestions"
                            label="Número de preguntas (min. 5)"
                            type="number"
                            fullWidth
                            value={numQuestions}
                            onChange={(event) => {
                                let newValue = parseInt(event.target.value, 10);
                                setNumQuestions(newValue);
                            }}
                            inputProps={{ min: 5 }}
                            className="dialogTextField"
                        />

                        <Typography variant="body1">Ingrese el tiempo por pregunta (segundos):</Typography>
                        <TextField
                            margin="dense"
                            id="timePerQuestion"
                            label="Tiempo por pregunta (mín. 10 segundos)"
                            type="number"
                            fullWidth
                            value={timePerQuestion}
                            onChange={(event) => {
                                let newValue = parseInt(event.target.value, 10);
                                setTimePerQuestion(newValue);

                            }}
                            inputProps={{ min: 10 }}
                            className="dialogTextField"
                        />
                    </DialogContent>
                    <DialogActions className="dialogButton">
                        <Button variant="contained" color="primary" fullWidth onClick={handleCloseDialog}  >
                            Aceptar
                        </Button>
                    </DialogActions>
                </div>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={setOpenSnackbar}
                    message={error}
                />

            </Dialog>

            <Footer />
        </ConfigContext.Provider>
    )
}

export default MainPage;
