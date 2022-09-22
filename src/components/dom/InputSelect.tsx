import cn from 'clsx'
import { forwardRef, ComponentProps, ReactNode } from 'react'

export type OptionType = {
  value: any
  text: any
}

interface SelectProps extends Omit<ComponentProps<'select'>, 'label'> {
  id: string
  label?: string
  value: any
  name: any
  defaultValue: any
  defaultOption?: any
  required?: boolean
  options: Array<OptionType>
  icon?: ReactNode
  disabled?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      value,
      name,
      required,
      options,
      icon,
      defaultValue,
      defaultOption,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const rootClasses = cn(
      "flex border border-1 relative rounded-[0.25rem] h-[3.5rem] items-stretch after:content-[''] after:pointer-events-none after:absolute after:right-[0.85rem] after:top-0 after:bottom-0 after:w-0 after:h-0 after:m-auto after:border-l-[6px] after:border-r-[6px] after:border-l-transparent after:border-r-transparent after:border-t-[8px] after:border-t-[#666] after:rounded-[2px]",
      {
        ['bg-[#EBEBEB] border-[#D4D4D4] text-[#2F2F2F]']: disabled,
      },
      {
        ['bg-white border-[#666] text-black']: !disabled,
      }
    )

    const labelClasses = cn('text-gray-700 font-bold mb-1')

    const iconClasses = cn(
      'w-4 h-4 flex absolute leading-[1] text-center top-[1.1875rem] left-[0.75rem]'
    )

    const selectClasses = cn(
      'border border-black placeholder:text-gray-700 text-black px-3 py-2 focus:border-pink-500 focus:ring-pink-500'
    )

    const optionClasses = cn('text-sm text-gray-500')

    return (
      <>
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
        <select
          id={id}
          name={name}
          className={selectClasses}
          ref={ref}
          disabled={disabled}
          {...rest}
        >
          <option hidden disabled></option>
          <option defaultValue={defaultValue}>{defaultOption}</option>
          {options.map((_, index) => (
            <option key={index} value={_.value}>
              {_.text}
            </option>
          ))}
        </select>
      </>
    )
  }
)

Select.displayName = 'CSpace.Select'

export default Select
