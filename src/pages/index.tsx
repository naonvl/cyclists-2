import cn from 'clsx'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, MouseEvent } from 'react'
import { fabric } from 'fabric'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import CloseIcon from '@heroicons/react/24/outline/XMarkIcon'
import { SketchPicker as ReactSketchPicker } from 'react-color'

import useStore from '@/helpers/store'
import Text from '@/components/dom/Text'

import Navbar from '@/components/dom/Navbar'
import Dropdowns from '@/components/dom/Dropdowns'
import Image from '@/components/dom/Image'
import ColorPicker from '@/components/dom/ColorPicker'
import { jerseyStyles } from '@/constants'
import InputNumber from '@/components/dom/InputNumber'
import DropdownControls from '@/components/dom/DropdownControls'
import loadSvg from '@/helpers/loadSvg'
import ModalText from '@/components/dom/ModalText'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Shirt = dynamic(() => import('@/components/canvas/Shirt'), {
  ssr: false,
})
const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

// dom components goes here
const Page = (props) => {
  const canvasRef = useRef<fabric.Canvas | null>(null)

  const isAddText = useStore((state) => state.isAddText)
  const setIsAddText = useStore((state) => state.setIsAddText)
  const changeZoomIn = useStore((state) => state.changeZoomIn)
  const changeZoomOut = useStore((state) => state.changeZoomOut)
  const texture = useStore((state) => state.texture)
  const setTexture = useStore((state) => state.setTexture)
  const changeRotateRight = useStore((state) => state.changeRotateRight)
  const changeRotateLeft = useStore((state) => state.changeRotateLeft)
  const setIsObjectFront = useStore((state) => state.setIsObjectFront)
  const isObjectFront = useStore((state) => state.isObjectFront)
  const setCameraChange = useStore((state) => state.setCameraChange)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const svgGroup = useStore((state) => state.svgGroup)
  const setColorChanged = useStore((state) => state.setColorChanged)
  const colors = useStore((state) => state.colors)
  const setColors = useStore((state) => state.setColors)
  const setSvgGroup = useStore((state) => state.setSvgGroup)

  const inputNumberRef = useRef<HTMLInputElement>(null)
  const cancelModalTextRef = useRef(null)

  const [openTextModal, setOpenTextModal] = useState(false)
  const [step, setStep] = useState(1)
  const [order, setOrder] = useState(1)

  const [dropdownOpen, setDropdownOpen] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  })
  const [addStep, setAddStep] = useState({
    name: '',
    fontSize: 16,
    fontFamily: 'Roboto',
  })

  useEffect(() => {
    loadSvg({
      texture: texture,
      canvas: canvasRef,
      setIsLoading,
      setSvgGroup,
      setColors,
      isLoading,
    })

    // cleanup
    return () => {
      canvasRef.current?.dispose()
      canvasRef.current = null
    }
  }, [isLoading, setColors, setIsLoading, setSvgGroup, texture])

  useEffect(() => {
    switch (step) {
      case 1:
        return setDropdownOpen({
          stepOne: true,
          stepTwo: false,
          stepThree: false,
        })
      case 2:
        return setDropdownOpen({
          stepOne: false,
          stepTwo: true,
          stepThree: false,
        })
      case 3:
        return setDropdownOpen({
          stepOne: false,
          stepTwo: false,
          stepThree: true,
        })

      default:
        return setDropdownOpen({
          stepOne: true,
          stepTwo: false,
          stepThree: false,
        })
    }
  }, [step])

  const handleFlipCamera = () => {
    setIsObjectFront()
    setCameraChange(true)
  }

  const handleChangeTexture = (index: number) => {
    setIsLoading(true)
    setTexture({
      path: index + 1,
      width: jerseyStyles[index].width,
      height: jerseyStyles[index].height,
    })
  }

  const decrementAction = () => {
    if (order == 1) {
      return setOrder(1)
    }

    return setOrder(order - 1)
  }

  const incrementAction = () => {
    return setOrder(order + 1)
  }

  const handleChange = (e: any) => {
    setAddStep({ ...addStep, [e.target.name]: e.target.value })
  }

  const handlePrev = () => {
    if (step == 1) {
      return setStep(1)
    }

    setStep(step - 1)
  }

  const handleNext = () => {
    if (step == 3) {
      return setStep(3)
    }

    setStep(step + 1)
  }

  const handleOpen = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const label: string | null = e.currentTarget.ariaLabel

    if (label === null) return null

    switch (label) {
      case 'stepOne':
        return setStep(1)
      case 'stepTwo':
        return setStep(2)
      case 'stepThree':
        return setStep(3)
      default:
        return setStep(1)
    }
  }

  const handleClickCanvas = () => {
    setIsAddText(false)
  }

  return (
    <>
      <Navbar />

      <div className='px-4 py-2 bg-[#f9f9f9] lg:px-16 lg:py-4'>
        <Text className='text-xs'>
          Home | Jersey Customiser. Your jersey just the way you want it.
        </Text>
      </div>

      <div className='flex flex-col px-4 mx-auto lg:px-16 lg:flex-row max-w-[1400px]'>
        {isAddText ? (
          <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-black opacity-50' />
        ) : null}
        <div className='lg:w-1/2'>
          <div className='my-5 lg:hidden'>
            <div className='relative'>
              <DropdownControls
                zoomInClick={() => changeZoomIn(true)}
                zoomOutClick={() => changeZoomOut(true)}
                rotateRightClick={() => changeRotateRight(true)}
                rotateLeftClick={() => changeRotateLeft(true)}
              />
            </div>
            <div className='relative'>
              <button
                type='button'
                className='absolute z-30 px-3 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer top-[1rem] left-[4rem]'
                onClick={handleFlipCamera}
              >
                view {isObjectFront ? 'back' : 'front'}
              </button>

              <button
                type='button'
                className='absolute z-30 inline-flex text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
              >
                <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
                <span>save</span>
              </button>
              {isAddText ? (
                <div className='absolute w-[60%] top-[24rem] left-3 z-[100]'>
                  <Text className='px-3 py-4 text-white bg-pink-500'>
                    Place the text by clicking on the model
                  </Text>
                </div>
              ) : null}
            </div>
            {Page?.r3f && props.width <= 768 ? (
              <LCanvas
                onClick={handleClickCanvas}
                style={{
                  height: '543px',
                  zIndex: isAddText ? '99' : '20',
                }}
              >
                {Page.r3f({ canvasRef })}
              </LCanvas>
            ) : null}
          </div>
          <div className='flex items-center justify-center w-full my-2 ml-auto lg:hidden gap-3'>
            <div className='relative inline-flex'>
              <Image
                alt='360'
                src='/icons/360.png'
                objectFit='contain'
                layout='fill'
                width={40}
                height={40}
                quality={80}
              />
            </div>
            <div className='relative inline-flex gap-2'>
              <Image
                alt='FAQ'
                src='/icons/FAQ.png'
                objectFit='contain'
                layout='fill'
                width={25}
                height={25}
                quality={80}
              />
              <Text>Do you have any questions?</Text>
            </div>
          </div>
          <div className='mt-5 mb-3'>
            <div className='flex justify-between overflow-hidden md:justify-between'>
              <div
                className='inline-flex flex-col items-center cursor-pointer'
                onClick={() => setStep(1)}
              >
                <Text
                  className={cn(
                    'text-2xl lg:text-3xl font-bold w-full mr-auto',
                    {
                      ['text-pink-600']: step == 1,
                    }
                  )}
                >
                  Step 1
                </Text>
                <Text
                  className={cn('text-xs uppercase', {
                    ['text-pink-600']: step == 1,
                  })}
                >
                  choose your style
                </Text>
              </div>
              <div
                className='inline-flex flex-col items-center cursor-pointer'
                onClick={() => setStep(2)}
              >
                <Text
                  className={cn(
                    'text-2xl lg:text-3xl font-bold w-full mr-auto',
                    {
                      ['text-pink-600']: step == 2,
                    }
                  )}
                >
                  Step 2
                </Text>
                <Text
                  className={cn('text-xs uppercase', {
                    ['text-pink-600']: step == 2,
                  })}
                >
                  choose your colours
                </Text>
              </div>
              <div
                className='inline-flex flex-col items-center cursor-pointer'
                onClick={() => setStep(3)}
              >
                <Text
                  className={cn(
                    'text-2xl lg:text-3xl font-bold w-full mr-auto',
                    {
                      ['text-pink-600']: step == 3,
                    }
                  )}
                >
                  Step 3
                </Text>
                <Text
                  className={cn('text-xs uppercase', {
                    ['text-pink-600']: step == 3,
                  })}
                >
                  add text [If you want]
                </Text>
              </div>
            </div>
          </div>

          <div className='mt-4 mb-1'>
            <Dropdowns
              onClick={(e: any) => handleOpen(e)}
              open={dropdownOpen.stepOne}
              buttonName='Choose your style'
              rootClass='w-full mb-2'
              menuClass='w-full'
              label='stepOne'
            >
              <div className='flex flex-row overflow-hidden'>
                {jerseyStyles.map(({ text, image }, index) => (
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center w-full cursor-pointer hover:border hover:border-pink-600 pt-3 my-2',
                      {
                        ['border border-pink-600']: texture.path === index + 1,
                      }
                    )}
                    onClick={() => handleChangeTexture(index)}
                    key={index}
                  >
                    <Image
                      alt={text}
                      src={image}
                      objectFit='contain'
                      layout='fill'
                      width='100%'
                      height={95}
                      quality={80}
                      style={{
                        maxWidth: '177px',
                      }}
                    />
                    <button
                      type='button'
                      className={cn(
                        'w-full h-[3.5rem] px-3 text-sm font-bold text-center py-2 uppercase text-black'
                      )}
                    >
                      {text}
                    </button>
                  </div>
                ))}
              </div>
            </Dropdowns>

            <Dropdowns
              onClick={(e: any) => handleOpen(e)}
              open={dropdownOpen.stepTwo}
              buttonName='Choose your colours'
              rootClass='w-full mb-2 z-20'
              menuClass='w-full'
              menuBackground='bg-[#e5e5e5]'
              label='stepTwo'
            >
              <div className='overflow-hidden grid grid-cols-3 gap-3'>
                {colors.map((data, index) => (
                  <div
                    key={index}
                    className='inline-flex flex-col items-center justify-between w-full'
                  >
                    <Text className='mr-auto text-xs text-gray-600'>
                      {data.id == 'base'
                        ? `Choose the base colour`
                        : `Choose accent colour ${data.id}`}
                    </Text>
                    <div className='relative'>
                      <ColorPicker
                        color={data.fill}
                        setCurrentColor={(e: string) => {
                          svgGroup._objects[index].set('fill', e)
                          canvasRef.current?.renderAll()
                          setColorChanged(true)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Dropdowns>

            <Dropdowns
              onClick={(e: any) => handleOpen(e)}
              open={dropdownOpen.stepThree}
              buttonName='Add text'
              rootClass='w-full mb-2'
              menuClass='w-full'
              label='stepThree'
            >
              <div className='flex flex-col w-full overflow-hidden'>
                <div className='mx-auto'>
                  <button
                    onClick={() => setOpenTextModal(true)}
                    type='button'
                    className="px-4 py-3 text-sm text-white uppercase bg-pink-500 before:content-[' '] before:w-[25%] md:before:w-[30%] before:h-[3px] before:bg-pink-300 before:absolute before:left-6 before:top-7 after:content-[' after:w-[25%] md:after:w-[30%] after:h-[3px] after:bg-pink-300 after:absolute after:right-6 after:top-7 hover:bg-pink-600"
                  >
                    create text
                  </button>
                </div>
              </div>
            </Dropdowns>
          </div>

          <div className='mb-3'>
            <div className='p-3 bg-pink-200'>
              <Text className='text-xs font-bold text-black uppercase'>
                Need a custom design for your club, company or team? we can give
                you exactly what you need with no minimum order and quick
                turnaround time.{' '}
                <span className='text-pink-500'>just contact us</span>.
              </Text>
            </div>
          </div>

          <div className='my-2'>
            <div className='flex justify-between'>
              <button
                type='button'
                className={cn(
                  'text-center py-3 px-6 lg:py-2 lg:px-8 uppercase text-sm hover:border hover:border-black hover:bg-white hover:text-black',
                  {
                    ['border border-black bg-white text-black']:
                      dropdownOpen.stepOne,
                  },
                  {
                    ['bg-pink-600 border border-pink-600 text-white']:
                      dropdownOpen.stepTwo || dropdownOpen.stepThree,
                  }
                )}
                onClick={handlePrev}
              >
                prev
              </button>
              <button
                type='button'
                className={cn(
                  'text-center py-3 px-6 lg:py-2 lg:px-8 uppercase text-sm hover:border hover:border-black hover:bg-white hover:text-black',
                  {
                    ['border border-black bg-white text-black']:
                      dropdownOpen.stepThree,
                  },
                  {
                    ['bg-pink-600 border border-pink-600 text-white']:
                      dropdownOpen.stepOne || dropdownOpen.stepTwo,
                  }
                )}
                onClick={handleNext}
              >
                next
              </button>
            </div>
          </div>

          <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
            <InputNumber
              id='totalOrder'
              name='numberOfPeople'
              onChange={handleChange}
              value={order}
              min={1}
              decrementAction={decrementAction}
              incrementAction={incrementAction}
              count={order}
              ref={inputNumberRef}
            />
            <button
              type='button'
              className={cn(
                'w-full px-4 text-center py-3 text-sm uppercase bg-pink-600 border border-pink-600 text-white my-2 hover:border hover:border-black hover:bg-white hover:text-black'
              )}
            >
              add to cart
            </button>
          </div>
        </div>

        <div className='block my-2 lg:hidden'>
          <Text className='text-lg font-bold text-center'>
            £ 51.99 | <span className='text-sm'>save £13.00</span>{' '}
            <span className='text-red-500'>(25% off)</span>
          </Text>
        </div>

        <div className='hidden mx-5 lg:w-1/2 lg:block'>
          <div className='relative'>
            <DropdownControls
              zoomInClick={() => changeZoomIn(true)}
              zoomOutClick={() => changeZoomOut(true)}
              rotateRightClick={() => changeRotateRight(true)}
              rotateLeftClick={() => changeRotateLeft(true)}
            />
          </div>
          <div className='relative'>
            <button
              type='button'
              className='absolute z-30 px-3 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer top-[1rem] left-[4rem]'
              onClick={handleFlipCamera}
            >
              view {isObjectFront ? 'back' : 'front'}
            </button>

            <button
              type='button'
              className='absolute z-30 inline-flex text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
            >
              <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
              <span>save</span>
            </button>
            {isAddText ? (
              <div className='absolute w-[45%] top-[24rem] left-3 z-[100]'>
                <Text className='px-3 py-4 text-white bg-pink-500'>
                  Place the text by clicking on the model
                </Text>
              </div>
            ) : null}
          </div>
          {Page?.r3f && props.width > 768 ? (
            <LCanvas
              onClick={handleClickCanvas}
              style={{
                width: '596px',
                height: '543px',
                zIndex: isAddText ? '99' : '20',
              }}
            >
              {Page.r3f({ canvasRef })}
            </LCanvas>
          ) : null}
          <div className='items-center justify-center hidden w-full my-2 ml-auto lg:flex gap-3'>
            <div className='relative inline-flex'>
              <Image
                alt='360'
                src='/icons/360.png'
                objectFit='contain'
                layout='fill'
                width={40}
                height={40}
                quality={80}
              />
            </div>
            <div className='relative inline-flex gap-2'>
              <Image
                alt='FAQ'
                src='/icons/FAQ.png'
                objectFit='contain'
                layout='fill'
                width={25}
                height={25}
                quality={80}
              />
              <Text>Do you have any questions?</Text>
            </div>
          </div>
          <div className='hidden my-2 lg:block'>
            <Text className='text-lg font-bold text-center'>
              £ 51.99 | <span className='text-sm'>save £13.00</span>{' '}
              <span className='text-red-500'>(25% off)</span>
            </Text>
          </div>
        </div>
      </div>

      <canvas id='canvas' style={{ display: 'none' }} />
      <ModalText
        open={openTextModal}
        setOpen={setOpenTextModal}
        cancelButtonRef={cancelModalTextRef}
      />
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = ({ canvasRef }) => (
  <>
    <Shirt canvasRef={canvasRef} />
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title:
        'Cyclists | Jersey Customiser. Your jersey just the way you want it.',
    },
  }
}

export default Page
