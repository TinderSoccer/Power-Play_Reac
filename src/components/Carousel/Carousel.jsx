import { useState, useEffect } from 'react'

const Carousel = ({ products = [], onViewProduct }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = [
    {
      id: 1,
      image: '/banner/banner kirby.png',
      alt: 'Kirby',
      productId: 'kirby-forgotten-land'
    },
    {
      id: 2,
      image: '/banner/FIFA26.png',
      alt: 'FIFA 26',
      productId: 'fifa-26'
    },
    {
      id: 3,
      image: '/banner/HOLLLOWKNIGTH.png',
      alt: 'Hollow Knight Silksong',
      productId: 'hollow-knight-silksong'
    }
    ,
    {
      id: 4,
      image: '/banner/banner-super-mario.png',
      alt: 'Super Mario Galaxy',
      productId: 'super-mario-galaxy'
    },
    {
      id: 5,
      image: '/banner/banner-hyrule-warrior.png',
      alt: 'Hyrule Warriors',
      productId: 'hyrule-warriors'
    },
    {
      id: 6,
      image: '/banner/banner-battlefield.png',
      alt: 'Battlefield',
      productId: 'battlefield-6'
    },
    {
      id: 7,
      image: '/banner/banner-call-of-duty-black-ops1.jpeg',
      alt: 'Call of Duty Black Ops',
      productId: 'call-of-duty-black-ops'
    }
  ]

  const totalSlides = slides.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, totalSlides])

  return (
    <div className="banner-container">
      <div
        className="banner-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="banner-carousel__inner">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`banner-carousel__item ${index === currentSlide ? 'banner-carousel__item--active' : ''}`}
              onClick={() => {
                if (onViewProduct) {
                  // Crear un producto placeholder si no está en el array
                  let product = products.find(p => p.id === slide.productId)
                  
                  if (!product) {
                    // Producto placeholder con datos básicos
                    product = {
                      id: slide.productId,
                      name: slide.alt,
                      price: 70000,
                      image: `/imagenes/${slide.productId}.png`,
                      category: 'juegos',
                      sku: `JUE-${slide.productId}`
                    }
                  }
                  
                  onViewProduct(product)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="banner-img"
              />
            </div>
          ))}
        </div>

        <button
          className="banner-carousel__control banner-carousel__control--prev"
          onClick={prevSlide}
          aria-label="Slide anterior"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <button
          className="banner-carousel__control banner-carousel__control--next"
          onClick={nextSlide}
          aria-label="Siguiente slide"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="banner-carousel__indicators">
        {slides.map((slide, index) => (
          <span
            key={slide.id}
            className={`banner-carousel__indicator ${index === currentSlide ? 'banner-carousel__indicator--active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel