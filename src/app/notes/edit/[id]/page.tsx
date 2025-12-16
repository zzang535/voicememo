'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ConfirmModal from '@/components/ConfirmModal';
import AlertModal from '@/components/AlertModal';
import { getUserId } from '@/utils/userUtils';
import { COLORS } from '@/constants/colors';

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
  const [originalContent, setOriginalContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

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
        setContent(result.data.content);
        setOriginalContent(result.data.content);
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

  // 노트 저장
  const saveMemo = async () => {
    if (!content.trim()) {
      setShowEmptyAlert(true);
      return;
    }

    if (!memo) return;

    setIsSaving(true);
    try {
      // OpenAI 분석 처리
      console.log('🤖 OpenAI 분석 시작...');
      let analysisResult;

      try {
        const analysisResponse = await fetch('/api/analyze-memo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content.trim()
          })
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          if (analysisData.success) {
            analysisResult = analysisData.data;
            console.log('✅ OpenAI 분석 완료:', analysisResult);
            if (analysisData.test_mode) {
              console.log('⚠️ 테스트 모드로 실행됨 (OPENAI_API_KEY 미설정)');
            }
          }
        } else {
          console.error('❌ OpenAI 분석 실패:', await analysisResponse.json());
        }
      } catch (error) {
        console.error('❌ OpenAI 분석 오류:', error);
        // 분석 실패해도 메모는 저장
      }

      // 노트 수정 (분석 결과 포함)
      const response = await fetch('/api/memo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: memo.id,
          userId: userId,
          content: content.trim(),
          thought: analysisResult?.thought,
          emotions: analysisResult?.emotions,
          core_needs: analysisResult?.core_needs,
          summary: analysisResult?.summary,
          reasoning: analysisResult?.reasoning
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('노트 수정 성공');
        router.push(`/notes/${memo.id}`);
      } else {
        console.error('Failed to update memo:', result.message);
        alert('노트 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating memo:', error);
      alert('노트 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 뒤로가기 처리
  const handleBackClick = () => {
    // 내용이 수정되었는지 확인
    if (content !== originalContent) {
      setShowBackConfirm(true);
    } else {
      router.push(`/notes/${memoId}`);
    }
  };

  // 뒤로가기 확인
  const confirmBack = () => {
    setShowBackConfirm(false);
    router.push(`/notes/${memoId}`);
  };

  // 노트 삭제 확인
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // 노트 삭제 실행
  const confirmDelete = async () => {
    if (!memo) return;

    setShowDeleteConfirm(false);

    try {
      const response = await fetch(`/api/memo?id=${memo.id}&userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        console.log('노트 삭제 성공');
        router.push('/notes');
      } else {
        console.error('Failed to delete memo:', result.message);
        alert('노트 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting memo:', error);
      alert('노트 삭제 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${COLORS.PAGE_BG} text-white`}>
        <Header title="노트 수정" />
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className={`${COLORS.BOX_BG} rounded-lg p-6 border ${COLORS.BORDER}`}>
            <div className="animate-pulse">
              <div className={`h-4 ${COLORS.BOX_BG_HOVER} rounded w-1/4 mb-4`}></div>
              <div className={`h-32 ${COLORS.BOX_BG_HOVER} rounded mb-4`}></div>
              <div className={`h-10 ${COLORS.BOX_BG_HOVER} rounded w-1/3`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className={`min-h-screen ${COLORS.PAGE_BG} text-white`}>
        <Header title="노트 수정" />
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
    <div className={`fixed inset-0 ${COLORS.PAGE_BG} text-white flex flex-col`}>
      <Header
        title="노트 수정"
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <div className="flex-1 flex flex-col pt-20 px-4 pb-4 max-w-4xl mx-auto w-full overflow-hidden">
        {/* 노트 정보 */}
        <div className="flex justify-between items-center flex-shrink-0 mb-4 text-sm text-gray-400">
          <div>
            노트 #{memo.id} - {new Date(memo.created_at).toLocaleString('ko-KR')}
          </div>
          <div className="text-xs text-gray-500">
            글자 수: {content.length}자
          </div>
        </div>

        {/* 노트 편집 영역 */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`flex-1 w-full p-3 ${COLORS.BOX_BG} border ${COLORS.BORDER} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none`}
            placeholder="노트 내용을 입력하세요..."
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4 flex-shrink-0">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={handleDeleteClick}
            className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            삭제
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={saveMemo}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {/* 뒤로가기 확인 모달 */}
      <ConfirmModal
        isOpen={showBackConfirm}
        message="편집된 내용이 저장되지 않습니다. 정말로 나가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
        confirmButtonColor="red"
        onConfirm={confirmBack}
        onCancel={() => setShowBackConfirm(false)}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        message="정말로 이 노트를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        confirmButtonColor="red"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* 빈 내용 알림 모달 */}
      <AlertModal
        isOpen={showEmptyAlert}
        message="노트 내용을 입력해주세요."
        onConfirm={() => setShowEmptyAlert(false)}
      />
    </div>
  );
}

