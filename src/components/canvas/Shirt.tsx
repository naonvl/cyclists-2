import * as THREE from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { fabric } from 'fabric'
import Loader from '@/components/canvas/Loader'
import useStore from '@/helpers/store'
import { useState, useRef, Suspense, MutableRefObject } from 'react'
import {
  useGLTF,
  Environment,
  OrbitControls,
  AdaptiveDpr,
  Stats,
  Preload,
  BakeShadows,
  AdaptiveEvents,
} from '@react-three/drei'

type GLTFResult = GLTF & {
  nodes: {
    M740158_mesh_band: THREE.Mesh
    M740158_mesh_in: THREE.Mesh
    M740158_mesh_out: THREE.Mesh
    M740158_mesh_zipp: THREE.Mesh
    M740158_mesh_zipper: THREE.Mesh
  }
  materials: {}
}

interface ShirtProps {
  props?: JSX.IntrinsicElements['group']
  canvasRef: MutableRefObject<fabric.Canvas | null>
}

const ShirtComponent = ({ props, canvasRef }: ShirtProps) => {
  const { camera, gl } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const textureRef = useRef<THREE.Texture | null>(null)

  // Loading state
  const isLoading = useStore((state) => state.isLoading)
  // Zoom state
  const zoomIn = useStore((state) => state.zoomIn)
  const changeZoomIn = useStore((state) => state.changeZoomIn)
  const zoomOut = useStore((state) => state.zoomOut)
  const changeZoomOut = useStore((state) => state.changeZoomOut)
  const setZoom = useStore((state) => state.setZoom)
  // Rotate state
  const rotateRight = useStore((state) => state.rotateRight)
  const changeRotateRight = useStore((state) => state.changeRotateRight)
  const rotateLeft = useStore((state) => state.rotateLeft)
  const changeRotateLeft = useStore((state) => state.changeRotateLeft)
  // Flip state
  const isObjectFront = useStore((state) => state.isObjectFront)
  const cameraChanged = useStore((state) => state.cameraChanged)
  const setCameraChange = useStore((state) => state.setCameraChange)

  const colorChanged = useStore((state) => state.colorChanged)
  const setColorChanged = useStore((state) => state.setColorChanged)
  const isAddText = useStore((state) => state.isAddText)

  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const { nodes } = useGLTF('/model/S-cycling-jersey.drc.glb') as GLTFResult

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    controlsRef.current.update()
    // setZoom(Math.floor(state.camera.position.z))
    if (canvasRef.current) {
      textureRef.current = new THREE.Texture(canvasRef.current.getElement())
      textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.needsUpdate = true
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true
      canvasRef.current.renderAll()
    }

    if (colorChanged) {
      state.camera.position.z = state.camera.position.z + 0.001
      setColorChanged(false)
    }

    if (!isObjectFront && cameraChanged) {
      state.camera.position.z = -90
      setCameraChange(false)
    }

    if (isObjectFront && cameraChanged) {
      state.camera.position.z = 90
      setCameraChange(false)
    }

    if (controlsRef.current && zoomOut) {
      state.camera.position.x *= 1.1
      state.camera.position.y *= 1.1
      state.camera.position.z *= 1.1
      changeZoomOut(false)
    }

    if (controlsRef.current && zoomIn) {
      state.camera.position.x *= 0.9
      state.camera.position.y *= 0.9
      state.camera.position.z *= 0.9
      changeZoomIn(false)
    }

    if (controlsRef.current && rotateRight) {
      groupRef.current.rotation.y += -Math.PI / 4
      changeRotateRight(false)
    }

    if (controlsRef.current && rotateLeft) {
      groupRef.current.rotation.y += Math.PI / 4
      changeRotateLeft(false)
    }

    if (isAddText) {
      state.gl.domElement.style.cursor = 'crosshair'
    }

    if (!isAddText) {
      state.gl.domElement.style.cursor = hovered ? 'grab' : 'auto'
      state.gl.domElement.style.cursor = clicked ? 'grabbing' : 'grab'
    }
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <spotLight
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        position={[10, 50, 50]}
        castShadow
      />
      <spotLight
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        position={[10, 50, -50]}
        castShadow
      />
      <ambientLight intensity={0.4} />
      <Suspense fallback={<Loader />}>
        <group
          ref={groupRef}
          dispose={null}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => setClicked(false)}
          {...props}
        >
          <mesh
            geometry={nodes.M740158_mesh_band.geometry}
            material={nodes.M740158_mesh_band.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              normalMap={normalMap}
              normalMap-flipY={false}
              map={textureRef.current}
            >
              <texture attach='map' image={canvasRef} />
            </meshStandardMaterial>
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_in.geometry}
            material={nodes.M740158_mesh_in.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              roughness={1}
              emissive={1}
              bumpMap={bump}
              bumpScale={0.03}
              map={textureRef.current}
              color='#ccc'
            />
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_out.geometry}
            material={nodes.M740158_mesh_out.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              bumpMap={bump}
              roughness={0.7}
              emissive={1}
              bumpScale={0.03}
              map={textureRef.current}
              aoMap={aoMapout}
              aoMapIntensity={0.5}
            >
              <texture attach='map' image={canvasRef} ref={textureRef} />
            </meshStandardMaterial>
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_zipp.geometry}
            material={nodes.M740158_mesh_zipp.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              normalMap={normalMap}
              normalMap-flipY={false}
              map={textureRef.current}
              aoMap={aoMapzipp}
              aoMapIntensity={0.7}
            >
              <texture attach='map' image={canvasRef} />
            </meshStandardMaterial>
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_zipper.geometry}
            material={nodes.M740158_mesh_zipper.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              normalMap={normalMap}
              normalMap-flipY={false}
              map={textureRef.current}
              aoMap={aoMapzipp}
              aoMapIntensity={0.7}
            >
              <texture attach='map' image={canvasRef} />
            </meshStandardMaterial>
          </mesh>
        </group>
        <Preload all />
        <BakeShadows />
        <Environment preset='city' />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.4}
        minDistance={20}
        minZoom={20}
        maxDistance={90}
        maxZoom={90}
        enableZoom={true}
        enablePan={false}
        enableDamping={false}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Stats showPanel={0} />
    </>
  )
}

useGLTF.preload('/model/S-cycling-jersey.drc.glb')

export default ShirtComponent
