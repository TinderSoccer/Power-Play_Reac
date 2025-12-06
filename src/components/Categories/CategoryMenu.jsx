import { useEffect, useMemo, useState } from 'react'
import '../../styles/category-menu.css'

const FALLBACK_CATEGORIES = [
  { slug: 'consolas', name: 'Consolas' },
  { slug: 'accesorios', name: 'Accesorios' },
  { slug: 'videojuegos', name: 'Videojuegos' },
  { slug: 'juegos-mesa', name: 'Juegos de Mesa' }
]

const CategoryMenu = ({ categories = [], products = [], onSelect }) => {
  const normalized = useMemo(() => {
    const base = categories.length > 0 ? categories : FALLBACK_CATEGORIES
    return base.map((cat, index) => ({
      slug: cat.slug || cat.value || cat.id || `cat-${index}`,
      name: cat.name || cat.label || 'Categoría'
    }))
  }, [categories])

  const counters = useMemo(() => {
    return products.reduce((acc, product) => {
      const key = product?.category
      if (!key) return acc
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }, [products])

  const getInitialOpen = () => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 768px)').matches
  }

  const [open, setOpen] = useState(getInitialOpen)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setOpen(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const handleSelect = (slug) => {
    if (onSelect) {
      onSelect(slug)
    }
    if (window.innerWidth < 768) {
      setOpen(false)
    }
  }

  return (
    <section className="category-menu">
      <div className="category-menu__header">
        <div>
          <p className="menu-eyebrow">Menú táctico</p>
          <h3>Elige tu categoría</h3>
        </div>
        <button
          type="button"
          className={`menu-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen(prev => !prev)}
          aria-label="Mostrar categorías"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`category-menu__panel ${open ? 'open' : ''}`}>
        {normalized.map(cat => (
          <button
            key={cat.slug}
            type="button"
            className="category-menu__chip"
            onClick={() => handleSelect(cat.slug)}
          >
            <span>{cat.name}</span>
            <small>{counters[cat.slug] || counters[cat.name?.toLowerCase()] || 0} prod.</small>
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategoryMenu
