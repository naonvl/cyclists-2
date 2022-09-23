import { useEffect } from 'react'
import { Html, useProgress } from '@react-three/drei'
import Image from '@/components/dom/Image'
import useStore from '@/helpers/store'

function Loader() {
  const { progress } = useProgress()
  const setProgress = useStore((state) => state.setProgress)

  useEffect(() => {
    if (progress === 100) {
      setProgress(false)
    }
  }, [progress, setProgress])

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
