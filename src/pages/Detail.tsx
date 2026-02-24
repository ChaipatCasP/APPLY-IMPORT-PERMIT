import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'
import POHeader from '../components/detail/POHeader'
import ProductsList from '../components/detail/ProductsList'
import PermitTypePanel from '../components/detail/PermitTypePanel'
import UploadSection from '../components/detail/UploadSection'
import UploadedFilesView from '../components/detail/UploadedFilesView'
import AIMatchingResultPanel from '../components/detail/AIMatchingResultPanel'
import ESTDetailsTable from '../components/detail/ESTDetailsTable'
import { jagotaApi } from '../services/jagotaApiService'
import type { GetDocDetail, POEntry, POTariff, SupSlaughterhouse, AIPOTariff, AISupSlaughterhouse } from '../types'
import type { POItem, POStatus, TempType, Product, PermitType, ESTDetail } from '../types'

function mapStage(stage: string): POStatus {
  switch (stage) {
    case 'Waiting R1/1': return 'Waiting R1/1'
    case 'Expiry Alert': return 'Expiry Alert'
    case 'Completed': return 'Completed'
    case 'Received': return 'Received'
    default: return 'Waiting PI'
  }
}

function mapProducts(po: POEntry): Product[] {
  return po.PO_DETAILS.map((d, i) => ({
    id: `${po.PO_DOC}-${i}`,
    code: d.PRODUCT_CODE,
    name: d.PRODUCT_NAME,
    quantity: parseFloat(d.QTY) || 0,
    unit: d.UNIT,
    tariffCode: '',
    description: d.PRODUCT_NAME,
  }))
}

function mapPermitTypes(tariffs: POTariff[]): PermitType[] {
  return tariffs.map((t, i) => ({
    id: `tariff-${i}`,
    description: `${t.TARIFF_NAME_EN} / ${t.TARIFF_NAME_TH}`,
    tariffCode: t.TARIFF_CODE,
    unit: t.UNIT,
    quantity: parseFloat(t.QTY) || 0,
    matched: false,
  }))
}

function mapPermitTypesFromAI(tariffs: AIPOTariff[]): PermitType[] {
  return tariffs.map((t, i) => ({
    id: `ai-tariff-${i}`,
    description: t.TARIFF_NAME,
    tariffCode: t.PRODUCT_CODE,
    unit: t.UNIT,
    quantity: parseFloat(t.QTY) || 0,
    matched: t.MATCHED_STATUS === 'Y',
  }))
}

function mapEstDetails(slaughterhouses: SupSlaughterhouse[]): ESTDetail[] {
  return slaughterhouses.map((s, i) => ({
    id: `est-${i}`,
    plantName: s.NAME_E,
    estNo: s.EST,
    address: s.ADDRESS,
    city: s.CITY,
    country: s.COUNTRY,
    plantLicenseNo: s.PLANT_LICENSED_NO,
    verified: false,
  }))
}

function mapEstDetailsFromAI(slaughterhouses: AISupSlaughterhouse[]): ESTDetail[] {
  return slaughterhouses.map((s, i) => ({
    id: `ai-est-${i}`,
    plantName: s.NAME,
    estNo: s.EST_NO,
    address: s.ADDRESS,
    city: '',
    country: '',
    plantLicenseNo: '',
    verified: false,
  }))
}

