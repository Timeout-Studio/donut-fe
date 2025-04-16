'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 定義排名數據接口
interface RankingItem {
  id: number;
  rank: number;
  username: string;
  date: string;
  time: string; // 時間格式如 "05:31"
  avatarUrl: string;
}

// 模擬排名數據
const mockRankings: RankingItem[] = [
  { id: 1, rank: 1, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 2, rank: 2, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 3, rank: 3, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 4, rank: 4, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 5, rank: 5, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 6, rank: 6, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 7, rank: 7, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 8, rank: 8, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
  { id: 9, rank: 9, username: '林駿宇', date: '2025/04/12', time: '05:31', avatarUrl: '/placeholder-avatar.png' },
];

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
          src={ranking.avatarUrl} 
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
const RankingListItem = ({ ranking }: { ranking: RankingItem }) => {
  // 第5名使用淺綠色背景，其他使用深灰色
  const isSpecial = ranking.rank === 5;
  
  return (
    <div className="relative w-full flex items-center">
      {/* 排名數字 - 放在pill外部 */}
      <span className="font-semibold text-lg text-white z-10 mr-5 w-6 text-center">{ranking.rank}</span>
      
      {/* pill背景 */}
      <div className="relative flex-1 flex items-center gap-5 ps-3 py-3 px-5">
        <div className={`absolute inset-0 rounded-full ${isSpecial ? 'bg-[#A6E8D9]' : 'bg-[#4B4B50]'}`} />
        
        <div className={`w-[50px] h-[50px] rounded-full z-10 overflow-hidden ${isSpecial ? 'bg-[#4B4B50]' : 'bg-donut-accent'} flex justify-center items-center`}>
          <Image 
            src={ranking.avatarUrl} 
            alt={ranking.username} 
            width={44} 
            height={44} 
            className="object-cover w-[90%] h-[90%]"
          />
        </div>
        
        <div className="flex flex-col z-10">
          <h3 className={`font-bold text-lg ${isSpecial ? 'text-black' : 'text-white'}`}>{ranking.username}</h3>
          <p className={`text-xs ${isSpecial ? 'text-[#4B4B50]' : 'text-[#ABABAB]'}`}>{ranking.date}</p>
        </div>
        
        <span className={`font-semibold text-lg ml-auto z-10 ${isSpecial ? 'text-black' : 'text-white'}`}>{ranking.time}</span>
      </div>
    </div>
  );
};

export default function Rankings() {
  const [rankings, setRankings] = useState<RankingItem[]>(mockRankings);
  
  // 在真實環境中，可以在這裡從API獲取排名數據
  useEffect(() => {
    // 模擬從API獲取數據
    // const fetchRankings = async () => {
    //   try {
    //     const response = await fetch('/api/rankings');
    //     const data = await response.json();
    //     setRankings(data);
    //   } catch (error) {
    //     console.error('Error fetching rankings:', error);
    //   }
    // };
    
    // fetchRankings();
  }, []);
  
  // 按照設計順序重排前三名: 二、一、三
  const getTopThreeOrdered = () => {
    // 找出前三名
    const first = rankings.find(r => r.rank === 1);
    const second = rankings.find(r => r.rank === 2);
    const third = rankings.find(r => r.rank === 3);
    
    // 按照設計需求的順序返回: 二、一、三
    return [second, first, third].filter(Boolean);
  };
  
  const topThree = getTopThreeOrdered();
  const otherRankings = rankings.filter(r => r.rank > 3);

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10 bg-[#1D1D1F] min-h-screen">
      {/* 前三名 - 在所有屏幕尺寸下橫向顯示 */}
      <div className="flex flex-row justify-center items-end w-full mb-8 sm:mb-12 gap-0">
        {topThree.map((ranking, index) => (
          <div 
            key={ranking?.id} 
            className={`
              ${index === 1 
                ? 'z-10 order-2' 
                : index === 0 
                  ? 'order-1 -mr-2.5' 
                  : 'order-3 -ml-2.5'
              }
            `}
          >
            <TopThreeItem ranking={ranking!} />
          </div>
        ))}
      </div>
      
      {/* 其他排名列表 */}
      <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
        {otherRankings.map((ranking) => (
          <RankingListItem key={ranking.id} ranking={ranking} />
        ))}
      </div>
    </div>
  );
}