import { useEffect, useState } from 'react'

function TypeText({
  text = '',
  className = '',
  typingSpeed = 18,
  initialDelay = 0,
  onComplete,
  start = true,
  style,
}) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    if (!start) return undefined

    let typingTimer
    let cursor = 0
    let cancelled = false

    const typeNextCharacter = () => {
      if (cancelled) return
      cursor += 1
      setVisibleText(text.slice(0, cursor))

      if (cursor < text.length) {
        typingTimer = window.setTimeout(typeNextCharacter, typingSpeed)
      } else {
        onComplete?.()
      }
    }

    typingTimer = window.setTimeout(typeNextCharacter, initialDelay)
    return () => {
      cancelled = true
      window.clearTimeout(typingTimer)
    }
  }, [initialDelay, onComplete, start, text, typingSpeed])

  return (
    <p className={className} style={style} aria-live="polite">
      {visibleText}
    </p>
  )
}

export default TypeText
