'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function MemoEditPage() {
  const params = useParams();
  const router = useRouter();
  const [memo, setMemo] = useState<MemoData | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const memoId = params.id as string;

  // 사용자 ID 초기화
  useEffect(() => {
    const initUserId = getUserId();
    setUserId(initUserId);
  }, []);

  // 메모 조회
  const fetchMemo = useCallback(async () => {
    try {
      const response = await fetch(`/api/memo?id=${memoId}&userId=${encodeURIComponent(userId)}`);
      const result = await response.json();

      if (result.success && result.data) {
        setMemo(result.data);
        setContent(result.data.content);
      } else {
        console.error('Failed to fetch memo:', result.message);
        router.push('/memos');
      }
    } catch (error) {
      console.error('Error fetching memo:', error);
      router.push('/memos');
    } finally {
      setIsLoading(false);
    }
  }, [memoId, userId, router]);

  useEffect(() => {
    if (userId && memoId) {
      fetchMemo();
    }
  }, [userId, memoId, fetchMemo]);

  // 메모 저장
  const saveMemo = async () => {
    if (!content.trim() || !memo) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/memo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: memo.id,
          userId: userId,
          content: content.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('메모 수정 성공');
        router.push('/memos');
      } else {
        console.error('Failed to update memo:', result.message);
        alert('메모 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating memo:', error);
      alert('메모 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 메모 삭제
  const deleteMemo = async () => {
    if (!memo) return;

    const confirmed = confirm('정말로 이 메모를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/memo?id=${memo.id}&userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        console.log('메모 삭제 성공');
        router.push('/memos');
      } else {
        console.error('Failed to delete memo:', result.message);
        alert('메모 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting memo:', error);
      alert('메모 삭제 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pb-20">
        <Header title="메모 수정" />
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pb-20">
        <Header title="메모 수정" />
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">❌</div>
            <p>메모를 찾을 수 없습니다.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col">
      <Header title="메모 수정" />

      <div className={`flex-1 flex flex-col pt-20 px-4 max-w-4xl mx-auto w-full overflow-hidden transition-all ${isTextareaFocused ? 'pb-4' : 'pb-24'}`}>
        {/* 메모 정보 */}
        <div className="flex-shrink-0 mb-4">
          <div className="text-sm text-gray-400 mb-2">
            메모 #{memo.id}
          </div>
          <div className="text-xs text-gray-500">
            생성일: {new Date(memo.created_at).toLocaleString('ko-KR')}
          </div>
          {memo.updated_at !== memo.created_at && (
            <div className="text-xs text-gray-500">
              수정일: {new Date(memo.updated_at).toLocaleString('ko-KR')}
            </div>
          )}
        </div>

        {/* 메모 편집 영역 */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2 flex-shrink-0">
            메모 내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            className="flex-1 w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="메모 내용을 입력하세요..."
          />
          <div className="mt-2 text-xs text-gray-500 flex-shrink-0">
            글자 수: {content.length}자
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4 flex-shrink-0">
          <button
            onClick={() => router.push('/memos')}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={deleteMemo}
            className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            삭제
          </button>
          <button
            onClick={saveMemo}
            disabled={isSaving || !content.trim() || content === memo.content}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              isSaving || !content.trim() || content === memo.content
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {!isTextareaFocused && <BottomNavigation />}
    </div>
  );
}