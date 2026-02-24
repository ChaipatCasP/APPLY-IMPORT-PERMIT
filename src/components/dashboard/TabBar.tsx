import { useAppStore } from '../../store/useAppStore'
import type { TabType } from '../../types'

const tabs: { id: TabType; label: string }[] = [
  { id: 'All POs', label: 'All POs' },
  { id: 'Pending Apply', label: 'Pending Apply' },
  { id: 'Permit Received', label: 'Permit Received' },
  { id: 'Expiry Alert', label: 'Expiry Alert' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Revised PO', label: 'Revised PO' },
]

export default function TabBar() {
  const { filter, setActiveTab, stats, poItems } = useAppStore()

  const getCount = (tab: TabType): number | null => {
    if (tab === 'All POs') return poItems.length
    if (tab === 'Pending Apply') return stats.newPE
    if (tab === 'Expiry Alert') return stats.expiryAlert
    if (tab === 'Permit Received') return null
    if (tab === 'Completed') return stats.completed
    if (tab === 'Revised PO') return null
    return null
  }

  return (
    <div className="flex items-center gap-0 border-b border-gray-200 bg-white px-4 overflow-x-auto">
      {tabs.map((tab) => {
        const count = getCount(tab.id)
        const isActive = filter.activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn flex items-center gap-2 ${
              isActive ? 'tab-btn-active' : 'tab-btn-inactive'
            }`}
          >
            <span>{tab.label}</span>
            {count !== null && (
              <span
                className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
