import React from 'react'

const ProductCard = ({ product, onAddToCart, onViewProduct }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation() // evita abrir el detalle al apretar "Agregar"
    onAddToCart({
      ...product,
      quantity: 1
    })
  }

  const handleViewProduct = () => {
    if (onViewProduct) onViewProduct(product)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div 
      className="product-card"
      onClick={handleViewProduct}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'
          }}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{formatPrice(product.price)}</div>
        
        <button 
          className="btn-add-cart"
          onClick={handleAddToCart}
        >
          <i className="fas fa-shopping-cart"></i>
          Agregar al Carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard
