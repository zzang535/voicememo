'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import MemoItem from '@/components/MemoItem';
import { getUserId } from '@/utils/userUtils';

interface MemoData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function MemosPage() {
  const [memos, setMemos] = useState<MemoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  // 메모 목록 조회 함수
  const fetchMemos = async (userIdParam: string) => {
    try {
      const response = await fetch(`/api/memo?userId=${encodeURIComponent(userIdParam)}`);
      const result = await response.json();

      if (result.success) {
        setMemos(result.data);
      } else {
        console.error('Failed to fetch memos:', result.message);
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 메모 삭제 함수
  const deleteMemo = async (memoId: number) => {
    if (!userId) return;

    if (!confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/memo?id=${memoId}&userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        console.log('메모 삭제 성공');
        // 메모 목록 새로고침
        await fetchMemos(userId);
      } else {
        console.error('Failed to delete memo:', result.message);
        alert('메모 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting memo:', error);
      alert('메모 삭제 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    const initUserId = getUserId();
    setUserId(initUserId);
    console.log('사용자 ID 초기화:', initUserId);

    fetchMemos(initUserId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="메모 목록" />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-gray-400 text-center">
            총 {memos.length}개의 메모가 저장되어 있습니다
          </p>
        </div>

        {/* 메모 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : memos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p>아직 저장된 메모가 없습니다.</p>
              <p className="text-sm mt-2">음성 녹음 페이지에서 첫 번째 메모를 만들어보세요!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {memos.map((memo) => (
                <MemoItem key={memo.id} memo={memo} onDelete={deleteMemo} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}