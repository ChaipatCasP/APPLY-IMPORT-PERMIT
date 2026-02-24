import { format } from 'date-fns'
import type { POItem } from '../../types'
import StatusBadge from '../dashboard/StatusBadge'

interface POHeaderProps {
  po: POItem
  onComplete?: () => void
}

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), 'dd-MM-yyyy')
  } catch {
    return dateStr
  }
}

export default function POHeader({ po, onComplete }: POHeaderProps) {
  const isComplete = po.status === 'Completed'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
      {/* Row 1 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span className="text-sm">
            <span className="text-blue-600 font-semibold">PO No.</span>{' '}
            <span className="font-bold text-blue-700">{po.poNumber}</span>
          </span>
          <span className="text-sm text-blue-600">
            Date: <span className="font-semibold">{formatDate(po.date)}</span>
          </span>
          <span className="text-sm text-blue-600">
            ETD: <span className="font-semibold">{formatDate(po.etd)}</span>
          </span>
          <span className="text-sm text-blue-600">
            Origin: <span className="font-semibold">{po.origin}</span>
          </span>
          <span className="text-sm text-blue-600">
            Temp:{' '}
            <span className="font-semibold text-blue-700">{po.temp}</span>
          </span>
          <span className="text-sm text-blue-600">
            Buyer: <span className="font-semibold">{po.buyer}</span>
          </span>
        </div>

        {/* Status / Action */}
        <div className="flex-shrink-0">
          {isComplete ? (
            <button
              onClick={onComplete}
              disabled
              className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg text-sm cursor-default"
            >
              Complete
            </button>
          ) : (
            <StatusBadge status={po.status} size="md" />
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
        <span className="text-sm text-blue-600 font-semibold">
          {po.supplier} ({po.supplierCode})
        </span>
        <span className="text-sm text-gray-500">
          ETA: <span className="font-semibold text-blue-600">{formatDate(po.eta)}</span>
        </span>
        <span className="text-sm text-gray-500">
          Transport:{' '}
          <span className="font-semibold text-blue-600">{po.freight}</span>
        </span>
        <span className="text-sm text-gray-500">
          Port:{' '}
          <span className="font-semibold text-blue-600">{po.port}</span>
        </span>
        <span className="text-sm text-gray-500">
          PO Approval date:{' '}
          <span className="font-semibold text-blue-600">
            {formatDate(po.poApprovalDate)}
          </span>
        </span>
      </div>
    </div>
  )
}
