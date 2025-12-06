import '../../styles/category-showcase.css'

const FALLBACK_CATEGORIES = [
  { slug: 'consolas', name: 'Consolas', description: 'Últimas generaciones PlayStation, Xbox y Nintendo' },
  { slug: 'accesorios', name: 'Accesorios', description: 'Headsets, controles, sillas y todo tu setup' },
  { slug: 'videojuegos', name: 'Videojuegos', description: 'Nuevos lanzamientos y clásicos imprescindibles' },
  { slug: 'juegos-mesa', name: 'Juegos de Mesa', description: 'Diversión unplugged para toda la familia' }
]

const gradients = [
  'linear-gradient(135deg, #d8e6ff, #fef3c7)',
  'linear-gradient(135deg, #fdf2f8, #e0f2fe)',
  'linear-gradient(135deg, #fce7f3, #e9d5ff)',
  'linear-gradient(135deg, #dcfce7, #e0f2fe)'
]

const CategoryShowcase = ({ categories = [], products = [], onSelect }) => {
  const normalized = (categories.length ? categories : FALLBACK_CATEGORIES).map((cat, index) => ({
    slug: cat.slug || cat.value || cat.id || `cat-${index}`,
    name: cat.name || cat.label || 'Categoría',
    description: cat.description || 'Explora los productos disponibles',
    gradient: gradients[index % gradients.length]
  }))

  const counters = products.reduce((acc, product) => {
    if (!product?.category) return acc
    const key = product.category
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const handleSelect = (slug) => {
    if (onSelect) {
      onSelect(slug)
    }
  }

  return (
    <section className="category-showcase">
      <div className="category-showcase__header">
        <div>
          <p className="eyebrow">Explorar por categoría</p>
          <h3>Organiza el catálogo a tu manera</h3>
        </div>
        <span className="category-showcase__badge">
          {normalized.length} categorías activas
        </span>
      </div>

      <div className="category-showcase__chips">
        {normalized.map((cat) => (
          <button
            key={cat.slug}
            className="category-chip"
            type="button"
            onClick={() => handleSelect(cat.slug)}
          >
            <span>{cat.name}</span>
            <small>{counters[cat.slug] || counters[cat.name?.toLowerCase()] || 0} prod.</small>
          </button>
        ))}
      </div>

      <div className="category-showcase__grid">
        {normalized.map((cat) => (
          <article key={`${cat.slug}-card`} className="category-card" style={{ backgroundImage: cat.gradient }}>
            <div className="category-card__content">
              <p className="category-card__eyebrow">Categoría</p>
              <h4>{cat.name}</h4>
              <p>{cat.description}</p>
            </div>
            <div className="category-card__actions">
              <span className="category-card__pill">
                {(counters[cat.slug] || counters[cat.name?.toLowerCase()] || 0)} productos
              </span>
              <button type="button" onClick={() => handleSelect(cat.slug)}>
                Ver productos
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CategoryShowcase
