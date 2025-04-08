"use client";

import { useEffect, useState, use } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import BirdItem from "@/app/components/BirdItem";

// 定義頁面參數的介面
interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

// 定義物種資料的介面
interface Species {
	id: number;
	name: string;
	image_id: number; // 新增 image_id 欄位
}

// 定義用戶資料的介面
interface UserData {
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

const parseUserResult = (userData: UserData | null) => {
	if (!userData || !userData.result || userData.result.length === 0) {
		console.log("No user data or result available");
		return [];
	}

	const parsedResults = userData.result.map((result) => {
		let otherOrganisms: string[] = [];
		try {
			const parsedJson = JSON.parse(result.other_organism_id);
			otherOrganisms = Object.values(parsedJson) as string[];
		} catch (error) {
			console.error("Error parsing other_organism_id:", error);
		}

		return {
			id: result.id,
			organism_id: result.organism_id,
			other_organism_id: otherOrganisms,
			duration: result.duration,
		};
	});

	console.log("Parsed user results:", parsedResults);
	return parsedResults;
};

const fetchImages = async (organisms: Species[]) => {
	try {
		// 使用 image_id 來獲取圖片
		const imagePromises = organisms.map(async (organism) => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/file/${organism.image_id}/download`, {
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

		const images = await Promise.all(imagePromises);
		console.log("Fetched images:", images);
		return images;
	} catch (error) {
		console.error("Error fetching images:", error);
		return [];
	}
};

const fetchUserData = async (id: string) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/player/${id}?expand=result`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Failed to fetch user data");
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching user data:", error);
		return null;
	}
};

const fetchOrganisms = async () => {
	try {
		console.log("Fetching all organisms data");
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/organism/search`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch organisms");
		}

		const data = await response.json();
		// 確保返回的是陣列格式
		const organisms = Array.isArray(data._data) ? data._data : [];
		console.log("Fetched organisms:", organisms);
		return organisms;
	} catch (error) {
		console.error("Error fetching organisms:", error);
		return [];
	}
};

const fetchRanking = async (id: string) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/result/rank/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Failed to fetch ranking");
		}
		let result = await response.json();

		return result?.rank;
	} catch (error) {
		console.error("Error fetching ranking:", error);
		return null;
	}
}

// 個人結果頁面組件
const IndividualResultPage = ({ params }: PageProps) => {
	const resolvedParams = use(params);
	const { id } = resolvedParams;
	const [userData, setUserData] = useState<UserData | null>(null);
	const [parsedResults, setParsedResults] = useState<ReturnType<typeof parseUserResult>>([]);
	const [speciesImages, setSpeciesImages] = useState<{ organismId: string; blobUrl: string | null }[]>([]);
	const [organisms, setOrganisms] = useState<Species[]>([]);
	const [loading, setLoading] = useState(true);
	const [ranking, setRanking] = useState<number | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const userDataResult = await fetchUserData(id);
				setUserData(userDataResult);

				const results = parseUserResult(userDataResult);
				setParsedResults(results);

				const rankingResult = await fetchRanking(results[0]?.id.toString());
				setRanking(rankingResult);

				if (results.length > 0) {
					// 獲取所有生物資料
					const organismsData = await fetchOrganisms();
					setOrganisms(organismsData);

					// 使用生物資料獲取圖片
					const images = await fetchImages(organismsData);
					setSpeciesImages(images);
				}
			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();

		return () => {
			speciesImages.forEach((image) => {
				if (image.blobUrl) {
					URL.revokeObjectURL(image.blobUrl);
				}
			});
		};
	}, [id]);

	useEffect(() => {
		localStorage.setItem("userResultId", id);
	}, [id]);

	const userMainOrganism = organisms.find((org) => org.id.toString() == userData?.result[0]?.organism_id);
	console.log("userMainOrganism:", userMainOrganism);

	const userAvatarImage = speciesImages.find((image) => image.organismId == userMainOrganism?.id.toString());
	console.log("userAvatarImage:", userAvatarImage);

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
						className="object-cover"
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
								<div className="font-bold">{Math.floor((userData?.result[0]?.duration || 0) / 60)}</div>
								<div className="me-1 text-sm text-gray-400">分</div>
								<div className="font-bold">{String((userData?.result[0]?.duration || 0) % 60).padStart(2, "0")}</div>
								<div className="right-4 text-sm text-gray-400">秒</div>
							</div>
						</div>
					</div>

					{/* 排名 */}
					<div className="bg-[#2D2D2D] rounded-2xl px-4 py-5 flex-1 flex flex-col relative">
						<div className="text-gray-400 text-center mb-1">排名</div>
						<div className="flex-grow flex items-baseline gap-1 justify-center">
							<div className="text-5xl font-bold">{ranking}</div>
							<div className="text-sm text-gray-400">名</div>
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
