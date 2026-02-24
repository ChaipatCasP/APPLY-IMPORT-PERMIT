import { CheckCircle, XCircle } from 'lucide-react'
import type { AIMatchingResult } from '../../types'

interface AIMatchingResultPanelProps {
  result: AIMatchingResult
}

export default function AIMatchingResultPanel({
  result,
}: AIMatchingResultPanelProps) {
  const permitCount = result.permitTypes.length
  const estCount = result.estDetails.length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Section title */}
      <h3 className="text-sm font-bold text-gray-800">AI Data Matching Result</h3>

      {/* Permit types matching */}
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-red-700 px-4 py-2.5">
          <p className="text-white text-sm font-bold">
            Permit type to apply : {permitCount} Types
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {result.permitTypes.map((pt) => (
            <div
              key={pt.id}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {pt.description}
                </p>
                <p className="text-xs text-gray-500">{pt.tariffCode}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700">
                  {pt.quantity} kg
                </span>
                {pt.matched ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <XCircle size={18} className="text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EST details matching */}
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-700 px-4 py-2.5">
          <p className="text-white text-sm font-bold">
            EST Details : Total {estCount}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Plant Name', 'EST No.', 'Address', 'City', 'Country', 'Plant License No.', ''].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {result.estDetails.map((est) => (
                <tr
                  key={est.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700">
                    {est.plantName}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.estNo}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.address}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.city}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.country}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.plantLicenseNo}
                  </td>
                  <td className="px-3 py-2.5">
                    {est.verified ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
