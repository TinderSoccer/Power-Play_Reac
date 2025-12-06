import React from 'react'

const UserActions = ({ cartCount, onCartClick, user, onLogout, favoritesCount, onFavoritesClick, onOrdersClick, onLoginClick }) => {

  const handleCartClick = (e) => {
    e.preventDefault()
    if (onCartClick) {
      onCartClick()
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="user-actions">
      <a href="#carrito" className="action" onClick={handleCartClick}>
        <div className="icon-circle">
          <img src="/icons/carrito.png" alt="Carrito" className="icon" />
          <span
            id="cart-count"
            className={`cart-count ${cartCount > 0 ? 'show' : ''}`}
          >
            {cartCount}
          </span>
        </div>
        <span>Carrito</span>
      </a>

      {!user && (
        <a href="#login" className="action" onClick={(e) => {
          e.preventDefault()
          if (onLoginClick) {
            onLoginClick()
          }
        }}>
          <div className="icon-circle">
            <span style={{ fontSize: '1.5rem' }}>👤</span>
          </div>
          <span>Iniciar Sesión</span>
        </a>
      )}

      {user && (
        <a href="#mis-compras" className="action" onClick={(e) => {
          e.preventDefault()
          if (onOrdersClick) {
            onOrdersClick()
          }
        }}>
          <div className="icon-circle">
            <span style={{ fontSize: '1.5rem' }}>📦</span>
          </div>
          <span>Mis Compras</span>
        </a>
      )}

      {user && (
        <a href="#logout" className="action" onClick={handleLogout}>
          <div className="icon-circle">
            <span style={{ fontSize: '1.5rem' }}>🚪</span>
          </div>
          <span>Salir</span>
        </a>
      )}
    </div>
  )
}

export default UserActions
