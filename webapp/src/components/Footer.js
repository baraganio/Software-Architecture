import React from 'react';
import './Footer.css'; // Importa el archivo de estilos CSS
import { Toolbar } from '@mui/material';

const Footer = () => {
    return (
        <div className="footer footer-wiq">
            <Toolbar>
                <p className='footer-text'>
                    © {new Date().getFullYear()} Hecho con ❤️ por <a href="https://github.com/coral2742">Coral</a>, <a href="https://github.com/baraganio">Carlos</a>, <a href="https://github.com/uo264915">Pablo</a> y <a href="https://github.com/UO290054">Raymond</a>. ASW - Curso 2023-24
                </p>
            </Toolbar>
        </div>
    );
};

export default Footer;
