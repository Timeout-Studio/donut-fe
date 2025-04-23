import { YZUICLogo, StrawberryPieLogo } from "../svg_components/Logos";

export default function Footer() {
	return (
		<footer className="bg-donut-bg-2 px-4 py-8 sm:px-6 sm:py-10 relative z-20">
			{/* 在電腦版使用三欄佈局，手機版垂直居中 */}
			<div className="flex">
				<div className="container mx-auto">
					<div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between gap-10 mb-10">
						{/* 左側區塊 - logo和畢業展信息 */}
						<div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:ms-auto">
							<object data="/TimoutStudioLogo.svg" className="h-10 sm:h-12 w-auto mb-4" />
							<p className="text-donut-p text-base sm:text-lg font-medium lg:mb-2">元智大學資訊傳播學系第 28 屆畢業展 － 互動組</p>
							<p className="hidden lg:block"><span className="opacity-60">Follow us on&ensp;</span><span className="underline"><a target="_blank" href="https://www.instagram.com/donut_timeout/">Instagram</a></span></p>
						</div>

						{/* 主辦單位 */}
						<div className="lg:ms-8">
							<h3 className="text-donut-p text-lg sm:text-xl text-center lg:text-start font-bold mb-4">主辦單位</h3>
							<div className="flex flex-wrap justify-center lg:justify-start gap-6 items-center">
								<a className="flex items-center" href="https://infocom.yzu.edu.tw/">
									<YZUICLogo className="text-donut-text-white h-10 sm:h-12 w-auto" />
								</a>
								<a className="flex items-center" href="https://strawberrypie.tw/">
									<StrawberryPieLogo className="text-donut-text-white h-10 sm:h-12 w-auto" />
								</a>
							</div>
						</div>

						{/* 協辦單位 */}
						<div className="lg:ms-8 lg:me-auto">
							<h3 className="text-donut-p text-lg sm:text-xl text-center lg:text-start font-bold mb-4">協辦單位</h3>
							<div className="flex flex-wrap justify-center lg:justify-start gap-6 items-center">
								<object data="/SongshanLogo.svg" className="h-9 sm:h-11 w-auto"></object>
								<object data="/TaoyuanLogo.svg" className="h-9 sm:h-11 w-auto"></object>
								<object data="/MOELogo.svg" className="h-9 sm:h-11 w-auto"></object>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 社群連結 */}
			<p className="block text-center mb-6 lg:hidden"><span className="opacity-60">Follow us on&ensp;</span><span className="underline"><a target="_blank" href="https://www.instagram.com/donut_timeout/">Instagram</a></span></p>

			{/* 版權信息 - 跨越整個寬度 */}
			<p className="pt-6 text-donut-text-gray text-sm text-center border-t border-gray-700/40">
				Copyright © 2025 Timeout Studio. All rights reserved.
			</p>
		</footer>
	);
} 