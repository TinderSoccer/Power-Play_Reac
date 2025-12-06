import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/orders.css'

const OrdersPage = ({ onGoHome }) => {
  const { user, getUserOrders } = useContext(AuthContext)
  const userOrders = getUserOrders ? getUserOrders() : []

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
        <div className="orders-list">
          {userOrders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-summary">
                <div>
                  <small>ID Orden</small>
                  <strong>{order.id}</strong>
                </div>
                <div>
                  <small>Fecha</small>
                  <strong>{new Date(order.createdAt).toLocaleDateString('es-CL')}</strong>
                </div>
                <div>
                  <small>Estado</small>
                  <strong className="order-status">{order.status || 'Pendiente'}</strong>
                </div>
              </div>

              <div className="order-items">
                <h4>Productos</h4>
                {order.cartItems?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div>
                      <img src={item.image} alt={item.name} onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=Sin+Imagen'
                      }} />
                      <div>
                        <p>{item.name}</p>
                        <small>Cantidad: {item.quantity}</small>
                      </div>
                    </div>
                    <strong>${(item.price * item.quantity).toLocaleString('es-CL')}</strong>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div>
                  <h5>Entrega</h5>
                  <p>{order.formData?.fullName}</p>
                  <p>{order.formData?.address}</p>
                  <p>{order.formData?.city}, {order.formData?.postalCode}</p>
                </div>
                <div>
                  <h5>Total</h5>
                  <p>${order.total?.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
