import { AlertTriangle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import FilterBar from '../components/dashboard/FilterBar'
import TabBar from '../components/dashboard/TabBar'
import POTable from '../components/dashboard/POTable'
import { useAppStore } from '../store/useAppStore'

export default function Dashboard() {
  const { stats, setActiveTab } = useAppStore()

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto flex flex-col gap-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* New PE */}
          <StatCard
            label="New PE"
            value={stats.newPE}
            valueColor="text-orange-600"
            bgColor="bg-orange-50"
            borderColor="border-orange-100"
            onClick={() => setActiveTab('Pending Apply')}
          >
            <div className="flex items-center gap-1 text-xs text-red-500">
              <AlertTriangle size={12} />
              <span>Failed</span>
              <span className="font-bold text-red-600">{stats.newPEFailed}</span>
            </div>
          </StatCard>

          {/* Waiting R1/1 */}
          <StatCard
            label="Waiting R1/1"
            value={stats.waitingR11}
            valueColor="text-blue-600"
            bgColor="bg-blue-50"
            borderColor="border-blue-100"
            onClick={() => setActiveTab('Pending Apply')}
          >
            <div className="flex items-center gap-1 text-xs text-red-500">
              <AlertTriangle size={12} />
              <span>Failed</span>
              <span className="font-bold text-red-600">
                {stats.waitingR11Failed}
              </span>
            </div>
          </StatCard>

          {/* Expiry Alert */}
          <StatCard
            label="Expiry Alert"
            value={stats.expiryAlert}
            valueColor="text-purple-600"
            bgColor="bg-purple-50"
            borderColor="border-purple-100"
            onClick={() => setActiveTab('Expiry Alert')}
          >
            <div className="flex flex-col gap-0.5 text-xs">
              <div className="flex items-center gap-1 text-orange-500">
                <span>In 5 days</span>
                <span className="font-bold text-orange-600">
                  {stats.expiryIn5Days}
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <span>Expired</span>
                <span className="font-bold text-red-600">
                  {stats.expiryExpired}
                </span>
              </div>
            </div>
          </StatCard>

          {/* Completed */}
          <StatCard
            label="Completed"
            value={stats.completed}
            valueColor="text-green-700"
            bgColor="bg-green-50"
            borderColor="border-green-100"
            onClick={() => setActiveTab('Completed')}
          />

          {/* Received */}
          <StatCard
            label="Received"
            value={stats.received}
            valueColor="text-red-600"
            bgColor="bg-red-50"
            borderColor="border-red-100"
            onClick={() => setActiveTab('Permit Received')}
          />
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <TabBar />
          <POTable />
        </div>
      </div>
    </Layout>
  )
}
