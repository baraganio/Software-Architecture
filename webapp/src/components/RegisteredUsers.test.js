import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BrowserRouter as Router} from "react-router-dom";
import RegisteredUsers from './RegisteredUsers';

const mockAxios = new MockAdapter(axios);

describe('Registered Users component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('muestra todos los usuarios registrados', async () => {
    const user1 = ['pablo', '2024-04-03T12:34:56Z'];
    const mockUsers = [user1];
    mockAxios.onGet("http://localhost:8000/getregisteredusers").reply(200, mockUsers);

    render(
      <Router>
        <RegisteredUsers />
      </Router>);

  await waitFor(() => {

    expect(screen.getByText('pablo')).toBeInTheDocument();
    expect(screen.getByText('03/04/2024')).toBeInTheDocument();
    });

  });




  it('should format dates correctly', async () => {
    const mockRegisteredUsers = [
      ['username1', '2024-04-03T12:34:56Z'],
      ['username2', '2024-04-02T12:39:56Z'],
    ];

    mockAxios.onGet('http://localhost:8000/getregisteredusers').reply(200, mockRegisteredUsers);

    render(
      <Router>
        <RegisteredUsers />
      </Router>);


    await waitFor(() => {
        // Check if dates are formatted correctly
        expect(screen.getByText('03/04/2024')).toBeInTheDocument();
        expect(screen.getByText('02/04/2024')).toBeInTheDocument();
      });

  });


  it('comprobar footer', async () => {
    render(
      <Router>
        <RegisteredUsers />
      </Router>);
  
    const footerText = screen.getByText(/© \d{4} Hecho con ❤️ por/);
  
    expect(footerText).toBeInTheDocument();
  });
});