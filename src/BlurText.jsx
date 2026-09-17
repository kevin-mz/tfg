import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((step) => Object.keys(step))])
  const keyframes = {}

  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])]
  })

  return keyframes
}

function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
  stepDuration = 0.35,
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  const from = useMemo(
    () => (direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, y: -50 }
      : { filter: 'blur(10px)', opacity: 0, y: 50 }),
    [direction],
  )
  const to = useMemo(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  )
  const keyframes = buildKeyframes(from, to)
  const times = Array.from({ length: to.length + 1 }, (_, index) => index / to.length)
  const totalDuration = stepDuration * to.length

  return (
    <p ref={ref} className={className}>
      {elements.map((element, index) => (
        <motion.span
          key={`${element}-${index}`}
          initial={from}
          animate={inView ? keyframes : from}
          transition={{ duration: totalDuration, times, delay: (index * delay) / 1000, ease: 'easeOut' }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </p>
  )
}

export default BlurText
