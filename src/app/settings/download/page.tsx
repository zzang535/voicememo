'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { getUserId } from '@/utils/userUtils';
import { COLORS } from '@/constants/colors';

interface MemoData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function DownloadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeUserId = async () => {
      const initUserId = await getUserId();
      setUserId(initUserId);
    };
    initializeUserId();
  }, []);

  // 메모 데이터 가져오기
  const fetchMemos = async () => {
    if (!userId) return [];

    try {
      const response = await fetch(`/api/memo?userId=${encodeURIComponent(userId)}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        console.error('Failed to fetch memos:', result.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
      return [];
    }
  };

  // Excel 다운로드
  const downloadExcel = async () => {
    setIsLoading(true);
    try {
      const memoData = await fetchMemos();

      if (memoData.length === 0) {
        alert('다운로드할 메모가 없습니다.');
        return;
      }

      // CSV 형식으로 데이터 변환 (Excel에서 열 수 있음)
      const csvContent = [
        'ID,내용,생성일,수정일', // 헤더
        ...memoData.map((memo: MemoData) =>
          `${memo.id},"${memo.content.replace(/"/g, '""')}","${new Date(memo.created_at).toLocaleString('ko-KR')}","${new Date(memo.updated_at).toLocaleString('ko-KR')}"`
        )
      ].join('\n');

      // BOM 추가 (한글 깨짐 방지)
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `voice_memos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Excel 다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // JSON 다운로드
  const downloadJson = async () => {
    setIsLoading(true);
    try {
      const memoData = await fetchMemos();

      if (memoData.length === 0) {
        alert('다운로드할 메모가 없습니다.');
        return;
      }

      const jsonContent = JSON.stringify(memoData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `voice_memos_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('JSON 다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${COLORS.PAGE_BG} text-white`}>
      <Header title="데이터 다운로드" showBackButton onBackClick={() => router.back()} />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-400">저장된 메모를 파일로 다운로드할 수 있습니다</p>
        </div>

        <div className="space-y-4">
          {/* Excel 다운로드 버튼 */}
          <button
            onClick={downloadExcel}
            disabled={isLoading}
            className={`w-full ${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER} hover:${COLORS.BOX_BG_HOVER} transition-colors duration-200 cursor-pointer ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📊</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Excel로 내려받기
                </h3>
                <p className="text-sm text-gray-400">
                  CSV 형식으로 다운로드
                </p>
              </div>
              <div className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* JSON 다운로드 버튼 */}
          <button
            onClick={downloadJson}
            disabled={isLoading}
            className={`w-full ${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER} hover:${COLORS.BOX_BG_HOVER} transition-colors duration-200 cursor-pointer ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📄</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  JSON으로 내려받기
                </h3>
                <p className="text-sm text-gray-400">
                  개발자용 JSON 형식으로 다운로드
                </p>
              </div>
              <div className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="mt-8 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${COLORS.BOX_BG} rounded-lg border ${COLORS.BORDER}`}>
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-300">다운로드 준비 중...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}