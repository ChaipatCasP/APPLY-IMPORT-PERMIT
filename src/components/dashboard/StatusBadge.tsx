import type { POStatus } from '../../types'

interface StatusBadgeProps {
  status: POStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<
  POStatus,
  { bg: string; text: string; border: string }
> = {
  'Waiting PI': {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  'Waiting R1/1': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
  },
  Completed: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  Received: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  'Expiry Alert': {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  'Revised PO': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  }

  const padding = size === 'md' ? 'px-4 py-1.5' : 'px-3 py-1'
  const fontSize = size === 'md' ? 'text-sm' : 'text-xs'

  return (
    <span
      className={`inline-flex items-center ${padding} rounded-full border font-semibold ${fontSize} ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}
    >
      • {status}
    </span>
  )
}
