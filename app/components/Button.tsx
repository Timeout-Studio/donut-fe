"use client";

import React, { useState } from "react";

interface Button {
  label: string;
  href: string;
  onClick: () => void;
}

export function Button({ label }: Button) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked((prev) => !prev);
    console.log(clicked);
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
        active:bg-donut-prim
      `}
    >
      {label}
    </button>
  );
}

export default Button;