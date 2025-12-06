import React, { useMemo, useState } from 'react'
import '../styles/AdminPage.css'

const DEFAULT_CATEGORY_OPTIONS = [
  { id: 'default-consolas', value: 'consolas', label: 'Consolas' },
  { id: 'default-accesorios', value: 'accesorios', label: 'Accesorios' },
  { id: 'default-videojuegos', value: 'videojuegos', label: 'Videojuegos' },
  { id: 'default-juegos-mesa', value: 'juegos-mesa', label: 'Juegos de Mesa' }
]

const AdminPage = ({
  products = [],
  categories = [],
  categoriesLoading,
  categoriesError,
  users = [],
  usersLoading,
  usersError,
  onLogout,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateUserRole,
  onDeleteUser,
  onRefresh,
  loading,
  error
}) => {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'consolas',
    image: '',
    sku: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [status, setStatus] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [categoryStatus, setCategoryStatus] = useState(null)
  const [userStatus, setUserStatus] = useState(null)

  const categoryOptions = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.map(cat => ({
        id: cat.id || cat.value,
        value: cat.slug || cat.value,
        label: cat.name || cat.label,
        description: cat.description
      }))
    }
    return DEFAULT_CATEGORY_OPTIONS
  }, [categories])

  const notify = (type, message) => {
    setStatus({ type, message })
    setTimeout(() => setStatus(null), 4000)
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setEditData({ ...product })
  }

  const handleSave = async () => {
    if (!editingId) return
    setActionLoading(true)
    setStatus(null)

    const payload = {
      name: editData.name,
      price: editData.price,
      category: editData.category,
      image: editData.image,
      sku: editData.sku,
      description: editData.description,
      featured: editData.featured
    }

    const result = await onEditProduct(editingId, payload)
    setActionLoading(false)

    if (result?.success) {
      setEditingId(null)
      notify('success', 'Producto actualizado correctamente')
    } else if (result?.message) {
      notify('error', result.message)
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    setActionLoading(true)
    setStatus(null)

    const payload = {
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      image: newProduct.image,
      sku: newProduct.sku
    }

    const result = await onAddProduct(payload)
    setActionLoading(false)

    if (result?.success) {
      setNewProduct({ name: '', price: '', category: 'consolas', image: '', sku: '' })
      setShowAddForm(false)
      notify('success', 'Producto creado correctamente')
    } else if (result?.message) {
      notify('error', result.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return
    }

    setStatus(null)
    const result = await onDeleteProduct(id)
    if (result?.success) {
      notify('success', 'Producto eliminado')
    } else if (result?.message) {
      notify('error', result.message)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      alert('Ingresa un nombre para la categoría')
      return
    }

    const result = await onAddCategory({
      name: newCategory.name,
      description: newCategory.description
    })

    if (result?.success) {
      setNewCategory({ name: '', description: '' })
      setCategoryStatus({ type: 'success', message: 'Categoría creada correctamente' })
    } else if (result?.message) {
      setCategoryStatus({ type: 'error', message: result.message })
    }
  }

  const handleDeleteCategoryLocal = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return
    const result = await onDeleteCategory(id)
    if (result?.success) {
      setCategoryStatus({ type: 'success', message: 'Categoría eliminada' })
    } else if (result?.message) {
      setCategoryStatus({ type: 'error', message: result.message })
    }
  }

  const handleRoleChange = async (user, role) => {
    if (role === user.role) return
    const result = await onUpdateUserRole(user.id, role)
    if (result?.success) {
      setUserStatus({ type: 'success', message: 'Rol actualizado' })
    } else if (result?.message) {
      setUserStatus({ type: 'error', message: result.message })
    }
  }

  const handleDeleteUserLocal = async (user) => {
    if (!onDeleteUser) return
    if (user.role === 'admin') {
      setUserStatus({ type: 'error', message: 'No puedes eliminar administradores' })
      return
    }
    if (!window.confirm(`¿Eliminar a ${user.email}?`)) return

    const result = await onDeleteUser(user.id)
    if (result?.success) {
      setUserStatus({ type: 'success', message: 'Usuario eliminado' })
    } else if (result?.message) {
      setUserStatus({ type: 'error', message: result.message })
    }
  }

  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0)

  const tabs = [
    { id: 'products', label: 'Productos' },
    { id: 'categories', label: 'Categorías' },
    { id: 'users', label: 'Usuarios' }
  ]

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🎮 Panel de Administración</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-refresh" onClick={onRefresh} disabled={loading}>
            {loading ? 'Actualizando...' : '⟳ Actualizar'}
          </button>
          <button className="btn-logout" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {(error || status) && (
        <div className={`admin-alert ${status?.type === 'error' || error ? 'alert-error' : 'alert-success'}`}>
          {error || status?.message}
        </div>
      )}

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Productos</h3>
          <p className="stat-value">{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Valor Total Inventario</h3>
          <p className="stat-value">${(totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="stat-card">
          <h3>Categorías Activas</h3>
          <p className="stat-value">{categoryOptions.length}</p>
        </div>
      </div>

      {activeTab === 'products' && (
        <>
          <div className="admin-actions">
            <button
              className="btn-add-product"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '✕ Cancelar' : '+ Agregar Producto'}
            </button>
          </div>

          {showAddForm && (
            <div className="add-product-form">
              <h2>Nuevo Producto</h2>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Precio (CLP)"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="URL de imagen"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="SKU (opcional)"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                />
                <button className="btn-save" onClick={handleAddProduct} disabled={actionLoading}>
                  {actionLoading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </div>
          )}

          <div className="admin-products">
            <h2>Productos</h2>
            {loading ? (
              <p style={{ color: '#999' }}>Cargando productos...</p>
            ) : (
              <div className="products-table">
                <div className="table-header">
                  <div className="col col-name">Nombre</div>
                  <div className="col col-price">Precio (CLP)</div>
                  <div className="col col-category">Categoría</div>
                  <div className="col col-actions">Acciones</div>
                </div>

                {products.map(product => (
                  <div key={product.id} className="table-row">
                    {editingId === product.id ? (
                      <>
                        <input
                          className="col col-name edit-input"
                          data-label="Nombre"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                        <input
                          className="col col-price edit-input"
                          type="number"
                          data-label="Precio"
                          value={editData.price}
                          onChange={(e) =>
                            setEditData({ ...editData, price: parseInt(e.target.value) || 0 })
                          }
                        />
                        <select
                          className="col col-category edit-input"
                          value={editData.category}
                          data-label="Categoría"
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                        >
                          {categoryOptions.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <div className="col col-actions" data-label="Acciones">
                          <button className="btn-save" onClick={handleSave}>
                            ✓ Guardar
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditingId(null)}
                          >
                            ✕ Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col col-name" data-label="Nombre">{product.name}</div>
                        <div className="col col-price" data-label="Precio">
                          ${Number(product.price).toLocaleString('es-CL')}
                        </div>
                        <div className="col col-category" data-label="Categoría">{product.category}</div>
                        <div className="col col-actions" data-label="Acciones">
                          <button className="btn-edit" onClick={() => handleEdit(product)}>
                            Editar
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <div className="admin-categories">
          <div className="add-product-form">
            <h2>Nueva Categoría</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nombre"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
              <button className="btn-save" onClick={handleCreateCategory}>
                Crear
              </button>
            </div>
            {(categoriesError || categoryStatus) && (
              <div className={`admin-alert ${categoriesError || categoryStatus?.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {categoriesError || categoryStatus?.message}
              </div>
            )}
          </div>

          {categoriesLoading ? (
            <p style={{ color: '#999' }}>Cargando categorías...</p>
          ) : (
            <div className="products-table">
              <div className="table-header">
                <div className="col col-name">Nombre</div>
                <div className="col col-category">Slug</div>
                <div className="col col-price">Descripción</div>
                <div className="col col-actions">Acciones</div>
              </div>
              {categoryOptions.map(cat => (
                <div key={cat.id} className="table-row">
                  <div className="col col-name" data-label="Nombre">{cat.label}</div>
                  <div className="col col-category" data-label="Slug">{cat.value}</div>
                  <div className="col col-price" data-label="Descripción">{cat.description || '—'}</div>
                  <div className="col col-actions" data-label="Acciones">
                    {cat.id?.startsWith('default-') ? (
                      <span style={{ color: '#777' }}>Predeterminada</span>
                    ) : (
                      <button className="btn-delete" onClick={() => handleDeleteCategoryLocal(cat.id)}>
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-users">
          {usersLoading ? (
            <p style={{ color: '#999' }}>Cargando usuarios...</p>
          ) : (
            <>
              {(usersError || userStatus) && (
                <div className={`admin-alert ${usersError || userStatus?.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                  {usersError || userStatus?.message}
                </div>
              )}
              <div className="products-table">
                <div className="table-header users-header">
                  <div className="col col-name">Nombre</div>
                  <div className="col col-category">Email</div>
                  <div className="col col-price">Rol</div>
                  <div className="col col-actions">Acciones</div>
                </div>
                {users.map(user => (
                  <div key={user.id} className="table-row users-row">
                  <div className="col col-name" data-label="Nombre">{user.name || 'Sin nombre'}</div>
                  <div className="col col-category" data-label="Email">{user.email}</div>
                  <div className="col col-price" data-label="Rol">
                      <select
                        className="edit-input"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="col col-actions" data-label="Acciones">
                      <button
                        className="btn-delete ghost"
                        onClick={() => handleDeleteUserLocal(user)}
                        disabled={user.role === 'admin'}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPage
