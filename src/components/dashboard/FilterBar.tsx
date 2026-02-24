import { Search, ChevronDown, Calendar } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { suppliers, buyers, statuses } from '../../data/mockData'

export default function FilterBar() {
  const { filter, setFilter } = useAppStore()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search PO Number"
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Supplier */}
      <div className="relative">
        <select
          value={filter.supplier}
          onChange={(e) => setFilter({ supplier: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {suppliers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Buyer */}
      <div className="relative">
        <select
          value={filter.buyer}
          onChange={(e) => setFilter({ buyer: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {buyers.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Status */}
      <div className="relative">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ status: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Date Range */}
      <button className="flex items-center gap-2 pl-3 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
        <Calendar size={14} className="text-gray-400" />
        <span className="text-gray-500">Date Range</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    </div>
  )
}
