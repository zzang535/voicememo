'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { getUserId, getShortUserId } from '@/utils/userUtils';

export default function SettingsPage() {
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  // 컴포넌트 마운트 시 사용자 ID 가져오기
  useState(() => {
    const initUserId = getUserId();
    setUserId(initUserId);
  });

  const settingsItems = [
    {
      title: '버전 정보',
      description: '',
      icon: 'ℹ️',
      action: () => router.push('/settings/version')
    },
    {
      title: '데이터 관리',
      description: '메모 백업 및 복원',
      icon: '💾',
      action: () => console.log('데이터 관리')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="설정" />

      <div className="pt-20 px-4 max-w-4xl mx-auto">

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

      </div>

      <BottomNavigation />
    </div>
  );
}