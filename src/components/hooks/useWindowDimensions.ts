import { useState, useEffect, useCallback } from 'react'

interface Size {
  width: number | undefined
  height: number | undefined
}

const useWindowDimensions = (): Size => {
  const hasWindow = typeof window !== 'undefined'

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : undefined
    const height = hasWindow ? window.innerHeight : undefined

    return { width, height }
  }, [hasWindow])

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions())
      }
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [getWindowDimensions, hasWindow])

  return windowDimensions
}

export default useWindowDimensions
