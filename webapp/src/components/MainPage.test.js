import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MainPage from './MainPage';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

const renderMainPageComponent = () => {
  return render(
    <Router>
      <MainPage />
    </Router>
  );
};

describe('MainPage component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('muestra la página principal correctamente', async () => {
    renderMainPageComponent();
  
    const element1 = screen.getByText(/¡Bienvenido a/);
    const element2 = screen.getByText(/WIQ 2024!/);
    const newGameButton = screen.getByRole('button', { name: 'Nuevo juego' });
  
    expect(element1).toBeInTheDocument();
    expect(element2).toBeInTheDocument();
  
    fireEvent.click(newGameButton);
  
    await act(async () => {
    });
    expect(window.location.pathname).toBe('/Game');
  });

  it('abre el diálogo de configuración y cierra correctamente', async () => {
    renderMainPageComponent();
  
    const configButton = screen.getByRole('button', { name: 'Configuración' });
  
    fireEvent.click(configButton);
  
    const numQuestionsInput = screen.getByLabelText('Número de preguntas (min. 5)');
    const timePerQuestionInput = screen.getByLabelText('Tiempo por pregunta (mín. 10 segundos)');
    const acceptButton = screen.getByRole('button', { name: 'Aceptar' });
  
    // Verificar que el diálogo se abre correctamente
    expect(numQuestionsInput).toBeInTheDocument();
    expect(timePerQuestionInput).toBeInTheDocument();

  
    // Simular el cambio de valor en los campos de entrada
    fireEvent.change(numQuestionsInput, { target: { value: '15' } });
    fireEvent.change(timePerQuestionInput, { target: { value: '20' } });

    fireEvent.click(acceptButton);
    fireEvent.click(configButton);
  
    // Verificar que los valores se actualizan correctamente
    expect(numQuestionsInput.value).toBe('15');
    expect(timePerQuestionInput.value).toBe('20');
  
  });

  
  it('muestra un mensaje de error si las condiciones no se cumplen', async () => {
    renderMainPageComponent();
  
    const configButton = screen.getByRole('button', { name: 'Configuración' });
  
    fireEvent.click(configButton);
  
    const numQuestionsInput = screen.getByLabelText('Número de preguntas (min. 5)');
    const timePerQuestionInput = screen.getByLabelText('Tiempo por pregunta (mín. 10 segundos)');
    const acceptButton = screen.getByRole('button', { name: 'Aceptar' });
  
    // Simular el cambio de valor en los campos de entrada con valores inválidos
    fireEvent.change(numQuestionsInput, { target: { value: '3' } });
    fireEvent.change(timePerQuestionInput, { target: { value: '5' } });
  
    // Simular hacer clic en el botón de aceptar
    fireEvent.click(acceptButton);
  
    // Verificar que se muestra un mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/El número de preguntas debe ser al menos 5 y el tiempo por pregunta debe ser al menos 10 segundos./i)).toBeInTheDocument();
    });

    // Verificar que el diálogo no se cierra
    expect(screen.queryByText('Configuración del juego')).toBeInTheDocument();
  });
  

  it('navega a la página de ScoreBoard al hacer clic en el botón "Ranking"', async () => {
    renderMainPageComponent();
  
    const rankingButton = screen.getByRole('button', { name: 'Ranking' });
  
    fireEvent.click(rankingButton);
  
    // Verificar que la ruta se cambió correctamente
    await waitFor(() => {
      expect(window.location.pathname).toBe('/ScoreBoard');
    });
  });


  it('navega a la página de Juego al hacer clic en el botón "Nuevo juego"', async () => {
    renderMainPageComponent();
  
    const gameButton = screen.getByRole('button', { name: 'Nuevo juego' });
  
    fireEvent.click(gameButton);
  
    // Verificar que la ruta se cambió correctamente
    await waitFor(() => {
      expect(window.location.pathname).toBe('/Game');
    });
  });

  it('navega a la página de usuarios registrados', async () => {
    renderMainPageComponent();
  
    const registeredUsersLink = screen.getByText('Usuarios registrados');

    fireEvent.click(registeredUsersLink);
  
    // Verificar que la ruta se cambió correctamente
    await waitFor(() => {
      expect(window.location.pathname).toBe('/RegisteredUsers');
    });
  });


  it('navega a la página principal', async () => {
    renderMainPageComponent();
  
    const mainPageLink = screen.getByText('Página principal');

    fireEvent.click(mainPageLink);
  
    // Verificar que la ruta se cambió correctamente
    await waitFor(() => {
      expect(window.location.pathname).toBe('/mainPage');
    });
  });


  it('navega a la página de historial de preguntas', async () => {
    renderMainPageComponent();
  
    const historialLink = screen.getByText('Historial');
    fireEvent.click(historialLink);

    const questionHistorialLink = screen.getByText('Historial de preguntas');
    fireEvent.click(questionHistorialLink);
  
    // Verificar que la ruta se cambió correctamente
    await waitFor(() => {
      expect(window.location.pathname).toBe('/historicaldata');
    });
  });

  it('navega a la página de historial de usuario', async () => {
    renderMainPageComponent();
  
    const historialLink = screen.getByText('Historial');
    fireEvent.click(historialLink);

    const questionHistorialLink = screen.getByText('Historial de usuario');
    fireEvent.click(questionHistorialLink);
  
    // Verificar que la ruta se cambió correctamente
    await waitFor(() => {
      expect(window.location.pathname).toBe('/historicalUserdata');
    });
  });

  it('realiza un logout', async () => {
    renderMainPageComponent();
  
    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);
  });


  it('comprobar footer', async () => {
    renderMainPageComponent();
  
    const footerText = screen.getByText(/© \d{4} Hecho con ❤️ por/);
  
    expect(footerText).toBeInTheDocument();
  });
  



  
});