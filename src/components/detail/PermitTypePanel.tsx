import { CheckCircle } from 'lucide-react'
import type { PermitType } from '../../types'

interface PermitTypePanelProps {
  permitTypes: PermitType[]
}

export default function PermitTypePanel({ permitTypes }: PermitTypePanelProps) {
  const totalQty = permitTypes.reduce((acc, p) => acc + p.quantity, 0)
  const count = permitTypes.length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      {/* Header */}
      <div className="bg-red-700 px-4 py-3">
        <h3 className="text-white font-bold text-sm">
          Permit type to apply : {count} Types
        </h3>
      </div>

      {/* Permit Type list */}
      <div className="p-4 flex flex-col gap-3">
        {permitTypes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No permit types
          </p>
        ) : (
          permitTypes.map((pt) => (
            <div key={pt.id} className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {pt.description}
                </p>
                <p className="text-xs text-gray-500">{pt.tariffCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                  {pt.quantity} kg
                </span>
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {permitTypes.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 text-right">
          <span className="text-sm font-bold text-gray-700">
            Total Qty : {totalQty} kg
          </span>
        </div>
      )}
    </div>
  )
}
