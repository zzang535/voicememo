'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function VersionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="서비스 정보" showBackButton onBackClick={() => router.back()} />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* App Version Info */}
          <div className="text-center">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">앱 버전</h3>
              <p className="text-3xl font-bold text-blue-400 mb-2">v0.9.0</p>
              <p className="text-sm text-gray-400 mb-4">
                설정 메뉴에 고객센터, 개인정보처리방침, 이용약관 페이지 추가
              </p>
              <div className="text-xs text-gray-500">
                마지막 업데이트: 2024년 12월
              </div>
            </div>
          </div>

          {/* 서비스 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">서비스 정보</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">서비스명</span>
                  <span className="text-sm text-gray-300">Voice Memo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">개발사</span>
                  <span className="text-sm text-gray-300">싱잉버드</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">버전</span>
                  <span className="text-sm text-gray-300">v0.9.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">지원 브라우저</span>
                  <span className="text-sm text-gray-300">Chrome, Firefox, Safari, Edge</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">지원 언어</span>
                  <span className="text-sm text-gray-300">한국어</span>
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
                  음성 메모 관리 및 검색
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  로컬 저장소 기반 데이터 보관
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  음성 메모 재생 및 편집
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

      <BottomNavigation />
    </div>
  );
}