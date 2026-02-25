import { useRef, useState } from "react";
import { Upload, File, Eye, Loader2, X } from "lucide-react";
import type { UploadedFileDoc } from "../../types";
import { useAppStore } from "../../store/useAppStore";

interface UploadSectionProps {
  poId: string;
  uploadedFiles: UploadedFileDoc[];
  showUploadArea?: boolean;
}

function FileStatusIcon({ status }: { status: UploadedFileDoc["STATUS"] }) {
  if (status === "Processing")
    return (
      <Loader2
        size={16}
        className="text-yellow-500 animate-spin flex-shrink-0"
      />
    );
  if (status === "Completed")
    return <File size={16} className="text-green-500 flex-shrink-0" />;
  if (status === "Failed")
    return <File size={16} className="text-red-500 flex-shrink-0" />;
  return <File size={16} className="text-blue-500 flex-shrink-0" />;
}

export default function UploadSection({
  poId,
  uploadedFiles,
  showUploadArea = true,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { addUploadedFile } = useAppStore();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) return;
      const now = new Date();
      const buddhistYear = now.getFullYear() + 543;
      const queuedAt = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${buddhistYear} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      // const newFile: UploadedFile = {
      //   id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      //   fileName: file.name,
      //   status: 'Processing',
      //   recordStatus: 'Active',
      //   queuedAt,
      //   finishedAt: undefined,
      // }
      // addUploadedFile(poId, newFile)
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Upload area */}
      {showUploadArea && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            Upload New Files
          </h3>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
            }`}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={32} className="text-gray-400" />
            <p className="text-sm text-gray-500 text-center">
              Drag &amp; drop PDF files here
            </p>
            <p className="text-xs text-gray-400">or click to browse files</p>
            <button
              type="button"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <File size={13} />
              Choose Files
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            Uploaded Files
          </h3>
          <div className="flex flex-col gap-2">
            {uploadedFiles.map((f, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg px-4 py-3 flex items-start justify-between gap-2"
              >
                <div className="flex items-start gap-3">
                  <FileStatusIcon status={f.STATUS} />
                  <div className="text-xs leading-relaxed">
                    <p className="text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          f.STATUS === "Processing"
                            ? "text-yellow-600"
                            : f.STATUS === "Done"
                              ? "text-green-600"
                              : "text-red-600"
                        }`}
                      >
                        {f.STATUS}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400 flex-shrink-0">
                  <p>Queued: {f.QUE_DATETIME}</p>
                  <p>Finished: {f.FINISH_DATETIME ?? "-"}</p>
                  <button
                    className="mt-1.5 text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1 ml-auto transition-colors"
                    onClick={() => setPreviewUrl(f.DOCUMENT_URL)}
                  >
                    <Eye size={12} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state (no file, no upload area) */}
      {!showUploadArea && uploadedFiles.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          No files uploaded
        </p>
      )}

      {/* File Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700 truncate max-w-[80%]">
                {previewUrl}
              </span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* PDF Viewer */}
            <iframe
              src={previewUrl}
              className="flex-1 w-full"
              title="File Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
