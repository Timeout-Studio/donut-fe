// 導出所有API服務和工具
import apiClient from './apiClient';
import rankingService from './services/rankingService';
import speciesService from './services/speciesService';
import { useApi } from './hooks/useApi';

// 統一導出所有API相關資源
export {
  apiClient,         // API客戶端
  rankingService,    // 排行榜服務
  speciesService,    // 物種圖鑑服務
  useApi,            // API鉤子
};

// 導出類型
export type { RankingItem } from './services/rankingService';
export type { Species } from './services/speciesService'; 