import { useEffect } from 'react'
import { Html, useProgress } from '@react-three/drei'
import useStore from '@/helpers/store'
import Image from '@/components/dom/Image'

function Loader() {
  const setIsLoading = useStore((state) => state.setIsLoading)
  const { progress } = useProgress()

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false)
    }
  }, [progress, setIsLoading])

  return (
    <Html center>
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
