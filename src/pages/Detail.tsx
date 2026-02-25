import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Layout from "../components/layout/Layout";
import POHeader from "../components/detail/POHeader";
import ProductsList from "../components/detail/ProductsList";
import PermitTypePanel from "../components/detail/PermitTypePanel";
import UploadSection from "../components/detail/UploadSection";
import UploadedFilesView from "../components/detail/UploadedFilesView";
import AIMatchingResultPanel from "../components/detail/AIMatchingResultPanel";
import ESTDetailsTable from "../components/detail/ESTDetailsTable";
import { jagotaApi } from "../services/jagotaApiService";
import type {
  GetDocDetail,
  POEntry,
  POTariff,
  SupSlaughterhouse,
  AIPOTariff,
  AISupSlaughterhouse,
} from "../types";
import type {
  POItem,
  POStatus,
  TempType,
  Product,
  PermitType,
  ESTDetail,
} from "../types";
import ESTDetailsTableAI from "@/components/detail/ESTDetailsTableAI";

function mapStage(stage: string): POStatus {
  switch (stage) {
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

function mapProducts(po: POEntry): Product[] {
  return po.PO_DETAILS.map((d, i) => ({
    id: `${po.PO_DOC}-${i}`,
    code: d.PRODUCT_CODE,
    name: d.PRODUCT_NAME,
    quantity: parseFloat(d.QTY) || 0,
    unit: d.UNIT,
    tariffCode: "",
    description: d.PRODUCT_NAME,
  }));
}

function mapPermitTypes(tariffs: POTariff[]): PermitType[] {
  return tariffs.map((t, i) => ({
    id: `tariff-${i}`,
    description: `${t.TARIFF_NAME_EN} / ${t.TARIFF_NAME_TH}`,
    tariffCode: t.TARIFF_CODE,
    unit: t.UNIT,
    quantity: parseFloat(t.QTY) || 0,
    matched: false,
  }));
}

function mapPermitTypesFromAI(tariffs: AIPOTariff[]): PermitType[] {
  return tariffs.map((t, i) => ({
    id: `ai-tariff-${i}`,
    description: t.TARIFF_NAME,
    tariffCode: t.PRODUCT_CODE,
    unit: t.UNIT,
    quantity: parseFloat(t.QTY) || 0,
    matched: t.MATCHED_STATUS === "Y",
  }));
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
  }));
}

function mapEstDetailsFromAI(
  slaughterhouses: AISupSlaughterhouse[],
): ESTDetail[] {
  return slaughterhouses.map((s, i) => ({
    id: `ai-est-${i}`,
    plantName: s.NAME,
    estNo: s.EST_NO,
    address: s.ADDRESS,
    city: "",
    country: "",
    plantLicenseNo: "",
    verified: false,
  }));
}

