import React from 'react'
import '../styles/products-grid.css'

const FavoritesPage = ({ favorites, onAddToCart, onViewProduct, onRemoveFavorite, onGoHome }) => {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, rgba(30,144,255,.2), rgba(57,255,20,.1))',
        padding: '40px 20px',
        marginBottom: '40px',
        borderBottom: '2px solid #00ff66'
      }}>
        <h1 style={{
          color: '#00ff66',
          fontSize: '2.5rem',
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(0, 255, 102, 0.3)'
        }}>
          ♥ Mis Productos Favoritos
        </h1>
        <p style={{
          color: '#888',
          fontSize: '1.1rem',
          marginBottom: '1rem'
        }}>
          {favorites.length} producto{favorites.length !== 1 ? 's' : ''} marcado{favorites.length !== 1 ? 's' : ''} como favorito
        </p>
        <button
          onClick={onGoHome}
          style={{
            background: '#00ff66',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Volver a la tienda
        </button>
      </div>

      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#888'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            No tienes productos favoritos aún 😢
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
        <div style={{ padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '30px',
            width: '100%'
          }}>
            {favorites.map((product) => (
              <div
                key={product.id}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid #1f1f1f',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.borderColor = '#00ff66'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(57, 255, 20, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#1f1f1f'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '220px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '15px'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'
                    }}
                  />
                </div>

                <div style={{
                  padding: '15px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    color: '#d3d3d3',
                    fontWeight: '500',
                    lineHeight: '1.3',
                    flex: 1,
                    minHeight: '2.6rem'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: '1.5rem',
                    color: '#00ff66',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
                  }}>
                    ${product.price.toLocaleString('es-CL')}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart(product)
                      }}
                      style={{
                        flex: 1,
                        background: '#00ff66',
                        color: '#000',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#00cc52'
                        e.target.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#00ff66'
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      🛒 Agregar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveFavorite(product.id)
                      }}
                      style={{
                        width: '45px',
                        background: 'rgba(255, 0, 0, 0.2)',
                        border: '2px solid #ff0000',
                        color: '#ff0000',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 0, 0, 0.3)'
                        e.target.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 0, 0, 0.2)'
                        e.target.style.transform = 'scale(1)'
                      }}
                      title="Remover de favoritos"
                    >
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
