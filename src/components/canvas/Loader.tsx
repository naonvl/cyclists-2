import { Html } from '@react-three/drei'
import Image from '@/components/dom/Image'

function Loader() {
  return (
    <Html as='div' transform={false} wrapperClass='loader'>
      <div className='relative w-full h-auto ml-auto'>
        <Image
          alt='Cyclists Logo'
          src='/img/loader.gif'
          layout='fill'
          width={600}
          height={599}
          objectFit='cover'
          className='z-[100]'
          style={{
            position: 'absolute',
            top: '-14rem',
            right: '-62rem',
          }}
          quality={60}
          priority={true}
        />
      </div>
    </Html>
  )
}

export default Loader
