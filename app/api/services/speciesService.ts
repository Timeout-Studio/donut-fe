import apiClient from '../apiClient';

// API響應格式定義
interface ApiResponse {
  _data?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
  results?: Record<string, unknown>[];
  [key: string]: unknown;
}

// 搜索請求參數介面
interface SearchParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  keyword?: string | null;
  organismTypes?: string[];
  speciesTypes?: string[];
  statusValues?: string[] | null;
  fields?: string[] | null;
  expand?: string[] | null;
  [key: string]: string | number | boolean | null | string[] | undefined;
}

// 物種資料介面
export interface Species {
  id: number;
  name: string;
  organism_type: string;  // "0" = 鳥類, "1" = 蟲類, "2" = 其他
  level: number;
  description: string;
  short_description: string;
  image_id: string;
  sound_id: string;
  species_type: string;
  status: string;
  created_at: number;
  updated_at: number;
  imageUrl?: string; // 前端顯示用，將根據image_id生成
}

// 分類映射
export const SPECIES_CATEGORIES = {
  ALL: '全部',
  BIRD: '鳥類',     // organism_type: "0"
  BUG: '蟲類',      // organism_type: "1"
  OTHER: '其他'     // organism_type: "2"
};

// 分類對應到API的organism_type
const CATEGORY_TO_ORGANISM_TYPE: Record<string, string> = {
  [SPECIES_CATEGORIES.BIRD]: "0",
  [SPECIES_CATEGORIES.BUG]: "1", 
  [SPECIES_CATEGORIES.OTHER]: "2"
};

// 物種圖鑑API服務
class SpeciesService {
  // 默認搜索參數
  private defaultSearchParams: SearchParams = {
    page: 1,
    pageSize: 20,
    sort: "-id"
  };

  // 根據API響應獲取數據數組
  private getDataFromResponse(response: ApiResponse): Record<string, unknown>[] {
    if (response._data && Array.isArray(response._data)) {
      return response._data;
    } 
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (response.results && Array.isArray(response.results)) {
      return response.results;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }
  
  // 處理物種數據，添加圖片URL等必要信息
  private processSpeciesData(species: Species): Species {
    // 使用API端點來構建圖片URL
    const imageUrl = species.image_id 
      ? `${apiClient.getBaseUrl()}/file/${species.image_id}/download` 
      : '/species/default.jpg'; // 如果沒有image_id，使用本地默認圖片
    
    return {
      ...species,
      imageUrl
    };
  }

  // 獲取所有物種
  async getAllSpecies(): Promise<Species[]> {
    try {
      const response = await apiClient.post<ApiResponse>('/organism/search', this.defaultSearchParams);
      const speciesData = this.getDataFromResponse(response);
      return speciesData.map((item) => this.processSpeciesData(item as unknown as Species));
    } catch (error) {
      console.error('Error fetching all species:', error);
      return [];
    }
  }

  // 根據物種類型獲取物種
  async getSpeciesByCategory(category: string): Promise<Species[]> {
    try {
      // 如果是全部類別，直接獲取所有物種
      if (category === SPECIES_CATEGORIES.ALL) {
        return this.getAllSpecies();
      }
      
      // 獲取對應的organism_type
      const organismType = CATEGORY_TO_ORGANISM_TYPE[category];
      if (!organismType) {
        console.error(`Invalid category: ${category}`);
        return [];
      }
      
      // 使用searchOrganism endpoint進行篩選，使用organismTypes參數
      const searchParams: SearchParams = {
        ...this.defaultSearchParams,
        organismTypes: [organismType]
      };
      
      const response = await apiClient.post<ApiResponse>('/organism/search', searchParams);
      const speciesData = this.getDataFromResponse(response);
      return speciesData.map((item) => this.processSpeciesData(item as unknown as Species));
    } catch (error) {
      console.error(`Error fetching species by category ${category}:`, error);
      return [];
    }
  }

  // 獲取單一物種詳情
  async getSpeciesById(id: number): Promise<Species | null> {
    try {
      const response = await apiClient.get<ApiResponse>(`/organism/${id}`);
      // 如果返回的是單一物種資料
      if (response && !Array.isArray(response)) {
        return this.processSpeciesData(response as unknown as Species);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching species by id ${id}:`, error);
      return null;
    }
  }
}

// 導出物種圖鑑服務實例
const speciesService = new SpeciesService();
export default speciesService;