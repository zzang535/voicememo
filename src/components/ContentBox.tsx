'use client';

import { COLORS } from '@/constants/colors';

interface ContentBoxProps {
  title?: string;
  children: React.ReactNode;
  rightButton?: React.ReactNode;
  className?: string;
}

export default function ContentBox({ title, children, rightButton, className = '' }: ContentBoxProps) {
  return (
    <div className={`${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER} ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {rightButton && <div>{rightButton}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
