import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'

const LCanvas = ({ children, style }) => {
  return (
    <Canvas
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      id='rendered'
    >
      {/* <LControl /> */}
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
