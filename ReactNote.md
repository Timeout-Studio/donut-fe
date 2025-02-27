# React 基礎筆記

https://www.youtube.com/watch?v=SqcY0GlETPk

## 大致概念

- 以 TS 包裝
- Function return DOM

## 基礎先備知識

- HTML
- CSS
- JS

## 大致介紹

- 最廣泛使用的 App Building JS Lib
- 可重複利用 Component
- 區塊動態更新 (React DOM)

### Framework 和 Library 的差別

- Framework 會有明確的 Guideline，像整組工具
- Library 主要提供功能，像一個工具
  - React 是 Library，主要處理 UI，因此需要其他 Library 幫忙處理其他事務（eg. Routing, HTTP, Animation...）
  - 推薦 Library
    - Bootstrap (CSS)
    -

## 環境設定

- Node.js 19 up

## Create APP Steps

- Vite [x]

1. `npm create vite@x.x.x`
2. name project
3. select framework (React **lib**)
4. cd to directory
5. `npm i`
6. open in VSCode
7. `npm run dev`

## 結構介紹

### node_modules

- 第三方 lib 存放位置

### public

- Asset Directory

### src

- source code
  - app component

### index.html

- container and script import

### package.json

- basic info and config

### tsconfig.json

- TypeScript build settings

### vite.config.ts

- Settings of Vite

## 建立 Component

現在大部分會使用 "Functionn-based" Component，更簡潔與簡單。但舊專案可能會是 "Class-based Component"。

- 建議 function name 使用 PascalCasing (AKA. Upper Camel Case)
- 使用 return JSX 的方式編譯成 JS

```ts
// Message.tsx
function Message() {
  // JSX: JS XML
  return <h1>Hello World</h1>;
}

export default Message;

// App.tsx
import Message from "./Message";

function App() {
  return (
    <div>
      <Message />
    </div>
  );
}

export default App;
```

- 可搭配 JS 語法使用

```ts
function Message() {
  const name = "Fish";
  if (name) return <h1>Hello {name}</h1>;
  return <h1>Hello Max</h1>;
}

export default Message;
```

- AKA. Virtual DOM
- return 多行要包 ();
- 一個 return 只能有一個 element（但可以多層），就像一個樹狀結構只能有一個 root（比如包個 div）
- Fragment 可以代替 div 做 group，編譯後就不會有 div。
  - 可以用 <></> 替代 <Fragment>，效果一樣，更簡潔

```ts
function ListGroup() {
  return (
    <>
      <h1>Hello</h1>
      <ul className="list-group">
        <li className="list-group-item">An item</li>
        <li className="list-group-item">A second item</li>
        <li className="list-group-item">A third item</li>
        <li className="list-group-item">A fourth item</li>
        <li className="list-group-item">And a fifth one</li>
      </ul>
    </>
  );
}

export default ListGroup;
```
