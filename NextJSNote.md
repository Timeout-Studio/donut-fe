# NextJS Note

## Next.js 介紹

Next.js 是一個基於 React 的框架，包含 Route, CLI, Node.js Runtime 等功能。

- 可以前後端合併用 js（但我們還是用 php）
- Pre-rendered Component
- Static Site Generation（SSG。預先生成瀏覽器能看到的內容。相對純 React 則要點入網站才會動態生成，不利於 SEO。）

## 環境

- Node.js 16+

### 推薦插件
- ES7+ React/Redux/... extension
- TypeScript
- Tailwind

## 架構介紹

### 1. app (app-router)

- 用資料夾直接當 route，不用額外 map

### 2. public

- 用於放 assets

### 3. root files

- 設定類，正常情況不動

## 撰寫建議

- 建議檔名用 Lower Camel Case
- Component Function 建議用 Upper Camel Case
- 用 `<Link>` 替代 `<a>` 可以減少資源請求次數，降低 Client Side Navigation 次數。

## Component Rendered At

兩者應該根據需求混用，建議預設用 Server-side，必須時再指定用 Client-side。

eg. 重複元件主要放在 Server-side，特定需要互動的（比如 submit button）獨立 extract 出到 Client-side

### 1. Client-side

適合需要即時互動的部件，比如 Toggle Switch、表單。依賴 Local Storage。

- 較耗客戶端記憶體
- 較不安全，不適合敏感資料
- 沒 SEO

直接在 Component 檔案開頭加上 `'use client'` 即可使用

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

### 2. Server-side

適合 DB 查詢、API Request。

- 較安全
- 省客戶端效能
- 無法用 broswer event listener
- 有 SEO

## data fetching

### fetch on client

使用 `useState()` + `useEffect()`

- 要重新 return Component，需要額外的 request
- 較耗客戶端記憶體
- No SEO
- 不安全

### fetch on Server

用 `interface` & `fetch()` 處理，此外建議用 `try{fetch();}catch{print("error");}` 以免資料請求不到時整頁掛掉。

```jsx
import React from "react";

interface User {
  id: number;
  name: string;
}

const UserPage = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: 'no-store',
  });
  const users: User[] = await res.json();

  return (
    <div>
      <p>{new Date().toLocaleTimeString()}</p>
      <h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </h1>
    </div>
  );
};

export default UserPage;
```

- cache
  - fetch 可以指定緩存方式
  - cache: 'no-store' // 關掉緩存
  - next: {revalidate: 10} // 10 秒更新一次

## Request Type (fetch on Server)

### Static (SSG)

At Build Time

當編譯完成後就不會再更新

預設只要用 cache 就是 static，節省效能

Incremental Static Regeneration (ISR):
`next: {revalidate: 10}` 一樣會當作 static，只是時間過後可以重新 request

### Dynamic (Server Side Rendering, SSR)

At Request Time

會在下次 Request 時更新

禁用緩存則會當作動態

## Tailwind

- Global CSS 只放真的 Global 避免污染

### CSS Module

- className 不能用 Dash Symbol，建議用 Upper Camel Case
- 編譯時會自動生成 style class 避免衝突

### Tailwind CSS Class

- 很像 bootstrap 的 class
- 可以搭配已寫好的 UI Component 套件使用，如 HeadlessUI, DaisyUI