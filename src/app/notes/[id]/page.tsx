'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ContentBox from '@/components/ContentBox';
import { getUserId } from '@/utils/userUtils';
import { COLORS } from '@/constants/colors';
import { getEmotionStyle } from '@/constants/automaticThoughts';

interface MemoData {
  id: number;
  user_id: string;
  content: string;
  thought?: string | null;
  emotions?: string[] | null;
  core_needs?: string[] | null;
  summary?: string | null;
  created_at: string;
  updated_at: string;
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [memo, setMemo] = useState<MemoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  const memoId = params.id as string;

  // 사용자 ID 초기화
  useEffect(() => {
    const initializeUserId = async () => {
      const initUserId = await getUserId();
      setUserId(initUserId);
    };
    initializeUserId();
  }, []);

  // 노트 조회
  const fetchMemo = useCallback(async () => {
    try {
      const response = await fetch(`/api/memo?id=${memoId}&userId=${encodeURIComponent(userId)}`);
      const result = await response.json();

      if (result.success && result.data) {
        setMemo(result.data);
      } else {
        console.error('Failed to fetch memo:', result.message);
        router.push('/notes');
      }
    } catch (error) {
      console.error('Error fetching memo:', error);
      router.push('/notes');
    } finally {
      setIsLoading(false);
    }
  }, [memoId, userId, router]);

  useEffect(() => {
    if (userId && memoId) {
      fetchMemo();
    }
  }, [userId, memoId, fetchMemo]);

  const handleBackClick = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/notes/edit/${memoId}`);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${COLORS.PAGE_BG} text-white`}>
        <Header title="노트 상세" showBackButton={true} />
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className={`h-20 ${COLORS.BOX_BG} rounded-lg`}></div>
            <div className={`h-32 ${COLORS.BOX_BG} rounded-lg`}></div>
            <div className={`h-32 ${COLORS.BOX_BG} rounded-lg`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className={`min-h-screen ${COLORS.PAGE_BG} text-white`}>
        <Header title="노트 상세" showBackButton={true} />
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">❌</div>
            <p>노트를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.PAGE_BG} text-white pb-8`}>
      <Header
        title="노트 상세"
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <div className="pt-20 px-4 max-w-4xl mx-auto space-y-6">
        {/* 노트 정보 */}
        <div className="text-sm text-gray-400 text-center">
          노트 #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
        </div>


        {/* C. 원문 메모 (Full Content) */}
        <ContentBox
          title="노트"
          rightButton={
            <button
              onClick={handleEdit}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
              title="노트 수정"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          }
        >
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
            {memo.content}
          </p>
        </ContentBox>


        {/* A. 요약 (Summary) */}
        {memo.summary && (
          <ContentBox>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">한 줄 요약</div>
              <p className="text-lg leading-relaxed text-white font-medium">
                "{memo.summary}"
              </p>
            </div>
          </ContentBox>
        )}

        {/* B. 감정 (Emotions) */}
        {memo.emotions && memo.emotions.length > 0 && (
          <ContentBox title="감정">
            <div className="flex flex-wrap gap-2">
              {memo.emotions.map((emotion, index) => {
                const style = getEmotionStyle(emotion);
                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{
                      color: style.color,
                      backgroundColor: style.bgColor,
                      border: `1px solid ${style.color}40`,
                    }}
                  >
                    <span className="text-base">{style.icon}</span>
                    <span>{emotion}</span>
                  </span>
                );
              })}
            </div>
          </ContentBox>
        )}


      </div>
    </div>
  );
}
