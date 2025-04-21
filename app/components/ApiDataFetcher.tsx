'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ApiDataFetcherProps<T> {
  fetchData: () => Promise<T>;
  children: (data: T) => ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: (error: Error) => ReactNode;
}

/**
 * 通用API數據獲取組件
 * 用於處理數據加載、錯誤處理和渲染邏輯
 */
export function ApiDataFetcher<T>({
  fetchData,
  children,
  loadingComponent = <div>載入中...</div>,
  errorComponent = (error) => <div className="text-red-500">錯誤: {error.message}</div>,
}: ApiDataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('未知錯誤'));
        console.error('API數據獲取錯誤:', err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [fetchData]);

  if (loading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    return <>{errorComponent(error)}</>;
  }

  if (!data) {
    return <div>沒有數據</div>;
  }

  return <>{children(data)}</>;
}

// 使用示例:
/*
import { ApiDataFetcher } from '../components/ApiDataFetcher';
import rankingService from '../api/services/rankingService';

function RankingPage() {
  return (
    <ApiDataFetcher
      fetchData={() => rankingService.getTopRankings(10)}
      loadingComponent={<CustomLoadingSpinner />}
    >
      {(data) => (
        <div>
          {data.map(item => (
            <div key={item.id}>{item.name}: {item.time}</div>
          ))}
        </div>
      )}
    </ApiDataFetcher>
  );
}
*/ 