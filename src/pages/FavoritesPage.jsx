import React from 'react'
import ProductGrid from '../components/Products/ProductGrid'
import '../styles/favorites.css'

const FavoritesPage = ({ favorites = [], onAddToCart, onViewProduct, onRemoveFavorite, onGoHome }) => {
  const handleFavoriteToggle = (product) => {
    if (onRemoveFavorite) {
      onRemoveFavorite(product.id)
    }
  }

  return (
    <div className="favorites-shell">
      <header className="favorites-hero">
        <div>
          <p>Tu colección personal</p>
          <h1>♥ Tus Favoritos</h1>
          <p>{favorites.length} producto(s) listos para la próxima partida</p>
        </div>
        <button type="button" onClick={onGoHome}>Volver al catálogo</button>
      </header>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>No tienes productos favoritos aún.</p>
          <button type="button" onClick={onGoHome}>Explorar productos</button>
        </div>
      ) : (
        <ProductGrid
          products={favorites}
          onAddToCart={onAddToCart}
          onViewProduct={onViewProduct}
          onAddToFavorite={handleFavoriteToggle}
          favorites={favorites}
          title="Tus favoritos"
          subtitle="Tu loadout personalizado"
        />
      )}
    </div>
  )
}

export default FavoritesPage
