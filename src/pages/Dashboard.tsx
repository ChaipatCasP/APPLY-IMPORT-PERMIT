import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/dashboard/FilterBar";
import TabBar from "../components/dashboard/TabBar";
import POTable from "../components/dashboard/POTable";
import { useAppStore } from "../store/useAppStore";
import { jagotaApi } from "../services/jagotaApiService";
import type {
  StageCountResult,
  CustomerDoc,
} from "../services/jagotaApiService";
import type { POItem, POStatus, TempType } from "../types";

function mapStage(stage: string): POStatus {
  switch (stage) {
    case "Pending Apply":
      return "Waiting PI";
    case "Waiting R1/1":
      return "Waiting R1/1";
    case "Expiry Alert":
      return "Expiry Alert";
    case "Completed":
      return "Completed";
    case "Received":
      return "Received";
    default:
      return "Waiting PI";
  }
}

function mapCustomerDocToPoItem(doc: CustomerDoc): POItem {
  return {
    id: `${doc.DOC_BOOK}-${doc.DOC_NO}`,
    poNumber: doc.PO_DOC,
    date: doc.PO_DATE,
    supplier: doc.SUPP_NAME,
    supplierCode: doc.SUPP_CODE,
    port: doc.PORT_OF_ORIGIN,
    portAgent: doc.SHIPPER_SUP_NAME,
    estNo: "N/A",
    quantity: parseFloat(doc.TOTAL) || 0,
    permitTypes: [],
    countryTemp: doc.COUNTRY_ORIGIN,
    freight: doc.TRANSPORT_MODE === "Sea" ? "Sea Freight" : "Air Freight",
    etd: doc.ETD,
    eta: doc.ETA,
    createDate: doc.CREATION_DATE,
    requestDocNoDate: undefined,
    status: mapStage(doc.STAGE),
    origin: doc.COUNTRY_ORIGIN,
    temp: doc.PRODUCT_TEMPERATURE as TempType,
    buyer: doc.BUYER,
    buyerCode: "",
    poApprovalDate: doc.PO_APP_DATE,
    products: [],
    permitTypesDetail: [],
    estDetails: [],
    uploadedFiles: [],
  };
}

