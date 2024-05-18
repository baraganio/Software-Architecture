import { render, screen } from '@testing-library/react';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App';

test('renders learn react link', () => {

  render(
    <Router>
      <App />
    </Router>);

  const welcomeText = screen.getByText(/Bienvenido a/i);

  const wiqText = screen.getByText(/WIQ 2024/i);

  expect(welcomeText).toBeInTheDocument();
  expect(wiqText).toBeInTheDocument();
});

