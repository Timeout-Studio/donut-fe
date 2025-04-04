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
        bg-donut-bg-2
        font-semibold
        text-2xl
        text-donut-text-white
        px-6 
        py-2
        rounded-full
        transition
        duration-200
        hover:bg-donut-sec
        hover:text-white
        focus:bg-donut-prim
      `}
    >
      {label}
    </button>
  );
}

export default ClickButton;