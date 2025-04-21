'use client';

import { useState } from 'react';
import Image from 'next/image';

// 定義團隊成員數據接口
interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

// 模擬團隊成員數據
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: '紅衣衫',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/team-member-placeholder.png'
  },
  {
    id: 2,
    name: '紅衣衫',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/team-member-placeholder.png'
  },
  {
    id: 3,
    name: '紅衣衫',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/team-member-placeholder.png'
  },
  {
    id: 4,
    name: '紅衣衫',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/team-member-placeholder.png'
  },
  {
    id: 5,
    name: '紅衣衫',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/team-member-placeholder.png'
  },
  {
    id: 6,
    name: '紅衣衫',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/team-member-placeholder.png'
  }
];

// 團隊成員卡片組件
const TeamMemberCard = ({ member, isReversed = false }: { member: TeamMember, isReversed?: boolean }) => {
  return (
    <div className={`
      flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} 
      items-center md:items-end w-full 
      mt-5 first:mt-3 md:mt-16 md:first:mt-0
      bg-[#252529] md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none
    `}>
            <div className="
        w-[120px] h-[120px] 
        md:w-[160px] md:h-[160px] 
        rounded-[24px] md:rounded-[40px] 
        bg-white overflow-hidden 
        mx-auto md:mx-6
        mb-4 md:mb-0
      ">
        <Image 
          src={member.imageUrl} 
          alt={member.name} 
          width={160} 
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
      <div className={`
        flex flex-col gap-2 md:gap-4 w-full
        flex-1 max-w-xs md:max-w-sm
        text-center ${isReversed ? 'md:text-right' : 'md:text-left'} 
        md:mb-0
      `}>
        <h3 className="font-bold text-xl md:text-3xl text-white">{member.name}</h3>
        <p className="font-medium text-base md:text-xl text-donut-accent">{member.role}</p>
        <p className="text-sm md:text-base text-white leading-relaxed mt-1 md:mt-0">{member.description}</p>
      </div>
    
    </div>
  );
};

// 頁籤按鈕組件
const TabButton = ({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) => (
  <button 
    className={`
      rounded-full py-3 px-5 md:py-4 md:px-6 
      font-bold text-sm md:text-base
      transition-colors duration-200 
      ${active ? 'bg-[#4B4B50] text-white' : 'bg-donut-accent text-white hover:bg-donut-accent/90'} 
      focus:outline-none focus:ring-2 focus:ring-donut-accent focus:ring-offset-2 focus:ring-offset-[#1D1D1F]
    `}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function About() {
  const [activeTab, setActiveTab] = useState<'about-donut' | 'about-timeout'>('about-donut');
  
  return (
    <div className="flex flex-col px-4 sm:px-6 md:px-8 py-8 md:py-11 bg-[#1D1D1F] min-h-screen">
      {/* 標題和頁籤區域 */}
      <div className="flex flex-col gap-6 md:gap-9 w-full mb-8 md:mb-10">
        <h1 className="font-bold text-2xl md:text-3xl text-white">關於我們</h1>
        
        <div className="flex flex-wrap gap-3 w-full">
          <TabButton 
            active={activeTab === 'about-donut'} 
            onClick={() => setActiveTab('about-donut')}
          >
            關於Do-NUT
          </TabButton>
          
          <TabButton 
            active={activeTab === 'about-timeout'} 
            onClick={() => setActiveTab('about-timeout')}
          >
            關於連線逾時
          </TabButton>
        </div>
      </div>
      
      {/* 內容區域 */}
      <section 
        className="
          w-full bg-white rounded-[24px] md:rounded-[40px] 
          p-6 md:p-8 
          mb-12 md:mb-16
          drop-shadow-lg
        "
      >
        {activeTab === 'about-donut' ? (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Do-NUT 專案簡介</h2>
            <p className="text-gray-700">
              Do-NUT 是一個致力於環境教育與自然保育的互動專案，旨在透過科技與藝術的結合，
              讓參與者能夠以全新的方式體驗自然世界。我們希望通過這個專案提高人們對環境議題的
              關注，並促進可持續發展意識的培養。
            </p>
            
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-3">我們的理念</h3>
            <p className="text-gray-700">
              在現代都市生活中，人們與自然的連結日漸減少。Do-NUT 希望重新建立這種連結，
              讓城市居民能夠重新認識自然環境的重要性，並在日常生活中實踐環保理念。
            </p>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">連線逾時工作室</h2>
            <p className="text-gray-700">
              連線逾時是一個由元智大學資訊傳播學系學生組成的創意團隊，專注於將科技與藝術結合，
              創造具有社會影響力的互動體驗。我們擅長運用各種媒體技術，包括互動裝置、數位內容、
              網頁與應用程式開發等，為使用者帶來創新的體驗。
            </p>
            
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-3">我們的使命</h3>
            <p className="text-gray-700">
              我們致力於探索科技與人文的交匯點，通過創新的設計思維解決現實問題，
              並為社會創造正面影響。連線逾時相信，有意義的創作能夠改變人們的觀念，
              進而推動社會的進步。
            </p>
          </div>
        )}
      </section>
      
      {/* 團隊成員展示區域 */}
      <section className="w-full">
        <h2 className="font-bold text-xl md:text-2xl text-white mb-8 md:mb-12">團隊成員</h2>
        
        <div className="w-full flex flex-col max-w-2xl mx-auto space-y-5 md:space-y-16">
          {teamMembers.map((member, index) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              isReversed={index % 2 !== 0} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}