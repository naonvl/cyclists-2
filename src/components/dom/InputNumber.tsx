import cn from 'clsx'
import { ComponentProps, forwardRef, useRef } from 'react'
import MinusIcon from '@heroicons/react/24/outline/MinusIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'

interface InputNumberProps extends Omit<ComponentProps<'input'>, 'label'> {
  id: string
  error?: string
  success?: string
  required?: boolean
  placeholder?: string
  label?: string
  name: any
  decrementAction: () => void
  incrementAction: () => void
  count: number
  min?: number | undefined
  max?: number | undefined
  disabled?: boolean
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      id,
      error,
      success,
      required,
      placeholder,
      label,
      name,
      decrementAction,
      incrementAction,
      count,
      min,
      max,
      disabled,
      ...rest
    },
    ref
  ) => {
    const minusRef = useRef<HTMLDivElement>(null)
    const plusRef = useRef<HTMLDivElement>(null)

    const rootClasses = cn(
      'flex border border-1 relative rounded-[0.25rem] h-auto py-3 md:items-center items-stretch md:my-auto',
      {
        ['bg-[#EBEBEB] border-[#D4D4D4] text-[#2F2F2F]']: disabled,
      },
      {
        ['bg-white border-[#666] text-black']: !disabled,
      },
      {
        ['border-red-500 text-red-500']: error,
      }
    )

    const labelClasses = cn(
      "text-[0.75rem] pt-0 pointer-events-none -top-[0.375rem] left-[0.375rem] pl-[0.375rem] pr-[0.375rem] w-auto h-auto bg-transparent absolute select-none leading-[1] block text-[#666] max-w-[calc(100%_-_12px)] overflow-hidden z-[2] cursor-pointer before:content-[''] before:w-[calc(100%_+_0.75rem_/_2)] before:h-[0.1875rem] before:absolute before:top-[0.25rem] before:-left-[0.375rem] before:-z-[1] before:bg-white",
      {
        ["after:content-['*'] after:pl-[3px]"]: required,
      }
    )

    const inputClasses = cn(
      'placeholder:text-ellipsis placeholder:text-gray-400 rounded-[0.25rem] w-full h-full text-[1rem] block bg-transparent py-0 px-[0.6875rem] outline-0 border-0 cursor-text leading-[1.25] w-1/2 mx-auto text-center'
    )

    const minusClasses = cn(
      'w-11 h-11 p-3 flex absolute leading-[1] text-center top-[0.25rem] left-0 cursor-pointer items-center'
    )

    const plusClasses = cn(
      'w-11 h-11 p-3 flex absolute leading-[1] text-center top-[0.25rem] right-0 cursor-pointer items-center '
    )

    return (
      <div className={rootClasses}>
        <div className={minusClasses} ref={minusRef} onClick={decrementAction}>
          <MinusIcon className='w-full h-full text-black' />
        </div>
        <div className={plusClasses} ref={plusRef} onClick={incrementAction}>
          <PlusIcon className='w-6 h-6 text-black' />
        </div>
        {label ? (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        ) : null}
        <input
          id={id}
          name={name}
          value={count}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          className={inputClasses}
          type='number'
          ref={ref}
          {...rest}
        />
      </div>
    )
  }
)

InputNumber.displayName = 'CSpace.InputNumber'

export default InputNumber
