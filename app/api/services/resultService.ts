import apiClient from '../apiClient';
import { Species } from './speciesService';

// 定義用戶資料的介面
export interface UserData {
	id: string;
	username: string;
	level: string;
	duration: number;
	result: {
		id: number;
		organism_id: string;
		other_organism_id: string;
		duration: number;
	}[];
}

// 定義解析後的結果介面
export interface ParsedResult {
	id: number;
	organism_id: string;
	other_organism_id: string[];
	duration: number;
}

// 定義圖片介面
export interface SpeciesImage {
	organismId: string;
	blobUrl: string | null;
}

// 結果服務類
class ResultService {
	// 獲取用戶資料
	async getUserData(id: string): Promise<UserData | null> {
		try {
			const response = await apiClient.get<UserData>(`/player/${id}?expand=result`);
			console.log(response)
			return response;
		} catch (error) {
			console.error("Error fetching user data:", error);
			return null;
		}
	}

	// 解析用戶結果
	parseUserResult(userData: UserData | null): ParsedResult[] {
		if (!userData || !userData.result || userData.result.length === 0) {
			console.log("No user data or result available");
			return [];
		}

		// 找出最短的 duration 結果並累積所有 other_organism_id
		let shortestResult = userData.result[0];
		const allOtherOrganisms = new Set<string>();

		userData.result.forEach((result) => {
			// 更新最短時間結果
			if (result.duration < shortestResult.duration) {
				shortestResult = result;
			}

			// 累積所有 other_organism_id
			try {
				const parsedJson = JSON.parse(result.other_organism_id);
				const otherOrganismsArray = Object.values(parsedJson) as string[];
				otherOrganismsArray.forEach(org => allOtherOrganisms.add(org));
			} catch (error) {
				console.error("Error parsing other_organism_id:", error);
			}
		});

		// 創建最終的結果數據，使用最短時間的結果，但包含所有去重的 other_organism_id
		const parsedResults = [{
			id: shortestResult.id,
			organism_id: shortestResult.organism_id,
			other_organism_id: Array.from(allOtherOrganisms),
			duration: shortestResult.duration,
		}];

		return parsedResults;
	}

	// 獲取排名
	async getRanking(resultId: string): Promise<number | null> {
		try {
			const response = await apiClient.get<{rank: number}>(`/result/rank/${resultId}`);
			return response?.rank || 1;
		} catch (error) {
			console.error("Error fetching ranking:", error);
			return null;
		}
	}

	// 獲取排行榜總人數
	async getTotalPlayerCount(): Promise<number> {
		try {
			const searchParams = {
				page: 1,
				pageSize: 1,
				sort: "-id",
				fields: null,
				expand: null,
				keyword: null,
				statusValues: null
			};
			
			const response = await apiClient.post<{_meta: {totalCount: number}}>(`/result/search`, searchParams);
			return response._meta?.totalCount || 0;
		} catch (error) {
			console.error("Error fetching total player count:", error);
			return 0;
		}
	}

	// 獲取生物圖片
	async fetchImages(organisms: Species[]): Promise<SpeciesImage[]> {
		try {
			// 使用 image_id 來獲取圖片
			const imagePromises = organisms.map(async (organism) => {
				try {
					const response = await fetch(`${apiClient.getBaseUrl()}/file/${organism.image_id}/download`, {
						method: "GET",
					});

					if (!response.ok) {
						throw new Error(`Failed to fetch image for organism ${organism.id}`);
					}

					const blob = await response.blob();
					const blobUrl = URL.createObjectURL(blob);
					return { organismId: organism.id.toString(), blobUrl };
				} catch (error) {
					console.error(`Error fetching image for organism ${organism.id}:`, error);
					return { organismId: organism.id.toString(), blobUrl: null };
				}
			});

			return await Promise.all(imagePromises);
		} catch (error) {
			console.error("Error fetching images:", error);
			return [];
		}
	}
}

// 導出結果服務實例
const resultService = new ResultService();
export default resultService; 