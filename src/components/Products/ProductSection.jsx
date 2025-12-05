import React, { forwardRef } from 'react'
import ProductCard from './ProductCard'

const ProductSection = forwardRef(({ title, icon, products, onAddToCart, onViewProduct }, ref) => {
  const scrollContainerRef = React.useRef(null)

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 300
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="products-section" ref={ref}>
      <div className="section-header">
        <h2 className="section-title">
          {title} {icon}
        </h2>
        <div className="divider"></div>
      </div>

      <div className="products-carousel">
        <button
          className="products-carousel__control products-carousel__control--left"
          onClick={() => scroll('left')}
          aria-label="Scroll izquierda"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div
          className="products-carousel__scroll"
          ref={scrollContainerRef}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>

        <button
          className="products-carousel__control products-carousel__control--right"
          onClick={() => scroll('right')}
          aria-label="Scroll derecha"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  )
})

ProductSection.displayName = 'ProductSection'

export default ProductSection