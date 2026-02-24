import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ExternalLink, Thermometer, Wind, Snowflake, Package } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import StatusBadge from './StatusBadge'
import type { POItem } from '../../types'

function TempIcon({ temp }: { temp: string }) {
  if (temp.includes('FROZEN') || temp.includes('-18'))
    return <Snowflake size={14} className="text-blue-500" />
  if (temp.includes('CHILLED') || temp.includes('Chilled'))
    return <Thermometer size={14} className="text-cyan-500" />
  if (temp.includes('COOL'))
    return <Wind size={14} className="text-teal-500" />
  return <Package size={14} className="text-orange-400" />
}

function FreightIcon({ freight }: { freight: string }) {
  if (freight === 'Air Freight')
    return (
      <span className="material-symbols-outlined text-base text-purple-500">
        flight
      </span>
    )
  return (
    <span className="material-symbols-outlined text-base text-blue-500">
      directions_boat
    </span>
  )
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy')
  } catch {
    return dateStr
  }
}

interface TableRowProps {
  item: POItem
  onClick: () => void
}

function TableRow({ item, onClick }: TableRowProps) {
  return (
    <tr
      className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 group"
      onClick={onClick}
    >
      {/* PO Number */}
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-1">
          <ExternalLink
            size={13}
            className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-blue-600 font-semibold hover:underline">
            {item.poNumber}
          </span>
        </div>
      </td>

      {/* Supplier */}
      <td className="px-4 py-3 text-sm">
        <div className="font-medium text-gray-700 leading-tight">
          {item.supplier}
        </div>
        <div className="text-xs text-gray-400">({item.supplierCode})</div>
      </td>

      {/* Port */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {item.port || item.portAgent || '-'}
      </td>

      {/* EST No. */}
      <td className="px-4 py-3 text-sm text-gray-600">{item.estNo || '-'}</td>

      {/* Quantity / Permit Types */}
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-1">
          <TempIcon temp={item.temp} />
          <FreightIcon freight={item.freight} />
        </div>
      </td>

      {/* Country Temp / Freight */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {item.countryTemp || '-'}
      </td>

      {/* ETD / ETA */}
      <td className="px-4 py-3 text-xs text-gray-600">
        <div>
          <span className="text-gray-400">ETD:</span>{' '}
          {formatDate(item.etd)}
        </div>
        <div>
          <span className="text-gray-400">ETA:</span>{' '}
          {formatDate(item.eta)}
        </div>
      </td>

      {/* Create Date */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(item.createDate)}
      </td>

      {/* Request Doc No. Date */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {item.requestDocNoDate ? formatDate(item.requestDocNoDate) : item.quantity.toFixed(2)}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={item.status} />
      </td>
    </tr>
  )
}

export default function POTable() {
  const navigate = useNavigate()
  const { getFilteredItems } = useAppStore()
  const items = getFilteredItems()

  const columns = [
    'PO NUMBER',
    'SUPPLIER',
    'PORT',
    'EST NO.',
    'QUANTITY / PERMIT TYPES',
    'COUNTRY TEMP / FREIGHT',
    'ETD / ETA',
    'CREATE DATE',
    'Request Doc No. Date',
    'STATUS',
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <span className="material-symbols-outlined text-5xl">
                    inbox
                  </span>
                  <p className="text-sm">No records found</p>
                </div>
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                onClick={() => navigate(`/detail/${item.id}`)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
