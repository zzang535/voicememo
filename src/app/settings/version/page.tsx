'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function VersionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="버전 정보" showBackButton onBackClick={() => router.back()} />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {/* App Version Info */}
        <div className="text-center mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">앱 버전</h3>
            <p className="text-3xl font-bold text-blue-400 mb-2">v0.8.0</p>
            <p className="text-sm text-gray-400 mb-4">
              음성 인식 버튼 상태 관리 개선 및 즉시 저장 기능 구현
            </p>
            <div className="text-xs text-gray-500">
              마지막 업데이트: 2024년 12월
            </div>
          </div>
        </div>

      </div>

      <BottomNavigation />
    </div>
  );
}