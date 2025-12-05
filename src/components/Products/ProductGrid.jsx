import React from 'react'
import '../../styles/products-grid.css'

const ProductGrid = ({ products, onAddToCart, onViewProduct, onAddToFavorite, favorites }) => {
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId)
  }

  const handleFavoriteClick = (product) => {
    if (onAddToFavorite) {
      onAddToFavorite(product)
    }
  }

  return (
    <section className="products-grid-section">
      <div className="products-grid-header">
        <h2 className="products-grid-title">🎮 Todos Nuestros Productos</h2>
        <p className="products-grid-subtitle">Descubre nuestra amplia selección de gaming</p>
        <div className="products-grid-divider"></div>
      </div>

      <div className="products-grid-wrapper">
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-grid-card"
              onClick={() => onViewProduct(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-grid-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'
                  }}
                />
              </div>

              <div className="product-grid-info">
                <h3 className="product-grid-name">{product.name}</h3>
                <p className="product-grid-price">
                  ${product.price.toLocaleString('es-CL')}
                </p>

                <div className="product-grid-actions">
                  <button
                    className="btn-grid-add"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToCart(product)
                    }}
                  >
                    🛒 Agregar
                  </button>
                  <button
                    className="btn-grid-fav"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFavoriteClick(product)
                    }}
                    title={isFavorite(product.id) ? 'Remover de favoritos' : 'Agregar a favoritos'}
                  >
                    {isFavorite(product.id) ? '♥' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
