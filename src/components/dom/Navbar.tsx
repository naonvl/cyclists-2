import cn from 'clsx'
import BurgerIcon from '@heroicons/react/24/outline/Bars3Icon'
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import SettingIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon'
import Image from '@/components/dom/Image'
import Text from '@/components/dom/Text'

interface NavbarProps {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <>
      <div className='flex px-4 bg-white lg:px-16 lg:hidden gap-2'>
        <div className='inline-flex items-center'>
          <BurgerIcon className='w-6 h-6 text-[#030505]' />
        </div>
        <div className='inline-flex items-center'>
          <SearchIcon className='w-5 h-5 text-[#030505]' />
        </div>
        <div className='inline-flex items-center mx-auto'>
          <Image
            alt='Cyclists Logo'
            src='/img/cyclists-logo.webp'
            width={150}
            height={47}
            objectFit='contain'
            layout='fill'
            quality={60}
            priority={true}
          />
        </div>
        <div className='inline-flex items-center'>
          <SettingIcon className='w-6 h-6 text-[#030505]' />
        </div>
        <div className='inline-flex items-center'>
          <ShoppingBagIcon className='w-6 h-6 text-[#030505]' />
        </div>
      </div>
      <div className='hidden px-4 bg-white lg:px-16 gap-2 lg:flex'>
        <div className='flex justify-between w-full'>
          <div className='inline-flex items-center mr-auto'>
            <Image
              alt='Cyclists Logo'
              src='/img/cyclists-logo.webp'
              width={200}
              height={41}
              objectFit='contain'
              layout='fill'
              quality={60}
              priority={true}
            />
          </div>
          <div className='inline-flex items-center mx-auto gap-5'>
            <Text className='font-bold uppercase'>jersey collections</Text>
            <Text className='font-bold uppercase'>other collections</Text>
            <Text className='font-bold uppercase'>casuals</Text>
            <Text className='font-bold uppercase'>on sale</Text>
          </div>
          <div className='inline-flex items-center ml-auto gap-4'>
            <SearchIcon className='w-5 h-5 text-[#030505]' />
            <SettingIcon className='w-6 h-6 text-[#030505]' />
            <ShoppingBagIcon className='w-6 h-6 text-[#030505]' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
