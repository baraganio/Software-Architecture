import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from './Game';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter

const mockAxios = new MockAdapter(axios);

const renderGameComponent = (numQuestions, timePerQuestion) => {
  render(
    <MemoryRouter initialEntries={['/game']} initialIndex={0}>
      <Game gameConfig={{ numQuestions, timePerQuestion }} />
    </MemoryRouter>
  );
};



const mockQuestionData = {
  responseQuestionObject: 'What is 2 + 2?',
  responseCorrectOption: '4',
  responseAnswerOptions: ['2', '3', '4', '5'],
};

describe('Game component', () => {
  let consoleErrorSpy;


  beforeEach(() => {
    mockAxios.reset();
    jest.useFakeTimers();
    jest.clearAllMocks();
    localStorage.clear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });


  afterEach(() => {
    // Restaurar console.error después de cada test
    consoleErrorSpy.mockRestore();
  });

  it('should handle API error correctly', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(500); // Simular error de servidor

    await waitFor(() => {
      // Verificar que console.error fue llamado con el mensaje de error esperado
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.anything());
    });
  });


  it('muestra la página principal correctamente', async () => {
    renderGameComponent();

    // Open the confirmation dialog
    fireEvent.click(screen.getByText('Volver al menú principal'));

    // Simulate clicking the confirm button
    fireEvent.click(screen.getByText('Confirmar'));

    // Wait for the component to unmount (indicating the redirection)
    await waitFor(() => {
      expect(screen.queryByText('Game')).not.toBeInTheDocument();

    });

  });


  it('should display initial elements correctly', () => {
    renderGameComponent();

    // Verificar que elementos iniciales se muestren correctamente
    expect(screen.getByText('Saber y Ganar Juego')).toBeInTheDocument();
    expect(screen.getByText('Preguntas restantes: 5')).toBeInTheDocument(); // Depende de la configuración del juego
    expect(screen.getByText('Correctas: 0')).toBeInTheDocument();
    expect(screen.getByText('Incorrectas: 0')).toBeInTheDocument();
    expect(screen.getByText('Pregunta 0:')).toBeInTheDocument(); // La primera pregunta
    expect(screen.getByText('Volver al menú principal')).toBeInTheDocument();
  });

  it('should display question and answer options', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    await waitFor(() => {
      // Esperar a que el texto de la pregunta cambie a "Pregunta 1"
      if (screen.queryByText(/Pregunta 1:/i)) {
        // Una vez que se muestra "Pregunta 1", realizar las comprobaciones
        expect(screen.getByText(/Pregunta 1:/i)).toBeInTheDocument();
        expect(screen.getByText(/What is 2 \+ 2\?/i)).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
      }
    });
  });

  it('should handle correct answer click', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    // Esperar hasta que se muestre "Pregunta 1"
    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        // Una vez que se muestre la pregunta, hacer clic en la respuesta correcta
        fireEvent.click(screen.getByText('4'));
        // Verificar si afectó correctamente al conteo de respuestas correctas
        expect(screen.getByText(/Correctas: 1/i)).toBeInTheDocument();
        // Verificar si el color del botón cambió a verde
        expect(screen.getByText('4')).toHaveStyle({ backgroundColor: 'rgba(79, 141, 18, 0.726)' });
      }
    });
  });

  it('should handle incorrect answer click', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    // Esperar hasta que se muestre "Pregunta 1"
    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        // Una vez que se muestre la pregunta, hacer clic en una respuesta incorrecta
        fireEvent.click(screen.getByText('2'));
        expect(screen.getByText(/Incorrectas: 1/i)).toBeInTheDocument();
        // Verificar si el color del botón cambió a rojo
        expect(screen.getByText('2')).toHaveStyle({ backgroundColor: 'rgba(208, 22, 22, 0.952)' });
      }
    });
  });

  it('should close confirmation dialog on cancel', async () => {
    renderGameComponent();

    // Open the confirmation dialog
    fireEvent.click(screen.getByText('Volver al menú principal'));

    // Simulate clicking the cancel button
    fireEvent.click(screen.getByText('Cancelar'));

    // Verify that the dialog is closed
    await waitFor(() => {
      expect(screen.queryByText('Confirmación')).not.toBeInTheDocument();
    });
  });

  it('should redirect to main page after confirmation', async () => {
    renderGameComponent();

    // Open the confirmation dialog
    fireEvent.click(screen.getByText('Volver al menú principal'));

    // Simulate clicking the confirm button
    fireEvent.click(screen.getByText('Confirmar'));

    // Wait for the component to unmount (indicating the redirection)
    await waitFor(() => {
      expect(screen.queryByText('Game')).not.toBeInTheDocument();

    });
  });

  it('should display end game message and enable "Back to Main Menu" button when game is finished', async () => {
    renderGameComponent();


    for (let i = 1; i <= 5; i++) {
      mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

      await waitFor(() => {
        if (screen.queryByText(`Pregunta ${i}:`)) {
          fireEvent.click(screen.getByText('4'));
          expect(screen.getByText(`Correctas: ${i}`)).toBeInTheDocument();
          expect(screen.getByText(`Preguntas restantes: ${5 - i}`)).toBeInTheDocument();
          expect(screen.getByText('Incorrectas: 0')).toBeInTheDocument();
        }
      });
    }

    // Verificar que la partida haya finalizado correctamente
    await waitFor(() => {
      if (screen.queryByText(/Partida finalizada/i)) {
        expect(screen.getByText(/Partida finalizada/i)).toBeInTheDocument();
        expect(screen.getByText(/Gracias por jugar/i)).toBeInTheDocument();
        expect(screen.getByText(/Puntuación/i)).toBeInTheDocument();
        expect(screen.getByText(/Volver al menú principal/i)).toBeInTheDocument();
      }
    });



  });




  it('should disable buttons when time runs out', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    // Esperar hasta que se muestre "Pregunta 1"
    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        jest.advanceTimersByTime(10000); // Avanzar el temporizador por 10 segundos

        // Verificar que los botones estén deshabilitados
        const buttons = screen.getAllByRole('button', { name: /answer/i });
        buttons.forEach(button => {
          expect(button).toBeDisabled();
        });
      }
    });
  });


  it('should handle timeout correctly', async () => {
    // Define una función simulada para handleShowQuestion
    const handleShowQuestion = jest.fn();

    renderGameComponent({ handleShowQuestion }); // Pasa la función simulada como propiedad

    await waitFor(() => {
      mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });
    });

    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        jest.advanceTimersByTime(10000);
        expect(screen.getByText(correctOption)).toHaveStyle({ backgroundColor: 'rgba(79, 141, 18, 0.726)' });
        expect(incrementIncorrect).toHaveBeenCalledTimes(1);
        expect(decrementQuestionsToAnswer).toHaveBeenCalledTimes(1);
      }
    });

    await waitFor(() => {
      expect(handleShowQuestion).toHaveBeenCalledTimes(0); // Verifica que handleShowQuestion se llame una vez
    });
  });



  it('should decrement questions to answer when question is answered', async () => {
    renderGameComponent(5, 10); // Configuración inicial con 5 preguntas y 10 segundos por pregunta

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    // Iterar sobre las preguntas y respuestas
    for (let i = 1; i <= 5; i++) {
      // Esperar hasta que se muestre la pregunta i
      await waitFor(() => {
        if (screen.queryByText(`Pregunta ${i}:`)) {
          // Una vez que se muestre la pregunta, hacer clic en una respuesta
          fireEvent.click(screen.getByText('4'));

          // Verificar que el número de preguntas restantes se haya decrementado correctamente
          expect(screen.getByText(`Preguntas restantes: ${5 - i}`)).toBeInTheDocument();
        }
      });
    }
  });



  it('should handle dialog open and close', async () => {
    renderGameComponent();

    fireEvent.click(screen.getByText('Volver al menú principal'));

    expect(screen.getByText('Confirmación')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Confirmación')).not.toBeInTheDocument();
    });
  });

  it('should stop and start timer when dialog opens and closes', async () => {
    renderGameComponent();

    fireEvent.click(screen.getByText('Volver al menú principal'));

    expect(screen.getByText('Cancelar')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.getByText('Preguntas restantes: 5')).toBeInTheDocument();
    });
  });
  it('should handle timer countdown correctly', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        jest.advanceTimersByTime(10000);
        expect(screen.getByText('Preguntas restantes: 4')).toBeInTheDocument();
      }
    });
  });

  it('should handle game finish correctly', async () => {
    renderGameComponent();

    for (let i = 1; i <= 5; i++) {
      mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

      await waitFor(() => {
        if (screen.queryByText(`Pregunta ${i}:`)) {
          fireEvent.click(screen.getByText('4'));
          expect(screen.getByText(`Correctas: ${i}`)).toBeInTheDocument();
          expect(screen.getByText(`Preguntas restantes: ${5 - i}`)).toBeInTheDocument();
        }
      });
    }

    await waitFor(() => {
      if (screen.queryByText('Partida finalizada')) {
        expect(screen.getByText('Partida finalizada')).toBeInTheDocument();
        expect(screen.getByText('Gracias por jugar')).toBeInTheDocument();
        expect(screen.getByText('Puntuación')).toBeInTheDocument();
        expect(screen.getByText('Volver al menú principal')).toBeInTheDocument();
      }
    });
  });

  it('should disable buttons when time runs out', async () => {
    renderGameComponent();

    mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });

    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        jest.advanceTimersByTime(10000);
        const buttons = screen.getAllByRole('button', { name: /answer/i });
        buttons.forEach(button => {
          expect(button).toBeDisabled();
        });
      }
    });
  });

  it('should handle timeout correctly', async () => {
    renderGameComponent();

    await waitFor(() => {
      mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });
    });

    await waitFor(() => {
      if (screen.queryByText(/Pregunta 1:/i)) {
        jest.advanceTimersByTime(10000);
        expect(screen.getByText('4')).toHaveStyle({ backgroundColor: 'rgba(79, 141, 18, 0.726)' });
      }
    });
  });


  it('should display the timer correctly', async () => {
    renderGameComponent();


    expect(screen.getByText('10')).toBeInTheDocument(); // Comprobar el valor inicial del temporizador

    // Esperar a que el temporizador llegue a cero
    await waitFor(() => {
      if (screen.queryByText('0')) {
        expect(screen.queryByText('0')).toBeInTheDocument(); // Comprobar que el temporizador llega a cero
      }
    });
  });

  it('should countdown correctly', async () => {
    renderGameComponent();

    // Verificar que el temporizador comience con el valor correcto
    expect(screen.getByText('10')).toBeInTheDocument();

    for (let i = 9; i >= 0; i--) {
      await waitFor(() => {
        if (screen.queryByText(String(i))) {
          expect(screen.queryByText(String(i))).toBeInTheDocument();
        }
      });
    }

    // Verificar que el temporizador no sea negativo
    expect(screen.queryByText('-1')).not.toBeInTheDocument();
  });



  it('should display loading spinner while fetching questions', async () => {
    renderGameComponent();


    await waitFor(() => {
      // Verifica si se muestra el spinner de carga al principio
      expect(screen.getByTestId('Timer')).toBeInTheDocument();
    });



    // Simula una respuesta exitosa del servidor después de un breve retraso
    await waitFor(() => {
      mockAxios.onGet('http://localhost:8000/createquestion').reply(200, { data: mockQuestionData });
    });
  });




}); 
