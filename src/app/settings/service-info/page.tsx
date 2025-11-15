'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { APP_NAME, COMPANY_INFO, APP_INFO } from '@/constants/app';

interface VersionInfo {
  version: string;
  note: string;
  date: string;
}

interface VersionData {
  currentVersion: string;
  latestUpdate: VersionInfo;
}

export default function VersionPage() {
  const router = useRouter();
  const [versionData, setVersionData] = useState<VersionData | null>(null);

  useEffect(() => {
    // API를 통해 버전 정보 가져오기
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/api/version');
        const result = await response.json();
        if (result.success) {
          setVersionData(result.data);
        }
      } catch (error) {
        console.error('Error fetching version info:', error);
      }
    };

    fetchVersionInfo();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header title="서비스 정보" showBackButton onBackClick={() => router.back()} />

      <div className="pt-14 px-4 pb-8 max-w-4xl mx-auto">
        <div className="mt-4 space-y-6">
          {/* App Version Info */}
          <div className="text-center">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">앱 버전</h3>
              {versionData ? (
                <>
                  <p className="text-3xl font-bold text-blue-400 mb-2">v{versionData.currentVersion}</p>
                  <p className="text-sm text-gray-400 mb-4">
                    {versionData.latestUpdate.note}
                  </p>
                  <div className="text-xs text-gray-500">
                    마지막 업데이트: {formatDate(versionData.latestUpdate.date)}
                  </div>
                </>
              ) : (
                <div className="text-gray-400">버전 정보를 불러오는 중...</div>
              )}
            </div>
          </div>

          {/* 서비스 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">서비스 정보</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">서비스명</span>
                  <span className="text-sm text-gray-300">{APP_NAME.FULL}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">개발사</span>
                  <span className="text-sm text-gray-300">{COMPANY_INFO.NAME}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">버전</span>
                  <span className="text-sm text-gray-300">v{versionData?.currentVersion || '1.0.1'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">지원 브라우저</span>
                  <span className="text-sm text-gray-300">{APP_INFO.SUPPORTED_BROWSERS}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">지원 언어</span>
                  <span className="text-sm text-gray-300">{APP_INFO.SUPPORTED_LANGUAGES}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 기능 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">주요 기능</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  음성 녹음 및 저장
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  음성 인식을 통한 텍스트 변환
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  음성 노트 관리 및 검색
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  데이터 다운로드 (백업)
                </li>
              </ul>
            </div>
          </div>

          {/* 라이선스 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">라이선스</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">
                이 서비스는 개인 및 상업적 목적으로 무료로 사용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}