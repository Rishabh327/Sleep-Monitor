export function Card({ children, className = '' }) {
  return <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm ${className}`}>{children}</div>
}

export function CardHeader({ title, action, className = '' }) {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between ${className}`}>
      <h3 className="font-semibold">{title}</h3>
      {action}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>
}



