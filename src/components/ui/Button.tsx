/**
 * components/ui/Button.tsx
 *
 * Botón minimalista con variantes (Tailwind CSS).
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'default' | 'sm' | 'lg' | 'icon'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children?: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
}

const sizeClass: Record<Size, string> = {
  default: '',
  sm: ' btn-sm',
  lg: ' btn-lg',
  icon: ' btn-icon',
}

export function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`${variantClass[variant]}${sizeClass[size]}${className ? ' ' + className : ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
