import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/orders.css'

const OrdersPage = ({ onGoHome }) => {
  const { user, getUserOrders } = useContext(AuthContext)

  if (!user) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Debes iniciar sesión para ver tus compras</h2>
          <button
            onClick={onGoHome}
            style={{
              background: '#00ff66',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    )
  }

  const userOrders = getUserOrders ? getUserOrders() : []

  return (
    <div className="orders-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <h1 style={{ color: '#00ff66', fontSize: '1.8rem', margin: 0 }}>📦 Mis Compras</h1>
        <button
          onClick={onGoHome}
          style={{
            background: '#333',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Volver
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingBottom: '50px' }}>
        <div style={{ background: '#0f0f0f', padding: '20px', borderRadius: '8px', marginBottom: '20px', borderLeft: '3px solid #00ff66' }}>
          <p style={{ color: '#ddd', margin: 0 }}>
            <strong>Usuario:</strong> {user.name} ({user.email})
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#0f0f0f',
            borderRadius: '8px',
            border: '1px solid #333'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '20px' }}>
              No tienes compras aún 😢
            </p>
            <button
              onClick={onGoHome}
              style={{
                background: '#00ff66',
                color: '#000',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {userOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ color: '#888', marginBottom: '5px' }}>ID Orden</p>
                    <p style={{ color: '#00ff66', fontWeight: 'bold', fontSize: '0.9rem' }}>{order.id}</p>
                  </div>
                  <div>
                    <p style={{ color: '#888', marginBottom: '5px' }}>Fecha</p>
                    <p style={{ color: '#ddd', fontWeight: 'bold' }}>
                      {new Date(order.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#888', marginBottom: '5px' }}>Estado</p>
                    <p style={{ color: '#ffa500', fontWeight: 'bold' }}>
                      <span style={{ background: 'rgba(255, 165, 0, 0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                        ⏳ {order.status || 'Pendiente'}
                      </span>
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                  <h4 style={{ color: '#00ff66', marginBottom: '15px' }}>Productos</h4>
                  <div className="order-items">
                    {order.cartItems?.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'contain',
                              background: 'rgba(0, 255, 102, 0.05)',
                              padding: '5px',
                              borderRadius: '4px'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ color: '#ddd', margin: 0, fontWeight: '500' }}>{item.name}</p>
                            <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <p style={{ color: '#00ff66', fontWeight: 'bold', margin: 0 }}>
                          ${(item.price * item.quantity).toLocaleString('es-CL')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <h4 style={{ color: '#00ff66', marginBottom: '10px' }}>Dirección de Entrega</h4>
                      <div style={{ color: '#ddd', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        <p style={{ margin: '0 0 5px 0' }}><strong>{order.formData?.fullName}</strong></p>
                        <p style={{ margin: 0 }}>{order.formData?.address}</p>
                        <p style={{ margin: 0 }}>{order.formData?.city}, {order.formData?.postalCode}</p>
                        <p style={{ margin: '5px 0 0 0', color: '#888' }}>Tel: {order.formData?.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: '#00ff66', marginBottom: '10px' }}>Resumen</h4>
                      <div style={{ background: '#0a0a0a', padding: '10px', borderRadius: '4px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ddd', marginBottom: '5px' }}>
                          <span>Subtotal:</span>
                          <span>${order.subtotal?.toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ddd', marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                          <span>Envío:</span>
                          <span>${order.shipping?.toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff66', fontWeight: 'bold', fontSize: '1rem' }}>
                          <span>Total:</span>
                          <span>${order.total?.toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #333', paddingTop: '15px', marginTop: '15px' }}>
                  <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                    <strong>ID Transferencia:</strong> {order.formData?.transactionId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
