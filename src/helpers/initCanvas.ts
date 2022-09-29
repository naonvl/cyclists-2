import { fabric } from 'fabric'

interface InitCanvasProps {
  width?: number
  height?: number
}

const initCanvas = ({ width, height }: InitCanvasProps) => {

  return new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    width: width,
    height: height,
    selection: false,
  })
}

export default initCanvas
