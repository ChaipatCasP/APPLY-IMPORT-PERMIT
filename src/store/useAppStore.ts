import { create } from 'zustand'
import type { POItem, FilterState, TabType, UploadedFile } from '../types'
import { mockPOItems, dashboardStats } from '../data/mockData'
import type { DashboardStats } from '../types'

interface AppState {
  // Data
  poItems: POItem[]
  stats: DashboardStats
  tableLoading: boolean

  // Pagination
  currentPage: number
  totalPages: number
  totalRecords: number
  perPage: number

  // Filter state
  filter: FilterState

  // Upload state (for detail page)
  uploadingFiles: Record<string, UploadedFile[]>

  // Actions
  setPoItems: (items: POItem[]) => void
  setTableLoading: (loading: boolean) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (total: number, records: number) => void
  setPerPage: (perPage: number) => void
  setFilter: (filter: Partial<FilterState>) => void
  setActiveTab: (tab: TabType) => void
  resetFilter: () => void
  getFilteredItems: () => POItem[]
  getPOById: (id: string) => POItem | undefined
  addUploadedFile: (poId: string, file: UploadedFile) => void
  updateFileStatus: (poId: string, fileId: string, status: UploadedFile['status']) => void
}

const defaultFilter: FilterState = {
  search: '',
  supplier: 'All Suppliers',
  buyer: 'All Buyers',
  status: 'All Status',
  dateRange: null,
  activeTab: 'Pending Apply',
}

export const useAppStore = create<AppState>((set, get) => ({
  poItems: mockPOItems,
  stats: dashboardStats,
  tableLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  perPage: 20,
  filter: defaultFilter,
  uploadingFiles: {},

  setPoItems: (items) => set({ poItems: items }),

  setTableLoading: (loading) => set({ tableLoading: loading }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setTotalPages: (total, records) => set({ totalPages: total, totalRecords: records }),

  setPerPage: (perPage) => set({ perPage, currentPage: 1 }),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  setActiveTab: (tab) =>
    set((state) => ({ filter: { ...state.filter, activeTab: tab } })),

  resetFilter: () => set({ filter: defaultFilter }),

  getFilteredItems: () => {
    const { poItems, filter } = get()
    let items = [...poItems]

    // Tab filter
    if (filter.activeTab === 'Pending Apply') {
      items = items.filter((i) =>
        ['Waiting PI', 'Waiting R1/1'].includes(i.status)
      )
    } else if (filter.activeTab === 'Permit Received') {
      items = items.filter((i) => i.status === 'Received')
    } else if (filter.activeTab === 'Expiry Alert') {
      items = items.filter((i) => i.status === 'Expiry Alert')
    } else if (filter.activeTab === 'Completed') {
      items = items.filter((i) => i.status === 'Completed')
    } else if (filter.activeTab === 'Revised PO') {
      items = items.filter((i) => i.status === 'Revised PO')
    }
    // 'All POs' - no filter

    // Search
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase()
      items = items.filter(
        (i) =>
          i.poNumber.toLowerCase().includes(q) ||
          i.supplier.toLowerCase().includes(q)
      )
    }

    // Supplier
    if (filter.supplier !== 'All Suppliers') {
      items = items.filter((i) => i.supplier === filter.supplier)
    }

    // Buyer
    if (filter.buyer !== 'All Buyers') {
      items = items.filter((i) => i.buyer === filter.buyer)
    }

    // Status
    if (filter.status !== 'All Status') {
      items = items.filter((i) => i.status === filter.status)
    }

    return items
  },

  getPOById: (id) => {
    return get().poItems.find((i) => i.id === id)
  },

  addUploadedFile: (poId, file) =>
    set((state) => {
      const updated = state.poItems.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            uploadedFiles: [...po.uploadedFiles, file],
          }
        }
        return po
      })
      return { poItems: updated }
    }),

  updateFileStatus: (poId, fileId, status) =>
    set((state) => {
      const updated = state.poItems.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            uploadedFiles: po.uploadedFiles.map((f) =>
              f.id === fileId ? { ...f, status } : f
            ),
          }
        }
        return po
      })
      return { poItems: updated }
    }),
}))
