import { useEffect, useRef, useState } from 'react'

export const useRequestAnimationFrame = () => {
  const requestRef = useRef(0)
  const [render, setRender] = useState<Function | null>()
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!render) return
    if (!isRunning) {
      cancelAnimationFrame(requestRef.current)
      return
    }

    const animate = () => {
      if (!isRunning) {
        cancelAnimationFrame(requestRef.current)
        return
      }
      render()
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(requestRef.current)
  }, [render, isRunning])

  return { setRender, setIsRunning }
}
