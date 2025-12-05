import React, { useState } from 'react'

const CartPage = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onGoHome, onCheckout }) => {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [shippingExpanded, setShippingExpanded] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'DESCUENTO10') {
      setAppliedCoupon({ code: couponCode, discount: 0.1 })
      alert('¡Cupón aplicado! 10% de descuento')
      setCouponCode('')
    } else if (couponCode.trim() === '') {
      alert('Por favor ingresa un código de cupón')
    } else {
      alert('Cupón inválido')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0
  const shipping = 0
  const total = subtotal - discount + shipping

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <h1 className="cart-page-title">Carrito de compras</h1>

        {cartItems.length === 0 ? (
          <div className="cart-page-empty">
            <i className="fas fa-shopping-cart"></i>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar tu compra</p>
            <button className="btn-continue-shopping" onClick={onGoHome}>
              <i className="fas fa-arrow-left"></i>
              Continuar comprando
            </button>
          </div>
        ) : (
          <div className="cart-page-content">
            <div className="cart-page-items">
              <div className="cart-table-header">
                <div className="header-product">Detalle de producto</div>
                <div className="header-quantity">Cantidad</div>
                <div className="header-subtotal">Subtotal</div>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-page-item">
                    <div className="item-product">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Sin+imagen'
                        }}
                      />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-price">{formatPrice(item.price)}</p>
                        {item.sku && <p className="item-sku">SKU: {item.sku}</p>}
                      </div>
                    </div>

                    <div className="item-quantity">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn-page"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="qty-input-page"
                      />
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn-page"
                      >
                        +
                      </button>
                    </div>

                    <div className="item-subtotal">
                      <span className="subtotal-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="btn-remove-item"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <div className="coupon-section">
                  <input
                    type="text"
                    placeholder="Código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    className="coupon-input"
                  />
                  <button onClick={handleApplyCoupon} className="btn-apply-coupon">
                    Aplicar
                  </button>
                </div>

                <button onClick={onClearCart} className="btn-clear-cart">
                  VACIAR EL CARRITO
                </button>
              </div>
            </div>

            <div className="cart-page-summary">
              <h2>Resumen</h2>

              <div className="summary-section">
                <button
                  className="shipping-toggle"
                  onClick={() => setShippingExpanded(!shippingExpanded)}
                >
                  <span>Costo de envío estimado</span>
                  <i className={`fas fa-chevron-${shippingExpanded ? 'up' : 'down'}`}></i>
                </button>
                {shippingExpanded && (
                  <div className="shipping-info">
                    <p>Envío gratis para compras en tiendas de Santiago - Power Play</p>
                  </div>
                )}
              </div>

              <div className="summary-line">
                <span>Subtotal</span>
                <span className="summary-value">{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="summary-line discount">
                  <span>Descuento ({appliedCoupon.code})</span>
                  <span className="summary-value">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="summary-line shipping">
                <span>Envío (Despacho a tiendas de Stgo - Power Play)</span>
                <span className="summary-value">{shipping === 0 ? '$0' : formatPrice(shipping)}</span>
              </div>

              <div className="summary-total">
                <span>Total compra</span>
                <span className="total-value">{formatPrice(total)}</span>
              </div>

              <button
                className="btn-checkout-page"
                onClick={onCheckout}
              >
                COMPRAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage