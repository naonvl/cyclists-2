import cn from 'clsx'
import { useState } from 'react'
import CloseIcon from '@heroicons/react/24/outline/XMarkIcon'
import { SketchPicker as ReactSketchPicker } from 'react-color'

interface SketchPickerProps {
  color: string
  setCurrentColor?: (param: any) => void
}

const ColorPicker: React.FC<SketchPickerProps> = ({
  color,
  setCurrentColor,
}) => {
  const [state, setState] = useState({
    displayColorPicker: false,
    color: '',
  })

  const handleClick = () => {
    return setState({
      ...state,
      displayColorPicker: !state.displayColorPicker,
    })
  }

  const handleClose = () => {
    return setState({
      ...state,
      displayColorPicker: false,
    })
  }

  const handleChange = (color: any) => {
    setCurrentColor(color.hex)
    return setState({
      ...state,
      color: color.hex,
    })
  }

  const colorClasses = cn('w-[36px] h-[14px] rounded-[2px]')

  return (
    <>
      <div
        className='inline-block bg-white cursor-pointer p-[5px] rounded-[1px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]'
        onClick={handleClick}
      >
        <div
          className={colorClasses}
          style={{
            background: `${color}`,
          }}
        />
      </div>
      {state.displayColorPicker ? (
        <div className='absolute z-50'>
          <CloseIcon
            className='absolute w-5 h-5 text-gray-700 bg-white border border-b-0 border-gray-300 cursor-pointer -right-[1px] -top-[1.15rem]'
            onClick={handleClose}
          />
          <ReactSketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </>
  )
}

export default ColorPicker
