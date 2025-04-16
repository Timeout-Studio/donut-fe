'use client';

import { useState } from 'react';
import Image from 'next/image';

// 定義物種類別
type SpeciesCategory = '全部' | '鳥類' | '哺乳類' | '兩棲類';

// 定義物種資料結構
interface Species {
  id: number;
  name: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  category: SpeciesCategory;
}

// 模擬物種資料
const speciesData: Species[] = [
  {
    id: 1,
    name: '麻雀',
    subTitle: '常見鳥類',
    description: '你知道麻雀的叫聲多變嗎？牠們會發出各種不同的叫聲來傳達信息。',
    imageUrl: '/species/sparrow.jpg',
    category: '鳥類'
  },
  {
    id: 2,
    name: '白頭翁',
    subTitle: '台灣特有種',
    description: '你知道白頭翁的叫聲聽起來是「巧克力 巧克力」嗎～',
    imageUrl: '/species/bulbul.jpg',
    category: '鳥類'
  },
  {
    id: 3,
    name: '台灣獼猴',
    subTitle: '保育類動物',
    description: '台灣獼猴是台灣唯一原生的非人靈長類，被列為珍貴稀有保育類野生動物。',
    imageUrl: '/species/monkey.jpg',
    category: '哺乳類'
  },
  {
    id: 4,
    name: '台北樹蛙',
    subTitle: '夜行性兩棲類',
    description: '台北樹蛙是台灣特有種，主要分布在北部低海拔山區，繁殖季會發出響亮的叫聲。',
    imageUrl: '/species/frog.jpg',
    category: '兩棲類'
  }
];

// 類別選擇按鈕元件
const CategoryButton = ({ 
  category, 
  isActive, 
  onClick 
}: { 
  category: SpeciesCategory; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    className={`
      rounded-full py-3 px-6
      font-bold text-base
      transition-colors duration-200
      ${isActive ? 'bg-[#44C2A5] text-white' : 'bg-[rgba(75,75,80,0.7)] text-[#FDFDFD]'}
      focus:outline-none
      text-nowrap
    `}
    onClick={onClick}
  >
    {category}
  </button>
);

// 物種卡片元件
const SpeciesCard = ({ species }: { species: Species }) => (
  <div className="
    relative w-full bg-[#4B4B50] rounded-[30px]
    py-6 px-6 pr-[132px]
    flex flex-col justify-center
    overflow-visible
    mb-4
    min-h-[110px]
  ">
    {/* 物種圖片 */}
    <div className="absolute right-0 top-[-20px] transform translate-x-[10px]">
      <Image
        src={species.imageUrl}
        alt={species.name}
        width={160}
        height={170}
        className="rounded-[30px] object-cover"
      />
    </div>
    
    {/* 文字內容 */}
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-white">{species.name}</h3>
        <p className="text-[15px] font-medium text-[#47FFF8]">{species.subTitle}</p>
      </div>
      <p className="text-sm text-white/80 line-clamp-2">{species.description}</p>
    </div>
  </div>
);

export default function Species() {
  const [activeCategory, setActiveCategory] = useState<SpeciesCategory>('全部');
  
  // 根據選擇的類別過濾物種
  const filteredSpecies = activeCategory === '全部'
    ? speciesData
    : speciesData.filter(species => species.category === activeCategory);
  
  return (
    <div className="flex flex-col py-11 bg-[#1D1D1F] min-h-screen">
      <div className="max-w-screen-md mx-auto w-full px-6">
        {/* 標題與分類選擇 */}
        <h1 className="text-[28px] font-bold text-white mb-9">總圖鑑</h1>
      </div>
      
      {/* 類別選擇區 - 沒有水平 padding 以避免切割感 */}
      <div className="max-w-screen-md mx-auto w-full overflow-hidden mb-10">
        <div 
          className="flex flex-nowrap gap-3 overflow-x-auto pb-2 hide-scrollbar px-6" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollPaddingLeft: '24px',
            scrollPaddingRight: '24px'
          }}
        >
          {(['全部', '鳥類', '哺乳類', '兩棲類'] as SpeciesCategory[]).map(category => (
            <CategoryButton
              key={category}
              category={category}
              isActive={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
      </div>
      
      {/* 物種卡片列表 */}
      <div className="max-w-screen-md mx-auto w-full px-6">
        <div className="flex flex-col gap-4">
          {filteredSpecies.map(species => (
            <SpeciesCard key={species.id} species={species} />
          ))}
          
          {filteredSpecies.length === 0 && (
            <p className="text-white text-center py-10">此類別下暫無物種資料</p>
          )}
        </div>
      </div>
    </div>
  );
}