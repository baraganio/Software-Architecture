import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, TablePagination, Typography } from '@mui/material';
import './HistoricalData.css';
import Navbar from './Navbar';

const HistoricalData = () => {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [questionsHistory, setQuestionsHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    handleShowHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowHistory = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/getquestionshistory`);
      setQuestionsHistory(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const paginatedData = questionsHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Navbar />
      <Typography component="h2" style={{ marginTop: '1rem', marginBottom: '1rem' }} className='fs-2 main-title animate__animated animate__backInLeft' variant="h2" sx={{ textAlign: 'center' }}>
        Historial de preguntas
      </Typography>
    
    <Container component="main" className='contenedor containerTable' >
    <div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow className='custom-td'>
              <TableCell>Pregunta</TableCell>
              <TableCell>Opción correcta</TableCell>
              <TableCell>Opción incorrecta 1</TableCell>
              <TableCell>Opción incorrecta 2</TableCell>
              <TableCell>Opción incorrecta 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} style={{ border: '#000 solid 0.1rem' }}>
                    <td>{row[0]}</td>
                    <td style={{ backgroundColor: '#B8DEB8' }}>{row[1]}</td>
                    <td style={{ backgroundColor: '#DAAEAE' }}>{row[2]}</td>
                    <td style={{ backgroundColor: '#DAAEAE' }}>{row[3]}</td>
                    <td style={{ backgroundColor: '#DAAEAE' }}>{row[4]}</td>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={questionsHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
      />
    </div>
  </Container>

  </>

  );
};

export default HistoricalData;
