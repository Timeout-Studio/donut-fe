'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import speciesService, { Species as ApiSpecies, SPECIES_CATEGORIES } from '../api/services/speciesService';
import SpeciesDetailModal, { SpeciesViewModel } from './SpeciesDetailModal';

// 定義物種類別
type SpeciesCategory = '全部' | '鳥類' | '蟲類' | '其他';

// 將API物種資料轉換為畫面所需的格式
const mapApiSpeciesToViewModel = (species: ApiSpecies): SpeciesViewModel => {
  // 根據organism_type映射到對應的類別
  let category: SpeciesCategory = '全部';
  switch (species.organism_type) {
    case "0":
      category = '鳥類';
      break;
    case "1":
      category = '蟲類';
      break;
    case "2":
      category = '其他';
      break;
  }
  
  return {
    id: species.id,
    name: species.name,
    short_description: species.short_description || `${category}物種`,
    description: species.description,
    // 使用API返回的image_id構建圖片URL，如果沒有則使用默認圖片
    imageUrl: species.imageUrl || '/species/default.jpg',
    category,
    longDescription: species.description
  };
};

// 載入中元件
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44C2A5]"></div>
  </div>
);

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
const SpeciesCard = ({ 
  species,
  onClick
}: { 
  species: SpeciesViewModel;
  onClick: () => void;
}) => (
  <div 
    className="
      relative w-full bg-[#4B4B50] rounded-[30px]
      py-6 px-6 pr-[160px]
      flex flex-col justify-center
      overflow-visible
      mb-4
      min-h-[110px]
      cursor-pointer
      transition-transform duration-200 hover:scale-[1.02]
    "
    onClick={onClick}
  >
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
        <p className="text-[15px] font-medium text-[#47FFF8]">{species.short_description}</p>
      </div>
      <p className="text-sm text-white/80 line-clamp-2">{species.description}</p>
    </div>
  </div>
);

export default function Species() {
  const [activeCategory, setActiveCategory] = useState<SpeciesCategory>('全部');
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesViewModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [species, setSpecies] = useState<SpeciesViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 使用API獲取物種資料
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        setLoading(true);
        
        let apiSpecies;
        if (activeCategory === '全部') {
          apiSpecies = await speciesService.getAllSpecies();
        } else {
          apiSpecies = await speciesService.getSpeciesByCategory(activeCategory);
        }
        
        // 轉換API資料為畫面所需的格式
        const viewModels = apiSpecies.map(mapApiSpeciesToViewModel);
        setSpecies(viewModels);
        setError(null);
      } catch (err) {
        console.error('Error fetching species data:', err);
        setError('獲取物種資料時發生錯誤，請稍後再試');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecies();
  }, [activeCategory]); // 當活動類別變更時重新獲取資料
  
  // 處理卡片點擊事件
  const handleCardClick = (species: SpeciesViewModel) => {
    setSelectedSpecies(species);
    setIsModalOpen(true);
    // 禁止背景滾動
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };
  
  // 處理模態窗關閉事件
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSpecies(null);
    }, 300); // 等待動畫完成後再清除選中的物種
    
    // 恢復背景滾動
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // 在組件卸載時恢復滾動
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);
  
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
          {(['全部', '鳥類', '蟲類', '其他'] as SpeciesCategory[]).map(category => (
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
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="p-4 bg-red-500/20 text-red-200 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {species.length > 0 ? (
              species.map(speciesItem => (
                <SpeciesCard 
                  key={speciesItem.id} 
                  species={speciesItem} 
                  onClick={() => handleCardClick(speciesItem)}
                />
              ))
            ) : (
              <p className="text-white text-center py-10">此類別下暫無物種資料</p>
            )}
          </div>
        )}
      </div>
      
      {/* 使用獨立出來的物種詳情模態視窗 */}
      <SpeciesDetailModal 
        species={selectedSpecies} 
        onClose={handleModalClose}
        isOpen={isModalOpen}
      />
    </div>
  );
}