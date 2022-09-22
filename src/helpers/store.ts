import create from 'zustand'
import shallow from 'zustand/shallow'

import type { NextRouter } from 'next/router'
import type { MutableRefObject } from 'react'

interface State {
  texturePath: number
  setTexturePath: (index: number) => void
  isLoading: boolean
  setIsLoading: (param: boolean) => void
  dropdownOpen: {
    stepOne: boolean
    stepTwo: boolean
    stepThree: boolean
  }
  zoom: number
  setZoom: (value: number) => void
  zoomIn: boolean
  zoomOut: boolean
  changeZoomIn: (param: boolean) => void
  changeZoomOut: (param: boolean) => void
  rotate: number
  setRotate: (value: number) => void
  rotateRight: boolean
  rotateLeft: boolean
  changeRotateRight: (param: boolean) => void
  changeRotateLeft: (param: boolean) => void
  isObjectFront: boolean
  setIsObjectFront: () => void
  cameraChanged: boolean
  setCameraChange: (param: boolean) => void
  router: NextRouter
  dom: MutableRefObject<any>
}

const useStoreImpl = create<State>()((set) => ({
  texturePath: 1,
  setTexturePath: (index) => set(() => ({ texturePath: index + 1 })),
  isLoading: true,
  setIsLoading: (param: boolean) => set((state) => ({ isLoading: param })),
  dropdownOpen: {
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  },
  zoom: 1,
  setZoom: (value) => set(() => ({ zoom: value })),
  zoomIn: false,
  changeZoomIn: (param) => set(() => ({ zoomIn: param })),
  zoomOut: false,
  changeZoomOut: (param) => set(() => ({ zoomOut: param })),
  rotate: 0,
  setRotate: (value) => set(() => ({ rotate: value })),
  rotateRight: false,
  rotateLeft: false,
  changeRotateRight: (param) => set(() => ({ rotateRight: param })),
  changeRotateLeft: (param) => set(() => ({ rotateLeft: param })),
  isObjectFront: true,
  setIsObjectFront: () =>
    set((state) => ({ isObjectFront: !state.isObjectFront })),
  cameraChanged: false,
  setCameraChange: (param) => set(() => ({ cameraChanged: param })),
  router: null,
  dom: null,
}))

const useStore = (sel: { (state: any): any }) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState }
export default useStore
