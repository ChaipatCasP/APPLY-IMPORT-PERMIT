import { FileText } from 'lucide-react'
import type { UploadedFile } from '../../types'

interface UploadedFilesViewProps {
  files: UploadedFile[]
}

export default function UploadedFilesView({ files }: UploadedFilesViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Uploaded Files</h3>

      {files.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">No files uploaded</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {files.map((f) => (
            <div key={f.id} className="flex flex-col items-center gap-1 cursor-pointer group">
              <div className="w-12 h-14 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center group-hover:border-red-400 transition-colors">
                <FileText size={24} className="text-red-500" />
              </div>
              <span className="text-xs text-gray-500 text-center max-w-[60px] truncate">
                PDF
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
