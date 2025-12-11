'use client';

import { useRouter } from 'next/navigation';
import ContentBox from '@/components/ContentBox';
import { getEmotionStyle } from '@/constants/automaticThoughts';

interface MemoItemProps {
  memo: {
    id: number;
    user_id: string;
    content: string;
    summary?: string | null;
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
    <ContentBox onClick={handleClick} clickable>
      <div className="mb-2">
        <div className="text-sm text-gray-500">
          #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
        </div>
      </div>

      {/* 요약 (타이틀) */}
      {memo.summary && (
        <h3 className="text-white text-sm font-semibold mb-2">
          {memo.summary}
        </h3>
      )}

      {/* 내용 미리보기 */}
      <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-5">
        {memo.content}
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
    </ContentBox>
  );
}
