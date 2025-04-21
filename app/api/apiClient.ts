/**
 * 基礎API客戶端
 * 處理API請求的共通邏輯，如錯誤處理、認證等
 * 支持GET和POST請求
 */

// API基礎URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// HTTP請求方法類型
type HttpMethod = 'GET' | 'POST';

// API請求選項介面
interface ApiRequestOptions {
  method: HttpMethod;
  headers?: HeadersInit;
  body?: any;
  credentials?: RequestCredentials;
}

// API客戶端類別
class ApiClient {
  // 獲取API基礎URL
  getBaseUrl(): string {
    return API_BASE_URL || '';
  }

  // 發送請求的基礎方法
  async fetchApi<T>(endpoint: string, options: ApiRequestOptions): Promise<T> {
    const { method, headers = {}, body, credentials = 'same-origin' } = options;
    
    // 準備請求選項
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials,
    };

    // 如果有body且是POST請求，添加到請求中
    if (body && method === 'POST') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      // 發送請求
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      
      // 檢查響應狀態
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${JSON.stringify(
            errorData
          )}`
        );
      }
      
      // 返回成功的響應數據
      return await response.json();
    } catch (error) {
      console.error(`API Request Failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET方法封裝
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.fetchApi<T>(endpoint, { method: 'GET', headers });
  }

  // POST方法封裝
  async post<T>(endpoint: string, body: any, headers?: HeadersInit): Promise<T> {
    return this.fetchApi<T>(endpoint, { method: 'POST', body, headers });
  }
}

// 導出API客戶端實例，以便可以在整個應用中共用
const apiClient = new ApiClient();
export default apiClient;