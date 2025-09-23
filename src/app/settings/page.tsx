'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { getUserId, getShortUserId } from '@/utils/userUtils';

export default function SettingsPage() {
  const [userId, setUserId] = useState<string>('');

  // 컴포넌트 마운트 시 사용자 ID 가져오기
  useState(() => {
    const initUserId = getUserId();
    setUserId(initUserId);
  });

  const settingsItems = [
    {
      title: '음성 인식 설정',
      description: 'Google Speech API 관련 설정',
      icon: '🎤',
      action: () => console.log('음성 인식 설정')
    },
    {
      title: '알림 설정',
      description: '메모 저장 완료 알림 등',
      icon: '🔔',
      action: () => console.log('알림 설정')
    },
    {
      title: '데이터 관리',
      description: '메모 백업 및 복원',
      icon: '💾',
      action: () => console.log('데이터 관리')
    },
    {
      title: '개인정보 보호',
      description: '데이터 보안 및 개인정보 설정',
      icon: '🔒',
      action: () => console.log('개인정보 보호')
    },
    {
      title: '앱 정보',
      description: '버전 정보 및 개발자 연락처',
      icon: 'ℹ️',
      action: () => console.log('앱 정보')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="설정" />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">앱 설정</h1>
          <p className="text-gray-400">음성 메모 앱 환경설정</p>

          {/* User ID Display */}
          {userId && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">
                사용자 ID: {getShortUserId(userId)}
              </span>
            </div>
          )}
        </div>

        {/* Settings Items */}
        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* App Version Info */}
        <div className="mt-8 text-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">앱 버전</h3>
            <p className="text-2xl font-bold text-blue-400 mb-1">v0.8.0</p>
            <p className="text-xs text-gray-500">
              음성 인식 버튼 상태 관리 개선 및 즉시 저장 기능 구현
            </p>
          </div>
        </div>

        {/* Developer Info */}
        <div className="mt-4 text-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">개발자</h3>
            <p className="text-sm text-gray-400">
              🤖 Claude Code와 함께 개발된 음성 메모 앱
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}