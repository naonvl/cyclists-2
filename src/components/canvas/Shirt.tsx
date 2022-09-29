/* eslint-disable no-console */
/* eslint-disable no-var */
import * as THREE from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { fabric } from 'fabric'
import Loader from '@/components/canvas/Loader'
import useStore from '@/helpers/store'
import { useState, useRef, Suspense, MutableRefObject, useEffect } from 'react'
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
  setRay: any
}

const ShirtComponent = ({ props, canvasRef, setRay }: ShirtProps) => {
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
  const scene = useThree((state) => state.scene)
  const colorChanged = useStore((state) => state.colorChanged)
  const setColorChanged = useStore((state) => state.setColorChanged)
  const isAddText = useStore((state) => state.isAddText)
  var raycaster = new THREE.Raycaster()
  var mouse = new THREE.Vector2()
  const [getUv, setGetUv] = useState() as any
  var raycastContainer = document.getElementById('rendered')
  var onClickPosition = new THREE.Vector2()
  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  var isMobile = false
  const initPatch = () => {
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = 'blue'
    fabric.Object.prototype.cornerStyle = 'circle'
    if (isMobile == true) {
      fabric.Object.prototype.cornerSize = 15
    } else {
      fabric.Object.prototype.cornerSize = 12
    }
    fabric.Canvas.prototype.getPointer = ((e, ignoreZoom) => {
      if (canvasRef.current._absolutePointer && !ignoreZoom) {
        return canvasRef.current._absolutePointer
      }
      if (canvasRef.current._pointer && ignoreZoom) {
        return canvasRef.current._pointer
      }
      var simEvt
      if (e.touches != undefined) {
        simEvt = new MouseEvent(
          {
            touchstart: 'mousedown',
            touchmove: 'mousemove',
            touchend: 'mouseup',
          }[e.type],
          {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 1,
            screenX: Math.round(e.changedTouches[0].screenX),
            screenY: Math.round(e.changedTouches[0].screenY),
            clientX: Math.round(e.changedTouches[0].clientX),
            clientY: Math.round(e.changedTouches[0].clientY),
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            relatedTarget: null,
          }
        )
        var pointer = fabric.util.getPointer(simEvt),
          upperCanvasEl = canvasRef.current.upperCanvasEl,
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale
      } else {
        var pointer = fabric.util.getPointer(e),
          upperCanvasEl = canvasRef.current.upperCanvasEl,
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale
      }
      if (!boundsWidth || !boundsHeight) {
        if ('top' in bounds && 'bottom' in bounds) {
          boundsHeight = Math.abs(bounds.top - bounds.bottom)
        }
        if ('right' in bounds && 'left' in bounds) {
          boundsWidth = Math.abs(bounds.right - bounds.left)
        }
      }
      canvasRef.current.calcOffset()
      pointer.x = Math.round(pointer.x) - canvasRef.current._offset.left
      pointer.y = Math.round(pointer.y) - canvasRef.current._offset.top
      /* BEGIN PATCH CODE */
      if (e.target !== canvasRef.current.upperCanvasEl) {
        var positionOnScene
        if (isMobile == true) {
          positionOnScene = getPositionOnScene(raycastContainer, simEvt)
          if (positionOnScene) {
            // console.log(simEvt.type);
            pointer.x = positionOnScene.x
            pointer.y = positionOnScene.y
          }
        } else {
          positionOnScene = getPositionOnScene(raycastContainer, e)

          if (positionOnScene) {
            // console.log(e.type);
            pointer.x = positionOnScene.x
            pointer.y = positionOnScene.y
          }
        }
      }
      /* END PATCH CODE */
      if (!ignoreZoom) {
        pointer = canvasRef.current.restorePointerVpt(pointer)
      }

      if (boundsWidth === 0 || boundsHeight === 0) {
        cssScale = { width: 1, height: 1 }
      } else {
        cssScale = {
          width: upperCanvasEl.width / boundsWidth,
          height: upperCanvasEl.height / boundsHeight,
        }
      }

      return {
        x: pointer.x * cssScale.width,
        y: pointer.y * cssScale.height,
      }
    })(fabric.Canvas.prototype.getPointer)
  }
  useEffect(() => {
    initPatch()
  })

  const { nodes } = useGLTF('/model/n-cycling-jersey.drc.glb') as GLTFResult

  const getIntersects = (point, objects) => {
    mouse.set(point.x * 2 - 1, -(point.y * 2) + 1)
    raycaster.setFromCamera(mouse, camera)
    return raycaster.intersectObjects(objects)
  }
  const getRealPosition = (axis, value) => {
    let CORRECTION_VALUE = axis === 'x' ? 4.5 : 5.5
    return Math.round(value * 2048) - CORRECTION_VALUE
  }
  const getMousePosition = (dom, x, y) => {
    let rect = dom.getBoundingClientRect()
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height]
  }
  const getPositionOnScene = (sceneContainer, evt) => {
    let array = getMousePosition(sceneContainer, evt.clientX, evt.clientY)
    onClickPosition.fromArray(array)
    let intersects: any = getIntersects(onClickPosition, scene.children)
    if (intersects.length > 0 && intersects[0].uv) {
      let uv = intersects[0].uv
      setRay(uv)
      intersects[0].object.material.map.transformUv(uv)
      let circle = new fabric.Circle({
        radius: 20,
        left: getRealPosition('x', uv.x),
        top: getRealPosition('y', uv.y),
        fill: 'red',
      })
      // canvasRef.current.add(circle)
      canvasRef.current.renderAll()
      // canvasRef.current.setActiveObject(circle)

      return {
        x: getRealPosition('x', uv.x),
        y: getRealPosition('y', uv.y),
      }
    }
    return null
  }
  // Subscribe canvasRef.current component to the render-loop, rotate the mesh every frame
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

    if (canvasRef.current && isAddText) {
      state.gl.domElement.style.cursor = 'crosshair'
      canvasRef.current.on('mouse:over', (opt) => {
        console.log(opt)
      })
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
          {/* <mesh
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
          </mesh> */}
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
              // map={textureRef.current}
              color='#ccc'
            />
          </mesh>
          <mesh
            onClick={(e: any) => {
              const positionOnScene = getPositionOnScene(raycastContainer, e)
              if (positionOnScene) {
                const canvasRect = canvasRef.current._offset
                const simEvt = new MouseEvent(e.type, {
                  clientX: canvasRect.left + positionOnScene.x * 1,
                  clientY: canvasRect.top + positionOnScene.y * 1,
                })
                canvasRef.current.upperCanvasEl.dispatchEvent(simEvt)
              }
            }}
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

export default ShirtComponent
