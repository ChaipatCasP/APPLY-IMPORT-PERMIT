import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: number
  valueColor?: string
  bgColor?: string
  borderColor?: string
  children?: ReactNode
  onClick?: () => void
}

export default function StatCard({
  label,
  value,
  valueColor = 'text-gray-800',
  bgColor = 'bg-white',
  borderColor = 'border-gray-100',
  children,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`${bgColor} rounded-xl shadow-sm border ${borderColor} p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className={`text-4xl font-black ${valueColor}`}>{value}</div>
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}
