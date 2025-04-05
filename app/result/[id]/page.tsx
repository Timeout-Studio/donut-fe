'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import BirdItem from '@/app/components/BirdItem'

interface PageProps {
  params: {
    id: string
  }
}

// 模擬的鳥類資料
const birds = [
  { name: '白頭翁', image: '/白頭翁.png' },
  { name: '五色鳥', image: '/五色鳥.png' },
  // ... 其他鳥類
]

const IndividualResultPage = ({ params }: PageProps) => {
  const { id } = params

  useEffect(() => {
    // 將 ID 保存到 LocalStorage
    localStorage.setItem('userResultId', id)
  }, [id])

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6">
      {/* 頂部 ID */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">{id}</h1>
      </div>

      {/* 個人資料區 */}
      <div className="flex flex-col items-center mb-8">
        {/* 大頭貼 */}
        <div className="w-32 h-32 rounded-full bg-white overflow-hidden mb-4">
          <Image
            src="/path-to-your-bird-image.png"
            alt="台灣藍鵲"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>

        {/* 等級顯示 */}
        <div className="bg-donut-accent rounded-full px-8 py-2">
          <h2 className="text-donut-text-white text-2xl font-bold">台灣藍鵲</h2>
        </div>

        {/* 遊玩數據 */}
        <div className="flex gap-4 w-full max-w-sm justify-center mt-8">
          {/* 遊玩時長 */}
          <div className="bg-[#2D2D2D] rounded-2xl p-4 flex-1 flex flex-col h-32 relative">
            <div className="text-gray-400 text-center">遊玩時長</div>
            <div className="flex-grow flex items-center justify-center">
              <div className="text-5xl font-bold">5</div>
            </div>
            <div className="absolute bottom-4 right-4 text-sm text-gray-400">分鐘</div>
          </div>

          {/* 排名 */}
          <div className="bg-[#2D2D2D] rounded-2xl p-4 flex-1 flex flex-col h-32 relative">
            <div className="text-gray-400 text-center">排名</div>
            <div className="flex-grow flex items-center justify-center">
              <div className="text-5xl font-bold">5</div>
            </div>
            <div className="absolute bottom-4 right-4 text-sm text-gray-400">名</div>
          </div>
        </div>
      </div>

      {/* 圖鑑區域 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">我的圖鑑</h2>
        <div className="grid grid-cols-3 gap-8">
          {Array(9).fill(null).map((_, index) => {
            const bird = birds[index % birds.length];
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <BirdItem isLocked={index > 6}>
                  <Image
                    src={bird.image}
                    alt=""
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </BirdItem>
                <span className="text-sm text-center">{bird.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default IndividualResultPage 