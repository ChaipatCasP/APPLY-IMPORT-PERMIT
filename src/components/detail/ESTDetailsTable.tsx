import { CheckCircle, XCircle } from "lucide-react";
import type { SupSlaughterhouse } from "../../types";

interface ESTDetailsTableProps {
  estDetails: SupSlaughterhouse[];
  showVerification?: boolean;
  darkHeader?: boolean;
}

export default function ESTDetailsTable({
  estDetails,
  showVerification = true,
  darkHeader = true,
}: ESTDetailsTableProps) {
  const count = estDetails.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 ${darkHeader ? "bg-gray-700" : "bg-red-700"}`}>
        <h3 className="text-white font-bold text-sm">
          EST Details : Total {count}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-[#e7eaed]">
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Plant Name
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                EST No.
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Address
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                City
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Country
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Plant License No.
              </th>
              {showVerification && (
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {estDetails.length === 0 ? (
              <tr>
                <td
                  colSpan={showVerification ? 7 : 6}
                  className="px-3 py-8 text-center text-sm text-gray-400"
                >
                  No EST details
                </td>
              </tr>
            ) : (
              estDetails.map((est, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700">
                    {est.NAME_E}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.EST}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.ADDRESS}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.CITY}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.COUNTRY}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {est.PLANT_LICENSED_NO}
                  </td>
                  {/* {showVerification && (
                    <td className="px-3 py-2.5">
                      {est.VERIFIED ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <XCircle size={18} className="text-red-500" />
                      )}
                    </td>
                  )} */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
