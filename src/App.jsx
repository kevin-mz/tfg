import { useEffect, useState } from 'react'
import BlurText from './BlurText'
import Grainient from './Grainient'
import './App.css'

const slides = [
  {
    number: '01',
    eyebrow: 'Apertura',
    title: 'URUGUAY INNOVA',
    copy: 'Esta es la primera placa de tu presentación.',
    images: [
      { src: 'https://www.gub.uy/sites/gubuy/files/inline-images/gili%20en%20lanzamiento.png', alt: 'Interior contemporáneo con luz natural' },
      { src: 'https://medios.presidencia.gub.uy/tav_portal/2025/noticias/AN_559/fgr_09.jpg', alt: 'Espacio de trabajo moderno' },
      { src: 'https://www.gub.uy/sites/gubuy/files/styles/listado_contenedores/public/imagenes/noticias/U%2BI%20en%20Antel%20Summit%20%283%29_0.jpeg?itok=7HzOzt4p', alt: 'Mesa de trabajo junto a una ventana' },
    ],
  },
  {
    number: '02',
    eyebrow: 'Desarrollo',
    title: 'La información cambia. El ambiente permanece.',
    copy: 'El fondo continúa su movimiento sin reiniciarse al cambiar de placa.',
    images: [
      { src: 'https://images.unsplash.com/photo-1497366811360-5c52c61b6c1d?auto=format&fit=crop&w=900&q=85', alt: 'Arquitectura interior de líneas limpias' },
      { src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=700&q=85', alt: 'Oficina luminosa con plantas' },
      { src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85', alt: 'Detalle de un espacio creativo' },
    ],
  },
  {
    number: '03',
    eyebrow: 'Cierre',
    title: 'El escenario está listo para tu historia.',
    copy: 'Reemplaza estas placas por el contenido definitivo de tu presentación.',
    images: [
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85', alt: 'Espacio abierto de diseño' },
      { src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85', alt: 'Interior cálido y minimalista' },
      { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=85', alt: 'Sala de trabajo contemporánea' },
    ],
  },
]

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slide = slides[currentSlide]

  const goToSlide = (nextSlide) => {
    setCurrentSlide((nextSlide + slides.length) % slides.length)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goToSlide(currentSlide - 1)
      if (event.key === 'ArrowRight') goToSlide(currentSlide + 1)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  return (
    <main className="grainient" aria-label="Animated gradient background">
      <Grainient
        color1="#25418e"
        color2="#25418e"
        color3="#658aed"
        timeSpeed={0.85}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
      <section className="deck" aria-label="Presentación">
        <p className="slide-number">{slide.number} / 0{slides.length}</p>
        <div className="slide-stage">
          <div className="slide" key={slide.number}>
            <p className="slide-eyebrow">{slide.eyebrow}</p>
            <BlurText
              key={slide.number}
              text={slide.title}
              className="slide-title"
              animateBy="words"
              direction="top"
              delay={120}
            />
            <p className="slide-copy">{slide.copy}</p>
          </div>

          <div className={`collage collage-${slide.number}`} aria-label={`Imágenes de la placa ${slide.number}`}>
            {slide.images.map((image, index) => (
              <div
                key={image.src}
                className={`collage-frame collage-frame-${index + 1}`}
              >
                <img className="collage-image" src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        <nav className="slide-controls" aria-label="Controles de presentación">
          <button type="button" onClick={() => goToSlide(currentSlide - 1)} aria-label="Placa anterior">
            <span className="arrow-icon arrow-icon-prev" aria-hidden="true" />
          </button>
          <div className="slide-dots">
            {slides.map((item, index) => (
              <button
                key={item.number}
                type="button"
                className={index === currentSlide ? 'is-active' : ''}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a la placa ${index + 1}`}
                aria-current={index === currentSlide ? 'step' : undefined}
              />
            ))}
          </div>
          <button type="button" onClick={() => goToSlide(currentSlide + 1)} aria-label="Placa siguiente">
            <span className="arrow-icon arrow-icon-next" aria-hidden="true" />
          </button>
        </nav>
      </section>
    </main>
  )
}

export default App
