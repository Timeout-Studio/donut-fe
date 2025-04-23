'use client';

import rankingService, { RankingItem } from '../api/services/rankingService';
import { useApi } from '../api/hooks/useApi';
import Image from 'next/image';

// 載入狀態組件
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-donut-prim"></div>
  </div>
);

export default function RankingExample() {
  // 使用API鉤子獲取排行榜數據（現在使用getAllRankings）
  const { data: allRankings, loading, error, refetch } = useApi<RankingItem[]>(
    () => rankingService.getAllRankings(),
    true,
    []
  );

  // 處理排行榜數據，只顯示前三名
  const getTopThree = (rankings: RankingItem[]) => {
    if (!rankings || rankings.length === 0) return [];
    
    return rankings
      .sort((a, b) => a.position - b.position)
      .slice(0, 3);
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      發生錯誤: {error.message}
    </div>
  );

  // 獲取前三名排行榜數據
  const topRankings = allRankings ? getTopThree(allRankings) : [];

  return (
    <div className="p-6 bg-donut-bg-2 rounded-2xl text-white">
      <h2 className="text-[28px] font-bold mb-9">排行榜</h2>
      
      {/* 排行榜數據顯示 */}
      {topRankings.length > 0 ? (
        <div className="flex justify-center items-end gap-4 mb-8">
          {/* 顯示前三名 */}
          {topRankings.map((item) => {
            // 針對不同名次顯示不同樣式
            if (item.position === 1) {
              return (
                <div key={item.id} className="flex flex-col items-center gap-2 w-[120px]">
                  <Image 
                    src="/home/crown.png" 
                    alt="Crown" 
                    width={40} 
                    height={40} 
                    className="mb-1"
                  />
                  <div className="w-[119px] h-[119px] bg-[#44C2A5] rounded-full overflow-hidden">
                    <Image 
                      src={item.avatarUrl || "/home/profile.jpg"} 
                      alt="Profile" 
                      width={119} 
                      height={119} 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <span className="text-white text-[22px] font-bold">{item.name}</span>
                    <span className="text-[#6C6D71] text-[10px]">{item.date}</span>
                    <span className="text-[#44C2A5] text-xl font-semibold">{item.time}</span>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={item.id} className="flex flex-col items-center gap-2 w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white text-xl font-semibold">{item.position}</span>
                    <div className="w-[88px] h-[88px] bg-[#44C2A5] rounded-full overflow-hidden">
                      <Image 
                        src={item.avatarUrl || "/home/profile.jpg"} 
                        alt="Profile" 
                        width={88} 
                        height={88} 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <span className="text-white text-[22px] font-bold">{item.name}</span>
                    <span className="text-[#6C6D71] text-[10px]">{item.date}</span>
                    <span className="text-[#44C2A5] text-xl font-semibold">{item.time}</span>
                  </div>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <p className="text-center text-white mb-8">暫無排行榜數據</p>
      )}
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => refetch()} 
          className="bg-[#44C2A5] rounded-[40px] py-[10px] px-[29px] text-white text-xl font-bold"
        >
          刷新數據
        </button>
      </div>
    </div>
  );
} 