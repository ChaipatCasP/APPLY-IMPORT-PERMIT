import { useEffect, useRef, useState } from "react";
import { Upload, File, Eye, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import type { UploadedFileDoc } from "../../types";
import { jagotaApi } from "../../services/jagotaApiService";

interface UploadSectionProps {
  poId: string;
  uploadedFiles: UploadedFileDoc[];
  showUploadArea?: boolean;
  company?: string;
  staffCode?: string;
  transactionType?: string;
  docBook?: string;
  docNo?: string;
  stage?: string;
  onRefresh?: () => void;
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
  company = "JB",
  staffCode,
  transactionType = "",
  docBook = "",
  docNo = "",
  stage = "REQUEST",
  onRefresh,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Countdown timer after successful upload
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      onRefresh?.();
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown, onRefresh]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const pdfs = Array.from(files).filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (const file of pdfs) {
        await jagotaApi.applyPermitAI({
          file,
          staff_code: staffCode ?? jagotaApi.getStaffCode(),
          company,
          transaction_type: transactionType,
          doc_book: docBook,
          doc_no: docNo,
          stage,
        });
      }
      // Start 10-second countdown then refresh
      setCountdown(10);
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Uploading overlay */}
      {uploading && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Uploading file...</p>
        </div>
      )}

      {/* Upload success countdown */}
      {countdown !== null && (
        <div className="flex flex-col items-center justify-center gap-2 py-4 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle size={28} className="text-green-500" />
          <p className="text-sm font-semibold text-green-700">Upload successful!</p>
          <p className="text-xs text-gray-500">
            Refreshing data in <span className="font-bold text-green-700">{countdown}s</span>...
          </p>
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{uploadError}</p>
          <button
            className="ml-auto text-xs text-red-400 hover:text-red-600 underline"
            onClick={() => setUploadError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Upload area */}
      {showUploadArea && !uploading && countdown === null && (
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
