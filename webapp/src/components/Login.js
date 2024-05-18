import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/login`, { username, password });
      localStorage.setItem('username', username);
      setOpenSnackbar(true);
      navigate("/MainPage");
    } catch (error) {
      setError('Error: Credenciales inválidas')
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <div>
        <Typography component="h1" variant="h5">
          Inicio de sesión
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={loginUser}>
          Iniciar sesión
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => {setOpenSnackbar(false);}} message="Inicio de sesión exitoso" />
        {error && (
          <Snackbar data-testid="closeButton"
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => { setOpenSnackbar(true); setError('Error: Credenciales inválidas'); }} 
            message={error} 
          />
        )}

      </div>

      
    </Container>
  );
};

export default Login;
