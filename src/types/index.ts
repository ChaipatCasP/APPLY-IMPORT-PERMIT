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
  permitTypesDetail_AI: PermitType[]
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


export interface ListDocResult {
  TOTAL_FOUND: string;
  TOTAL_PAGE: string;
  CUSTOMERS: CustomerDoc[];
}

export interface CustomerDoc {
  COMPANY: string;
  TRANSACTION_TYPE: string;
  DOC_BOOK: string;
  DOC_NO: string;
  PO_BOOK: string;
  PO_NO: string;
  PO_DOC: string;
  PO_DATE: string;
  PO_APP_DATE: string;
  SUPP_CODE: string;
  SUPP_NAME: string;
  CREATION_DATE: string;
  INCOTERM: string;
  TOTAL: string;
  ETD: string;
  ETA: string;
  PORT_OF_ORIGIN: string;
  COUNTRY_ORIGIN: string;
  SHIPPER_SUP_NAME: string;
  PRODUCT_TEMPERATURE: string;
  BUYER: string;
  TRANSPORT_MODE: string;
  PORT_OF_LOADING: string;
  STAGE: string;
  PROCESSING_STATUS: string;
  CLOSED_STATUS: string;
  CURRENCY: string;
}

// ==================== GET_DOC DETAIL ====================

export interface PODetail {
  PRODUCT_CODE: string;
  PRODUCT_NAME: string;
  QTY: string;
  RATE: string;
  UNIT: string;
  TOTAL: string;
}

export interface POEntry {
  COMPANY: string;
  TRANSACTION_TYPE: string;
  PO_BOOK_NO: string;
  PO_NO: string;
  PO_DOC: string;
  PO_DATE: string;
  APPROVE_DATE: string;
  SUP_CODE: string;
  SUPP_NAME: string;
  SUPP_ADDRESS: string;
  CREATION_DATE: string;
  INCOTERM: string;
  ETD: string;
  ETA: string;
  PORT_OF_ORIGIN: string;
  TOTAL: string;
  TAX_TOTAL: string;
  TAX_P: string;
  G_TOTAL: string;
  COUNTRY_ORIGIN: string;
  PRODUCT_TEMPERATURE: string;
  SHIPPER_SUP_NAME: string;
  BUYER: string;
  TRANSPORT_MODE: string;
  PORT_OF_LOADING: string;
  CURRENCY: string;
  PO_DETAILS: PODetail[];
}

export interface UploadedFileDoc {
  RECID: string;
  DOCUMENT_URL: string;
  QUE_DATETIME: string;
  WAITING_MIN: string;
  FINISH_DATETIME: string;
  STATUS: string;
}

export interface POTariff {
  TARIFF_CODE: string;
  TARIFF_NAME_EN: string;
  TARIFF_NAME_TH: string;
  QTY: string;
  UNIT: string;
}

export interface SupSlaughterhouse {
  SLUG_CODE: string;
  NAME_E: string;
  ADDRESS: string;
  COUNTRY: string;
  CITY: string;
  EST: string;
  PLANT_LICENSED_NO: string;
}

export interface AIPOTariff {
  PRODUCT_CODE: string;
  TARIFF_NAME: string;
  QTY: string;
  UNIT: string;
  MATCHED_STATUS: 'Y' | 'N' | string;
}

export interface AISupSlaughterhouse {
  NAME: string;
  ADDRESS: string;
  EST_NO: string;
}

export interface GetDocDetail {
  STAGE: string;
  REVISION: string;
  RECID: string;
  PREVIEW_ONLY: string;
  PO: POEntry[];
  UPLOADED_FILES: UploadedFileDoc[];
  PO_TARIFF: POTariff[];
  SUP_SLAUGHTERHOUSE: SupSlaughterhouse[];
  AI_PO_TARIFF: AIPOTariff[];
  AI_SUP_SLAUGHTERHOUSE: AISupSlaughterhouse[];
}

