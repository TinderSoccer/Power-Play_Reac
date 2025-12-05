import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const TopBar = ({ onStoresClick, onSignupClick, onLoginClick, onAccountClick }) => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className="top-bar thin">
      <div className="social">
        <span>Síguenos en redes sociales</span>
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      <div className="user-links">
        <a href="#tiendas" onClick={(e) => {
          e.preventDefault()
          if (onStoresClick) onStoresClick()
        }}>
          Nuestras tiendas
        </a>

        {isAuthenticated && (
          <a href="#account" onClick={(e) => {
            e.preventDefault()
            if (onAccountClick) onAccountClick()
          }}>
            Mi cuenta
          </a>
        )}
      </div>
    </div>
  )
}

export default TopBar