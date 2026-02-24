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

// API Service Class
class JagotaApiService {
    private baseUrl: string;
    private packagePath: string;
    private staffCode: string;

    constructor() {
        this.baseUrl = (import.meta as any).env.VITE_API_URL;
        this.packagePath = 'apip/ws_ai_import';
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