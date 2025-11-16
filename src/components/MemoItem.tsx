'use client';

import { useRouter } from 'next/navigation';
import { COLORS } from '@/constants/colors';

interface MemoItemProps {
  memo: {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
}

export default function MemoItem({ memo }: MemoItemProps) {
  const router = useRouter();

  // 노트 미리보기 텍스트 생성
  const getPreviewText = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const handleEdit = () => {
    router.push(`/notes/edit/${memo.id}`);
  };

  return (
    <div className={`${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER} transition-all hover:${COLORS.BOX_BG_HOVER}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">
          #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
        </div>
        <button
          onClick={handleEdit}
          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
          title="노트 수정"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      <p className="text-white text-sm leading-relaxed">
        {getPreviewText(memo.content)}
      </p>
    </div>
  );
}
