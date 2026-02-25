import { format } from "date-fns";
import type { GetDocDetail } from "../../types";
import StatusBadge from "../dashboard/StatusBadge";

interface POHeaderProps {
  po: GetDocDetail;
  onComplete?: () => void;
}

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "dd-MM-yyyy");
  } catch {
    return dateStr;
  }
}

export default function POHeader({ po, onComplete }: POHeaderProps) {
  const isComplete = po.STAGE === "Completed";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 ">
      {/* Row 1 */}
      <div className="flex flex-row ">
        <div className="w-[90%]">
          <div className="flex flex-wrap gap-x-6 gap-y-1 w-full">
            <span className="text-sm text-blue-600 w-[15%]">
              PO No. <span className="font-semibold">{po.PO?.[0]?.PO_DOC}</span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              Date :{" "}
              <span className="font-semibold">
                {formatDate(po.PO?.[0]?.PO_DATE ?? "")}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              ETD :{" "}
              <span className="font-semibold">
                {formatDate(po.PO?.[0]?.ETD ?? "")}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              Origin :{" "}
              <span className="font-semibold">
                {po.PO?.[0]?.COUNTRY_ORIGIN}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              Temp :{" "}
              <span className="font-semibold">
                {po.PO?.[0]?.PRODUCT_TEMPERATURE}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              Buyer: <span className="font-semibold">{po.PO?.[0]?.BUYER}</span>
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 w-full">
            <span className="text-sm text-blue-600 font-semibold w-[15%]">
              {po.PO?.[0]?.SUPP_NAME} ({po.PO?.[0]?.SUP_CODE})
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              ETA :{" "}
              <span className="font-semibold">
                {formatDate(po.PO?.[0]?.ETA ?? "")}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              Transport :{" "}
              <span className="font-semibold ">
                {po.PO?.[0]?.TRANSPORT_MODE === "Sea"
                  ? "Sea Freight"
                  : "Air Freight"}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              Port :{" "}
              <span className="font-semibold">
                {po.PO?.[0]?.PORT_OF_ORIGIN}
              </span>
            </span>
            <span className="text-sm text-blue-600 w-[15%]">
              PO Approval date :{" "}
              <span className="font-semibold ">
                {formatDate(po.PO?.[0]?.APPROVE_DATE ?? "")}
              </span>
            </span>
          </div>
        </div>

        <div className="w-[10%] text-center flex items-center justify-center">
          {/* Status / Action */}
          <div className="flex-shrink-0">
            {isComplete ? (
              <button
                onClick={onComplete}
                disabled
                className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg text-sm cursor-default"
              >
                Complete
              </button>
            ) : (
              <StatusBadge status={po.STAGE} size="md" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
