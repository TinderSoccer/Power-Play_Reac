import React, { createContext, useCallback, useEffect, useState } from 'react'
import { authApi, orderApi } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const resetSession = useCallback(() => {
    setUser(null)
    setToken(null)
    setOrders([])
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }, [])

  const fetchOrders = useCallback(async (activeToken) => {
    const authToken = activeToken || token
    if (!authToken) return

    try {
      const data = await orderApi.list(authToken)
      setOrders(data)
    } catch (error) {
      console.error('No se pudieron cargar las órdenes', error)
    }
  }, [token])

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const profile = await authApi.me(token)
        if (!isMounted) return
        setUser(profile)
        localStorage.setItem('user', JSON.stringify(profile))
        await fetchOrders(token)
      } catch (error) {
        console.error('Sesión inválida', error)
        if (isMounted) {
          resetSession()
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [token, fetchOrders, resetSession])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.token)
      await fetchOrders(response.token)
      return { success: true, message: 'Inicio de sesión exitoso' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signup = async (email, password, name) => {
    try {
      const response = await authApi.signup(name, email, password)
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.token)
      await fetchOrders(response.token)
      return { success: true, message: 'Cuenta creada exitosamente' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const logout = () => {
    resetSession()
  }

  const createOrder = async (orderData) => {
    if (!token) {
      throw new Error('Debes iniciar sesión para crear órdenes')
    }

    const newOrder = await orderApi.create(token, orderData)
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const getUserOrders = () => orders

  const isAuthenticated = Boolean(user && token)
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        orders,
        login,
        signup,
        logout,
        createOrder,
        getUserOrders,
        isAuthenticated,
        isAdmin,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
