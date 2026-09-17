function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  stepDuration = 0.35,
  startDelay = 0,
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const directionClass = direction === 'top' ? 'blur-text-from-top' : 'blur-text-from-bottom'

  return (
    <p className={className}>
      {elements.map((element, index) => (
        <span
          key={`${element}-${index}`}
          className={`blur-text-word ${directionClass}`}
          style={{
            '--blur-text-delay': `${(index * delay) / 1000}s`,
            '--blur-text-duration': `${stepDuration}s`,
            '--blur-text-start-delay': `${startDelay / 1000}s`,
          }}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  )
}

export default BlurText
