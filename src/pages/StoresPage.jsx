import React from 'react'

const StoresPage = ({ onGoHome }) => {
  const stores = [
    {
      id: 1,
      name: 'Power Play Santiago Centro',
      address: 'Ahumada 123, Santiago',
      phone: '+56 2 2234 5678',
      hours: 'Lunes a Viernes: 10:00 - 19:00\nSábados: 10:00 - 18:00\nDomingos: Cerrado',
      image: '🎮'
    },
    {
      id: 2,
      name: 'Power Play Mall Costanera',
      address: 'Av. Andrés Bello 2425, Santiago',
      phone: '+56 2 2234 5679',
      hours: 'Lunes a Domingo: 10:00 - 21:00',
      image: '🕹️'
    },
    {
      id: 3,
      name: 'Power Play Providencia',
      address: 'Calle Suecia 180, Providencia',
      phone: '+56 2 2234 5680',
      hours: 'Lunes a Viernes: 09:00 - 20:00\nSábados: 10:00 - 19:00\nDomingos: Cerrado',
      image: '👾'
    },
    {
      id: 4,
      name: 'Power Play Las Condes',
      address: 'Av. El Bosque Norte 380, Las Condes',
      phone: '+56 2 2234 5681',
      hours: 'Lunes a Domingo: 10:00 - 22:00',
      image: '🎯'
    }
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, rgba(30,144,255,.2), rgba(57,255,20,.1))',
        padding: '40px 20px',
        marginBottom: '40px',
        borderBottom: '2px solid #00ff66'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            color: '#00ff66',
            fontSize: '2.5rem',
            marginBottom: '10px',
            textShadow: '0 0 20px rgba(0, 255, 102, 0.3)'
          }}>
            🏪 Nuestras Tiendas
          </h1>
          <p style={{
            color: '#888',
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>
            Visita cualquiera de nuestras sucursales en Santiago
          </p>
          <button
            onClick={onGoHome}
            style={{
              background: '#00ff66',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {stores.map((store) => (
            <div
              key={store.id}
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '10px',
                padding: '25px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ff66'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 102, 0.2)'
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                {store.image}
              </div>

              <h3 style={{
                color: '#00ff66',
                fontSize: '1.3rem',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                {store.name}
              </h3>

              <div style={{ color: '#ddd', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong>📍 Dirección:</strong><br />
                  {store.address}
                </p>

                <p style={{ marginBottom: '12px' }}>
                  <strong>📞 Teléfono:</strong><br />
                  {store.phone}
                </p>

                <p>
                  <strong>🕐 Horario:</strong><br />
                  {store.hours.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>

              <button
                style={{
                  width: '100%',
                  background: '#00ff66',
                  color: '#000',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '20px',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#00cc52'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#00ff66'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                Cómo llegar
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(0, 255, 102, 0.05)',
          border: '1px solid #00ff66',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#00ff66', marginBottom: '10px' }}>¿No encuentras lo que buscas?</h3>
          <p style={{ color: '#ddd', marginBottom: '15px' }}>
            Contáctanos a través de nuestras redes sociales o llama a nuestro servicio al cliente
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Teléfono central: +56 2 2234 5678 | Email: info@powerplay.cl
          </p>
        </div>
      </div>
    </div>
  )
}

export default StoresPage
