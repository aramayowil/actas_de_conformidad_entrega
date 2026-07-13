/**
 * components/ui/Textarea.tsx
 */
import type { TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...rest }: Props) {
  return (
    <textarea
      className={`input min-h-[60px] resize-y${className ? ' ' + className : ''}`}
      {...rest}
    />
  )
}

export default Textarea
