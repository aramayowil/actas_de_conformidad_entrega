/**
 * components/ui/Label.tsx
 */
import type { LabelHTMLAttributes } from 'react'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = '', children, ...rest }: Props) {
  return (
    <label className={`label${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </label>
  )
}

export default Label
