import { useEffect, useState } from 'react'
import BlurText from './BlurText'
import Grainient from './Grainient'
import './App.css'

const slides = [
  {
    number: '01',
    eyebrow: '',
    title: 'URUGUAY INNOVA',
    copy: 'Descripción.',
    colors: ['#25418e', '#2856d6', '#658aed'],
    images: [
      { src: 'https://www.gub.uy/sites/gubuy/files/inline-images/gili%20en%20lanzamiento.png', alt: 'Interior contemporáneo con luz natural' },
      { src: 'https://medios.presidencia.gub.uy/tav_portal/2025/noticias/AN_559/fgr_09.jpg', alt: 'Espacio de trabajo moderno' },
      { src: 'https://www.gub.uy/sites/gubuy/files/styles/listado_contenedores/public/imagenes/noticias/U%2BI%20en%20Antel%20Summit%20%283%29_0.jpeg?itok=7HzOzt4p', alt: 'Mesa de trabajo junto a una ventana' },
    ],
  },
  {
    number: '02',
    eyebrow: '',
    title: 'SEGUNDA PLACA',
    copy: 'Descripción.',
    colors: ['#17336f', '#416cc4', '#8daef4'],
    images: [
      { src: 'https://www.gub.uy/sites/gubuy/files/inline-images/gili%20en%20lanzamiento.png', alt: 'Interior contemporáneo con luz natural' },
      { src: 'https://medios.presidencia.gub.uy/tav_portal/2025/noticias/AN_559/fgr_09.jpg', alt: 'Espacio de trabajo moderno' },
      { src: 'https://www.gub.uy/sites/gubuy/files/styles/listado_contenedores/public/imagenes/noticias/U%2BI%20en%20Antel%20Summit%20%283%29_0.jpeg?itok=7HzOzt4p', alt: 'Mesa de trabajo junto a una ventana' },
    ],
  },
  {
    number: '03',
    eyebrow: '',
    title: 'TERCERA PLACA',
    copy: 'Descripción.',
    colors: ['#416cc4', '#25418e', '#b8cafa'],
    images: [
      { src: 'https://www.gub.uy/sites/gubuy/files/inline-images/gili%20en%20lanzamiento.png', alt: 'Interior contemporáneo con luz natural' },
      { src: 'https://medios.presidencia.gub.uy/tav_portal/2025/noticias/AN_559/fgr_09.jpg', alt: 'Espacio de trabajo moderno' },
      { src: 'https://www.gub.uy/sites/gubuy/files/styles/listado_contenedores/public/imagenes/noticias/U%2BI%20en%20Antel%20Summit%20%283%29_0.jpeg?itok=7HzOzt4p', alt: 'Mesa de trabajo junto a una ventana' },
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
        color1={slide.colors[0]}
        color2={slide.colors[1]}
        color3={slide.colors[2]}
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
