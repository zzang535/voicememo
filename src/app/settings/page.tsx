'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import AlertModal from '@/components/AlertModal';

export default function SettingsPage() {
  const router = useRouter();
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);

  const settingsItems = [
    {
      title: '서비스 정보',
      description: '',
      icon: 'ℹ️',
      action: () => router.push('/settings/service-info')
    },
    {
      title: '데이터 다운로드',
      description: '',
      icon: '💾',
      action: () => setShowComingSoonAlert(true)
    },
    {
      title: '개인정보처리방침',
      description: '',
      icon: '🔒',
      action: () => router.push('/settings/privacy-policy')
    },
    {
      title: '이용약관',
      description: '',
      icon: '📄',
      action: () => router.push('/settings/terms-of-service')
    },
    {
      title: '고객센터',
      description: '',
      icon: '🎧',
      action: () => router.push('/settings/customer-support')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="설정" />

      <div className="pt-14 px-4 max-w-4xl mx-auto">

        {/* Settings Items */}
        <div className="mt-4 space-y-4">
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

      {/* 준비중 알림 모달 */}
      <AlertModal
        isOpen={showComingSoonAlert}
        message="🚧 개발중인 기능입니다. 조금만 기다려주세요! 😊"
        onConfirm={() => setShowComingSoonAlert(false)}
      />
    </div>
  );
}