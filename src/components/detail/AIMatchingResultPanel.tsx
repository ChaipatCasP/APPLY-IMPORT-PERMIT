import { CheckCircle, XCircle } from "lucide-react";
import type { GetDocDetail } from "../../types";

interface AIMatchingResultPanelProps {
  result: GetDocDetail;
}

export default function AIMatchingResultPanel({
  result,
}: AIMatchingResultPanelProps) {
  console.log("AIMatchingResultPanel render with result:", result);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Section title */}
      <h3 className="text-sm font-bold text-gray-800">
        AI Data Matching Result
      </h3>

      {/* Permit types matching */}
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-red-700 px-4 py-2.5">
          <p className="text-white text-sm font-bold">
            Permit type to apply : {result.AI_PO_TARIFF.length} Types
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {result.AI_PO_TARIFF.map((pt, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {pt.TARIFF_NAME}
                </p>
                <p className="text-xs text-gray-500">{pt.PRODUCT_CODE}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700">
                  {Number(pt.QTY).toLocaleString()} kg
                </span>
                {pt.MATCHED_STATUS === "Y" ? (
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
            EST Details : Total {result.AI_SUP_SLAUGHTERHOUSE.length}
          </p>
        </div>

        {result.AI_SUP_SLAUGHTERHOUSE.length !== 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {[
                    "Plant Name",
                    "EST No.",
                    "Address",
                    "City",
                    "Country",
                    "Plant License No.",
                    "",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.AI_SUP_SLAUGHTERHOUSE.map((est, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2.5 text-sm font-medium text-gray-700">
                      {est.NAME}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {est.EST_NO}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {est.ADDRESS}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {/* {est.CITY} */} N/A
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {/* {est.country} */} N/A
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600">
                      {/* {est.plantLicenseNo} */} N/A
                    </td>
                    <td className="px-3 py-2.5">
                      {/* {est.verified ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    )} */}
                      N/A
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
