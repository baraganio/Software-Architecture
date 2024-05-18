import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const RegisteredUsers = () => {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [registeredUsers, setRegisteredUsers] = useState([]);


  useEffect(() => {
    handleShowHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleShowHistory = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/getregisteredusers`, {});
      setRegisteredUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  


  return (
    <>
    <Navbar />
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }} className='contenedor' >

    <div>
        <Typography component="h2" style={{ marginTop: '1rem', marginBottom: '1rem' }} className='fs-2 main-title animate__animated animate__backInLeft' variant="h2" sx={{ textAlign: 'center' }}>
          Usuarios registrados
        </Typography>
        <table>
          <thead>
            <tr>
              <th className='text-center custom-td'>Nombre de usuario</th>
              <th className='text-center custom-td'>Fecha de registro</th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row[0]}</td>
                <td>{formatDate(row[1])}</td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
  </Container>
  <Footer />
  </>

  );
};

export default RegisteredUsers;
