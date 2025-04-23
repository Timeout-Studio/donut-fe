'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ReadMoreButton } from '../components/ReadMoreButton';

export default function Home() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

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
            
            <div className="flex justify-center items-end gap-4 mb-8">
              {/* 第二名 */}
              <div className="flex flex-col items-center gap-2 w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white text-xl font-semibold">2</span>
                  <div className="w-[88px] h-[88px] bg-[#44C2A5] rounded-full overflow-hidden">
                    <Image 
                      src="/home/profile.jpg" 
                      alt="Profile" 
                      width={88} 
                      height={88} 
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="text-white text-[22px] font-bold">林駿宇</span>
                  <span className="text-[#6C6D71] text-[10px]">2025/04/12</span>
                  <span className="text-[#44C2A5] text-xl font-semibold">05:31</span>
                </div>
              </div>
              
              {/* 第一名 */}
              <div className="flex flex-col items-center gap-2 w-[120px]">
                <Image 
                  src="/home/crown.png" 
                  alt="Crown" 
                  width={40} 
                  height={40} 
                  className="mb-1"
                />
                <div className="w-[119px] h-[119px] bg-[#44C2A5] rounded-full overflow-hidden">
                  <Image 
                    src="/home/profile.jpg" 
                    alt="Profile" 
                    width={119} 
                    height={119} 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="text-white text-[22px] font-bold">林駿宇</span>
                  <span className="text-[#6C6D71] text-[10px]">2025/04/12</span>
                  <span className="text-[#44C2A5] text-xl font-semibold">05:31</span>
                </div>
              </div>
              
              {/* 第三名 */}
              <div className="flex flex-col items-center gap-2 w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white text-xl font-semibold">3</span>
                  <div className="w-[88px] h-[88px] bg-[#44C2A5] rounded-full overflow-hidden">
                    <Image 
                      src="/home/profile.jpg" 
                      alt="Profile" 
                      width={88} 
                      height={88} 
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="text-white text-[22px] font-bold">林駿宇</span>
                  <span className="text-[#6C6D71] text-[10px]">2025/04/12</span>
                  <span className="text-[#44C2A5] text-xl font-semibold">05:31</span>
                </div>
              </div>
            </div>
            
            <ReadMoreButton href="/rankings" />
          </section>

          {/* 關於我們區塊 */}
          <section>
            <h2 className="text-white text-[28px] font-bold mb-9">關於我們</h2>
            <div className="w-full h-[150px] bg-white rounded-[40px] mb-6"></div>
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
            <ReadMoreButton href="/exhibition" />
          </section>
        </div>
      </div>
    </div>
  );
}