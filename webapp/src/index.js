import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {Route,  Routes,  MemoryRouter as Router} from "react-router-dom";
import App from './App';
import Game from './components/Game';
import HistoricalData from './components/HistoricalData';
import MainPage from './components/MainPage';
import HistoricalUserData from './components/HistoricalUserData';
import RegisteredUsers from './components/RegisteredUsers';
import ScoreBoard from './components/ScoreBoard';

import './index.css';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>}></Route>
        <Route path="/mainPage" element={<MainPage />}> </Route>
        <Route path="/game" element={<Game />}> </Route>
        <Route path="/historicaldata" element={<HistoricalData />}> </Route>
        <Route path="/historicalUserdata" element={<HistoricalUserData />}> </Route>
        <Route path="/RegisteredUsers" element={<RegisteredUsers />}> </Route>
        <Route path="/ScoreBoard" element={<ScoreBoard />}> </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
