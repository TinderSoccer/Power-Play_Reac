import React, { useState, useEffect } from 'react'
import '../styles/ProductDetail.css'

const ProductDetailPage = ({ 
  product, 
  onGoHome, 
  onAddToCart, 
  onAddToFavorite, 
  isFavorite
}) => {
  const [selectedImage, setSelectedImage] = useState(() => {
    // Inicializar con la imagen principal del producto
    // Esto asegura que siempre hay una imagen visible
    return product?.image || '/imagenes/placeholder.png'
  })
  const [quantity, setQuantity] = useState(1)
  const [showStores, setShowStores] = useState(false)

  // GALERÍA DINÁMICA: Generada automáticamente por convención de nombres
  // Patrón: /imagenes/{productId}_1.ext, {productId}_2.ext, etc.
  const getProductGallery = () => {
    if (!product) return []
    
    // Opción 1: Si el producto tiene array explícito de imágenes, úsalo
    if (product.images && Array.isArray(product.images)) {
      return product.images
    }
    
 
    const specialCases = {
      'ps5-standar': [
        '/imagenes/ps5-standar2.avif',
        '/imagenes/ps5_standar3.avif',
        '/imagenes/ps5_standar4.avif',
        '/imagenes/ps5_standar5.avif'
      ]
    }
    
    if (specialCases[product.id]) {
      return specialCases[product.id]
    }
    
    // Opción 2: Generar automáticamente basado en convención de nombres
    // Intenta cargar hasta 4 imágenes siguiendo patrón: {id}_1, {id}_2, {id}_3, {id}_4
    // Nota: Genera los paths - el navegador validará con 404 y onError fallback
    const autoGenerateGallery = (baseId) => {
      const gallery = []
      
      // Construir paths para 1-4 imágenes
      // Convención: {productId}_1.png, {productId}_2.png, etc.
      // El navegador usará onError si la imagen no existe
      for (let i = 1; i <= 4; i++) {
        const imagePath = `/imagenes/${baseId}_${i}.png`
        gallery.push(imagePath)
      }
      return gallery
    }
    
    // Generar galería automática
    const autoGallery = autoGenerateGallery(product.id)
    
    // Validar que tenga al menos imágenes
    return autoGallery.length > 0 ? autoGallery : [product.image, product.image, product.image, product.image]
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if (product) {
      const gallery = getProductGallery()
      if (gallery.length > 0) {
        setSelectedImage(gallery[0])
      } else {
        setSelectedImage(product.image)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  if (!product) {
    return (
      <div className="product-not-found">
        <div>
          <h2>Producto no encontrado</h2>
          <button onClick={onGoHome} className="btn-back-home">
            ← Volver a la tienda
          </button>
        </div>
      </div>
    )
  }

  const gallery = getProductGallery()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    const productWithQuantity = {
      ...product,
      quantity: quantity
    }
    onAddToCart(productWithQuantity)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1)
  }

  const stores = [
    { name: 'Power Play Santiago Centro', stock: 'Disponible' },
    { name: 'Power Play Mall Costanera', stock: 'Disponible' },
    { name: 'Power Play Providencia', stock: 'Pocas unidades' },
    { name: 'Power Play Las Condes', stock: 'No disponible' }
  ]

  const highlightBadges = [
    'Entrega en 48 hrs en RM',
    'Retiro gratis en tienda',
    'Garantía oficial 12 meses'
  ]

  const categoryFeatures = {
    consolas: ['Incluye control original', 'Compatible con streaming 4K', 'Wi-Fi 6 listo para eSports'],
    accesorios: ['Material premium resistente', 'Compatibilidad multi plataforma', 'Listo para sesiones extensas'],
    videojuegos: ['Audio 3D optimizado', 'Actualizaciones constantes', 'Multiplayer global'],
    'juegos-mesa': ['Componentes de alta calidad', 'Reglamento en español', 'Experiencia cooperativa']
  }

  const featureList = categoryFeatures[product.category] || ['Soporte técnico prioritario', 'Pago seguro en línea', 'Stock garantizado']

  const specTiles = [
    { label: 'Categoría', value: product.category },
    { label: 'SKU', value: product.sku || 'Pendiente' },
    { label: 'Estado', value: 'Nuevo / Sellado' },
    { label: 'Disponibilidad', value: 'Despacho nacional' }
  ]

  const extraPanels = [
    {
      title: 'Incluye',
      items: product.category === 'consolas'
        ? ['Cable HDMI 2.1', 'Cable de poder', 'Manual rápido']
        : ['Guía digital', 'Asistencia remota', 'Tracking de pedidos']
    },
    {
      title: 'Beneficios Power Play',
      items: ['Puntos acumulables en cada compra', 'Soporte vía WhatsApp 24/7', 'Extensión de garantía opcional']
    }
  ]

  const handlePrevImage = () => {
    const currentIndex = gallery.indexOf(selectedImage)
    const prevIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1
    setSelectedImage(gallery[prevIndex])
  }

  const handleNextImage = () => {
    const currentIndex = gallery.indexOf(selectedImage)
    const nextIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1
    setSelectedImage(gallery[nextIndex])
  }

  return (
    <div className="product-detail-page-weplay">
      <div className="detail-main-container">
        {/* COLUMNA 1: GALERÍA DE IMÁGENES */}
        <div className="detail-gallery-weplay">
          <div className="main-image-weplay">
            <button 
              className="gallery-arrow gallery-arrow-left"
              onClick={handlePrevImage}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            
            <img 
              src={selectedImage} 
              alt={product.name}
              onError={(e) => {
                e.target.src = product.image || 'https://via.placeholder.com/500x500?text=Sin+imagen'
              }}
            />
            
            <button 
              className="gallery-arrow gallery-arrow-right"
              onClick={handleNextImage}
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </div>
          <div className="thumbnails-weplay">
            {gallery.map((img, index) => (
              <button
                key={index}
                className={`thumbnail-weplay ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img} 
                  alt={`Vista ${index + 1}`}
                  onError={(e) => {
                    e.target.src = product.image || 'https://via.placeholder.com/100x100?text=Imagen'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* COLUMNA 2: INFORMACIÓN DEL PRODUCTO */}
        <div className="detail-info-weplay">
          {/* TÍTULO */}
          <h1 className="product-title-weplay">{product.name}</h1>

          {/* DROPDOWN DE TIENDAS */}
          <div className="stores-section">
            <button 
              className="stores-dropdown-btn"
              onClick={() => setShowStores(!showStores)}
            >
              <span className="store-icon-text">🏪 VER DISPONIBILIDAD EN TIENDAS</span>
              <span className={`dropdown-arrow ${showStores ? 'open' : ''}`}>▼</span>
            </button>

            {showStores && (
              <div className="stores-dropdown-list">
                {stores.map((store, idx) => (
                  <div key={idx} className="store-row">
                    <span className="store-name-text">{store.name}</span>
                    <span className={`store-status ${
                      store.stock === 'Disponible' ? 'available' : 
                      store.stock === 'Pocas unidades' ? 'low' : 'unavailable'
                    }`}>
                      {store.stock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* PRECIO Y SKU */}
        <div className="price-sku-section">
          <div className="product-price-weplay">{formatPrice(product.price)}</div>
          <div className="product-sku-weplay">SKU#: {product.sku}</div>
        </div>

          <div className="detail-highlights">
            {highlightBadges.map(badge => (
              <span key={badge} className="highlight-chip">{badge}</span>
            ))}
          </div>

          <div className="detail-meta-grid">
            {specTiles.map(tile => (
              <div key={tile.label} className="meta-tile">
                <span>{tile.label}</span>
                <strong>{tile.value}</strong>
              </div>
            ))}
          </div>

          {/* CANTIDAD, AGREGAR Y FAVORITO */}
          <div className="actions-row">
            <div className="quantity-box">
              <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={incrementQuantity}>+</button>
            </div>

            <button className="btn-add-to-cart-weplay" onClick={handleAddToCart}>
              AGREGAR AL CARRO
            </button>

            <button
              className={`btn-fav-weplay ${isFavorite ? 'active' : ''}`}
              onClick={() => onAddToFavorite(product)}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          </div>

          <div className="feature-list">
            <strong>Características clave:</strong>
            <ul>
              {featureList.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* COMPARTIR EN REDES */}
          <div className="share-weplay">
            <p>Comparte este producto en redes sociales</p>
            <div className="social-buttons">
              <button className="social-fb">f</button>
              <button className="social-tw">𝕏</button>
              <button className="social-wa">W</button>
            </div>
          </div>
        </div>

        {/* COLUMNA 3: BENEFICIOS (SIDEBAR DERECHO) */}
        <div className="benefits-column">
          <div className="benefit-card">
            <div className="benefit-icon-weplay">🚚</div>
            <div className="benefit-content">
              <strong>REALIZAMOS DESPACHOS A TODO CHILE</strong>
              <p>REVISA NUESTROS TIEMPOS DE ENTREGA <span className="link-text">AQUÍ</span></p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-weplay">✓</div>
            <div className="benefit-content">
              <strong>COMPRA 100% SEGURA Y GARANTIZADA</strong>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-weplay">💬</div>
            <div className="benefit-content">
              <strong>SOPORTE ONLINE Y ATENCIÓN PERSONALIZADA</strong>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="description-weplay">
        <h2>DESCRIPCIÓN</h2>
        <div className="description-text">
          <h3>{product.name}</h3>
          <p>
            Producto de alta calidad para gaming. 
            {product.category === 'consolas' 
              ? ' Consola de última generación con rendimiento superior.'
              : ' Especificaciones disponibles al contactar. Ideal para gamers profesionales.'
            }
          </p>
        </div>
      </div>

      <div className="detail-extra-panels">
        {extraPanels.map(panel => (
          <div key={panel.title} className="extra-card">
            <h4>{panel.title}</h4>
            <ul>
              {panel.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetailPage
