import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import '../../styles/Auth.css'

const Login = ({ onSwitchToSignup, onSuccess }) => {
  const [email, setEmail] = useState('admin@powerplay.com')
  const [password, setPassword] = useState('admin123')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsSubmitting(true)
    const result = await login(email, password)
    setIsSubmitting(false)

    if (result.success) {
      setMessage(result.message)
      setTimeout(() => {
        onSuccess()
      }, 800)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎮 Power Play</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="link-button"
            >
              Regístrate aquí
            </button>
          </p>
          <div className="demo-info">
            <p>Demo: admin@powerplay.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
