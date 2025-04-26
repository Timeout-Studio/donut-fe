'use client';

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
    name: '洪誼珊',
    role: '行銷',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/members/Sandy.jpg'
  },
  {
    id: 2,
    name: '朱維晞',
    role: '美術',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/members/April.jpg'
  },
  {
    id: 3,
    name: '林駿宇',
    role: '遊戲引擎',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/members/Max.jpg'
  },
  {
    id: 4,
    name: '羅建毅',
    role: '後端、硬體',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/members/Aaron.jpg'
  },
  {
    id: 5,
    name: '朱家芸',
    role: '硬體、場景設計',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/members/Ariel.jpg'
  },
  {
    id: 6,
    name: '惠維慶',
    role: '專案管理、硬體',
    description: '為了重新引導人們認識並珍惜這些被忽視的自然聲音，我們製作了一個互動空間，搭配故事劇情，播放不同環境聲音。',
    imageUrl: '/members/Hui.jpg'
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
      </div>

    </div>
  );
};

export default function About() {
  return (
    <div className="flex flex-col px-4 sm:px-6 md:px-8 py-8 md:py-11 min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto mb-10">
        <Image 
          src="/Us.jpg" 
          alt="About Us Banner" 
          width={1200}
          height={514} // 1200px width with a 21:9 aspect ratio
          className="w-full h-auto object-cover rounded-[20px]"
        />
      </div>
      {/* 標題區域 */}
      <div className="flex flex-col gap-6 md:gap-9 w-full mb-8 md:mb-10">
        <h1 className="font-bold text-2xl md:text-3xl text-white">關於我們</h1>
      </div>
      {/* 團隊成員展示區域 */}
      <section className="w-full">
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