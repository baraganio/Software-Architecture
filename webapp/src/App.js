// App.js
import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div title='main'>


      <div title='main-title'>
        <Typography component="h1" className='main-title' variant="h5" sx={{ textAlign: 'center' }}>
        Bienvenido a
        </Typography>
        <Typography component="h2" className='main-title animate__animated animate__backInLeft animate__tada' variant="h5" sx={{ textAlign: 'center' }}>
        WIQ 2024
        </Typography>
      </div>

        {showLogin ? <Login /> : <AddUser />}
        <Typography component="div" align="center" sx={{ marginTop: 2 }}>
         
          {showLogin ? (

            <button onClick={handleToggleView} className='gotoregister' style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>
              ¿No tienes una cuenta? Regístrate aquí.
            </button>
            ) : (
            <button onClick={handleToggleView} className='gotoregister' style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>
              ¿Ya tienes cuenta? Inicia sesión aquí.
            </button>

          )}

        </Typography>
      </div>
    </Container>
  );
}

export default App;
