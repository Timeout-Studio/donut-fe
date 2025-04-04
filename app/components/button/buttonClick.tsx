"use client";

import React, { useState } from "react";

interface ButtonClick {
  label: string;
}

export function ClickButton({ label }: ButtonClick) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        bg-emerald-300
        font-semibold
        text-2xl
        text-black
        px-6 
        py-2
        rounded-full
        transition
        duration-200
        ${clicked ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"}
      `}
    >
      {label}
    </button>
  );
}

export default ClickButton;