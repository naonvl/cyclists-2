import { setState } from '@/helpers/store'
import { useEffect, useRef } from 'react'

const Dom = ({ children }) => {
  const ref = useRef(null)
  useEffect(() => {
    setState({ dom: ref })
  }, [])

  return (
    <div className='!touch-auto' ref={ref}>
      {children}
    </div>
  )
}

export default Dom
