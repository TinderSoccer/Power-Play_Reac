import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          
          {/* Columna 1: Logos + GIF */}
          <div className="footer-column">
            <h4>Síguenos</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <img src="/icons/facebook.png" alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <img src="/icons/instagram.png" alt="Instagram" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                <img src="/icons/Twitter.png" alt="X/Twitter" />
              </a>
            </div>
            <img src="/icons/homero.gif" alt="GIF animado" className="footer-gif" />
          </div>

          {/* Columna 2: Corporativo */}
          <div className="footer-column">
            <h4>Corporativo</h4>
            <ul>
              <li><a href="#tiendas">Nuestras Tiendas</a></li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
              <li><a href="#devoluciones">Política de Devoluciones</a></li>
              <li><a href="#nosotros">Acerca de Nosotros</a></li>
            </ul>
          </div>

          {/* Columna 3: Horario / Contacto */}
          <div className="footer-column">
            <h4>Horario de Atención</h4>
            <p>Lunes a Viernes<br/>08:00 AM - 17:30 PM</p>
            <p>Email: <a href="mailto:servicio@powerplay.cl">servicio@powerplay.cl</a></p>

            <h4>Contacto</h4>
            <p>Contáctenos a través de redes sociales o al email:<br/>
              <a href="mailto:servicioalcliente@powerplay.cl">servicioalcliente@powerplay.cl</a>
            </p>
          </div>

          {/* Columna 4: Mi Cuenta */}
          <div className="footer-column">
            <h4>Mi Cuenta</h4>
            <ul>
              <li><a href="#pedidos">Historial de pedidos</a></li>
              <li><a href="#favoritos">Favoritos</a></li>
              <li><a href="#login">Mi cuenta</a></li>
            </ul>
          </div>

          {/* Columna 5: Métodos de pago */}
          <div className="footer-column">
            <h4>Métodos de Pago</h4>
            <img 
              src="/icons/pago.jpg" 
              alt="Métodos de pago" 
              className="payment-methods"
            />
          </div>

        </div>
      </footer>

      {/* Barra de derechos */}
      <div className="footer-bottom">
        <span>POWER PLAY © 2025 - Todos los derechos reservados</span>
      </div>
    </>
  )
}

export default Footer