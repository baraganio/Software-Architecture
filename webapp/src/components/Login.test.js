import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from "react-router-dom";
import Login from './Login';
import { createMemoryHistory } from 'history';

const mockAxios = new MockAdapter(axios);

function getLoginElements() {
  const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
  const passwordInput = screen.getByLabelText(/Contraseña/i);
  const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });
  return { usernameInput, passwordInput, loginButton };
}

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should log in successfully', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const { usernameInput, passwordInput, loginButton } = getLoginElements();

    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
      fireEvent.submit(loginButton);
    });
  });

  it('should handle error when logging in', async () => {
    render(
      <Router>
        <Login />
      </Router>);

    const { usernameInput, passwordInput, loginButton } = getLoginElements();


    // Mock del request axios.post para simular una respuesta de error
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Error: Credenciales inválidas' });

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Error: Credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  it('should redirect to MainPage after successful login', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Login />
      </Router>
    );

    const { usernameInput, passwordInput, loginButton } = getLoginElements();


    // Mock del request axios.post para simular una respuesta exitosa
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Inicio de sesión exitoso/i)).toBeInTheDocument();
    });

    expect(history.location.pathname).toBe('/');
  });



});
