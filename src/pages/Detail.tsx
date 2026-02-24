import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'
import POHeader from '../components/detail/POHeader'
import ProductsList from '../components/detail/ProductsList'
import PermitTypePanel from '../components/detail/PermitTypePanel'
import UploadSection from '../components/detail/UploadSection'
import UploadedFilesView from '../components/detail/UploadedFilesView'
import AIMatchingResultPanel from '../components/detail/AIMatchingResultPanel'
import ESTDetailsTable from '../components/detail/ESTDetailsTable'
import { useAppStore } from '../store/useAppStore'

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPOById } = useAppStore()
  const po = id ? getPOById(id) : undefined

  if (!po) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <span className="material-symbols-outlined text-6xl text-gray-300">
            search_off
          </span>
          <p className="text-gray-500 text-lg">PO not found</p>
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

  // Determine right-panel mode:
  // "view-only"  → Completed: show PDF icons
  // "processing" → File exists in Processing state: show file status card
  // "upload"     → No files: show drag & drop area + any existing files
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
            {/* Left: EST Details from PO */}
            <ESTDetailsTable
              estDetails={po.estDetails}
              showVerification={true}
              darkHeader={true}
            />

            {/* Right: AI Matching Result */}
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

        {/* EST Details only (when in upload mode and no AI matching yet) */}
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
