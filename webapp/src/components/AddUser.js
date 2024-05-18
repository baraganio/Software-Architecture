import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = ({ onCloseSnackbar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      await axios.post(`${apiEndpoint}/login`, { username, password });
      localStorage.setItem('username', username);
      setOpenSnackbar(true);
      
      // Redirige a la página de juego después de 3 segundos
      setTimeout(() => {
        navigate("/mainPage");
      }, 3000);
    } catch (error) {
      setError("Error al crear usuario");
      setOpenSnackbar(true); // Abre el Snackbar en caso de error
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <Typography component="h1" variant="h5">
        Crear usuario
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        name="password"
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={addUser}>
        Crear usuario
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={onCloseSnackbar} message="Usuario añadido correctamente" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </Container>
  );
};

export default AddUser;
