"use client";

import { useEffect, useState, use, useMemo } from "react";
import Image from "next/image";
import BirdItem from "@/app/components/BirdItem";
import resultService, { UserData, ParsedResult, SpeciesImage } from "@/app/api/services/resultService";
import speciesService, { Species } from "@/app/api/services/speciesService";

// 定義頁面參數的介面
interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

// 個人結果頁面組件
const IndividualResultPage = ({ params }: PageProps) => {
	const resolvedParams = use(params);
	const { id } = resolvedParams;
	// 定義各種狀態來存儲數據
	const [userData, setUserData] = useState<UserData | null>(null);
	const [parsedResults, setParsedResults] = useState<ParsedResult[]>([]);
	const [speciesImages, setSpeciesImages] = useState<SpeciesImage[]>([]);
	const [organisms, setOrganisms] = useState<Species[]>([]);
	const [loading, setLoading] = useState(true);
	const [ranking, setRanking] = useState<number | null>(null);
	const [totalPlayers, setTotalPlayers] = useState<number>(0);

	// 頁面加載時獲取數據
	useEffect(() => {
		const loadData = async () => {
			try {
				// 獲取用戶數據
				const userDataResult = await resultService.getUserData(id);
				setUserData(userDataResult);

				// 解析用戶結果
				const results = resultService.parseUserResult(userDataResult);
				setParsedResults(results);

				// 獲取總人數
				const totalCount = await resultService.getTotalPlayerCount();
				setTotalPlayers(totalCount);

				if (results.length > 0) {
					const rankingResult = await resultService.getRanking(results[0]?.id.toString());
					setRanking(rankingResult);

					// 獲取所有生物資料
					const organismsData = await speciesService.getAllSpecies();
					setOrganisms(organismsData);

					// 使用生物資料獲取圖片
					const images = await resultService.fetchImages(organismsData);
					setSpeciesImages(images);
				}
			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();

		// 清除圖片 URL 資源
		return () => {
			speciesImages.forEach((image) => {
				if (image.blobUrl) {
					URL.revokeObjectURL(image.blobUrl);
				}
			});
		};
	}, [id]);

	// 保存結果 ID 到本地儲存
	useEffect(() => {
		localStorage.setItem("userResultId", id);
	}, [id]);

	// 使用 useMemo 找出用戶的主要生物，避免重複計算
	const userMainOrganism = useMemo(() => {
		return organisms.find((org) => org.id.toString() == userData?.result[0]?.organism_id);
	}, [organisms, userData]);

	// 使用 useMemo 獲取用戶主要生物的圖片，避免重複計算
	const userAvatarImage = useMemo(() => {
		return speciesImages.find((image) => image.organismId == userMainOrganism?.id.toString());
	}, [speciesImages, userMainOrganism]);

	// 載入中顯示
	if (loading) {
		return <div className="min-h-screen bg-[#1E1E1E] text-white p-6">Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-[#1E1E1E] text-white p-6">
			{/* 頂部 ID 顯示區域 */}
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-8">{userData?.username}</h1>
			</div>

			{/* 個人資料顯示區域 */}
			<div className="flex flex-col items-center mb-8">
				{/* 大頭貼顯示 */}
				<div className="w-32 h-32 rounded-full bg-white overflow-hidden mb-4">
					<Image
						src={userAvatarImage?.blobUrl || "/path-to-default-avatar.png"}
						alt={userMainOrganism?.name || userData?.username || "User avatar"}
						width={128}
						height={128}
						className="object-contain w-full h-full"
					/>
				</div>

				{/* 等級顯示 */}
				<div className="bg-donut-accent rounded-full px-8 py-2">
					<h2 className="text-donut-text-white text-2xl font-bold">{userMainOrganism?.name}</h2>
				</div>

				{/* 遊玩數據 */}
				<div className="flex gap-4 w-full max-w-sm justify-center mt-8">
					{/* 遊玩時長 */}
					<div className="bg-[#2D2D2D] rounded-2xl px-4 py-5 flex-1 flex flex-col relative min-w-[200px]">
						<div className="text-gray-400 text-center mb-1">遊玩時長</div>
						<div className="flex-grow flex items-center justify-center">
							<div className="text-5xl flex items-baseline gap-1 relative">
								{Math.floor((parsedResults[0]?.duration || 0) / 60) > 0 && (
									<>
										<div className="font-bold">{Math.floor((parsedResults[0]?.duration || 0) / 60)}</div>
										<div className="me-1 text-sm text-gray-400">分</div>
									</>
								)}
								<div className="font-bold">
									{(parsedResults[0]?.duration || 0) % 60 < 10 && Math.floor((parsedResults[0]?.duration || 0) / 60) > 0 ? '0' : ''}
									{((parsedResults[0]?.duration || 0) % 60).toFixed(1)}
								</div>
								<div className="right-4 text-sm text-gray-400">秒</div>
							</div>
						</div>
					</div>

					{/* 排名 */}
					<div className="bg-[#2D2D2D] rounded-2xl px-4 py-5 flex-1 flex flex-col relative">
						<div className="text-gray-400 text-center mb-1">排名</div>
						<div className="flex-grow flex items-baseline gap-1 justify-center">
							<div className="text-5xl font-bold">{ranking}</div>
							<div className="text-sm text-gray-400">/ {totalPlayers}</div>
						</div>
					</div>
				</div>
			</div>

			{/* 圖鑑顯示區域 */}
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">我的圖鑑</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 min-w-[280px]">
					{organisms.map((organism) => {
						// 檢查這個生物是否在用戶的結果中
						const currentResult = parsedResults.find((result) => {
							return result.organism_id === organism.name || result.other_organism_id.includes(organism.name);
						});

						// 獲取圖片
						const currentImage = speciesImages.find((image) => image.organismId === organism.id.toString());

						// 只用於設定邊框顏色
						const isLocked = !currentResult;

						return (
							<div key={organism.name} className="flex flex-col items-center gap-2 min-w-[120px]">
								<BirdItem isLocked={isLocked}>
									<Image
										src={currentImage?.blobUrl || "/path-to-default-bird.png"}
										alt={organism.name}
										width={100}
										height={100}
										style={{ width: "100px", height: "100px" }}
										className={`object-contain ${isLocked ? "saturate-0 opacity-50" : ""}`}
									/>
								</BirdItem>
								<span className={`text-sm text-center ${isLocked ? "text-gray-500" : ""}`}>{isLocked ? "???" : organism.name}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default IndividualResultPage;
