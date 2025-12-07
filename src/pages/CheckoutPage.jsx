import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/checkout.css'

const CheckoutPage = ({ cartItems, onGoHome, onClearCart }) => {
  const { user, createOrder } = useContext(AuthContext)
  const [step, setStep] = useState('details') // 'details', 'payment', 'confirmation'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    transferenceConfirmed: false,
    transactionId: ''
  })
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [orderSnapshot, setOrderSnapshot] = useState(null)
  const [orderCreated, setOrderCreated] = useState(null)
  const [orderError, setOrderError] = useState('')

  const BANK_DATA = {
    bank: 'Banco De Chile',
    accountHolder: 'Power Play Gaming SPA',
    accountNumber: '1234567890',
    routingNumber: '16006001',
    accountType: 'Cuenta Corriente',
    currency: 'CLP'
  }

  const SHIPPING_COST = 5000
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + SHIPPING_COST

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateStep = () => {
    if (step === 'details') {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
        alert('Por favor completa todos los campos')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        alert('Email inválido')
        return false
      }
      return true
    }

    if (step === 'payment') {
      if (!formData.transferenceConfirmed) {
        alert('Debe confirmar que realizó la transferencia')
        return false
      }
      if (!formData.transactionId) {
        alert('Por favor ingresa el ID de la transferencia')
        return false
      }
      return true
    }

    return true
  }

  const handleNextStep = async () => {
    if (!validateStep()) return

    if (step === 'details') {
      setStep('payment')
      return
    }

    if (step === 'payment') {
      if (!user || !createOrder) {
        alert('Debes iniciar sesión para completar tu compra')
        return
      }

      try {
        setCreatingOrder(true)
        setOrderError('')

        const payload = {
          status: 'Pendiente',
          cartItems,
          formData,
          subtotal,
          shipping: SHIPPING_COST,
          total
        }

        const snapshot = {
          items: cartItems.map(item => ({ ...item })),
          subtotal,
          shipping: SHIPPING_COST,
          total,
          formData: { ...formData }
        }

        const createdOrder = await createOrder(payload)
        setOrderSnapshot(snapshot)
        setOrderCreated(createdOrder)
        setStep('confirmation')
        onClearCart()
      } catch (error) {
        console.error('No se pudo crear la orden', error)
        setOrderError(error.message)
        alert('No pudimos crear tu orden: ' + error.message)
      } finally {
        setCreatingOrder(false)
      }
    }
  }

  const handlePrevStep = () => {
    if (step === 'payment') {
      setStep('details')
    } else if (step === 'confirmation') {
      setStep('payment')
    }
  }

  const handleFinishCheckout = () => {
    onGoHome()
    setStep('details')
    setOrderSnapshot(null)
    setOrderCreated(null)
    setFormData(prev => ({
      ...prev,
      transferenceConfirmed: false,
      transactionId: ''
    }))
  }

  return (
    <div className="checkout-page">
      {/* HEADER */}
      <div className="checkout-header">
        <h1>💳 Finalizar Compra</h1>
        <div className="checkout-steps">
          <div className={`step ${step === 'details' ? 'active' : step !== 'details' ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <p>Datos</p>
          </div>
          <div className={`step-line ${step !== 'details' ? 'completed' : ''}`}></div>
          <div className={`step ${step === 'payment' ? 'active' : step === 'confirmation' ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <p>Pago</p>
          </div>
          <div className={`step-line ${step === 'confirmation' ? 'completed' : ''}`}></div>
          <div className={`step ${step === 'confirmation' ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <p>Confirmación</p>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        {/* CONTENIDO PRINCIPAL */}
        <div className="checkout-content">
          {/* PASO 1: DATOS */}
          {step === 'details' && (
            <div className="checkout-form">
              <h2>Datos de Entrega</h2>
              <form>
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+56912345678"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle Principal 123, Depto 4B"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Santiago"
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="8320000"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={onGoHome}>
                    ← Volver al Carrito
                  </button>
                  <button type="button" className="btn-next" onClick={handleNextStep}>
                    Continuar al Pago →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PASO 2: PAGO */}
          {step === 'payment' && (
            <div className="checkout-payment">
              <h2>Realizar Transferencia Bancaria</h2>

              <div className="bank-info">
                <h3>📋 Datos Bancarios</h3>
                <div className="bank-details">
                  <div className="detail-row">
                    <span className="label">Banco:</span>
                    <span className="value">{BANK_DATA.bank}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Titulare Cuenta:</span>
                    <span className="value">{BANK_DATA.accountHolder}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Número de Cuenta:</span>
                    <span className="value highlight">{BANK_DATA.accountNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Routing Number:</span>
                    <span className="value">{BANK_DATA.routingNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tipo de Cuenta:</span>
                    <span className="value">{BANK_DATA.accountType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Moneda:</span>
                    <span className="value">{BANK_DATA.currency}</span>
                  </div>
                </div>

                <div className="important-box">
                  <p>💡 <strong>Importante:</strong> Realiza una transferencia del total de <strong>${total.toLocaleString('es-CL')}</strong> a la cuenta bancaria anterior. Usa tu nombre completo como referencia.</p>
                </div>
              </div>

              <div className="transfer-confirmation">
                <h3>✓ Confirmar Transferencia</h3>
                <div className="form-group">
                  <label>ID o Referencia de la Transferencia</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Ej: TRF-20241024-001234"
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="confirmTransfer"
                    name="transferenceConfirmed"
                    checked={formData.transferenceConfirmed}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="confirmTransfer">
                    ✓ Confirmo que realicé la transferencia bancaria por ${total.toLocaleString('es-CL')}
                  </label>
                </div>

                {orderError && <p className="payment-error">⚠️ {orderError}</p>}

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={handlePrevStep}>
                    ← Volver
                  </button>
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleNextStep}
                    disabled={creatingOrder}
                  >
                    {creatingOrder ? 'Creando orden...' : 'Confirmé la transferencia →'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: CONFIRMACIÓN */}
          {step === 'confirmation' && (
            <div className="checkout-confirmation">
              <div className="success-icon">✓</div>
              <h2>¡Orden Confirmada!</h2>
              <p>Tu orden ha sido registrada y está pendiente de confirmación de pago.</p>

              <div className="order-details">
                <h3>📦 Detalles de la Orden</h3>
                {orderCreated?.id && (
                  <p className="order-code">ID de orden: <strong>{orderCreated.id}</strong></p>
                )}
                <p className="confirmation-note">
                  Gracias por tu compra. Tu pago está siendo verificado.
                </p>
                <div className="detail-section">
                  <h4>Productos:</h4>
                  <div className="order-items">
                    {(orderSnapshot?.items || cartItems).map(item => (
                      <div key={item.id} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${(orderSnapshot?.subtotal ?? subtotal).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span>${(orderSnapshot?.shipping ?? SHIPPING_COST).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="summary-row total">
                      <span>TOTAL:</span>
                      <span>${(orderSnapshot?.total ?? total).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Datos de Entrega:</h4>
                  <p><strong>{orderSnapshot?.formData?.fullName || formData.fullName}</strong></p>
                  <p>{orderSnapshot?.formData?.address || formData.address}</p>
                  <p>
                    {orderSnapshot?.formData?.city || formData.city}, {orderSnapshot?.formData?.postalCode || formData.postalCode}
                  </p>
                  <p>Teléfono: {orderSnapshot?.formData?.phone || formData.phone}</p>
                  <p>Email: {orderSnapshot?.formData?.email || formData.email}</p>
                </div>

                <div className="detail-section">
                  <h4>Información de Pago:</h4>
                  <p>
                    Transferencia Bancaria ID: <strong>{orderSnapshot?.formData?.transactionId || formData.transactionId}</strong>
                  </p>
                  <p>Estado: <span className="status-pending">⏳ Pendiente de Confirmación</span></p>
                </div>

                <div className="notification-box">
                  <p>
                    📧 Se ha enviado un email de confirmación a
                    <strong>{orderSnapshot?.formData?.email || formData.email}</strong>
                  </p>
                  <p>🔔 Te notificaremos cuando recibamos tu transferencia</p>
                </div>

                <button type="button" className="btn-finish" onClick={handleFinishCheckout}>
                  ✓ Volver a la tienda
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RESUMEN LATERAL */}
        <div className="checkout-summary">
          <h3>📋 Resumen</h3>

          <div className="summary-items">
            {(orderSnapshot?.items || cartItems).map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Cantidad: {item.quantity}</p>
                  <p className="item-price">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${(orderSnapshot?.subtotal ?? subtotal).toLocaleString('es-CL')}</span>
            </div>
            <div className="total-row">
              <span>Envío:</span>
              <span>${(orderSnapshot?.shipping ?? SHIPPING_COST).toLocaleString('es-CL')}</span>
            </div>
            <div className="total-row final">
              <span>TOTAL:</span>
              <span>${(orderSnapshot?.total ?? total).toLocaleString('es-CL')}</span>
            </div>
          </div>

          <div className="shipping-info">
            <p>✓ Envío gratis a tiendas de Santiago</p>
            <p>⏱️ Entrega en 2-3 días hábiles</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
