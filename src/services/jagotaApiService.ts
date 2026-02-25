/**
 * Jagota API Service
 * All-in-one service for Jagota API endpoints
 */

// Types
export interface ApiResponse<T = any> {
    flag: number;
    message: string;
    package_name: string;
    function_name: string;
    records: number;
    result: T[];
}

export interface AuthenParams {
    P_USERNAME: string;
    P_PASSWORD: string;
}

export interface AuthenResult {
    FLAG: string;
    STAFF_NAME: string;
}

// list_doc
export interface ListDocParams {
    P_STAFF_CODE: string;
    P_SUPP_CODE?: string;
    P_BUYER_CODE?: string;
    P_PROCESSING_STATUS?: string;
    P_STAGE?: string;
    P_STAGE_OPTION?: string;
    P_DATE_FROM?: string;
    P_DATE_TO?: string;
    P_SEARCH?: string;
    P_PAGE?: string | number;
    P_PER_PAGE?: string | number;
    P_ORDER_BY?: string;
    P_ORDER_DIR?: string;
}

export interface CustomerDoc {
    COMPANY: string;
    TRANSACTION_TYPE: string;
    DOC_BOOK: string;
    DOC_NO: string;
    PO_BOOK: string;
    PO_NO: string;
    PO_DOC: string;
    PO_DATE: string;
    PO_APP_DATE: string;
    SUPP_CODE: string;
    SUPP_NAME: string;
    CREATION_DATE: string;
    INCOTERM: string;
    TOTAL: string;
    ETD: string;
    ETA: string;
    PORT_OF_ORIGIN: string;
    COUNTRY_ORIGIN: string;
    SHIPPER_SUP_NAME: string;
    PRODUCT_TEMPERATURE: string;
    BUYER: string;
    TRANSPORT_MODE: string;
    PORT_OF_LOADING: string;
    STAGE: string;
    PROCESSING_STATUS: string;
    CLOSED_STATUS: string;
    CURRENCY: string;
}

export interface ListDocResult {
    TOTAL_FOUND: string;
    TOTAL_PAGE: string;
    CUSTOMERS: CustomerDoc[];
}

// STAGE_COUNT
export interface StageCountParams {
    P_STAFF_CODE: string;
}

export interface PendingStage {
    SEQ: string;
    STAGE: string;
    STAGE_NAME: string;
    TOTAL: string;
}

export interface RequestStage {
    SEQ: string;
    STAGE: string;
    STAGE_NAME: string;
    TOTAL: string;
    PROCESSING: string;
    READY: string;
    FAIL: string;
}

export interface ExpiryStage {
    SEQ: string;
    STAGE: string;
    STAGE_NAME: string;
    TOTAL: string;
    EXPIRE_IN_5_DAYS: string;
    EXPIRED: string;
}

export interface CompletedStage {
    SEQ: string;
    STAGE: string;
    STAGE_NAME: string;
    TOTAL: string;
}

export interface ReceivedStage {
    SEQ: string;
    STAGE: string;
    STAGE_NAME: string;
    TOTAL: string;
}

export interface StageCountResult {
    PENDING: PendingStage[];
    REQUEST: RequestStage[];
    EXPIRY: ExpiryStage[];
    COMPLETED: CompletedStage[];
    RECEIVED: ReceivedStage[];
}

// GET_DOC
export interface GetDocParams {
    COMPANY: string;
    TRANSACTION_TYPE: string;
    DOC_BOOK: string;
    DOC_NO: string | number;
}

// APPLY_PERMIT_AI (n8n)
export interface ApplyPermitAIParams {
    file: File;
    staff_code: string;
    company: string;
    transaction_type: string;
    doc_book: string;
    doc_no: string;
    stage: string;
}

// REVISE_JOB / REVISE_LIST / REVISE_CANCEL
export interface ReviseParams {
    P_STAFF_CODE: string;
    P_COMPANY: string;
    P_TRANSACTION_TYPE: string;
    P_DOC_BOOK: string;
    P_DOC_NO: string;
    P_STAGE: string;
}

export type ReviseListParams = ReviseParams;
export type ReviseCancelParams = ReviseParams;

// Re-export shared types from types/index.ts for convenience
export type { GetDocDetail, POEntry, PODetail, POTariff, SupSlaughterhouse, AIPOTariff, AISupSlaughterhouse, UploadedFileDoc } from '../types';

// API Service Class
class JagotaApiService {
    private baseUrl: string;
    private packagePath: string;
    private staffCode: string;
    private n8nUrl: string;
    private n8nBearerToken: string;

