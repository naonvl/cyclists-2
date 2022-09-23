import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'

const LControl = () => {
  const dom = useStore((state) => state.dom)
  const control = useRef(null)

  useEffect(() => {
    if (control.current) {
      const domElement = dom.current
      const originalTouchAction = domElement.style['touch-action']
      domElement.style['touch-action'] = 'auto'

      return () => {
        domElement.style['touch-action'] = 'auto'
      }
    }
  }, [dom, control])
  // @ts-ignore
  return <OrbitControls ref={control} domElement={dom.current} />
}
const LCanvas = ({ children, style }) => {
  const dom = useStore((state) => state.dom)

  return (
    <Canvas
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      id='rendered'
      // onCreated={(state) => state.events.connect(dom.current)}
    >
      {/* <LControl /> */}
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
