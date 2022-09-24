import create from 'zustand'
import shallow from 'zustand/shallow'

import type { NextRouter } from 'next/router'
import type { MutableRefObject } from 'react'

interface State {
  texturePath: number
  setTexturePath: (index: number) => void
  progress: boolean
  setProgress: (param: boolean) => void
  isLoading: boolean
  setIsLoading: (param: boolean) => void
  dropdownOpen: {
    stepOne: boolean
    stepTwo: boolean
    stepThree: boolean
  }
  canvas: MutableRefObject<any>
  setCanvas: (param: MutableRefObject<any>) => void
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
  svgGroup: Array<any>
  setSvgGroup: (data: any) => void
  colors: Array<any>
  setColors: (data: any) => void
  colorChanged: boolean
  setColorChanged: (param: boolean) => void
  texture: {
    path: number
    width: number
    height: number
  }
  setTexture: (data: { path: number; width: number; height: number }) => void
  router: NextRouter
  dom: MutableRefObject<any>
}

const useStoreImpl = create<State>()((set) => ({
  texture: {
    path: 1,
    width: 2048,
    height: 2048,
  },
  setTexture: (data: { path: number; width: number; height: number }) =>
    set(() => ({ texture: data })),
  colorChanged: false,
  setColorChanged: (param) => set(() => ({ colorChanged: param })),
  canvas: null,
  setCanvas: (param: MutableRefObject<any>) =>
    set((state) => {
      state.canvas = param
      return undefined
    }),
  texturePath: 1,
  setTexturePath: (index) => set(() => ({ texturePath: index + 1 })),
  colors: [],
  setColors: (data: any) =>
    set((state) => {
      state.colors.push(data)
      return undefined
    }),
  svgGroup: [],
  setSvgGroup: (data: any) =>
    set((state) => {
      state.svgGroup.push(data)
      return undefined
    }),
  progress: true,
  setProgress: (param: boolean) => set(() => ({ progress: param })),
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
