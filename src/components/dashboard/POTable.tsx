import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ExternalLink, Thermometer, Wind, Snowflake, Package, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const {
    getFilteredItems,
    tableLoading,
    currentPage,
    totalPages,
    totalRecords,
    perPage,
    setCurrentPage,
    setPerPage,
  } = useAppStore()
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

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * perPage + 1
  const endRecord = Math.min(currentPage * perPage, totalRecords)

  // Build page buttons (show up to 5 pages around current)
  const pageButtons: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageButtons.push(i)
  } else {
    pageButtons.push(1)
    if (currentPage > 3) pageButtons.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageButtons.push(i)
    }
    if (currentPage < totalPages - 2) pageButtons.push('...')
    pageButtons.push(totalPages)
  }

  return (
    <div className="flex flex-col">
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
            {tableLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 animate-pulse">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
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

      {/* Pagination */}
      {!tableLoading && totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
          {/* Records info + per-page selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{startRecord}</span>–<span className="font-semibold text-gray-700">{endRecord}</span> of{' '}
              <span className="font-semibold text-gray-700">{totalRecords}</span> records
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Rows:</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>

            {pageButtons.map((btn, idx) =>
              btn === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm select-none">
                  …
                </span>
              ) : (
                <button
                  key={btn}
                  className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                    btn === currentPage
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(btn as number)}
                >
                  {btn}
                </button>
              )
            )}

            <button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
