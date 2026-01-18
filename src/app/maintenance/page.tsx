'use client';

import { COLORS } from '@/constants/colors';
import { APP_NAME } from '@/constants/app';

export default function MaintenancePage() {
  return (
    <div className={`min-h-screen ${COLORS.PAGE_BG} text-white flex items-center justify-center px-4`}>
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="text-8xl mb-8">
          🔧
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">
          서비스 점검 중
        </h1>

        {/* Description */}
        <div className={`${COLORS.BOX_BG} rounded-2xl p-8 mb-6`}>
          <p className="text-lg mb-4 text-gray-300">
            더 나은 서비스 제공을 위해 데이터베이스 이전 작업을 진행하고 있습니다.
          </p>

          <div className="space-y-2 text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <span className="text-xl">📅</span>
              <span>일시: 2026년 1월 18일</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-xl">⏰</span>
              <span>시간: 오후 7시 ~ 9시 (한국 시간 기준)</span>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className={`${COLORS.BOX_BG} rounded-2xl p-6`}>
          <p className="text-sm text-gray-400">
            작업이 완료되면 자동으로 정상 서비스가 재개됩니다.<br />
            이용에 불편을 드려 죄송합니다.
          </p>
        </div>

        {/* App Name */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            {APP_NAME.KO}
          </p>
        </div>
      </div>
    </div>
  );
}
