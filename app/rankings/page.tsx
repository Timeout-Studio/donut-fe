'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import rankingService from '../api/services/rankingService';
import resultService from '../api/services/resultService';

// 定義排名數據接口
interface RankingItem {
  id: number;
  rank: number;
  username: string;
  date: string;
  time: string; // 時間格式如 "05:31"
  avatarUrl: string;
  player_id?: number;
}

// API響應類型
interface ApiResponse {
  _data?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
  results?: Record<string, unknown>[];
  [key: string]: unknown;
}

// 載入狀態組件
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-donut-accent"></div>
  </div>
);

// 前三名項目組件
const TopThreeItem = ({ ranking }: { ranking: RankingItem }) => {
  const isFirst = ranking.rank === 1;
  
  return (
    <div className={`flex flex-col items-center gap-2.5 ${isFirst ? 'w-[119px]' : 'w-[119px]'}`}>
      {isFirst && (
        <div className="w-[119px] h-[35px] relative">
          <Image 
            src="/crown.png" 
            alt="Crown" 
            width={119} 
            height={35} 
            className="object-contain w-full h-full"
          />
        </div>
      )}
      {!isFirst && (
        <div className="font-semibold text-xl text-white">{ranking.rank}</div>
      )}
      <div className={`flex justify-center items-center ${
        isFirst 
          ? 'w-[119px] h-[119px]' 
          : 'w-[88px] h-[88px]'
        } rounded-full bg-donut-accent overflow-hidden`}>
        <Image 
          src={ranking.avatarUrl || '/home/profile.jpg'} 
          alt={ranking.username} 
          width={isFirst ? 105 : 80} 
          height={isFirst ? 105 : 80} 
          className="object-cover w-[90%] h-[90%]"
        />
      </div>
      <div className="flex flex-col gap-1 items-center w-full">
        <h3 className="font-bold text-2xl text-white truncate max-w-full">{ranking.username}</h3>
        <p className="text-xs text-[#6C6D71]">{ranking.date}</p>
        <p className="font-semibold text-xl text-donut-accent">{ranking.time}</p>
      </div>
    </div>
  );
};

// 排名列表項目組件
const RankingListItem = ({ ranking, currentUserId }: { ranking: RankingItem; currentUserId: string | null }) => {
  // 判斷是否是當前用戶的排名
  const isCurrentUser = currentUserId && ranking.player_id?.toString() === currentUserId;
  
  return (
    <div className={`relative w-full flex items-center ${isCurrentUser && 'drop-shadow-[0_6px_8px_rgba(0,0,0,1)]'}`}>
      {/* 排名數字 - 放在pill外部 */}
      <span className="font-semibold text-lg text-white z-10 mr-5 w-6 text-center">{ranking.rank}</span>
      
      {/* pill背景 */}
      <div className="relative flex-1 flex items-center gap-5 ps-3 py-3 px-5">
        <div className={`absolute inset-0 rounded-full ${isCurrentUser ? 'bg-donut-accent' : 'bg-[#4B4B50]'}`} />
        
        <div className={`w-[50px] h-[50px] rounded-full z-10 overflow-hidden ${isCurrentUser ? 'bg-[#4B4B50]' : 'bg-donut-accent'} flex justify-center items-center`}>
          <Image 
            src={ranking.avatarUrl || '/home/profile.jpg'} 
            alt={ranking.username} 
            width={44} 
            height={44} 
            className="object-cover w-[90%] h-[90%]"
          />
        </div>
        
        <div className="flex flex-col z-10">
          <h3 className="font-bold text-lg texrt-white">{ranking.username}</h3>
          <p className={`text-xs ${isCurrentUser ? 'text-black' : 'text-[#ABABAB]'}`}>{ranking.date}</p>
        </div>
        
        <span className={`font-semibold text-lg ml-auto z-10 text-white`}>{ranking.time}</span>
      </div>
    </div>
  );
};

// 將秒轉換為分:秒格式
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Number((seconds % 60).toFixed(1)); // 取小數點後一位
  
  // 格式化為 MM:SS，確保秒數總是兩位數
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 從時間戳獲取日期字符串
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

