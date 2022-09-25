import cn from 'clsx'
import Image, { ImageProps as DefaultImageProps } from 'next/image'

interface ImageProps extends DefaultImageProps {
  alt: string
  src: string
  width: number | string
  height: number | string
  objectFit: 'cover' | 'contain' | 'none'
  layout: 'fill' | 'fixed' | 'intrinsic' | 'responsive'
  quality: number | string
  style?: React.CSSProperties | undefined
  className?: string
  rootClass?: string
}

const ImageComponent = ({
  alt,
  src,
  width,
  height,
  objectFit = 'none',
  layout = 'fill',
  quality = 60,
  className,
  rootClass,
  style,
  ...rest
}: ImageProps) => {
  const containerClasses = cn(`relative`, rootClass, {
    ['h-auto']: !height,
  })

  if (layout === 'fill') {
    return (
      <div
        className={containerClasses}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width,
          ...style,
        }}
      >
        <Image
          alt={alt}
          src={src}
          layout='fill'
          objectFit={objectFit}
          quality={quality}
          className={className}
          {...rest}
        />
      </div>
    )
  }

  return (
    <Image
      alt={alt}
      src={src}
      layout={layout}
      objectFit={objectFit}
      width={width}
      height={height}
      quality={quality}
      {...rest}
    />
  )
}

export default ImageComponent
