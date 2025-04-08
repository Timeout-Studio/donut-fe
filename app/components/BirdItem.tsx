import Image from 'next/image'

interface BirdItemProps {
  isLocked: boolean;
  children: React.ReactNode;
}

const BirdItem = ({ isLocked, children }: BirdItemProps) => {
  return (
    <div 
      className={`aspect-square border-4 rounded-[40px] ${
        isLocked ? 'border-gray-600' : 'border-donut-accent'
      } p-2`}
    >
      <div className={`w-full h-full rounded-xl flex items-center justify-center 
        ${isLocked ? 'opacity-50' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default BirdItem 