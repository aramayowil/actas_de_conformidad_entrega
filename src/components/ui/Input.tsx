/**
 * components/ui/Input.tsx
 */
import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...rest }: Props) {
  return <input className={`input${className ? ' ' + className : ''}`} {...rest} />
}

export default Input
