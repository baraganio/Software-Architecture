import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HistoricalData from './HistoricalData';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);
describe('HistoricalData component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Crear un spy para console.error antes de cada test
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar console.error después de cada test
    consoleErrorSpy.mockRestore();
    mockAxios.reset();
  });

  it('muestra la página con el histórico de preguntas generadas', async () => {
    const question1 = ['¿Cual es la capital de Venezuela?', 'Caracas', 'Doha', 'Barcelona', 'Nasáu'];
    const question2 = ['¿Cual es la capital de Francia?', 'París', 'Londres', 'Madrid', 'Roma'];
    const question3 = ['¿Cuál es la capital de Argentina?', 'Buenos Aires', 'Santiago', 'Lima', 'Bogotá'];
    const question4 = ['¿Cuál es la capital de Japón?', 'Tokio', 'Pekín', 'Bangkok', 'Seúl'];
    const question5 = ['¿Cuál es la capital de Italia?', 'Gijón', 'Atenas', 'Moscú', 'Oviedo'];
    const question6 = ['¿Cuál es la capital de Australia?', 'Canberra', 'Wellington', 'Sydney', 'Melbourne'];
    const question7 = ['¿Cuál es la capital de Sudáfrica?', 'Pretoria', 'El Cairo', 'Nairobi', 'Abiyán'];

    const mockUsers = [question1, question2, question3, question4, question5, question6, question7];

    mockAxios.onGet("http://localhost:8000/getquestionshistory").reply(200, mockUsers);

    render(<Router>
      <HistoricalData />
    </Router>);

    await waitFor(() => {
      expect(screen.getByText('¿Cual es la capital de Venezuela?')).toBeInTheDocument();
      expect(screen.queryByText('Caracas')).toBeInTheDocument();
      expect(screen.queryByText('Doha')).toBeInTheDocument();
      expect(screen.queryByText('Barcelona')).toBeInTheDocument();
      expect(screen.queryByText('Nasáu')).toBeInTheDocument();

      expect(screen.getByText('¿Cual es la capital de Francia?')).toBeInTheDocument();
      expect(screen.queryByText('París')).toBeInTheDocument();
      expect(screen.queryByText('Londres')).toBeInTheDocument();
      expect(screen.queryByText('Madrid')).toBeInTheDocument();
      expect(screen.queryByText('Roma')).toBeInTheDocument();
    });

    expect(screen.getByText('Rows per page:')).toBeInTheDocument();

    const rowsPerPageSelect = screen.getByRole('combobox', { name: /Rows per page:/ });

    // Verifica que esté presente el elemento de selección de filas por página
    expect(rowsPerPageSelect).toBeInTheDocument();

    await waitFor(() => {
      // Simula hacer clic en el ícono de la página siguiente
      const nextPageIcon = screen.getByTestId('KeyboardArrowRightIcon');
      fireEvent.click(nextPageIcon);
    });
    

  });



  it('maneja correctamente el error al obtener el historial de preguntas', async () => {
    // Mock de la respuesta de error del servidor
    mockAxios.onGet("http://localhost:8000/getquestionshistory").reply(500, { error: 'Internal Server Error' });

    render(<Router>
      <HistoricalData />
    </Router>);

    // Esperar a que se maneje el error
    await waitFor(() => {
      // Verificar que console.error fue llamado con el mensaje de error esperado
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.anything());
    });


  });


});
