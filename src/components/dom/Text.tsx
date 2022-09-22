import React, { JSXElementConstructor, CSSProperties } from 'react'
import cn from 'clsx'

type Variant = 'title' | 'sub-title' | 'body' | 'small'

export interface Props {
  variant?: Variant
  className?: string
  style?: CSSProperties
  html?: string
  children: React.ReactNode | any
}

const Text = ({
  variant = 'body',
  className,
  style,
  html,
  children,
}: Props) => {
  const componentsMap: {
    [P in Variant]: React.ComponentType<any> | string
  } = {
    title: 'h1',
    'sub-title': 'h2',
    body: 'p',
    small: 'small',
  }

  const stylesMap: {
    [P in Variant]: string
  } = {
    title: 'font-sans font-bold text-xl md:text-3xl',
    'sub-title': 'font-sans font-semibold text-lg md:text-xl',
    body: 'font-sans',
    small: 'font-mono text-xs md:text-sm',
  }

  const Component:
    | JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap[variant]

  const htmlContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {}

  return (
    <Component
      className={cn(stylesMap[variant], className)}
      style={style}
      {...htmlContentProps}
    >
      {children}
    </Component>
  )
}

export default Text
