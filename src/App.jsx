import { useState, useContext, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Carousel from './components/Carousel/Carousel'
import Footer from './components/Footer/Footer'
import Cart from './components/Cart/Cart'
import CartPage from './components/Cart/CartPage'
import ProductSection from './components/Products/ProductSection'
import ProductGrid from './components/Products/ProductGrid'
import products from './data/products'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import AdminPage from './pages/AdminPage'
import FavoritesPage from './pages/FavoritesPage'
import CheckoutPage from './pages/CheckoutPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrdersPage from './pages/OrdersPage'
import StoresPage from './pages/StoresPage'
import { AuthContext } from './context/AuthContext'
import { productApi, cartApi, categoryApi, userApi } from './services/api'
import CategoryMenu from './components/Categories/CategoryMenu'

const DEFAULT_CATEGORY_OPTIONS = [
  { value: 'consolas', label: 'Consolas' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'videojuegos', label: 'Videojuegos' },
  { value: 'juegos-mesa', label: 'Juegos de Mesa' }
]

const normalizeCartItem = (item) => ({
  ...item,
  id: item.id || item.productId,
  productId: item.productId || item.id,
  quantity: item.quantity ?? 1
})

const mapCartForApi = (items) => items.map(item => ({
  productId: item.productId || item.id,
  name: item.name,
  price: item.price,
  image: item.image,
  sku: item.sku,
  quantity: item.quantity
}))

function App() {
  const { isAuthenticated, isAdmin, logout, user, token } = useContext(AuthContext)
  const location = useLocation()

  // Refs para scroll a secciones
  const videoJuegosRef = useRef(null)
  const accesoriosRef = useRef(null)
  const consolasRef = useRef(null)

  // Productos cargados desde la API (fallback al archivo local)
  const [allProducts, setAllProducts] = useState(products)
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')

  // Carrito sincronizado (API para usuarios autenticados, localStorage para invitados)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_guest')
    return savedCart ? JSON.parse(savedCart).map(normalizeCartItem) : []
  })
  const cartSyncedRef = useRef(false)

  // Cargar favoritos desde localStorage (por usuario)
  const [favorites, setFavorites] = useState(() => {
    const favKey = isAuthenticated && user ? `favorites_${user.id}` : 'favorites_guest'
    const savedFavorites = localStorage.getItem(favKey)
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [authView, setAuthView] = useState('login') // 'login' o 'signup'
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const fetchProducts = useCallback(async () => {
    try {
      setProductsError('')
      const data = await productApi.list()
      setAllProducts(Array.isArray(data) ? data : products)
    } catch (error) {
      console.error('No se pudieron cargar los productos', error)
      setProductsError(error.message)
      setAllProducts(products)
    } finally {
      setProductsLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesError('')
      const data = await categoryApi.list()
      setCategoryList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('No se pudieron cargar las categorías', error)
      setCategoriesError(error.message)
      setCategoryList([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    if (!isAdmin || !token) {
      setUsers([])
      return
    }

    try {
      setUsersError('')
      setUsersLoading(true)
      const data = await userApi.list(token)
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('No se pudieron cargar los usuarios', error)
      setUsersError(error.message)
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }, [isAdmin, token])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, normalizeCartItem({ ...product, quantity: 1 })]
      }
    })
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      setCart([])
      if (isAuthenticated && token) {
        try {
          await cartApi.clear(token)
        } catch (error) {
          console.error('No se pudo limpiar el carrito remoto', error)
        }
      }
    }
  }

  const handleOpenCart = () => {
    setIsCartOpen(true)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  const handleViewCartPage = () => {
    setCurrentPage('cart')
    setIsCartOpen(false)
  }

  const handleCheckout = () => {
    setCurrentPage('checkout')
  }

  const handleLoginClick = () => {
    setShowAuthModal(true)
    setAuthView('login')
  }

  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleGoHome = () => {
    setCurrentPage('home')
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSearchTerm('') // Limpiar búsqueda al cambiar categoría
  }

  const handleScrollToSection = (category) => {
    // Scroll suave a la sección correspondiente
    setTimeout(() => {
      let ref = null
      if (category === 'videojuegos') ref = videoJuegosRef
      else if (category === 'accesorios') ref = accesoriosRef
      else if (category === 'consolas') ref = consolasRef
      
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleCategoryShortcut = (category) => {
    const slug = category || 'all'
    handleCategorySelect(slug)
    if (slug === 'all') {
      setCurrentPage('home')
      handleScrollToSection('consolas')
      return
    }

    setCurrentPage('category')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  // ← NUEVAS FUNCIONES
  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setCurrentPage('product-detail')
  }

  const handleCloseProductDetail = () => {
    setSelectedProduct(null)
    setCurrentPage('home')
  }

  const handleAddToFavorite = (product) => {
    setFavorites(prevFav => {
      const isFavorited = prevFav.find(item => item.id === product.id)
      if (isFavorited) {
        return prevFav.filter(item => item.id !== product.id)
      } else {
        return [...prevFav, product]
      }
    })
  }

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId)
  }

  const handleRemoveFavorite = (productId) => {
    setFavorites(prevFav => prevFav.filter(item => item.id !== productId))
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (term) => {
    const normalized = (term || '').trim()
    setSearchTerm(normalized)
    setSelectedCategory('all')
    if (normalized) {
      setCurrentPage('search')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setCurrentPage('home')
    }
  }

  const handleAdminAddProduct = async (productData) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      const payload = {
        ...productData,
        price: Number(productData.price),
        featured: Boolean(productData.featured)
      }
      const created = await productApi.create(token, payload)
      setAllProducts(prev => [...prev, created])
      return { success: true, product: created }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleAdminEditProduct = async (productId, productData) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      const payload = {
        ...productData,
        price: Number(productData.price),
        featured: Boolean(productData.featured)
      }
      const updated = await productApi.update(token, productId, payload)
      setAllProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
      return { success: true, product: updated }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleAdminDeleteProduct = async (productId) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      await productApi.remove(token, productId)
      setAllProducts(prev => prev.filter(p => p.id !== productId))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const slugify = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleAddCategory = async (categoryData) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      const payload = {
        name: categoryData.name,
        slug: categoryData.slug || slugify(categoryData.name),
        description: categoryData.description
      }
      const created = await categoryApi.create(token, payload)
      setCategoryList(prev => [...prev, created])
      return { success: true, category: created }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      await categoryApi.remove(token, categoryId)
      setCategoryList(prev => prev.filter(cat => cat.id !== categoryId))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleUpdateUserRole = async (userId, role) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      const updated = await userApi.updateRole(token, userId, role)
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
      return { success: true, user: updated }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión como administrador' }
    }

    try {
      await userApi.remove(token, userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Filtrar por categoría Y búsqueda
  const filteredProducts = allProducts.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch = searchTerm === '' ||
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const normalizedSearchTerm = searchTerm ? searchTerm.toLowerCase() : ''
  const searchResults = normalizedSearchTerm
    ? allProducts.filter(p => {
        const name = (p.name || '').toLowerCase()
        const categoryValue = (p.category || '').toLowerCase()
        const sku = (p.sku || '').toLowerCase()
        return name.includes(normalizedSearchTerm) ||
          categoryValue.includes(normalizedSearchTerm) ||
          sku.includes(normalizedSearchTerm)
      })
    : []

  const getCategoryLabel = useCallback((slug) => {
    if (!slug || slug === 'all') return 'Todos los productos'
    const fromApi = categoryList.find(cat => (cat.slug || cat.value) === slug)
    if (fromApi) return fromApi.name || fromApi.label || slug
    const fallback = DEFAULT_CATEGORY_OPTIONS.find(cat => cat.value === slug)
    return fallback ? fallback.label : slug
  }, [categoryList])

  const categoryResults = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)

  const handleLogout = () => {
    logout()
    setCurrentPage('home')
  }

  // Cargar carrito desde API/local según autenticación
  useEffect(() => {
    cartSyncedRef.current = false

    const loadCart = async () => {
      if (isAuthenticated && token) {
        try {
          const remoteCart = await cartApi.get(token)
          const normalized = (remoteCart?.items || []).map(normalizeCartItem)
          setCart(normalized)
        } catch (error) {
          console.error('No se pudo cargar el carrito remoto', error)
          const fallback = localStorage.getItem('cart_guest')
          setCart(fallback ? JSON.parse(fallback).map(normalizeCartItem) : [])
        }
      } else {
        const savedCart = localStorage.getItem('cart_guest')
        setCart(savedCart ? JSON.parse(savedCart).map(normalizeCartItem) : [])
      }

      cartSyncedRef.current = true
    }

    loadCart()
  }, [isAuthenticated, token, user])

  // Guardar carrito (API cuando está autenticado, localStorage para invitados)
  useEffect(() => {
    if (!cartSyncedRef.current) return

    const persistCart = async () => {
      if (isAuthenticated && token) {
        try {
          await cartApi.save(token, mapCartForApi(cart))
        } catch (error) {
          console.error('No se pudo sincronizar el carrito remoto', error)
        }
      } else {
        localStorage.setItem('cart_guest', JSON.stringify(cart))
      }
    }

    persistCart()
  }, [cart, isAuthenticated, token])

  // Recargar favoritos cuando cambia el usuario autenticado
  useEffect(() => {
    const favKey = isAuthenticated && user ? `favorites_${user.id}` : 'favorites_guest'
    const savedFavorites = localStorage.getItem(favKey)
    setFavorites(savedFavorites ? JSON.parse(savedFavorites) : [])
  }, [isAuthenticated, user])

  // Guardar favoritos en localStorage cada vez que cambien (separado por usuario)
  useEffect(() => {
    const favKey = isAuthenticated && user ? `favorites_${user.id}` : 'favorites_guest'
    localStorage.setItem(favKey, JSON.stringify(favorites))
  }, [favorites, isAuthenticated, user])

  // Si intenta ir a admin sin estar autenticado
  if (location.pathname === '/admin' && !isAuthenticated) {
    return authView === 'login' ? (
      <Login
        onSwitchToSignup={() => setAuthView('signup')}
        onSuccess={() => {
          window.location.href = '/admin'
        }}
      />
    ) : (
      <SignUp
        onSwitchToLogin={() => setAuthView('login')}
        onSuccess={() => {
          // Después del signup, volver al login para que se logee
          setAuthView('login')
        }}
      />
    )
  }

  // Si es admin y está en página de admin
  if (isAdmin && location.pathname === '/admin') {
    const categoryData = categoryList.length > 0
      ? categoryList.map(cat => ({ value: cat.slug, label: cat.name, id: cat.id, description: cat.description }))
      : DEFAULT_CATEGORY_OPTIONS

    return (
        <AdminPage
        products={allProducts}
        categories={categoryData}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        users={users}
        usersLoading={usersLoading}
        usersError={usersError}
        onLogout={handleLogout}
        onAddProduct={handleAdminAddProduct}
        onEditProduct={handleAdminEditProduct}
        onDeleteProduct={handleAdminDeleteProduct}
        onRefresh={fetchProducts}
        loading={productsLoading}
        error={productsError}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onUpdateUserRole={handleUpdateUserRole}
        onDeleteUser={handleDeleteUser}
      />
    )
  }

  // Si está autenticado pero no es admin e intenta ir a admin
  if (location.pathname === '/admin' && !isAdmin) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#0f172a',
        textAlign: 'center',
        background: 'var(--bg)'
      }}>
        <div>
          <h1 style={{ color: '#ff4d4d' }}>❌ Acceso Denegado</h1>
          <p>Solo los administradores pueden acceder a esta página.</p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem',
              fontWeight: 'bold'
            }}
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    )
  }

  // Vista normal de la tienda
  return (
    <div className="app-container">
      <div className="header-cart-wrapper">
        <Header
          cartCount={cartCount}
          onCartClick={handleOpenCart}
          user={isAuthenticated}
          onLogout={handleLogout}
          onSearch={handleSearch}
          favoritesCount={favorites.length}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('orders')}
          onLoginClick={handleLoginClick}
          onStoresClick={() => setCurrentPage('stores')}
          onSignupClick={() => {
            setShowAuthModal(true)
            setAuthView('signup')
          }}
          onAccountClick={() => setCurrentPage('orders')}
        />

        {/* Modal de Autenticación */}
        {showAuthModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000
          }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleCloseAuthModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  zIndex: 3001
                }}
              >
                ✕
              </button>
              {authView === 'login' ? (
                <Login
                  onSwitchToSignup={() => setAuthView('signup')}
                  onSuccess={() => {
                    handleCloseAuthModal()
                    setCurrentPage('home')
                  }}
                />
              ) : (
                <SignUp
                  onSwitchToLogin={() => setAuthView('login')}
                  onSuccess={() => {
                    setAuthView('login')
                  }}
                />
              )}
            </div>
          </div>
        )}

        {isCartOpen && (
          <Cart
            isOpen={isCartOpen}
            onClose={handleCloseCart}
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onViewCart={handleViewCartPage}
            onCheckout={handleCheckout}
          />
        )}
      </div>

      {currentPage === 'product-detail' && selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          onGoHome={handleCloseProductDetail}
          onAddToCart={handleAddToCart}
          onAddToFavorite={handleAddToFavorite}
          isFavorite={isFavorite(selectedProduct.id)}
        />
      ) : currentPage === 'home' ? (
        <main className="container">
          <div className="layout">
            <div className="content-container">
              <section className="hero">
                <h2>Bienvenido a Power Play!</h2>
                <p>Todo para gaming 🎮</p>
              </section>

              <CategoryMenu
                categories={categoryList}
                products={allProducts}
                onSelect={handleCategoryShortcut}
              />

              <Carousel 
                products={allProducts}
                onViewProduct={handleViewProduct}
              />

              <ProductSection
                title="Consolas"
                icon="🎮"
                ref={consolasRef}
                products={allProducts.filter(p => p.category === 'consolas').slice(0, 7)}
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
              />

              <ProductSection
                title="Accesorios"
                icon="💻"
                ref={accesoriosRef}
                products={allProducts.filter(p => p.category === 'accesorios')}
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
              />

              <ProductSection
                title="Videojuegos"
                icon="🎮"
                ref={videoJuegosRef}
                products={allProducts.filter(p => p.category === 'videojuegos')}
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
              />

              <ProductSection
                title="Juegos de Mesa"
                icon="🃏"
                products={allProducts.filter(p => p.category === 'juegos-mesa')}
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
              />
            </div>
          </div>
        </main>
      ) : currentPage === 'search' ? (
        <main className="container">
          <div className="layout">
            <div className="content-container">
              <section className="hero">
                <h2>Resultados para "{searchTerm}"</h2>
                <p>{searchResults.length > 0 ? `${searchResults.length} producto(s) encontrados` : 'No encontramos resultados, intenta con otro término.'}</p>
              </section>

              {searchResults.length > 0 ? (
                <ProductGrid
                  products={searchResults}
                  onAddToCart={handleAddToCart}
                  onViewProduct={handleViewProduct}
                  onAddToFavorite={handleAddToFavorite}
                  favorites={favorites}
                  title={`Resultados para "${searchTerm}"`}
                  subtitle={`${searchResults.length} producto(s) disponibles`}
                />
              ) : (
                <div className="empty-search">
                  <p>No encontramos productos que coincidan con "{searchTerm}".</p>
                  <button onClick={handleGoHome}>Volver a la tienda</button>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : currentPage === 'category' ? (
        <main className="container">
          <div className="layout">
            <div className="content-container">
              <section className="hero">
                <h2>{getCategoryLabel(selectedCategory)}</h2>
                <p>{categoryResults.length} producto(s) disponibles</p>
              </section>

              {categoryResults.length > 0 ? (
                <ProductGrid
                  products={categoryResults}
                  onAddToCart={handleAddToCart}
                  onViewProduct={handleViewProduct}
                  onAddToFavorite={handleAddToFavorite}
                  favorites={favorites}
                  title={`Catálogo: ${getCategoryLabel(selectedCategory)}`}
                  subtitle={`${categoryResults.length} opciones para tu loadout`}
                />
              ) : (
                <div className="empty-search">
                  <p>Aún no tenemos productos en esta categoría.</p>
                  <button onClick={handleGoHome}>Volver al inicio</button>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : currentPage === 'favorites' ? (
        <FavoritesPage
          favorites={favorites}
          onAddToCart={handleAddToCart}
          onViewProduct={handleViewProduct}
          onRemoveFavorite={handleRemoveFavorite}
          onGoHome={handleGoHome}
        />
      ) : currentPage === 'checkout' ? (
        <CheckoutPage
          cartItems={cart}
          onGoHome={handleGoHome}
          onClearCart={handleClearCart}
        />
      ) : currentPage === 'orders' ? (
        <OrdersPage
          onGoHome={handleGoHome}
        />
      ) : currentPage === 'stores' ? (
        <StoresPage
          onGoHome={handleGoHome}
        />
      ) : (
        <CartPage
          cartItems={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onGoHome={handleGoHome}
          onCheckout={() => setCurrentPage('checkout')}
        />
      )}

      <Footer />
    </div>
  )
}

export default App
