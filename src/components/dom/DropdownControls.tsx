import cn from 'clsx'
import { Fragment, useState, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import ChevronDoubleDownIcon from '@heroicons/react/24/outline/ChevronDoubleDownIcon'
import ChevronDoubleUpIcon from '@heroicons/react/24/outline/ChevronDoubleUpIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import ZoomInIcon from '@heroicons/react/24/outline/MagnifyingGlassPlusIcon'
import ZoomOutIcon from '@heroicons/react/24/outline/MagnifyingGlassMinusIcon'
import useStore from '@/helpers/store'
import Image from '@/components/dom/Image'

interface DropdownsProps {
  rootClass?: string
  menuClass?: string
  zoomInClick?: () => void
  zoomOutClick?: () => void
  rotateRightClick?: () => void
  rotateLeftClick?: () => void
}

const DropdownControls: React.FC<DropdownsProps> = ({
  rootClass,
  menuClass,
  zoomInClick,
  zoomOutClick,
  rotateRightClick,
  rotateLeftClick,
}) => {
  const buttonRef = useRef(null)
  const zoom = useStore((state) => state.zoom)
  const [open, setOpen] = useState<boolean>(true)

  const rootClasses = cn(
    'absolute z-30 top-[13rem] lg:top-[8rem] inline-block tezt-left',
    rootClass
  )
  const menuClasses = cn(
    'absolute right-0 z-10 origin-top-right rounded-md bg-white w-full focus:outline-none',
    menuClass
  )

  return (
    <Menu as='div' className={rootClasses}>
      <div>
        <Menu.Button
          onClick={() => setOpen(!open)}
          ref={buttonRef}
          className='inline-flex items-center justify-between px-2 py-2 text-sm font-medium text-black uppercase bg-gray-300 border border-gray-400 focus:outline-none'
        >
          <EyeIcon className='w-5 h-5' />
          {open ? (
            <ChevronDoubleDownIcon
              className='w-3 h-3 ml-1 -mr-1'
              aria-hidden='true'
            />
          ) : (
            <ChevronDoubleUpIcon
              className='w-3 h-3 ml-1 -mr-1'
              aria-hidden='true'
            />
          )}
        </Menu.Button>
      </div>
      <Transition
        show={open}
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className={menuClasses} static>
          <div className='w-full'>
            <button
              type='button'
              className='flex items-center justify-center w-full p-2 overflow-hidden bg-gray-100 border-b border-l border-r border-gray-400 cursor-pointer'
              onClick={zoomInClick}
              // disabled={zoom < 20 ? true : false}
            >
              <ZoomInIcon className={cn('w-5 h-5')} />
            </button>
            <button
              type='button'
              className='flex items-center justify-center w-full p-2 overflow-hidden bg-gray-100 border-b border-l border-r border-gray-400 cursor-pointer'
              onClick={zoomOutClick}
              disabled={zoom > 88 ? true : false}
            >
              <ZoomOutIcon className={cn('w-5 h-5')} />
            </button>
            <button
              type='button'
              className={cn(
                'flex items-center justify-center w-full p-2 overflow-hidden bg-gray-100 border-b border-l border-r border-gray-400 cursor-pointer'
              )}
              onClick={rotateRightClick}
            >
              <Image
                alt='Cyclists'
                layout='fill'
                src='/icons/rotate-right.svg'
                width={20}
                height={20}
                objectFit='contain'
                quality={50}
              />
            </button>
            <button
              type='button'
              className={cn(
                'flex items-center justify-center w-full p-2 overflow-hidden bg-gray-100 border-b border-l border-r border-gray-400 cursor-pointer'
              )}
              onClick={rotateLeftClick}
            >
              <Image
                alt='Cyclists'
                src='/icons/rotate-left.svg'
                layout='fill'
                width={20}
                height={20}
                objectFit='contain'
                quality={50}
              />
            </button>
            <div className='flex items-center justify-center w-full p-2 overflow-hidden bg-gray-100 border-b border-l border-r border-gray-400 cursor-pointer opacity-70'>
              <Image
                alt='Cyclists'
                src='/icons/one-step-back.svg'
                layout='fill'
                width={20}
                height={20}
                objectFit='contain'
                quality={50}
              />
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default DropdownControls
