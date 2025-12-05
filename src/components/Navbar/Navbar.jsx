import { useState, useRef } from 'react' // <-- CAMBIO: Se añade useRef
import '../../styles/navbar-sidebar.css'

const Navbar = ({ onCategorySelect, onScrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const leaveTimer = useRef(null) // <-- CAMBIO: Se añade el Ref para el temporizador

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    setIsOpen(false)
    setHoveredCategory(null) // Cierra el sidebar al hacer clic
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    if (onScrollToSection) {
      onScrollToSection(category)
    }
  }

  // Submenu data
  const categoryData = {
    videojuegos: {
      image: '/imagenes/imagen-juegos.png',
      filters: [
        { title: 'PLAYSTATION', items: ['PLAYSTATION 5', 'PLAYSTATION 4', 'PLAYSTATION 3'] },
        { title: 'NINTENDO', items: ['SWITCH 2', 'SWITCH', '3DS'] },
        { title: 'MICROSOFT', items: ['XBOX SERIES', 'XBOX ONE', 'XBOX 360'] }
      ]
    },
    accesorios: {
      image: '/imagenes/imagen-accesorios.png',
      filters: [
        { title: 'AUDIO', items: ['Audífonos', 'Parlantes'] },
        { title: 'PERIFÉRICOS', items: ['Teclados', 'Mouse', 'Controles'] },
        { title: 'ALMACENAMIENTO', items: ['Memorias SSD', 'Discos Externos'] }
      ]
    },
    consolas: {
      image: '/imagenes/imagen-consolas.png',
      filters: [
        { title: 'PLAYSTATION', items: ['PLAYSTATION 5', 'PLAYSTATION 4'] },
        { title: 'NINTENDO', items: ['SWITCH 2', 'SWITCH'] },
        { title: 'MICROSOFT', items: ['XBOX SERIES', 'XBOX ONE'] }
      ]
    }
  }

  // --- 👇 LÓGICA DE FLUIDEZ CORREGIDA ---
  // Estas 4 funciones reemplazan las que tenías
  
  const handleMouseEnterCategory = (category) => {
    clearTimeout(leaveTimer.current) // Cancela cualquier cierre pendiente
    setHoveredCategory(category)
  }

  const handleMouseLeaveNavbar = () => {
    // Inicia un temporizador para CERRAR
    leaveTimer.current = setTimeout(() => {
      setHoveredCategory(null)
    }, 200) // 200ms de espera
  }

  const handleMouseEnterSidebar = () => {
    clearTimeout(leaveTimer.current) // Cancela el cierre si entras al panel
  }

  const handleMouseLeaveSidebar = () => {
    // Inicia un temporizador para CERRAR (igual que al salir de la navbar)
    leaveTimer.current = setTimeout(() => {
      setHoveredCategory(null)
    }, 200)
  }
  // --- (Fin de la lógica corregida) ---

  return (
    <>
      <nav className="navbar">
        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          id="hamburger"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul id="navbar-menu" className={isOpen ? 'active' : ''}>
          <li>
            <a
              href="#all"
              onClick={(e) => {
                e.preventDefault()
                handleCategoryClick('all')
              }}
              className={activeCategory === 'all' ? 'active' : ''}
              // --- Aplicamos los eventos a "Ver Todo" también ---
              onMouseEnter={() => handleMouseEnterCategory(null)} // Cierra el panel
              onMouseLeave={handleMouseLeaveNavbar}
            >
              Ver Todo
            </a>
          </li>
          <li
            onMouseEnter={() => handleMouseEnterCategory('videojuegos')}
            onMouseLeave={handleMouseLeaveNavbar}
          >
            <a
              href="#videojuegos"
              onClick={(e) => {
                e.preventDefault()
                handleCategoryClick('videojuegos')
              }}
              className={(activeCategory === 'videojuegos' || hoveredCategory === 'videojuegos') ? 'active' : ''}
            >
              Juegos🎲
            </a>
          </li>
          <li
            onMouseEnter={() => handleMouseEnterCategory('accesorios')}
            onMouseLeave={handleMouseLeaveNavbar}
          >
            <a
              href="#accesorios"
              onClick={(e) => {
                e.preventDefault()
                handleCategoryClick('accesorios')
              }}
              className={(activeCategory === 'accesorios' || hoveredCategory === 'accesorios') ? 'active' : ''}
            >
              Accesorios🎧
            </a>
          </li>
          <li
            onMouseEnter={() => handleMouseEnterCategory('consolas')}
            onMouseLeave={handleMouseLeaveNavbar}
          >
            <a
              href="#consolas"
              onClick={(e) => {
                e.preventDefault()
                handleCategoryClick('consolas')
              }}
              className={(activeCategory === 'consolas' || hoveredCategory === 'consolas') ? 'active' : ''}
            >
              Consolas🎮
            </a>
          </li>
        </ul>
      </nav>

      {/* Sidebar/Preview - SE MANTIENE ABIERTO CON MOUSE */}
      {hoveredCategory && categoryData[hoveredCategory] && (
        <div
          className="navbar-hover-panel"
          onMouseEnter={handleMouseEnterSidebar}
          onMouseLeave={handleMouseLeaveSidebar}
        >
          <div className="hover-filters">
            {categoryData[hoveredCategory].filters.map((group, idx) => (
              <div key={idx} className={`filter-group filter-group-${group.title.toLowerCase()}`}>
                <h4 className="filter-title">{group.title}</h4>
                <ul className="filter-items">
                  {group.items.map((item, i) => (
                    <li key={i}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault()
                        handleCategoryClick(item.toLowerCase().replace(/ /g, '-'))
                      }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="hover-image">
            <img
              src={categoryData[hoveredCategory].image}
              alt={hoveredCategory}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=' + hoveredCategory
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar