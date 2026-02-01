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

// 친근한 시간 표현 함수
function formatFriendlyTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const hour = date.getHours();
  const getTimeOfDay = (h: number) => {
    if (h >= 5 && h < 12) return '아침';
    if (h >= 12 && h < 18) return '오후';
    if (h >= 18 && h < 22) return '저녁';
    return '밤';
  };

  // 0~1시간 → 방금 전
  if (diffHours < 1) {
    return '방금 전';
  }

  // 오늘인지 확인
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `오늘 ${getTimeOfDay(hour)}`;
  }

  // 어제인지 확인
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return `어제 ${getTimeOfDay(hour)}`;
  }

  // 2~3일 → 며칠 전
  if (diffDays < 4) {
    return '며칠 전';
  }

  // 1주~3주 → X월 초순/중순/말
  if (diffDays < 28) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let period: string;
    if (day <= 10) {
      period = '초순';
    } else if (day <= 20) {
      period = '중순';
    } else {
      period = '말';
    }
    return `${month}월 ${period}`;
  }

  // 1개월+ → 작년 N월 / N월
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentYear = now.getFullYear();

  if (year === currentYear) {
    return `${month}월`;
  } else if (year === currentYear - 1) {
    return `작년 ${month}월`;
  } else {
    return `${year}년 ${month}월`;
  }
}

export default function MemoItem({ memo }: MemoItemProps) {
  const router = useRouter();

  // 노트 미리보기 텍스트 생성
  const getPreviewText = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const handleClick = () => {
    router.push(`/notes/${memo.id}?from=list`);
  };

  return (
    <ContentBox onClick={handleClick} clickable>
      <div className="mb-2">
        <div className="text-sm text-gray-500">
          #{memo.id} • {formatFriendlyTime(memo.created_at)}
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
