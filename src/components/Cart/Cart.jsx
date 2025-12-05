import React from 'react'
import CartItem from './CartItem'

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart, onViewCart, onCheckout }) => {
  if (!isOpen) return null

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <>
      {/* Overlay para cerrar al hacer click */}
      <div className="cart-overlay" onClick={onClose}></div>
      
      {/* Modal del carrito */}
      <div className="cart-modal">
        <div className="cart-header">
          <h2>
            <i className="fas fa-shopping-cart"></i>
            Carrito de compras
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {items.length > 0 && (
          <div className="cart-total-top">
            <div className="cart-total-info">
              <span>Total carrito:</span>
              <span className="cart-total-amount">{formatPrice(total)}</span>
            </div>
            <div className="cart-item-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
          </div>
        )}

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-cart"></i>
              <p>Tu carrito está vacío</p>
              <button className="btn-continue" onClick={onClose}>
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                  />
                ))}
              </div>

              <div className="cart-footer">
                <button className="btn-checkout" onClick={() => {
                  onClose()
                  onCheckout()
                }}>
                  <i className="fas fa-credit-card"></i>
                  Comprar
                </button>
                
                <button className="btn-view-cart" onClick={onViewCart}>
                  Ver Carrito
                </button>

                <button className="btn-clear" onClick={onClearCart}>
                  <i className="fas fa-trash"></i>
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart