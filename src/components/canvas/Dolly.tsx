import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

const Dolly = (props) => {
  return useFrame((state, delta) =>
    mesh.current
      ? (mesh.current.rotation.y = mesh.current.rotation.x += 0.01)
      : null
  )
}
export default Dolly
