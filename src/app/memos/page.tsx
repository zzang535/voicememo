'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getUserId, getShortUserId } from '@/utils/userUtils';

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
  const [selectedMemo, setSelectedMemo] = useState<MemoData | null>(null);

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
        // 선택된 메모가 삭제된 경우 선택 해제
        if (selectedMemo && selectedMemo.id === memoId) {
          setSelectedMemo(null);
        }
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
    <div className="min-h-screen bg-gray-950 text-white">
      <Header title="메모 목록" />

      <div className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">저장된 메모</h1>
              <p className="text-gray-400">
                총 {memos.length}개의 메모가 저장되어 있습니다
              </p>
            </div>

            {/* User ID Display */}
            {userId && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-300">
                  사용자 ID: {getShortUserId(userId)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 메모 목록 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">메모 목록</h2>

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
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {memos.map((memo) => (
                  <div
                    key={memo.id}
                    onClick={() => setSelectedMemo(memo)}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700 ${
                      selectedMemo?.id === memo.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">
                          #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                          {getPreviewText(memo.content)}
                        </p>
                      </div>
                      <div className="ml-2 text-blue-400">📝</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 메모 상세보기 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">메모 상세</h2>

            {selectedMemo ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-1">
                      메모 #{selectedMemo.id}
                    </h3>
                    <div className="text-xs text-gray-500">
                      생성일: {new Date(selectedMemo.created_at).toLocaleString('ko-KR')}
                    </div>
                    {selectedMemo.updated_at !== selectedMemo.created_at && (
                      <div className="text-xs text-gray-500">
                        수정일: {new Date(selectedMemo.updated_at).toLocaleString('ko-KR')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteMemo(selectedMemo.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    삭제
                  </button>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-white leading-relaxed whitespace-pre-wrap">
                    {selectedMemo.content}
                  </p>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  글자 수: {selectedMemo.content.length}자
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500">
                <div className="text-4xl mb-4">👈</div>
                <p>왼쪽에서 메모를 선택하면</p>
                <p>상세 내용을 볼 수 있습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}