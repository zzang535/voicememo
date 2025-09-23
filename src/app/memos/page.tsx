'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
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
  const router = useRouter();

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

  // 메모 미리보기 텍스트 생성
  const getPreviewText = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

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
                <div
                  key={memo.id}
                  className="bg-gray-800 rounded-lg p-4 transition-all hover:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-2">
                        #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
                      </div>
                      <p className="text-white text-sm leading-relaxed mb-2">
                        {getPreviewText(memo.content, 150)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/memos/edit/${memo.id}`)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="메모 수정"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteMemo(memo.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="메모 삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}