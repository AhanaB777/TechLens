export default function LoadingSpinner({ size = 20, label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-block animate-spin rounded-full border-2 border-border border-t-primary"
      style={{ width: size, height: size }}
    />
  )
}
