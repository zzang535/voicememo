'use client';

import { useRouter } from 'next/navigation';

interface MemoItemProps {
  memo: {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
  onDelete: (id: number) => void;
}

export default function MemoItem({ memo, onDelete }: MemoItemProps) {
  const router = useRouter();

  // 메모 미리보기 텍스트 생성
  const getPreviewText = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const handleEdit = () => {
    router.push(`/memos/edit/${memo.id}`);
  };

  const handleDelete = () => {
    onDelete(memo.id);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 transition-all hover:bg-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-2">
            #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
          </div>
          <p className="text-white text-sm leading-relaxed mb-2">
            {getPreviewText(memo.content)}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
            title="메모 수정"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
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
  );
}
