import cn from 'clsx'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, MutableRefObject, useRef, FC } from 'react'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon'

interface DropdownsProps {
  rootClass?: string
  menuClass?: string
  buttonClass?: string
  children?: React.ReactNode | string
  buttonName: React.ReactNode | string
  onClick: (e: any) => void
  open: boolean
  label: string
}

const Dropdowns: React.FC<DropdownsProps> = ({
  rootClass,
  menuClass,
  buttonClass,
  children,
  buttonName,
  onClick,
  open,
  label,
}) => {
  const buttonRef = useRef(null)
  const rootClasses = cn('relative inline-block text-left', rootClass)
  const menuClasses = cn(
    'right-0 z-10 bg-white origin-top-right rounded-md focus:outline-none',
    menuClass
  )
  const buttonClasses = cn(
    'inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-white uppercase bg-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-100',
    buttonClass
  )
  const iconClasses = cn('w-5 h-5 ml-2 -mr-1')

  return (
    <Menu as='div' className={rootClasses}>
      <div>
        <Menu.Button
          onClick={onClick}
          ref={buttonRef}
          aria-label={label}
          className={buttonClasses}
        >
          {buttonName}
          {open ? (
            <ChevronUpIcon className={iconClasses} aria-hidden='true' />
          ) : (
            <ChevronDownIcon className={iconClasses} aria-hidden='true' />
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
          <div className='p-2'>{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Dropdowns
