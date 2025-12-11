'use client';

import { COLORS } from '@/constants/colors';

interface ContentBoxProps {
  title?: string;
  children: React.ReactNode;
  rightButton?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export default function ContentBox({
  title,
  children,
  rightButton,
  className = '',
  onClick,
  clickable = false
}: ContentBoxProps) {
  const clickableStyles = clickable || onClick
    ? `transition-all hover:${COLORS.BOX_BG_HOVER} cursor-pointer`
    : '';

  return (
    <div
      onClick={onClick}
      className={`${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER} ${clickableStyles} ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {rightButton && <div>{rightButton}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