export default function Dashboard() {
  const {
    setActiveTab,
    setPoItems,
    setTableLoading,
    setTotalPages,
    currentPage,
    perPage,
  } = useAppStore();
  const [stageCount, setStageCount] = useState<StageCountResult | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStageCount = async () => {
      try {
        setStatsLoading(true);
        const data = await jagotaApi.getStageCount();
        setStageCount(data);
      } catch (error) {
        console.error("Failed to fetch stage count:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStageCount();
  }, []);

  const fetchListDoc = useCallback(
    async (page: number) => {
      try {
        setTableLoading(true);
        const data = await jagotaApi.listDoc({
          P_STAFF_CODE: jagotaApi.getStaffCode(),
          P_PAGE: page,
          P_PER_PAGE: perPage,
        });

        const items = (data.CUSTOMERS ?? []).map(mapCustomerDocToPoItem);
        setPoItems(items);
        setTotalPages(
          parseInt(data.TOTAL_PAGE ?? "1", 10),
          parseInt(data.TOTAL_FOUND ?? "0", 10),
        );
      } catch (error) {
        console.error("Failed to fetch list doc:", error);
      } finally {
        setTableLoading(false);
      }
    },
    [perPage, setTableLoading, setPoItems, setTotalPages],
  );

  useEffect(() => {
    fetchListDoc(currentPage);
  }, [currentPage, fetchListDoc]);

  const pending = stageCount?.PENDING?.[0];
  const request = stageCount?.REQUEST?.[0];
  const expiry = stageCount?.EXPIRY?.[0];
  const completed = stageCount?.COMPLETED?.[0];
  const received = stageCount?.RECEIVED?.[0];

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto flex flex-col gap-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* New PE */}
          <div
            className="bg-white rounded-xl shadow-sm border border-white p-2 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("Pending Apply")}
          >
            <div className="bg-[#fdf3e0] rounded-xl shadow-sm border border-orange-100 p-2 flex flex-col h-full">
              <div className="flex justify-end pl-5 pr-2 py-1.5">
                <span className="text-4xl font-black text-orange-700">
                  {statsLoading ? "..." : (pending?.TOTAL ?? "0")}
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-[22px] font-semibold text-orange-700 uppercase tracking-wide pl-16">
                  New PE
                </span>
              </div>
              <div className="flex justify-end">
                <div className="flex flex-col items-center bg-orange-50 rounded-lg border-[4px] border-white">
                  <div className="flex flex-col items-center bg-orange-50 rounded-lg px-3 py-1 border border-red-500">
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertTriangle size={11} />
                      <span>Failed</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">
                      {/* {statsLoading ? "..." : (request?.FAIL ?? "0")} */}
                      N/A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Waiting R1/1 */}
          <div
            className="bg-white rounded-xl shadow-sm border border-white p-2 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("Pending Apply")}
          >
            <div className="bg-blue-100 rounded-xl shadow-sm border border-blue-100 p-2 flex flex-col h-full">
              <div className="flex justify-end pl-5 pr-2 py-1.5">
                <span className="text-4xl font-black text-blue-700">
                  {statsLoading ? "..." : (request?.TOTAL ?? "0")}
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-[22px] font-semibold text-blue-700 uppercase tracking-wide pl-16">
                  Waiting R1/1
                </span>
              </div>
              <div className="flex justify-end">
                <div className="flex flex-col items-center bg-orange-50 rounded-lg border-[4px] border-white">
                  <div className="flex flex-col items-center bg-orange-50 rounded-lg px-3 py-1 border border-red-500">
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertTriangle size={11} />
                      <span>Failed</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">
                      {statsLoading ? "..." : (request?.FAIL ?? "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Alert */}
          <div
            className="bg-white rounded-xl shadow-sm border border-white p-2 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("Expiry Alert")}
          >
            <div className="bg-purple-100 rounded-xl border border-purple-100 p-3 flex flex-col h-full gap-3">
              {/* Top row: label + value */}
              <div className="flex items-center justify-between px-1">
                <span className="text-base font-bold text-purple-700 text-[16px]  tracking-wide pt-4">
                  Expiry Alert
                </span>
                <span className="text-4xl font-black text-purple-700">
                  {statsLoading ? "..." : (expiry?.TOTAL ?? "0")}
                </span>
              </div>
            </div>

            {/* Bottom row: two sub-badges */}
            <div className="flex flex-row gap-2 bg-white rounded-xl border border-white  h-full">
              <div className="flex-1 flex items-center justify-between bg-[#fff3f2] rounded-lg px-3 py-1.5 border border-purple-100">
                <span className="text-[16px] text-[#b91717] font-medium">
                  In 5 days
                </span>
                <span className="text-[22px] font-bold text-[#b91717] ml-1">
                  {statsLoading ? "..." : (expiry?.EXPIRE_IN_5_DAYS ?? "0")}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-between bg-[#fff3f2] rounded-lg px-3 py-1.5 border border-purple-100">
                <span className="text-[16px] text-[#b91717] font-medium">
                  Expired
                </span>
                <span className="text-[22px] font-bold text-[#b91717] ml-1">
                  {statsLoading ? "..." : (expiry?.EXPIRED ?? "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div
            className="bg-white rounded-xl shadow-sm border border-white p-2 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("Completed")}
          >
            <div className="bg-green-100 rounded-xl border border-green-100 flex flex-col h-full">
              <div className="flex items-center justify-center px-1">
                <span className="text-[24px] font-bold text-green-700 tracking-wide pt-3">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-center px-1">
                <span className="text-[50px] font-black text-green-700">
                  {statsLoading ? "..." : (completed?.TOTAL ?? "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Received */}
          <div
            className="bg-white rounded-xl shadow-sm border border-white p-2 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("Permit Received")}
          >
            <div className="bg-[#feeadf] rounded-xl border border-red-100 flex flex-col h-full">
              <div className="flex items-center justify-center px-1">
                <span className="text-[24px] font-bold text-[#973513] tracking-wide pt-3">
                  Received
                </span>
              </div>

              <div className="flex items-center justify-center px-1">
                <span className="text-[50px] font-black text-[#973513]">
                  {statsLoading ? "..." : (received?.TOTAL ?? "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Filter Bar */}
        <FilterBar />
        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <TabBar />
          <POTable />
        </div>
      </div>
    </Layout>
  );
}
