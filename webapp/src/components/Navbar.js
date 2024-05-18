import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [historialDropdownOpen, setHistorialDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const toggleHistorialDropdown = () => {
    setHistorialDropdownOpen(!historialDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate("/");
  };
  

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <a className="navbar-brd" href="/mainPage">WIQ 2024</a>
        <button className="navbar-toggler" type="button" onClick={toggleHistorialDropdown}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${historialDropdownOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/mainPage">Página principal</Link>
            </li>
            <li className={`nav-item dropdown ${historialDropdownOpen ? 'show' : ''}`} onClick={toggleHistorialDropdown}>
              <Link className="nav-link dropdown-toggle" to="#" role="button">
                Historial
              </Link>
              <div className={`dropdown-menu ${historialDropdownOpen ? 'show' : ''}`}>
                <Link className="dropdown-item" to="/historicaldata">Historial de preguntas</Link>
                <Link className="dropdown-item" to="/historicalUserdata">Historial de usuario</Link>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/RegisteredUsers">Usuarios registrados</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ScoreBoard">Ranking</Link>
            </li>
            <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
