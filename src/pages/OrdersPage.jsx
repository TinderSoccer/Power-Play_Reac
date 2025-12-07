import React, { useContext, useMemo } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/orders.css'

const statusStyles = {
  pendiente: 'pill-pending',
  'en proceso': 'pill-processing',
  enviado: 'pill-shipped',
  completada: 'pill-completed',
  cancelada: 'pill-cancelled'
}

const OrdersPage = ({ onGoHome }) => {
  const { user, getUserOrders } = useContext(AuthContext)
  const userOrders = useMemo(() => (getUserOrders ? getUserOrders() : []), [getUserOrders])

  const formatCLP = (value) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0)

  const buildTimeline = (status = 'Pendiente') => {
    const normalized = status.toLowerCase()
    return [
      { label: 'Orden recibida', description: 'Hemos recibido tu pedido', active: true },
      {
        label: 'Procesando pago',
        description: 'Validando y preparando tus productos',
        active: ['en proceso', 'enviado', 'completada'].includes(normalized)
      },
      {
        label: 'Despachado',
        description: 'Tu compra ya salió a reparto',
        active: ['enviado', 'completada'].includes(normalized)
      },
      {
        label: 'Completado',
        description: 'Pedido entregado con éxito',
        active: normalized === 'completada'
      }
    ]
  }

  if (!user) {
    return (
      <div className="orders-shell">
        <div className="orders-hero">
          <div>
            <h1>Necesitas iniciar sesión</h1>
            <p>Accede para revisar tus compras.</p>
          </div>
          <button onClick={onGoHome}>Volver al catálogo</button>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-shell">
      <header className="orders-hero">
        <div>
          <p>Tu historial</p>
          <h1>📦 Mis Compras</h1>
          <p>{userOrders.length} pedido(s) registrado(s)</p>
        </div>
        <button onClick={onGoHome}>Volver a la tienda</button>
      </header>

      <div className="orders-info">
        <div>
          <span>Usuario</span>
          <strong>{user.name} ({user.email})</strong>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="orders-empty">
          <p>No tienes compras aún.</p>
          <button onClick={onGoHome}>Explorar productos</button>
        </div>
      ) : (
        <div className="orders-grid">
          {userOrders.map((order) => {
            const status = order.status || 'Pendiente'
            const normalizedStatus = status.toLowerCase()
            const timeline = buildTimeline(status)
            return (
              <article key={order.id} className="order-card">
                <header className="order-card-header">
                  <div>
                    <small>ID Orden</small>
                    <strong>{order.id}</strong>
                  </div>
                  <div>
                    <small>Fecha</small>
                    <strong>{new Date(order.createdAt).toLocaleDateString('es-CL')}</strong>
                  </div>
                  <div>
                    <span className={`status-pill ${statusStyles[normalizedStatus] || 'pill-pending'}`}>
                      {status}
                    </span>
                  </div>
                </header>

                <div className="order-card-grid">
                  <section className="order-section">
                    <h4>Productos</h4>
                    {order.cartItems?.map((item, idx) => (
                      <div key={`${order.id}-${idx}`} className="order-item">
                        <div className="order-item-info">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/60x60?text=IMG'
                            }}
                          />
                          <div>
                            <p>{item.name}</p>
                            <small>Cantidad: {item.quantity}</small>
                          </div>
                        </div>
                        <strong>{formatCLP(item.price * item.quantity)}</strong>
                      </div>
                    ))}
                  </section>

                  <section className="order-section">
                    <h4>Entrega</h4>
                    <div className="order-detail-row">
                      <span>Destinatario</span>
                      <strong>{order.formData?.fullName ?? '—'}</strong>
                    </div>
                    <div className="order-detail-row">
                      <span>Dirección</span>
                      <strong>{order.formData?.address ?? '—'}</strong>
                    </div>
                    <div className="order-detail-row">
                      <span>Ciudad</span>
                      <strong>{order.formData?.city ?? '—'}</strong>
                    </div>
                    <div className="order-detail-row">
                      <span>Contacto</span>
                      <strong>{order.formData?.phone ?? order.formData?.email ?? '—'}</strong>
                    </div>
                    <div className="order-detail-row">
                      <span>Total pagado</span>
                      <strong>{formatCLP(order.total)}</strong>
                    </div>
                  </section>
                </div>

                <div className="order-timeline">
                  {timeline.map((step, idx) => (
                    <div key={`${order.id}-step-${idx}`} className={`timeline-step ${step.active ? 'active' : ''}`}>
                      <span className="step-dot" />
                      <div>
                        <p>{step.label}</p>
                        <small>{step.description}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
