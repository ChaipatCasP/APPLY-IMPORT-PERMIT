// ==================== ENUMS ====================
export type POStatus =
  | 'Waiting PI'
  | 'Waiting R1/1'
  | 'Completed'
  | 'Received'
  | 'Expiry Alert'
  | 'Revised PO'

export type TempType =
  | 'Frozen (-18C)'
  | 'Chilled (0-2C)'
  | '+16C (COOL & DRY)'
  | '+1C - +4C (CHILLED)'
  | '+20C (DRY)'
  | '-18C (FROZEN)'

export type TransportType = 'Sea Freight' | 'Air Freight'

export type TabType =
  | 'All POs'
  | 'Pending Apply'
  | 'Permit Received'
  | 'Expiry Alert'
  | 'Completed'
  | 'Revised PO'

export type UploadFileStatus = 'Processing' | 'Completed' | 'Failed' | 'Active'

export type FileRecordStatus = 'Active' | 'Inactive'

// ==================== INTERFACES ====================

export interface Product {
  id: string
  code: string
  name: string
  quantity: number
  unit: string
  tariffCode: string
  description: string
}

export interface PermitType {
  id: string
  description: string
  tariffCode: string
  unit: string
  quantity: number
  matched: boolean
}

export interface ESTDetail {
  id: string
  plantName: string
  estNo: string
  address: string
  city: string
  country: string
  plantLicenseNo: string
  verified: boolean
}

export interface UploadedFile {
  id: string
  fileName: string
  status: UploadFileStatus
  recordStatus: FileRecordStatus
  queuedAt: string
  finishedAt?: string
}

export interface AIMatchingResult {
  permitTypes: PermitType[]
  estDetails: ESTDetail[]
}

export interface POItem {
  id: string
  poNumber: string
  date: string
  supplier: string
  supplierCode: string
  port: string
  portAgent: string
  estNo: string
  quantity: number
  permitTypes: string[]
  countryTemp: string
  freight: TransportType
  etd: string
  eta: string
  createDate: string
  requestDocNoDate?: string
  status: POStatus
  origin: string
  temp: TempType
  buyer: string
  buyerCode: string
  poApprovalDate: string
  products: Product[]
  permitTypesDetail: PermitType[]
  estDetails: ESTDetail[]
  uploadedFiles: UploadedFile[]
  aiMatchingResult?: AIMatchingResult
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  newPE: number
  newPEFailed: number
  waitingR11: number
  waitingR11Failed: number
  expiryAlert: number
  expiryIn5Days: number
  expiryExpired: number
  completed: number
  received: number
}

// ==================== FILTER ====================
export interface FilterState {
  search: string
  supplier: string
  buyer: string
  status: string
  dateRange: { from: string; to: string } | null
  activeTab: TabType
}
