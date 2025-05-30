"use client"; // 確保這段程式在 Client Side 運行

import Link from "next/link";
import { X, Menu } from "lucide-react"; // 這裡假設你用 Lucide icons
import { DonutLogo } from "../svg_components/Logos"; // 你的 Logo 組件

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 僅在客戶端渲染後才應用轉場效果
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="h-16 nav-gradient fixed w-full flex justify-between items-center p-4 z-50">
      <Link href="/home">
        <DonutLogo className="text-donut-prim mb-0.75 ml-0.5" />
      </Link>
      {/* Menu Button */}
      <button title="Menu" onClick={() => setIsOpen(true)}>
        <Menu className="text-donut-prim" />
      </button>

      {/* Navigation Menu */}
      <div
        className={`fixed h-screen w-full top-0 left-0 p-4 panel-gradient
          ${mounted ? "transition-transform duration-500" : ""}
          -translate-y-full ${isOpen ? "translate-y-0" : ""}`}
      >
        <div className="bg-donut-bg w-full p-8 rounded-2xl donut-drop-shadow">
          <div className="flex justify-between items-center">
            <object data="/TimoutStudioLogo.svg" className="" />
            <button title="Close" onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>
          <ul className="list-group mt-8 flex flex-col gap-6 items-end text-donut-h2 font-medium">
            <li className="list-group-item">
              <Link href="/home" onClick={() => setIsOpen(false)}>
                首頁
              </Link>
            </li>
            <li className="list-group-item">
              <Link href="/rankings" onClick={() => setIsOpen(false)}>
                排行榜
              </Link>
            </li>
            <li className="list-group-item">
              <Link href="/species" onClick={() => setIsOpen(false)}>
                物種圖鑑
              </Link>
            </li>
            <li className="list-group-item">
              <Link href="/result" onClick={() => setIsOpen(false)}>
                個人成績
              </Link>
            </li>
            <li className="list-group-item">
              <Link href="/about" onClick={() => setIsOpen(false)}>
                關於我們
              </Link>
            </li>
          </ul>
        </div>
        <div
          className="fixed top-0 left-0 h-screen w-full -z-10"
          onClick={() => setIsOpen(false)}
        ></div>
      </div>
    </nav>
  );
}
