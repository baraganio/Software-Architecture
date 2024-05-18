import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';
import { BrowserRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

const renderAddUserComponent = () => {
  return render(
    <BrowserRouter>
      <AddUser />
    </BrowserRouter>
  );
};

const addUser = async () => {
  const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
  const passwordInput = screen.getByLabelText(/Contraseña/i);
  const addUserButton = screen.getByRole('button', { name: /Crear usuario/i });

  fireEvent.change(usernameInput, { target: { value: 'testUser' } });
  fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

  fireEvent.click(addUserButton);
};

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
    jest.useFakeTimers();
  });

  it('should add user successfully', async () => {
    renderAddUserComponent();

    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    await addUser();

    await waitFor(() => {
      expect(screen.getByText(/Usuario añadido correctamente/i)).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    renderAddUserComponent();

    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    await addUser();

    await waitFor(() => {
      expect(screen.getByText(/Error: Error al crear usuario/i)).toBeInTheDocument();
    });
  });

  it('should display proper labels and inputs', () => {
    renderAddUserComponent();

    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear usuario/i })).toBeInTheDocument();
  });

  it('should display success Snackbar with autoHideDuration', async () => {
    renderAddUserComponent();

    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    await addUser();

    jest.runAllTimers();

    expect(screen.queryByText(/Usuario añadido correctamente/i)).toBeNull();

    await waitFor(() => {
      expect(screen.getByText(/Usuario añadido correctamente/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });


  });

  it('should display error Snackbar with autoHideDuration', async () => {
    renderAddUserComponent();

    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    await addUser();

    jest.runAllTimers();

    expect(screen.queryByText(/Error: Internal Server Error/i)).toBeNull();

    await waitFor(() => {
      expect(screen.getByText(/Error: Error al crear usuario/i)).toBeInTheDocument();
    });
  });


});
