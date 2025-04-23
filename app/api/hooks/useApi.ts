import { useState, useEffect, useCallback } from 'react';

// API請求狀態介面
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T | void>;
}

/**
 * 通用API請求鉤子
 * 
 * @param fetchFunction - 獲取數據的異步函數
 * @param initialFetch - 是否在組件掛載時自動獲取數據，默認為true
 * @param deps - 依賴項數組，當依賴改變時重新獲取數據
 * @returns API狀態對象，包含數據、加載狀態、錯誤和重新獲取函數
 */
export function useApi<T>(
  fetchFunction: () => Promise<T>,
  initialFetch = true,
  deps: unknown[] = []
): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(initialFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('未知錯誤');
      setError(errorObj);
      console.error('API請求錯誤:', err);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// 使用示例:
/*
import { useApi } from '../api/hooks/useApi';
import rankingService from '../api/services/rankingService';

function RankingComponent() {
  const userId = '123';
  const { data, loading, error, refetch } = useApi(
    () => rankingService.getUserRanking(userId),
    true,
    [userId]
  );

  if (loading) return <div>載入中...</div>;
  if (error) return <div>發生錯誤: {error.message}</div>;
  if (!data) return <div>沒有數據</div>;

  return (
    <div>
      <h2>您的排名: {data.position}</h2>
      <p>完成時間: {data.time}</p>
      <button onClick={refetch}>刷新數據</button>
    </div>
  );
}
*/ 