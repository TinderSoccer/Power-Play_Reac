import React from 'react'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Calcular subtotal (precio * cantidad)
  const subtotal = item.price * item.quantity

  // Aumentar cantidad
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  // Disminuir cantidad
  const handleDecrease = () => {
    onUpdateQuantity(item.id, item.quantity - 1)
  }

  // Eliminar producto
  const handleRemove = () => {
    onRemove(item.id)
  }

  return (
    <div className="cart-item">
      {/* Imagen */}
      <div className="cart-item-image">
        <img 
          src={item.image} 
          alt={item.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80?text=Sin+imagen'
          }}
        />
      </div>

      {/* Información */}
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
      </div>

      {/* Controles de cantidad */}
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button 
            className="qty-btn"
            onClick={handleDecrease}
            aria-label="Disminuir cantidad"
          >
            <i className="fas fa-minus"></i>
          </button>
          
          <span className="quantity-display">{item.quantity}</span>
          
          <button 
            className="qty-btn"
            onClick={handleIncrease}
            aria-label="Aumentar cantidad"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        {/* Subtotal */}
        <div className="cart-item-subtotal">
          {formatPrice(subtotal)}
        </div>

        {/* Botón eliminar */}
        <button 
          className="remove-btn"
          onClick={handleRemove}
          aria-label="Eliminar producto"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  )
}

export default CartItem