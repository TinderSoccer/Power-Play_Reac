import React, { useState } from 'react'
import '../styles/AdminPage.css'

const AdminPage = ({
  products = [],
  onLogout,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
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

  const categories = ['consolas', 'accesorios', 'videojuegos', 'juegos-mesa']

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

  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0)

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
          <p className="stat-value">{categories.length}</p>
        </div>
      </div>

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
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
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
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                    <input
                      className="col col-price edit-input"
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: parseInt(e.target.value) || 0 })
                      }
                    />
                    <select
                      className="col col-category edit-input"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="col col-actions">
                      <button className="btn-save" onClick={handleSave} disabled={actionLoading}>
                        {actionLoading ? 'Guardando...' : '✓ Guardar'}
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
                    <div className="col col-name">{product.name}</div>
                    <div className="col col-price">
                      ${Number(product.price).toLocaleString('es-CL')}
                    </div>
                    <div className="col col-category">{product.category}</div>
                    <div className="col col-actions">
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
    </div>
  )
}

export default AdminPage
