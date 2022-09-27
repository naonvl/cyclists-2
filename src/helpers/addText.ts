import { fabric } from 'fabric'
import { MutableRefObject } from 'react'

interface AddTextProps {
  text: string
  canvasRef: MutableRefObject<fabric.Canvas | null>
}

const addText = ({ text, canvasRef }: AddTextProps) => {
  const jerseyText = new fabric.IText(text, {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    left: 500,
    top: 220,
    originX: 'center',
    originY: 'center',
    selectable: true,
    editable: true,
    centeredScaling: true,
  })

  if (canvasRef.current) {
    jerseyText.enterEditing()
    canvasRef.current.renderAll()
    console.log(canvasRef.current.getActiveObject())
  }
}

export default addText
