import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { CSSTransition } from 'react-transition-group';

// 物種視圖模型接口
export interface SpeciesViewModel {
  id: number;
  name: string;
  short_description: string;
  description: string;
  imageUrl: string;
  category: string;
  longDescription?: string;
}

interface SpeciesDetailModalProps {
  species: SpeciesViewModel | null;
  onClose: () => void;
  isOpen: boolean;
}

const SpeciesDetailModal = ({ 
  species, 
  onClose,
  isOpen
}: SpeciesDetailModalProps) => {
  // 添加 ref 以避免使用 findDOMNode
  const nodeRef = useRef(null);
  
  // 監聽ESC鍵來關閉模態框
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      >
        {/* 手機尺寸的卡片設計 */}
        <div 
          className="relative w-full max-w-[380px] overflow-visible modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 物種圖片 - 懸浮在卡片上方，一半進入卡片內部 */}
          <div className="relative w-full flex justify-center z-20" style={{ marginBottom: "-110px" }}>
            <Image
              src={species.imageUrl}
              alt={species.name}
              width={250}
              height={250}
              className="object-contain h-[250px] w-[250px] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              priority
            />
          </div>
          
          {/* 內容卡片 */}
          <div className="relative bg-[#4B4B50]/90 rounded-t-[40px] rounded-b-[30px] px-8 pt-28 pb-12">
            {/* 播放按鈕 */}
            <div className="absolute right-8 top-16 z-20">
              <button className="w-12 h-12 flex items-center justify-center bg-[#44C2A5] rounded-full shadow-lg">
                <svg className="ml-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.5L17.5 12L8 18.5V5.5Z" fill="white"/>
                </svg>
              </button>
            </div>
            
            {/* 關閉按鈕 */}
            <div className="absolute top-6 right-6 z-30">
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-[#44C2A5] rounded-full hover:bg-[#3BB093] transition-colors"
                aria-label="關閉"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            {/* 內容區域 */}
            <div className="flex flex-col">
              <h1 className="text-white text-2xl font-bold mb-4">
                {species.name}
              </h1>
              <h2 className="text-[#47FFF8] text-xl font-bold mb-4">
                {species.short_description}
              </h2>
              
              <div className="text-white text-[15px] leading-relaxed whitespace-pre-line">
                {species.longDescription?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SpeciesDetailModal; 