'use client';

import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function VersionPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="앱 정보" />

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

        {/* Developer Info */}
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">개발자 정보</h3>
            <p className="text-sm text-gray-400 mb-2">
              🤖 Claude Code와 함께 개발된 음성 메모 앱
            </p>
            <p className="text-xs text-gray-500">
              AI 기반 음성 인식 기술을 활용한 간편한 메모 앱
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">주요 기능</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <span className="text-blue-400">🎤</span>
                <span>실시간 음성 인식 및 텍스트 변환</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">💾</span>
                <span>자동 메모 저장 및 관리</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">📝</span>
                <span>메모 편집 및 삭제 기능</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-400">📱</span>
                <span>모바일 최적화 UI/UX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}