    constructor() {
        this.baseUrl = (import.meta as any).env.VITE_API_URL;
        this.packagePath = 'apip/ws_ai_apply_permit';
        this.staffCode = ''; // Will be set after successful authentication
        this.n8nUrl = (import.meta as any).env.VITE_N8N_URL ?? '';
        this.n8nBearerToken = (import.meta as any).env.VITE_N8N_BEARER_TOKEN ?? '';

        if (!this.baseUrl) {
            throw new Error('Missing required environment variable: VITE_API_URL');
        }
    }


    private buildUrl(endpoint: string): string {
        return `${this.baseUrl}/${this.packagePath}/${endpoint}/`;
    }

    private buildJsonUrl(endpoint: string): string {
        // Use a relative path so Vite's dev-server proxy forwards the request
        // and avoids CORS preflight on JSON + custom-header requests.
        return `/Apipj/ws_ai_apply_permit/${endpoint}/`;
    }

    private async makeRequest<T>(endpoint: string, params: Record<string, any>): Promise<ApiResponse<T>> {
        const url = this.buildUrl(endpoint);

        const formData = new FormData();
        Object.entries(params).forEach(([key, value]) => {
            // Send all parameters, even if empty string
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as ApiResponse<T>;

            if (data.flag !== 1) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    private async makeFormRequestWithHeaders<T>(
        url: string,
        formData: FormData,
        headers: Record<string, string> = {},
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as ApiResponse<T>;

            if (data.flag !== 1) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`API form request failed for ${url}:`, error);
            throw error;
        }
    }

    private async makeJsonRequest<T>(
        endpoint: string,
        body: Record<string, any>,
        username?: string,
    ): Promise<ApiResponse<T>> {
        const url = this.buildJsonUrl(endpoint);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Username': username ?? this.staffCode,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as ApiResponse<T>;

            if (data.flag !== 1) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`API JSON request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * User Authentication
     * POST /apip/ws_ai_import/USER_AUTHEN/
     */
    async authenticateUser(params: AuthenParams): Promise<AuthenResult> {
        const response = await this.makeRequest<AuthenResult>('USER_AUTHEN', params);

        if (!response.result || response.result.length === 0) {
            throw new Error('Authentication failed: No result returned');
        }

        return response.result[0];
    }

    /**
     * List Documents
     * POST /apip/ws_ai_apply_permit/list_doc/
     */
    async listDoc(params: ListDocParams): Promise<ListDocResult> {
        const response = await this.makeRequest<ListDocResult>('list_doc', {
            P_STAFF_CODE: params.P_STAFF_CODE ?? this.staffCode,
            P_SUPP_CODE: params.P_SUPP_CODE ?? '',
            P_BUYER_CODE: params.P_BUYER_CODE ?? '',
            P_PROCESSING_STATUS: params.P_PROCESSING_STATUS ?? '',
            P_STAGE: params.P_STAGE ?? '',
            P_STAGE_OPTION: params.P_STAGE_OPTION ?? '',
            P_DATE_FROM: params.P_DATE_FROM ?? '',
            P_DATE_TO: params.P_DATE_TO ?? '',
            P_SEARCH: params.P_SEARCH ?? '',
            P_PAGE: params.P_PAGE ?? '',
            P_PER_PAGE: params.P_PER_PAGE ?? '',
            P_ORDER_BY: params.P_ORDER_BY ?? '',
            P_ORDER_DIR: params.P_ORDER_DIR ?? '',
        });

        if (!response.result || response.result.length === 0) {
            return { TOTAL_FOUND: '0', TOTAL_PAGE: '0', CUSTOMERS: [] };
        }

        return response.result[0];
    }

    /**
     * Get Document Detail
     * POST /Apipj/ws_ai_apply_permit/GET_DOC/
     * Uses JSON body + Username header
     */
    async getDoc(params: GetDocParams): Promise<import('../types').GetDocDetail> {
        const response = await this.makeJsonRequest<import('../types').GetDocDetail>('GET_DOC', {
            COMPANY: params.COMPANY,
            TRANSACTION_TYPE: params.TRANSACTION_TYPE,
            DOC_BOOK: params.DOC_BOOK,
            DOC_NO: params.DOC_NO,
        });

        if (!response.result || response.result.length === 0) {
            return {
                STAGE: '', REVISION: '', RECID: '', PREVIEW_ONLY: 'N',
                PO: [], UPLOADED_FILES: [], PO_TARIFF: [],
                SUP_SLAUGHTERHOUSE: [], AI_PO_TARIFF: [], AI_SUP_SLAUGHTERHOUSE: [],
            };
        }

        return response.result[0];
    }

    /**
     * Get Stage Count
     * POST /apip/ws_ai_apply_permit/STAGE_COUNT/
     */
    async getStageCount(params?: StageCountParams): Promise<StageCountResult> {
        const response = await this.makeRequest<StageCountResult>('STAGE_COUNT', {
            P_STAFF_CODE: params?.P_STAFF_CODE ?? this.staffCode,
        });

        if (!response.result || response.result.length === 0) {
            throw new Error('getStageCount: No result returned');
        }

        return response.result[0];
    }

    /**
     * Set staff code for future requests
     */
    setStaffCode(staffCode: string): void {
        this.staffCode = staffCode;
    }

    /**
     * Get current staff code
     */
    getStaffCode(): string {
        return this.staffCode;
    }

    /**
     * Apply Permit AI (n8n webhook)
     * POST https://n8n-staging.jagota.com/webhook-test/ApplyPermitAI-toque
     * Sends a PDF file + form fields with Bearer auth
     */
    async applyPermitAI(params: ApplyPermitAIParams, username?: string): Promise<ApiResponse<any>> {
        const url = `${this.n8nUrl}/ApplyPermitAI-toque`;
        const formData = new FormData();
        formData.append('file_upload', params.file);
        formData.append('staff_code', params.staff_code);
        formData.append('company', params.company);
        formData.append('transaction_type', params.transaction_type);
        formData.append('doc_book', params.doc_book);
        formData.append('doc_no', params.doc_no);
        formData.append('stage', params.stage);

        return this.makeFormRequestWithHeaders<any>(url, formData, {
            Authorization: `Bearer ${this.n8nBearerToken}`,
            Username: username ?? this.staffCode,
        });
    }

    /**
     * Revise Job
     * POST /Apip/ws_ai_apply_permit/REVISE_JOB/
     */
    async reviseJob(params: ReviseParams, username?: string): Promise<ApiResponse<any>> {
        const url = `${this.baseUrl}/Apip/ws_ai_apply_permit/REVISE_JOB/`;
        const formData = new FormData();
        formData.append('P_STAFF_CODE', params.P_STAFF_CODE);
        formData.append('P_COMPANY', params.P_COMPANY);
        formData.append('P_TRANSACTION_TYPE', params.P_TRANSACTION_TYPE);
        formData.append('P_DOC_BOOK', params.P_DOC_BOOK);
        formData.append('P_DOC_NO', params.P_DOC_NO);
        formData.append('P_STAGE', params.P_STAGE);

        return this.makeFormRequestWithHeaders<any>(url, formData, {
            Username: username ?? this.staffCode,
        });
    }

    /**
     * Revise List
     * POST /Apip/ws_ai_apply_permit/REVISE_LIST/
     */
    async reviseList(params: ReviseListParams, username?: string): Promise<ApiResponse<any>> {
        const url = `${this.baseUrl}/Apip/ws_ai_apply_permit/REVISE_LIST/`;
        const formData = new FormData();
        formData.append('P_STAFF_CODE', params.P_STAFF_CODE);
        formData.append('P_COMPANY', params.P_COMPANY);
        formData.append('P_TRANSACTION_TYPE', params.P_TRANSACTION_TYPE);
        formData.append('P_DOC_BOOK', params.P_DOC_BOOK);
        formData.append('P_DOC_NO', params.P_DOC_NO);
        formData.append('P_STAGE', params.P_STAGE);

        return this.makeFormRequestWithHeaders<any>(url, formData, {
            Username: username ?? this.staffCode,
        });
    }

    /**
     * Revise Cancel
     * POST /Apip/ws_ai_apply_permit/REVISE_CANCEL/
     */
    async reviseCancel(params: ReviseCancelParams, username?: string): Promise<ApiResponse<any>> {
        const url = `${this.baseUrl}/Apip/ws_ai_apply_permit/REVISE_CANCEL/`;
        const formData = new FormData();
        formData.append('P_STAFF_CODE', params.P_STAFF_CODE);
        formData.append('P_COMPANY', params.P_COMPANY);
        formData.append('P_TRANSACTION_TYPE', params.P_TRANSACTION_TYPE);
        formData.append('P_DOC_BOOK', params.P_DOC_BOOK);
        formData.append('P_DOC_NO', params.P_DOC_NO);
        formData.append('P_STAGE', params.P_STAGE);

        return this.makeFormRequestWithHeaders<any>(url, formData, {
            Username: username ?? this.staffCode,
        });
    }

}

// Export singleton instance
export const jagotaApi = new JagotaApiService();

// Export the class for custom instances
export default JagotaApiService;