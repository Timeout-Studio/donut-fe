# NextJS Note

## Next.js 介紹

Next.js 是一個 framework based on React，包含 Route, CLI, Node.js Runtime lib。

- 可以前後端合併用 js（但我們用 php）
- pre-render component
- static site generation（預先生成瀏覽器能看得內容，純 React 則要點入網站才會動態生成。）

## 環境

- Node.js 16+
- ES7+ React/Redux/... extension
- TypeScript
- Tailwind

## 架構介紹

### app (app-router)

- 用資料夾直接當 route，不用額外 map

### public

- 用於放 assets

### root files

- 設定類，正常情況不動

## 撰寫建議

建議檔名用 lower camel case
Component function 建議用 upper camel case

- route 資料夾
- `<a>` 用 `<link>` 替代，減少資源載入（Client Side Navigation）

## Rendering At

兩者應該混用以達到最佳效果，建議預設用 Server-side，必須時再指定用 Client-side。

eg. 重複元件主要放在 Server-side，特定需要互動的（比如 submit button）獨立 extract 出到 Client-side

### Client-side

- 較耗客戶端記憶體
- 較不安全，不適合敏感資料
- 沒 SEO

直接在 Component 檔案開頭加上 `'use client'`

```jsx
// ProductCard.tsx

import React from "react";
import AddToCart from "./AddToCart";

const ProductCards = () => {
  return <div>
    <AddToCart/>
  </div>;
};

export default ProductCards;

// AddToCart.tsx

"use client";

import React from "react";

const AddToCart = () => {
  return (
    <button
      onClick={() => {
        console.log("clicked");
      }}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
```

### Server-side

- 較安全
- 省客戶端效能
- 無法用 broswer event listener
- 有 SEO

## data fetching

### fetch on client

- useState() + useEffect()
- React Query

會傳輸比較久
耗客戶端記憶體
No SEO
不安全
需要額外的 request

### fetch on Server

用 await fetch instead of useState

- cache
  fetch 可以指定緩存方式
  - cache: 'no-store' // 關掉緩存
  - next: {revalidate: 10} // 10 秒更新一次

## Rendering Type

### Static

at build time

預設只要用 cache 就是 static，節省效能
禁用緩存則會當作動態

### Dynamic

at request time

## Tailwind

- Global CSS 只放真的 Global 避免汙染

### CSS Module

- className 不能用 dash symbol，建議用 upper camel case
- 編譯時會自動生成 style class 避免衝突