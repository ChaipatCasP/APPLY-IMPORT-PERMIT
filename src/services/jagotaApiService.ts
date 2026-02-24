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

// API Service Class
class JagotaApiService {
    private baseUrl: string;
    private packagePath: string;
    private staffCode: string;

    constructor() {
        this.baseUrl = (import.meta as any).env.VITE_API_URL;
        this.packagePath = 'apip/ws_ai_apply_permit';
        this.staffCode = ''; // Will be set after successful authentication

        if (!this.baseUrl) {
            throw new Error('Missing required environment variable: VITE_API_URL');
        }
    }


    private buildUrl(endpoint: string): string {
        return `${this.baseUrl}/${this.packagePath}/${endpoint}/`;
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

}

// Export singleton instance
export const jagotaApi = new JagotaApiService();

// Export the class for custom instances
export default JagotaApiService;