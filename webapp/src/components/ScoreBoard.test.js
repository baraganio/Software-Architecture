import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ScoreBoard from './ScoreBoard';

const mockAxios = new MockAdapter(axios);

describe('ScoreBoard component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('renders the scoreboard table with correct data', async () => {
    const scoreboardData = [
      { id: 1, username: 'user1', totalCorrect: 5, totalIncorrect: 4, points: 15 },
      { id: 2, username: 'user2', totalCorrect: 7, totalIncorrect: 2, points: 30 },
    ];
    mockAxios.onGet('http://localhost:8000/getScoreBoard').reply(200, scoreboardData);
  
    render(
      <Router>
        <ScoreBoard />
      </Router>
    );
  
    await waitFor(() => {
      const user1Element = screen.getByText('user1');
      const user2Element = screen.getByText('user2');
  
      expect(user1Element).toBeInTheDocument();
      expect(user2Element).toBeInTheDocument();
  
      // Check for specific cell values within user1Element
      const user1Cells = screen.getAllByText('user1')[0].parentElement.querySelectorAll('td');
      expect(user1Cells[2]).toHaveTextContent('5');
      expect(user1Cells[3]).toHaveTextContent('4');
      expect(user1Cells[4]).toHaveTextContent('15');
  
      // Check for specific cell values within user2Element
      const user2Cells = screen.getAllByText('user2')[0].parentElement.querySelectorAll('td');
      expect(user2Cells[2]).toHaveTextContent('7');
      expect(user2Cells[3]).toHaveTextContent('2');
      expect(user2Cells[4]).toHaveTextContent('30');
    });
  });
  
  

  it('renders the main title correctly', () => {
    render(
      <Router>
        <ScoreBoard />
      </Router>
    );
    expect(screen.getByText('Ranking de Puntuaciones')).toBeInTheDocument();
  });


  it('comprobar footer', async () => {
    render(
      <Router>
        <ScoreBoard />
      </Router>
    );
  
    const footerText = screen.getByText(/© \d{4} Hecho con ❤️ por/);
  
    expect(footerText).toBeInTheDocument();
  });

});
