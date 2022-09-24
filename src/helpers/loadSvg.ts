import { MutableRefObject } from 'react'
import { fabric } from 'fabric'

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
}

const loadSvg = ({
  texture,
  canvas,
  setIsLoading,
  setSvgGroup,
  setColors,
}: LoadSVGProps) => {
  fabric.loadSVGFromURL(
    `/textures/Jersey_COLOR${texture.path}.svg`,
    (objects) => {
      const svgData = fabric.util.groupSVGElements(objects, {
        width: texture.width,
        height: texture.height,
        selectable: false,
        crossOrigin: 'Anonymous',
      })

      svgData.top = 0
      svgData.left = 0
      // setSvgGroup(svgData)

      // svgData.map((svg) => setColors({ id: svg.id, color: svg.color }))

      if (canvas.current) {
        if (canvas.current._objects[0] != undefined) {
          canvas.current.remove(canvas.current._objects[0])
        }

        canvas.current.add(svgData)
        canvas.current.sendToBack(svgData)
        canvas.current.renderAll()
        setIsLoading(false)
      }
    }
  )
}
export default loadSvg
