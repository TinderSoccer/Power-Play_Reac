import React, { useState } from "react";
import "../../styles/ProductDetail.css";

const ProductDetail = ({ product, onClose, onAddToCart, onAddToFavorite, isFavorite }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);

  if (!product) return null;

  const handleFavoriteClick = () => {
    if (onAddToFavorite) {
      onAddToFavorite(product)
    }
  }

  return (
    <div className="product-detail-overlay">
      <div className="product-detail-container">
        {/* Botón Cerrar */}
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="product-detail-content">
          {/* IZQUIERDA: Imagen principal + miniaturas */}
          <div className="product-images">
            <img src={selectedImage} alt={product.name} className="main-image" />

            <div className="thumbnails">
              <img
                src={product.image}
                alt="miniatura"
                className={`thumbnail active`}
                onClick={() => setSelectedImage(product.image)}
              />
            </div>
          </div>

          {/* DERECHA: Detalles */}
          <div className="product-info">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-price">${product.price.toLocaleString("es-CL")}</p>
            <p className="product-sku">SKU: {product.sku}</p>

            <div className="product-actions">
              <button
                className="btn-add"
                onClick={() => onAddToCart(product)}
              >
                🛒 Agregar al carrito
              </button>
              <button
                className={`btn-fav ${isFavorite ? 'active' : ''}`}
                onClick={handleFavoriteClick}
                title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
              >
                {isFavorite ? '♥' : '🤍'}
              </button>
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>Producto de alta calidad para gaming. Especificaciones y características disponibles al contactar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
