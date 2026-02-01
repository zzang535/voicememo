'use client';

import { useState } from 'react';

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

// 정확한 시간 표시 함수
function formatExactTime(dateString: string): string {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface TimeDisplayProps {
  dateString: string;
  className?: string;
}

export default function TimeDisplay({ dateString, className = '' }: TimeDisplayProps) {
  const [showExactTime, setShowExactTime] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowExactTime(!showExactTime);
  };

  return (
    <span
      className={`active:opacity-70 border-b border-dashed border-current cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {showExactTime ? formatExactTime(dateString) : formatFriendlyTime(dateString)}
    </span>
  );
}