export default function Rankings() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRanking, setCurrentUserRanking] = useState<RankingItem | null>(null);
  
  // 從 localStorage 獲取當前用戶 ID，然後使用 resultService 獲取完整用戶數據
  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== 'undefined') {
        const userResultId = localStorage.getItem('userResultId');
        if (userResultId) {
          try {
            // 使用 resultService 獲取用戶數據
            const userData = await resultService.getUserData(userResultId);
            if (userData && userData.id) {
              // 設置用戶的真正 ID
              setCurrentUserId(userData.id.toString());
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }
    };
    
    fetchUserData();
  }, []);
  
  // 從API獲取排名數據
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        // 調用API獲取所有排行榜數據
        const response = await rankingService.getAllRankings();
        
        console.log('API Response:', response); // 調試輸出
        
        // 檢查API響應格式並處理數據
        let rankingsData: Record<string, unknown>[] = [];
        if (response && typeof response === 'object') {
          // 如果是數組，直接使用
          if (Array.isArray(response)) {
            // @ts-expect-error - rankingService 返回的類型與我們預期的類型兼容
            rankingsData = response;
          }
          // 如果是對象，查找數據數組
          else {
            const apiResponse = response as unknown as ApiResponse;
            
            // 首先檢查 _data 屬性 (根據截圖這是API返回的主要數據結構)
            if (apiResponse._data && Array.isArray(apiResponse._data)) {
              rankingsData = apiResponse._data;
            } 
            // 備用選項
            else if (apiResponse.data && Array.isArray(apiResponse.data)) {
              rankingsData = apiResponse.data;
            }
            else if (apiResponse.results && Array.isArray(apiResponse.results)) {
              rankingsData = apiResponse.results;
            }
            else if (Object.keys(response).length > 0) {
              rankingsData = [response as Record<string, unknown>];
            }
          }
        }
        
        // 將API返回的數據映射到我們需要的數據格式
        const formattedRankings: RankingItem[] = rankingsData.map((item: Record<string, unknown>, index: number) => {
          // 處理 player_id 作為用戶名，實際環境中這裡可能需要從別的地方獲取真實用戶名
          const playerId = item.player_id as number | undefined;
          const username = playerId ? `玩家 ${playerId}` : `未知玩家 ${index + 1}`;
          
          // 處理日期，從created_at轉換
          const createdAt = item.created_at as number | undefined;
          const date = createdAt ? formatDate(createdAt) : '未知日期';
          
          // 處理時間，從duration轉換為分:秒格式
          const duration = item.duration as number | undefined;
          const time = duration ? formatDuration(duration) : '00:00';
          
          // 根據ID或索引生成排名
          const rank = index + 1; // 或者可以根據其他邏輯確定排名
          
          return {
            id: item.id ? Number(item.id) : index + 1,
            rank,
            username,
            date,
            time,
            avatarUrl: '/home/profile.jpg', // 使用默認頭像
            player_id: playerId
          };
        });
        
        // 按duration排序
        const sortedRankings = formattedRankings.sort((a, b) => {
          // 解析時間 (格式為 MM:SS)
          const timeA = a.time.split(':').map(Number);
          const timeB = b.time.split(':').map(Number);
          
          // 轉換為秒數進行比較
          const secondsA = timeA[0] * 60 + timeA[1];
          const secondsB = timeB[0] * 60 + timeB[1];
          
          // 較短時間排在前面
          return secondsA - secondsB;
        });
        
        // 更新排名順序
        sortedRankings.forEach((item, index) => {
          item.rank = index + 1;
        });
        
        setRankings(sortedRankings);
        setError(null);
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('無法獲取排行榜數據，請稍後再試');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankings();
  }, []);
  
  // 找出當前用戶的排名並設置
  useEffect(() => {
    if (rankings.length > 0 && currentUserId) {
      const userRanking = rankings.find(r => r.player_id?.toString() === currentUserId);
      if (userRanking) {
        setCurrentUserRanking(userRanking);
      }
    }
  }, [rankings, currentUserId]);
  
  // 如果正在加載，顯示加載動畫
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 bg-[#1D1D1F] min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  // 如果有錯誤，顯示錯誤信息
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 bg-[#1D1D1F] min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }
  
  // 如果沒有數據，顯示提示信息
  if (rankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 bg-[#1D1D1F] min-h-screen">
        <div className="p-4 text-white">
          暫無排行榜數據
        </div>
      </div>
    );
  }
  
  // 按照設計順序重排前三名: 二、一、三
  const getTopThreeOrdered = () => {
    // 找出前三名
    const first = rankings.find(r => r.rank === 1);
    const second = rankings.find(r => r.rank === 2);
    const third = rankings.find(r => r.rank === 3);
    
    // 按照設計需求的順序返回: 二、一、三
    return [second, first, third].filter(Boolean) as RankingItem[];
  };
  
  const topThree = getTopThreeOrdered();
  const otherRankings = rankings.filter(r => r.rank > 3 && r.rank <= 20);
  
  // 檢查當前用戶是否在前20名之外
  const userOutsideTop20 = currentUserRanking && currentUserRanking.rank > 20;

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10 min-h-screen relative">
      {/* 前三名 - 在所有屏幕尺寸下橫向顯示 */}
      <div className="flex flex-row justify-center items-end w-full mb-8 sm:mb-12 gap-0">
        {topThree.map((ranking, index) => (
          <div 
            key={ranking.id} 
            className={`
              ${index === 1 
                ? 'z-10 order-2' 
                : index === 0 
                  ? 'order-1 -mr-2.5' 
                  : 'order-3 -ml-2.5'
              }
            `}
          >
            <TopThreeItem ranking={ranking} />
          </div>
        ))}
      </div>
      
      {/* 其他排名列表（4-20名） */}
      <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
        {otherRankings.map((ranking) => (
          <RankingListItem key={ranking.id} ranking={ranking} currentUserId={currentUserId} />
        ))}
      </div>
      
      {/* 如果用戶排名在20名以外，顯示固定在底部的排名 */}
      {userOutsideTop20 && currentUserRanking && (
        <div className="w-full mt-auto pt-3 sticky bottom-0 left-0 right-0 z-10">
          <div className="w-full max-w-lg mx-auto">
            <RankingListItem ranking={currentUserRanking} currentUserId={currentUserId || currentUserRanking.id.toString()} />
          </div>
          <div className="h-4"></div> {/* 底部間距 */}
        </div>
      )}
    </div>
  );
}