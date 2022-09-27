import { MutableRefObject } from 'react'
import { fabric } from 'fabric'

import addText from '@/helpers/addText'

interface LoadSVGProps {
  texture: {
    path: number
    width: number
    height: number
  }
  canvas: MutableRefObject<fabric.Canvas | null>
  setIsLoading?: (param: boolean) => void
  setSvgGroup?: (data: any) => void
  setColors?: (any) => void
  isLoading: boolean
}

const loadSvg = ({
  texture,
  canvas,
  setIsLoading,
  setSvgGroup,
  setColors,
}: LoadSVGProps) => {
  canvas.current = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    width: texture.width,
    height: texture.height,
    selection: false,
  })

  let colors: Array<{ id: any; fill: any }> = []

  return fabric.loadSVGFromURL(
    `/textures/Jersey_COLOR${texture.path}.svg`,
    (objects) => {
      const svgData = fabric.util.groupSVGElements(objects, {
        width: texture.width,
        height: texture.height,
        selectable: false,
        crossOrigin: 'anonymous',
      }) as any

      svgData.top = 0
      svgData.left = 0
      setSvgGroup(svgData)

      for (let i = 0; i < svgData._objects.length; i++) {
        colors[i] = {
          id: svgData._objects[i].id,
          fill: svgData._objects[i].fill,
        }
      }

      setColors(colors)

      if (canvas.current && canvas.current._objects[0] == undefined) {
        canvas.current.remove(canvas.current._objects[0])
      }

      if (canvas.current && svgData._objects.length > 0) {
        canvas.current.add(svgData)
        canvas.current.sendToBack(svgData)
        canvas.current.renderAll()
        // addText({ text: 'Nigel', canvasRef: canvas })
        setIsLoading(false)
      }
    }
  )
}
export default loadSvg
