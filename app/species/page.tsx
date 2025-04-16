'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CSSTransition } from 'react-transition-group';

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
  longDescription?: string; // 添加長描述欄位用於模態視窗展示
}

// 模擬物種資料
const speciesData: Species[] = [
  {
    id: 1,
    name: '麻雀',
    subTitle: '常見鳥類',
    description: '你知道麻雀的叫聲多變嗎？牠們會發出各種不同的叫聲來傳達信息。',
    imageUrl: '/species/sparrow.jpg',
    category: '鳥類',
    longDescription: '麻雀是最常見的鳥類之一，被認為是世界上分布最廣的野生鳥類。牠們有著強大的適應力，能夠在各種環境中生存。麻雀的社交行為非常豐富，常常成群結隊活動。牠們以種子和小昆蟲為主要食物，在城市環境中也能找到充足的食物來源。'
  },
  {
    id: 2,
    name: '白頭翁',
    subTitle: '台灣特有種',
    description: '你知道白頭翁的叫聲聽起來是「巧克力 巧克力」嗎～',
    imageUrl: '/species/bulbul.jpg',
    category: '鳥類',
    longDescription: '被稱為城市三劍客的白頭翁，有著很強的環境適應能力\n在布農族的傳說裡，是不太討喜的鳥類，因為她為了不要渡河而把自己的頭毛染白，灑謊自己是老人家，讓人覺得沒有誠信喔！\n在布農族的傳說裡，是不太討喜的鳥類，因為她為了不要渡河而把自己的頭毛染白，灑謊自己是老人家，讓人覺得沒有誠信喔！'
  },
  {
    id: 3,
    name: '台灣獼猴',
    subTitle: '保育類動物',
    description: '台灣獼猴是台灣唯一原生的非人靈長類，被列為珍貴稀有保育類野生動物。',
    imageUrl: '/species/monkey.jpg',
    category: '哺乳類',
    longDescription: '台灣獼猴是台灣特有的原生物種，也是台灣唯一的非人靈長類動物。牠們主要分布在海拔100至2000公尺的森林中，群體行為明顯，通常有20至30隻組成一個猴群。台灣獼猴目前被列為珍貴稀有保育類野生動物，受到法律保護。'
  },
  {
    id: 4,
    name: '台北樹蛙',
    subTitle: '夜行性兩棲類',
    description: '台北樹蛙是台灣特有種，主要分布在北部低海拔山區，繁殖季會發出響亮的叫聲。',
    imageUrl: '/species/frog.jpg',
    category: '兩棲類',
    longDescription: '台北樹蛙是台灣特有的樹蛙物種，主要分布在北部地區的低海拔山區。牠們具有良好的攀爬能力，通常棲息在樹上或灌木叢中。台北樹蛙是夜行性動物，白天隱藏在葉片底下或樹洞中，夜晚則活躍覓食。在繁殖季節，雄蛙會發出清脆響亮的叫聲吸引雌蛙。'
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

// 物種詳情模態視窗元件
const SpeciesDetailModal = ({ 
  species, 
  onClose,
  isOpen
}: { 
  species: Species | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  // 添加 ref 以避免使用 findDOMNode
  const nodeRef = useRef(null);
  
  if (!species) return null;

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
      nodeRef={nodeRef}
      appear={true}
    >
      <div 
        ref={nodeRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-sm bg-[#4B4B50] rounded-[40px] overflow-hidden modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 圖片部分 - 絕對定位在背景 */}
          <div className="absolute top-0 right-0 w-full h-full">
            <Image
              src={species.imageUrl}
              alt={species.name}
              fill
              className="object-cover opacity-10 -z-10"
            />
          </div>
          
          {/* 綠色漸層背景 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#47897C]/60 to-[#44C2A5]/90 -z-10"></div>

          {/* 關閉按鈕 */}
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-[#44C2A5] rounded-full"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 內容區域 */}
          <div className="p-10 pt-12 flex flex-col h-[478px]">
            <div className="grow flex flex-col items-center gap-8 mt-8">
              <h2 className="text-[#47FFF8] text-xl font-bold w-full">
                {species.description}
              </h2>
              <p className="text-white text-base whitespace-pre-line w-full overflow-y-auto pr-2">
                {species.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

// 物種卡片元件
const SpeciesCard = ({ 
  species,
  onClick
}: { 
  species: Species;
  onClick: () => void;
}) => (
  <div 
    className="
      relative w-full bg-[#4B4B50] rounded-[30px]
      py-6 px-6 pr-[132px]
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
        <p className="text-[15px] font-medium text-[#47FFF8]">{species.subTitle}</p>
      </div>
      <p className="text-sm text-white/80 line-clamp-2">{species.description}</p>
    </div>
  </div>
);

export default function Species() {
  const [activeCategory, setActiveCategory] = useState<SpeciesCategory>('全部');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 根據選擇的類別過濾物種
  const filteredSpecies = activeCategory === '全部'
    ? speciesData
    : speciesData.filter(species => species.category === activeCategory);
  
  // 處理卡片點擊事件
  const handleCardClick = (species: Species) => {
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
            <SpeciesCard 
              key={species.id} 
              species={species} 
              onClick={() => handleCardClick(species)}
            />
          ))}
          
          {filteredSpecies.length === 0 && (
            <p className="text-white text-center py-10">此類別下暫無物種資料</p>
          )}
        </div>
      </div>
      
      {/* 物種詳情模態視窗 */}
      <SpeciesDetailModal 
        species={selectedSpecies} 
        onClose={handleModalClose}
        isOpen={isModalOpen}
      />
    </div>
  );
}