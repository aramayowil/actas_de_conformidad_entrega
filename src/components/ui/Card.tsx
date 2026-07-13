/**
 * components/ui/Card.tsx
 */
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div className={`card${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...rest }: CardProps) {
  return (
    <div className={`card-header${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function CardContent({ className = '', children, ...rest }: CardProps) {
  return (
    <div className={`card-content${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...rest }: CardProps) {
  return (
    <h3 className={`card-title${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = '', children, ...rest }: CardProps) {
  return (
    <p className={`card-description${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </p>
  )
}

export default Card