function mapGetDocDetailToPoItem(
  detail: GetDocDetail,
  docBook: string,
  docNo: string,
): POItem {
  const po = detail.PO?.[0];
  const hasAITariffs = (detail.PO_TARIFF?.length ?? 0) > 0;
  const hasAITariffs_AI = (detail.AI_PO_TARIFF?.length ?? 0) > 0;
  const hasAISlaughter = (detail.AI_SUP_SLAUGHTERHOUSE?.length ?? 0) > 0;

  const permitTypesDetail = hasAITariffs
    ? mapPermitTypes(detail.PO_TARIFF ?? [])
    : [];

  const permitTypesDetail_AI = hasAITariffs_AI
    ? mapPermitTypesFromAI(detail.AI_PO_TARIFF ?? [])
    : [];

  // ? mapPermitTypesFromAI(detail.AI_PO_TARIFF)
  // : mapPermitTypes(detail.PO_TARIFF ?? []);

  const estDetails = hasAISlaughter
    ? mapEstDetailsFromAI(detail.AI_SUP_SLAUGHTERHOUSE)
    : mapEstDetails(detail.SUP_SLAUGHTERHOUSE ?? []);

  const firstEst = hasAISlaughter
    ? (detail.AI_SUP_SLAUGHTERHOUSE[0]?.EST_NO ?? "")
    : (detail.SUP_SLAUGHTERHOUSE?.[0]?.EST ?? "");

  return {
    id: `${docBook}-${docNo}`,
    poNumber: po?.PO_DOC ?? "",
    date: po?.PO_DATE ?? "",
    supplier: po?.SUPP_NAME ?? "",
    supplierCode: po?.SUP_CODE ?? "",
    port: po?.PORT_OF_ORIGIN ?? "",
    portAgent: po?.SHIPPER_SUP_NAME ?? "",
    estNo: firstEst,
    quantity: parseFloat(po?.TOTAL ?? "0") || 0,
    permitTypes: detail.PO_TARIFF?.map((t) => t.TARIFF_CODE) ?? [],
    countryTemp: po?.COUNTRY_ORIGIN ?? "",
    freight: po?.TRANSPORT_MODE === "Sea" ? "Sea Freight" : "Air Freight",
    etd: po?.ETD ?? "",
    eta: po?.ETA ?? "",
    createDate: po?.CREATION_DATE ?? "",
    requestDocNoDate: undefined,
    status: mapStage(detail.STAGE),
    origin: po?.COUNTRY_ORIGIN ?? "",
    temp: (po?.PRODUCT_TEMPERATURE ?? "") as TempType,
    buyer: po?.BUYER ?? "",
    buyerCode: "",
    poApprovalDate: po?.APPROVE_DATE ?? "",
    products: po ? mapProducts(po) : [],
    permitTypesDetail: permitTypesDetail,
    permitTypesDetail_AI: permitTypesDetail_AI,
    estDetails,
    uploadedFiles: [],
  };
}

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Parse DOC_BOOK and DOC_NO from id (format: "DOC_BOOK-DOC_NO" e.g. "91-6785")
  const dashIdx = id ? id.indexOf("-") : -1;
  const docBook = dashIdx !== -1 ? id!.substring(0, dashIdx) : null;
  const docNo = dashIdx !== -1 ? id!.substring(dashIdx + 1) : null;

  const [docDetail, setDocDetail] = useState<GetDocDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive POItem from raw GetDocDetail
  // const po = useMemo(
  //   () =>
  //     docDetail && docBook && docNo
  //       ? mapGetDocDetailToPoItem(docDetail, docBook, docNo)
  //       : null,
  //   [docDetail, docBook, docNo],
  // );

  useEffect(() => {
    if (!id) {
      setError("Invalid document ID");
      setLoading(false);
      return;
    }

    if (dashIdx === -1) {
      setError("Invalid document ID format");
      setLoading(false);
      return;
    }

    const fetchDoc = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await jagotaApi.getDoc({
          COMPANY: "JB",
          TRANSACTION_TYPE: docBook!,
          DOC_BOOK: docBook!,
          DOC_NO: docNo!,
        });

        if (!result || !result.PO?.length) {
          setError("Document not found");
          return;
        }

        setDocDetail(result);
      } catch (err: any) {
        setError(err.message ?? "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id]);

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
    );
  }

  if (error || !docDetail) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <span className="material-symbols-outlined text-6xl text-gray-300">
            search_off
          </span>
          <p className="text-gray-500 text-lg">{error ?? "PO not found"}</p>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const isCompleted = docDetail.STAGE === "Completed";
  const hasFiles = docDetail.UPLOADED_FILES.length > 0;

  const rightPanelMode: "view-only" | "processing" | "upload" = isCompleted
    ? "view-only"
    : hasFiles
      ? "processing"
      : "upload";

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto flex flex-col gap-5">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* PO Info Header */}
        <POHeader po={docDetail} />

        {/* Main 2-column content */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Col 1: Products */}
              <ProductsList products={docDetail.PO[0].PO_DETAILS} />

              {/* Col 2: Permit Type */}
              <PermitTypePanel permitTypes={docDetail.PO_TARIFF} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 mt-5">
              <ESTDetailsTable
                estDetails={docDetail.SUP_SLAUGHTERHOUSE}
                showVerification={false}
                darkHeader={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
            {/* Col 3: Upload / Files */}
            <div className="flex flex-col gap-4">
              {rightPanelMode === "view-only" && (
                <UploadedFilesView files={docDetail.UPLOADED_FILES} />
              )}

              {rightPanelMode === "processing" && (
                <UploadSection
                  poId={docDetail.UPLOADED_FILES[0]?.RECID ?? ""}
                  uploadedFiles={docDetail.UPLOADED_FILES}
                  showUploadArea={false}
                />
              )}

              {rightPanelMode === "upload" && (
                <UploadSection
                  poId={docDetail.UPLOADED_FILES[0]?.RECID ?? ""}
                  uploadedFiles={docDetail.UPLOADED_FILES}
                  showUploadArea={true}
                />
              )}

              <AIMatchingResultPanel result={docDetail} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
