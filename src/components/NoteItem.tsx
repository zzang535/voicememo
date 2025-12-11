'use client';

import { useRouter } from 'next/navigation';
import { COLORS } from '@/constants/colors';
import { getEmotionStyle } from '@/constants/automaticThoughts';

interface MemoItemProps {
  memo: {
    id: number;
    user_id: string;
    content: string;
    emotions?: string[] | null;
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

  const handleClick = () => {
    router.push(`/notes/${memo.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER} transition-all hover:${COLORS.BOX_BG_HOVER} cursor-pointer`}
    >
      <div className="mb-2">
        <div className="text-sm text-gray-500">
          #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
        </div>
      </div>
      <p className="text-white text-sm leading-relaxed mb-3">
        {getPreviewText(memo.content)}
      </p>

      {/* 감정 태그 */}
      {memo.emotions && memo.emotions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {memo.emotions.map((emotion, index) => {
            const style = getEmotionStyle(emotion);
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  color: style.color,
                  backgroundColor: style.bgColor,
                }}
              >
                <span className="text-xs">{style.icon}</span>
                <span>{emotion}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
