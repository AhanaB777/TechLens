const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover shadow-sm',
  secondary:
    'bg-white text-ink border border-border hover:border-border-strong hover:bg-surface-raised',
  ghost: 'text-primary hover:bg-primary-soft',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
}

/**
 * Generic action button. Content-agnostic — callers pass label + optional icon.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  as: Tag = 'button',
  ...rest
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center rounded-[10px] font-medium
        transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon width={16} height={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon width={16} height={16} />}
    </Tag>
  )
}
