'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ResultPage = () => {
  const router = useRouter()

  useEffect(() => {
    // 檢查 LocalStorage 中是否有保存的 ID
    const storedId = localStorage.getItem('userResultId')
    if (storedId) {
      // 如果有保存的 ID，重定向到該 ID 的頁面
      router.push(`/result/${storedId}`)
    }
  }, [router])

  return (
    <div className="p-6">
      <h1 className="text-2xl">感應一下你的小卡以查看結果</h1>
    </div>
  )
}

export default ResultPage 