function mapGetDocDetailToPoItem(detail: GetDocDetail, docBook: string, docNo: string): POItem {
  const po = detail.PO?.[0]
  const hasAITariffs = (detail.AI_PO_TARIFF?.length ?? 0) > 0
  const hasAISlaughter = (detail.AI_SUP_SLAUGHTERHOUSE?.length ?? 0) > 0

  const permitTypesDetail = hasAITariffs
    ? mapPermitTypesFromAI(detail.AI_PO_TARIFF)
    : mapPermitTypes(detail.PO_TARIFF ?? [])

  const estDetails = hasAISlaughter
    ? mapEstDetailsFromAI(detail.AI_SUP_SLAUGHTERHOUSE)
    : mapEstDetails(detail.SUP_SLAUGHTERHOUSE ?? [])

  const firstEst = hasAISlaughter
    ? (detail.AI_SUP_SLAUGHTERHOUSE[0]?.EST_NO ?? '')
    : (detail.SUP_SLAUGHTERHOUSE?.[0]?.EST ?? '')

  return {
    id: `${docBook}-${docNo}`,
    poNumber: po?.PO_DOC ?? '',
    date: po?.PO_DATE ?? '',
    supplier: po?.SUPP_NAME ?? '',
    supplierCode: po?.SUP_CODE ?? '',
    port: po?.PORT_OF_ORIGIN ?? '',
    portAgent: po?.SHIPPER_SUP_NAME ?? '',
    estNo: firstEst,
    quantity: parseFloat(po?.TOTAL ?? '0') || 0,
    permitTypes: detail.PO_TARIFF?.map((t) => t.TARIFF_CODE) ?? [],
    countryTemp: po?.COUNTRY_ORIGIN ?? '',
    freight: po?.TRANSPORT_MODE === 'Sea' ? 'Sea Freight' : 'Air Freight',
    etd: po?.ETD ?? '',
    eta: po?.ETA ?? '',
    createDate: po?.CREATION_DATE ?? '',
    requestDocNoDate: undefined,
    status: mapStage(detail.STAGE),
    origin: po?.COUNTRY_ORIGIN ?? '',
    temp: (po?.PRODUCT_TEMPERATURE ?? '') as TempType,
    buyer: po?.BUYER ?? '',
    buyerCode: '',
    poApprovalDate: po?.APPROVE_DATE ?? '',
    products: po ? mapProducts(po) : [],
    permitTypesDetail,
    estDetails,
    uploadedFiles: [],
  }
}

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [po, setPo] = useState<POItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid document ID')
      setLoading(false)
      return
    }

    // id format: DOC_BOOK-DOC_NO  e.g. "91-6785"
    const dashIdx = id.indexOf('-')
    if (dashIdx === -1) {
      setError('Invalid document ID format')
      setLoading(false)
      return
    }

    const docBook = id.substring(0, dashIdx)
    const docNo = id.substring(dashIdx + 1)

    const fetchDoc = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await jagotaApi.getDoc({
          COMPANY: 'JB',
          TRANSACTION_TYPE: docBook,
          DOC_BOOK: docBook,
          DOC_NO: docNo,
        })

        if (!result || !result.PO?.length) {
          setError('Document not found')
          return
        }

        setPo(mapGetDocDetailToPoItem(result, docBook, docNo))
      } catch (err: any) {
        setError(err.message ?? 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    fetchDoc()
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-[1600px] mx-auto flex flex-col gap-5 animate-pulse">
          <div className="h-6 w-36 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !po) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <span className="material-symbols-outlined text-6xl text-gray-300">
            search_off
          </span>
          <p className="text-gray-500 text-lg">{error ?? 'PO not found'}</p>
          <button
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    )
  }

  const isCompleted = po.status === 'Completed'
  const hasFiles = po.uploadedFiles.length > 0

  const rightPanelMode: 'view-only' | 'processing' | 'upload' = isCompleted
    ? 'view-only'
    : hasFiles
    ? 'processing'
    : 'upload'

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto flex flex-col gap-5">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* PO Info Header */}
        <POHeader po={po} />

        {/* Main 3-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Col 1: Products */}
          <ProductsList products={po.products} />

          {/* Col 2: Permit Type */}
          <PermitTypePanel permitTypes={po.permitTypesDetail} />

          {/* Col 3: Upload / Files */}
          <div className="flex flex-col gap-4">
            {rightPanelMode === 'view-only' && (
              <UploadedFilesView files={po.uploadedFiles} />
            )}

            {rightPanelMode === 'processing' && (
              <UploadSection
                poId={po.id}
                uploadedFiles={po.uploadedFiles}
                showUploadArea={false}
              />
            )}

            {rightPanelMode === 'upload' && (
              <UploadSection
                poId={po.id}
                uploadedFiles={po.uploadedFiles}
                showUploadArea={true}
              />
            )}
          </div>
        </div>

        {/* AI Matching Result (shown when files exist) */}
        {(hasFiles || isCompleted) && po.aiMatchingResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ESTDetailsTable
              estDetails={po.estDetails}
              showVerification={true}
              darkHeader={true}
            />
            <AIMatchingResultPanel result={po.aiMatchingResult} />
          </div>
        )}

        {/* EST Details (full width when no AI result) */}
        {!(hasFiles || isCompleted) && po.estDetails.length > 0 && (
          <ESTDetailsTable
            estDetails={po.estDetails}
            showVerification={true}
            darkHeader={true}
          />
        )}

        {rightPanelMode === 'upload' && po.estDetails.length > 0 && (
          <ESTDetailsTable
            estDetails={po.estDetails}
            showVerification={false}
            darkHeader={true}
          />
        )}
      </div>
    </Layout>
  )
}