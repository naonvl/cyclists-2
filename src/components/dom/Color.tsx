import cn from 'clsx'
import { useState, useEffect } from 'react'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { colorPallete } from '@/constants'
import ArrowSmallLeftIcon from '@heroicons/react/24/outline/ArrowSmallLeftIcon'
import ArrowSmallRightIcon from '@heroicons/react/24/outline/ArrowSmallRightIcon'
import useStore from '@/helpers/store'

interface SketchPickerProps {
  color: string
  setCurrentColor?: (param: any) => void
}

const Color: React.FC<SketchPickerProps> = ({ color, setCurrentColor }) => {
  const colors = useStore((state) => state.colors)
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()
  const [pagination, setPagination] = useState(1)
  const [currentColor, setColor] = useState('')
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  useEffect(() => {
    if (!currentColor) {
      setColor(color)
    }
  }, [color, currentColor, setColor])

  const handleChange = (color: string) => {
    setCurrentColor(color)
    return setColor(color)
  }

  const handlePrevPage = () => {
    if (pagination == 1) {
      return setPagination(3)
    }

    setPagination(pagination - 1)
  }

  const handleNextPage = () => {
    if (pagination == 3) {
      return setPagination(1)
    }

    setPagination(pagination + 1)
  }
  return (
    <Popover className='relative'>
      {({ open }) => (
        <>
          <Popover.Button
            ref={setReferenceElement}
            className='inline-block my-2 mr-auto bg-white cursor-pointer p-[5px] rounded-[1px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]'
          >
            <div
              className='w-[36px] h-[14px] rounded-[2px]'
              style={{
                background: `${currentColor}`,
              }}
            />
          </Popover.Button>

          {open ? (
            <Popover.Panel
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className='z-10 px-2 py-3 bg-[#f9f9f9] w-[18rem]'
            >
              <div className='w-full'>
                {pagination === 1 && (
                  <>
                    <div className='flex flex-row gap-2'>
                      <div
                        className={cn(
                          'relative border-1 border-black w-[49px] h-[29px] rounded-[2px] cursor-pointer',
                          {
                            ["before:content-[''] before:absolute before:right-0 before:bottom-0 before:w-0 before:h-0 before:z-[3] before:-rotate-90 before:border-t-[24px] before:border-l-[24px] before:border-transparent after:content-[''] after:absolute after:-right-[2px] after:-bottom-[2.5px] after:w-full after:h-full after:bg-[url('/icons/checked.svg')] after:bg-no-repeat after:bg-right after:bg-contain after:z-[4]"]:
                              '#FFFFFF' === currentColor,
                          }
                        )}
                        onClick={() => handleChange('#FFFFFF')}
                        style={{
                          background: '#fff',
                        }}
                      >
                        {/* <span className="absolute border-2 border-[#476bcc] left-[6px]" */}
                      </div>
                      <div
                        className={cn(
                          'relative w-[49px] h-[29px] rounded-[2px] cursor-pointer',
                          {
                            ["before:content-[''] before:absolute before:right-0 before:bottom-0 before:w-0 before:h-0 before:z-[3] before:-rotate-90 before:border-t-[24px] before:border-l-[24px] before:border-transparent after:content-[''] after:absolute after:-right-[2px] after:-bottom-[2.5px] after:w-full after:h-full after:bg-[url('/icons/checked.svg')] after:bg-no-repeat after:bg-right after:bg-contain after:z-[4]"]:
                              '#000000' === currentColor,
                          }
                        )}
                        onClick={() => handleChange('#000000')}
                        style={{
                          background: '#000',
                        }}
                      />
                    </div>
                    {colorPallete.mainPallete1.map((colors, index) => (
                      <div className='flex flex-row my-2 gap-3' key={index}>
                        {colors.map(({ name, color }, index) => (
                          <div
                            className={cn(
                              'relative w-[49px] h-[29px] rounded-[2px] cursor-pointer',
                              {
                                ["before:content-[''] before:absolute before:right-0 before:bottom-0 before:w-0 before:h-0 before:z-[3] before:-rotate-90 before:border-t-[24px] before:border-l-[24px] before:border-transparent after:content-[''] after:absolute after:-right-[2px] after:-bottom-[2.5px] after:w-full after:h-full after:bg-[url('/icons/checked.svg')] after:bg-no-repeat after:bg-right after:bg-contain after:z-[4]"]:
                                  color === currentColor,
                              }
                            )}
                            style={{
                              background: `${color}`,
                            }}
                            onClick={() => handleChange(color)}
                            key={index}
                          />
                        ))}
                      </div>
                    ))}
                  </>
                )}

                {pagination === 2 &&
                  colorPallete.mainPallete2.map((colors, index) => (
                    <div className='flex flex-row my-2 gap-3' key={index}>
                      {colors.map(({ name, color }, index) => (
                        <div
                          className={cn(
                            'relative w-[49px] h-[29px] rounded-[2px] cursor-pointer',
                            {
                              ["before:content-[''] before:absolute before:right-0 before:bottom-0 before:w-0 before:h-0 before:z-[3] before:-rotate-90 before:border-t-[24px] before:border-l-[24px] before:border-transparent after:content-[''] after:absolute after:-right-[2px] after:-bottom-[2.5px] after:w-full after:h-full after:bg-[url('/icons/checked.svg')] after:bg-no-repeat after:bg-right after:bg-contain after:z-[4]"]:
                                color === currentColor,
                            }
                          )}
                          style={{
                            background: `${color}`,
                          }}
                          onClick={() => handleChange(color)}
                          key={index}
                        />
                      ))}
                    </div>
                  ))}

                {pagination === 3 &&
                  colorPallete.mainPallete3.map((colors, index) => (
                    <div className='flex flex-row my-2 gap-3' key={index}>
                      {colors.map(({ name, color }, index) => (
                        <div
                          className={cn(
                            'relative w-[49px] h-[29px] rounded-[2px] cursor-pointer',
                            {
                              ["before:content-[''] before:absolute before:right-0 before:bottom-0 before:w-0 before:h-0 before:z-[3] before:-rotate-90 before:border-t-[24px] before:border-l-[24px] before:border-transparent after:content-[''] after:absolute after:-right-[2px] after:-bottom-[2.5px] after:w-full after:h-full after:bg-[url('/icons/checked.svg')] after:bg-no-repeat after:bg-right after:bg-contain after:z-[4]"]:
                                color === currentColor,
                            }
                          )}
                          style={{
                            background: `${color}`,
                          }}
                          onClick={() => handleChange(color)}
                          key={index}
                        />
                      ))}
                    </div>
                  ))}

                <div className=''></div>
                <div className='flex flex-wrap justify-between px-2 py-1 bg-gradient-to-t from-pink-400 to-pink-500'>
                  <div className='flex' onClick={handlePrevPage}>
                    <ArrowSmallLeftIcon className='w-5 h-auto text-black cursor-pointer' />
                  </div>
                  <div className='flex gap-2'>
                    {[1, 2, 3].map((num, index) => (
                      <p
                        className={cn('text-sm cursor-pointer', {
                          ['font-bold']: num === pagination,
                        })}
                        onClick={() => setPagination(num)}
                        key={index}
                      >
                        {num}
                      </p>
                    ))}
                  </div>
                  <div className='flex' onClick={handleNextPage}>
                    <ArrowSmallRightIcon className='w-5 h-auto text-black cursor-pointer' />
                  </div>
                </div>
              </div>
            </Popover.Panel>
          ) : null}
        </>
      )}
    </Popover>
  )
}

export default Color
