import Link from 'next/link';

interface ReadMoreButtonProps {
  href: string;
}

export function ReadMoreButton({ href }: ReadMoreButtonProps) {
  return (
    <div className="flex justify-center w-full">
      <Link href={href}>
        <div className="bg-[#44C2A5] rounded-[40px] py-[10px] px-[29px] flex justify-center">
          <span className="text-white text-xl font-bold whitespace-nowrap">Read More</span>
        </div>
      </Link>
    </div>
  );
} 