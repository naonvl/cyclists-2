import { fabric } from 'fabric'
import { MutableRefObject } from 'react'

interface AddTextProps {
  text: string
  canvasRef: MutableRefObject<fabric.Canvas | null>
  left: number
  top: number
}

const addText = ({ text, canvasRef, left, top }: AddTextProps) => {
  const jerseyText = new fabric.IText(text, {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    left: left,
    top: top,
    originX: 'center',
    originY: 'center',
    selectable: true,
    editable: true,
    centeredScaling: true,
  })

  if (canvasRef.current) {
    canvasRef.current.add(jerseyText)
    canvasRef.current.setActiveObject(jerseyText)
    canvasRef.current.renderAll()
  }
}

export default addText
