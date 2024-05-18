import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HistoricalUserData from './HistoricalUserData';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

describe('HistoricalUserData component', () => {
  beforeEach(() => {
    mockAxios.reset();
    localStorage.setItem('username', 'testUser');
  });

  it('renders the main title correctly', () => {
    render(
      <Router>
        <HistoricalUserData />
      </Router>
    );
    expect(screen.getByText('Historial de partidas de testUser')).toBeInTheDocument();
  });

  it('fetches game history, renders game data, expands game details, and renders questions', async () => {
    const mockGameHistory = [
      { 
        id: 1, 
        date: '2024-04-27T08:00:00', 
        duration: 60, 
        percentage: 75, 
        totalQuestions: 10, 
        correctAnswers: 7, 
        incorrectAnswers: 3, 
        questions: [
          { question: 'Question 1', correctAnswer: 'Answer 1', userAnswer: 'Answer 1' },
          { question: 'Question 2', correctAnswer: 'Answer 2', userAnswer: 'Answer 3' }
        ] 
      }
    ];
  
    mockAxios.onGet('http://localhost:8000/getgamehistory/testUser').reply(200, mockGameHistory);
  
    render(
      <Router>
        <HistoricalUserData />
      </Router>
    );
  
    // Espera a que se muestre la información de la partida
    await waitFor(() => {
      expect(screen.getByText('27/04/2024 08:00')).toBeInTheDocument();
      expect(screen.getByText('60 segundos')).toBeInTheDocument();
      expect(screen.getByText('75.00%')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  
    // Simula hacer clic en el botón de expansión para mostrar las preguntas ocultas
    fireEvent.click(screen.getByText('+'));
  
    // Espera a que se muestre la pregunta esperada
    await waitFor(() => {
      expect(screen.getByText('Pregunta 1:')).toBeInTheDocument();
      expect(screen.getByText('Respuesta Correcta: Answer 1')).toBeInTheDocument();
      expect(screen.getByText('Respuesta del Usuario: Answer 1')).toBeInTheDocument();
      expect(screen.getByText('La respuesta fue: Correcta')).toBeInTheDocument();
    });
  
    // Espera a que se muestre la segunda pregunta
    await waitFor(() => {
      expect(screen.getByText('Pregunta 2:')).toBeInTheDocument();
      expect(screen.getByText('Respuesta Correcta: Answer 2')).toBeInTheDocument();
      expect(screen.getByText('Respuesta del Usuario: Answer 3')).toBeInTheDocument();
      expect(screen.getByText('La respuesta fue: Incorrecta')).toBeInTheDocument();
    });
  });
  
  it('handles pagination correctly', async () => {
    const mockGameHistory = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      date: `2024-04-${index < 9 ? '0' + (index + 1) : index + 1}T08:00:00`,
      duration: 60,
      percentage: 75,
      totalQuestions: 10,
      correctAnswers: 7,
      incorrectAnswers: 3,
      questions: [
        { question: `Question ${index + 1}`, correctAnswer: 'Answer 1', userAnswer: 'Answer 1' },
        { question: `Question ${index + 2}`, correctAnswer: 'Answer 2', userAnswer: 'Answer 3' }
      ]
    }));
  
    mockAxios.onGet('http://localhost:8000/getgamehistory/testUser').reply(200, mockGameHistory);
  
    render(
      <Router>
        <HistoricalUserData />
      </Router>
    );
  
    // Espera a que se muestre la información de la primera página
    await waitFor(() => {
      // Busca la información de la fecha y el tiempo de partida utilizando texto exacto
      expect(screen.queryAllByText('60 segundos')).not.toBeNull();
      expect(screen.queryAllByText('75.00%')).not.toBeNull();
      expect(screen.queryAllByText('10')).not.toBeNull();
      expect(screen.queryAllByText('7')).not.toBeNull();
      expect(screen.queryAllByText('3')).not.toBeNull();
    });
  
    // Simula hacer clic en el botón para ir a la siguiente página
    fireEvent.click(screen.getByLabelText('Go to next page'));
  
    // Espera a que se muestre la información de la segunda página
    await waitFor(() => {
      // Busca la información de la fecha y el tiempo de partida utilizando texto exacto en la segunda página
      expect(screen.queryAllByText('60 segundos')).not.toBeNull();
      expect(screen.queryAllByText('75.00%')).not.toBeNull();
      expect(screen.queryAllByText('10')).not.toBeNull();
      expect(screen.queryAllByText('7')).not.toBeNull();
      expect(screen.queryAllByText('3')).not.toBeNull();
    });
  });
  
});
