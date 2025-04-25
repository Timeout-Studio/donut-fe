'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ReadMoreButton } from '../components/ReadMoreButton';
import rankingService from '../api/services/rankingService';

// 定義排名數據接口
interface RankingItem {
  id: number;
  rank: number;
  username: string;
  date: string;
  time: string;
  avatarUrl: string;
}

// API響應類型
interface ApiResponse {
  _data?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
  results?: Record<string, unknown>[];
  [key: string]: unknown;
}

// 將秒轉換為分:秒格式
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Number((seconds % 60).toFixed(1));
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 從時間戳獲取日期字符串
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

export default function Home() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [topRankings, setTopRankings] = useState<RankingItem[]>([]);
  const [loadingRankings, setLoadingRankings] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 從開始滾動就漸漸變暗，在滾動到半個螢幕高度時就達到最暗（0.3亮度）
      if (scrollPosition >= windowHeight / 2) {
        // 如果滾動超過半個螢幕高度，保持最暗（0.3）
        setScrollOpacity(0.3);
      } else {
        // 根據滾動位置計算透明度：從1（不滾動）到0.3（滾動半個螢幕高度）
        const newOpacity = 1 - (scrollPosition / (windowHeight / 2)) * 0.7;
        setScrollOpacity(newOpacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 從API獲取排名數據
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoadingRankings(true);
        // 調用API獲取所有排行榜數據
        const response = await rankingService.getAllRankings();
        
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
          const playerId = item.player_id as string | number | undefined;
          const username = playerId ? `玩家 ${playerId}` : `未知玩家 ${index + 1}`;
          
          // 處理日期，從created_at轉換
          const createdAt = item.created_at as number | undefined;
          const date = createdAt ? formatDate(createdAt) : '未知日期';
          
          // 處理時間，從duration轉換為分:秒格式
          const duration = item.duration as number | undefined;
          const time = duration ? formatDuration(duration) : '00:00';
          
          // 根據ID或索引生成排名
          const rank = index + 1;
          
          return {
            id: item.id ? Number(item.id) : index + 1,
            rank,
            username,
            date,
            time,
            avatarUrl: '/home/profile.jpg' // 使用默認頭像
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
        
        // 只保留前三名
        setTopRankings(sortedRankings.slice(0, 3));
      } catch (err) {
        console.error('Error fetching rankings:', err);
        // 設置一些默認數據，避免UI空白
        setTopRankings([]);
      } finally {
        setLoadingRankings(false);
      }
    };
    
    fetchRankings();
  }, []);

  // 按照設計順序重排前三名: 二、一、三
  const getTopThreeOrdered = () => {
    // 找出前三名
    const first = topRankings.find(r => r.rank === 1);
    const second = topRankings.find(r => r.rank === 2);
    const third = topRankings.find(r => r.rank === 3);
    
    // 按照設計需求的順序返回: 二、一、三
    return [second, first, third].filter(Boolean) as RankingItem[];
  };

  const orderedTopThree = topRankings.length > 0 ? getTopThreeOrdered() : [];

  return (
    <div className="relative bg-[#1D1D1F] min-h-screen">
      {/* 背景圖片 - 覆蓋整個頁面，但z-index較低避免覆蓋footer */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: 1 - scrollOpacity }}
        ></div>
        <Image 
          src="/home/background.jpg" 
          alt="Background"
          fill
          className="object-cover"
          style={{ opacity: scrollOpacity }}
          priority
        />
      </div>

      {/* 中央Logo和介紹 - 佔滿一個螢幕高度 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 w-full max-w-lg mx-auto">
        <div className="w-full max-w-[350px] relative mb-4">
          <Image 
            src="/home/Do-NUT_Logo_W.png" 
            alt="Do-Nut Logo" 
            width={700}
            height={310}
            className="w-full h-auto drop-shadow-lg"
            priority
          />
        </div>
        <p className="text-white text-center text-[18px] sm:text-[20px] leading-7 mb-48 sm:leading-8 w-full drop-shadow-md">
          是一個透過故事劇情與闖關遊戲<br />
          喚起人們對環境重視的沉浸式展覽
        </p>
      </div>

      {/* 內容區域 */}
      <div className="relative z-10 px-6 pb-12 flex flex-col items-center">
        <div className="max-w-md w-full flex flex-col gap-10">
          {/* 排行榜區塊 */}
          <section>
            <h2 className="text-white text-[28px] font-bold mb-9">排行榜</h2>
            
            {loadingRankings ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44C2A5]"></div>
              </div>
            ) : orderedTopThree.length > 0 ? (
              <div className="flex justify-center items-end gap-4 mb-8">
                {orderedTopThree.map((ranking, index) => {
                  const isFirst = index === 1; // 中間位置是第一名
                  
                  return (
                    <div key={ranking.id} className="flex flex-col items-center gap-2 w-[120px]">
                      {isFirst ? (
                        <Image 
                          src="/home/crown.png" 
                          alt="Crown" 
                          width={40} 
                          height={40} 
                          className="mb-1"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-white text-xl font-semibold">{ranking.rank}</span>
                        </div>
                      )}
                      
                      <div className={`${isFirst ? 'w-[119px] h-[119px]' : 'w-[88px] h-[88px]'} bg-[#44C2A5] rounded-full overflow-hidden`}>
                        <Image 
                          src={ranking.avatarUrl} 
                          alt="Profile" 
                          width={isFirst ? 119 : 88} 
                          height={isFirst ? 119 : 88} 
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col items-center w-full">
                        <span className="text-white text-[22px] font-bold">{ranking.username}</span>
                        <span className="text-[#6C6D71] text-[10px]">{ranking.date}</span>
                        <span className="text-[#44C2A5] text-xl font-semibold">{ranking.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-white text-center py-6">
                暫無排行榜數據
              </div>
            )}
            
            <ReadMoreButton href="/rankings" />
            </section>

          {/* 關於我們區塊 */}
          <section>
            <h2 className="text-white text-[28px] font-bold mb-9">關於我們</h2>
            <Image 
              src="/Us.jpg" 
              alt="About Us" 
              width={800}
              height={150}
              className="w-full h-[150px] rounded-[20px] mb-6 object-cover"
            />
            <ReadMoreButton href="/about" />
          </section>
          
          {/* 展場資訊區塊 */}
          <section>
            <h2 className="text-white text-[28px] font-bold mb-9">展場資訊</h2>
            <div className="flex flex-col gap-3 mb-6">
              <h3 className="text-white text-2xl font-medium">校內展</h3>
              <p className="text-white text-base">
                時間｜𝟮𝟬𝟮𝟱.𝟬𝟰.𝟬𝟳-𝟮𝟬𝟮𝟱.𝟬𝟰.𝟭𝟮<br />
                地點｜元智大學 五館三樓 及 六館玻璃屋
              </p>
              
              <h3 className="text-white text-2xl font-medium mt-4">校外展</h3>
              <p className="text-white text-base">
                時間｜𝟮𝟬𝟮𝟱.𝟬𝟰.𝟮𝟱-𝟮𝟬𝟮𝟱.𝟬𝟰.𝟮𝟴<br />
                地點｜松山文創園區三號倉庫
              </p>
              
              <h3 className="text-white text-2xl font-medium mt-4">更多資訊</h3>
              <p className="text-white text-base">
                Instagram｜@donut_timeout
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}