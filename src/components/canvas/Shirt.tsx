import * as THREE from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { fabric } from 'fabric'
import loadSvg from '@/helpers/loadSvg'
import initCanvas from '@/helpers/initCanvas'
import Loader from '@/components/canvas/Loader'
import useStore from '@/helpers/store'
import {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  Suspense,
} from 'react'
import {
  useGLTF,
  Environment,
  OrbitControls,
  AdaptiveDpr,
  Stats,
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
}

const width = 1024
const height = 1024

const ShirtComponent = ({ props }: ShirtProps) => {
  const { gl } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
  const texturePath = useStore((state) => state.texturePath)
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

  // Textures
  const [normalMap] = useLoader(DDSLoader, ['/textures/Jersey_NORMAL.dds'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const { nodes } = useGLTF('/model/S-cycling-jersey.drc.glb') as GLTFResult

  useEffect(() => {
    canvasRef.current = initCanvas({
      width,
      height,
    })

    loadSvg({
      path: texturePath,
      canvas: canvasRef,
      width,
      height,
    })

    // start()
    // if (cam.current) {
    //   cam.current.lookAt(1, 0, 0)
    // }

    // cleanup
    // return () => {
    //   canvasRef.current.dispose()
    //   canvasRef.current = null
    // }
  }, [setZoom, texturePath])

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // setZoom(Math.floor(state.camera.position.z))

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

    if (canvasRef.current) {
      textureRef.current = new THREE.Texture(canvasRef.current.getElement())
      textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.needsUpdate = true
      textureRef.current.flipY = false

      textureRef.current.needsUpdate = true
    }

    state.gl.domElement.style.cursor = hovered ? 'grab' : 'auto'
    state.gl.domElement.style.cursor = clicked ? 'grabbing' : 'grab'
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <ambientLight intensity={0.7} />
      <spotLight
        intensity={1}
        angle={0.3}
        penumbra={1}
        position={[10, 50, 50]}
        castShadow
      />
      <spotLight
        intensity={1}
        angle={0.3}
        penumbra={1}
        position={[10, 50, -50]}
        castShadow
      />
      <Suspense fallback={<Loader />}>
        {/* <Loader /> */}
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
              normalMap={normalMap}
              normalMap-flipY={false}
              map={textureRef.current}
              color='#fff'
            />
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_out.geometry}
            material={nodes.M740158_mesh_out.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              normalMap={normalMap}
              normalMap-flipY={false}
              map={textureRef.current}
              aoMap={aoMapout}
              aoMapIntensity={0.7}
            >
              <texture attach='map' image={canvasRef} ref={textureRef} />
            </meshStandardMaterial>
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_zipp.geometry}
            material={nodes.M740158_mesh_zipp.material}
            position={[0, -1.05, 4.19]}
            rotation={[-0.24, 0, 0]}
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
        <Environment preset='city' />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.4}
        minDistance={20}
        minZoom={20}
        maxDistance={90}
        maxZoom={90}
        enableZoom={true}
        enablePan={false}
      />
      <AdaptiveDpr />
      <Stats showPanel={0} />
    </>
  )
}

useGLTF.preload('/model/S-cycling-jersey.drc.glb')

export default ShirtComponent
