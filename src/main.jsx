import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/custom.css'
import './styles/banner.css'
import './styles/products.css'
import './styles/products-grid.css'
import './styles/CartPage.css'
import './styles/ProductDetail.css'
import './styles/Auth.css'
import './styles/AdminPage.css'
import './styles/checkout.css'
import './styles/orders.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)