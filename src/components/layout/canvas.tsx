import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'

const LCanvas = ({ children, style, onClick }) => {
  return (
    <Canvas
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      onClick={onClick}
      id='rendered'
    >
      {/* <LControl /> */}
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
