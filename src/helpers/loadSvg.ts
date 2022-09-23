import { MutableRefObject } from 'react'
import { fabric } from 'fabric'

interface LoadSVGProps {
  path: number
  canvas: MutableRefObject<fabric.Canvas | null>
  width?: number
  height?: number
  setIsLoading?: (param: boolean) => void
  setSvgGroup?: (data: any) => void
  setColors?: (any) => void
}

const loadSvg = ({
  path,
  canvas,
  width = 512,
  height = 512,
  setIsLoading,
  setSvgGroup,
  setColors,
}: LoadSVGProps) => {
  fabric.loadSVGFromURL(`/textures/Jersey_COLOR${path}.svg`, (objects) => {
    const svgData = fabric.util.groupSVGElements(objects, {
      width: width,
      height: height,
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
  })
}
export default loadSvg
