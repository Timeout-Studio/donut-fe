import apiClient from '../apiClient';

// 排行榜項目介面
export interface RankingItem {
  id: string;
  name: string;
  date: string;
  time: string;
  position: number;
  avatarUrl?: string;
}

// 搜索請求參數介面
interface SearchParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  [key: string]: any;
}

// 排行榜API服務
class RankingService {
  // 默認搜索參數
  private defaultSearchParams: SearchParams = {
    page: 1,
    pageSize: 20,
    sort: "duration" // 按遊玩時間排序
  };

  // 獲取指定用戶的排名
  async getUserRanking(userId: string): Promise<RankingItem | null> {
    return apiClient.get<RankingItem | null>(`/result/user/${userId}`);
  }

  // 獲取所有排行榜
  async getAllRankings(): Promise<RankingItem[]> {
    // 使用 searchResult 端點獲取所有排名，並按duration排序
    return apiClient.post<RankingItem[]>(`/result/search`, this.defaultSearchParams);
  }
  
  // 根據獲取的所有排名提取前N名
  async getTopRankings(limit: number = 3): Promise<RankingItem[]> {
    const allRankings = await this.getAllRankings();
    // 因為API已經按遊玩時間排序，這裡可以直接取前N項，無需再排序
    return allRankings.slice(0, limit);
  }
}

// 導出排行榜服務實例
const rankingService = new RankingService();
export default rankingService;