'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function CustomerSupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="고객센터" showBackButton onBackClick={() => router.back()} />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">

          {/* 연락처 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">연락처 정보</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">회사명:</span> 싱잉버드
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">담당부서:</span> 개발팀
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">담당자:</span> 황윤
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">이메일:</span>
                  <a href="mailto:singingbird535@gmail.com" className="text-blue-400 hover:text-blue-300 ml-1">
                    singingbird535@gmail.com
                  </a>
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">전화번호:</span>
                  <a href="tel:010-2849-0490" className="text-blue-400 hover:text-blue-300 ml-1">
                    010-2849-0490
                  </a>
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">운영시간:</span> 평일 오전 9시 - 오후 6시 (한국시간)
                </p>
              </div>
            </div>
          </div>

          {/* 자주 묻는 질문 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">자주 묻는 질문</h3>

            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Q. 음성 인식이 정확하지 않아요.
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  A. 음성 인식의 정확도는 주변 소음, 발음의 명확성, 마이크 품질 등에 영향을 받습니다. 조용한 환경에서 마이크에 가까이 대고 또렷하게 말씀해주세요. 현재 한국어 음성 인식을 지원합니다.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Q. 저장된 메모를 다른 기기에서도 볼 수 있나요?
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  A. 현재 모든 데이터는 로컬 기기에만 저장되어 다른 기기에서는 접근할 수 없습니다. 데이터의 프라이버시와 보안을 위한 정책입니다. 향후 클라우드 동기화 기능을 검토 중입니다.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Q. 음성 메모를 백업하고 싶어요.
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  A. 설정 메뉴의 &apos;데이터 다운로드&apos; 기능을 이용해 음성 메모 데이터를 JSON 파일로 다운로드할 수 있습니다. 이 파일을 안전한 곳에 보관하시면 백업 용도로 활용하실 수 있습니다.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Q. 마이크 권한을 허용했는데 녹음이 안돼요.
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  A. 브라우저를 새로고침하거나 재시작해보세요. 다른 애플리케이션에서 마이크를 사용하고 있지는 않은지 확인해주세요. 문제가 지속되면 브라우저 설정에서 마이크 권한을 다시 설정해보시기 바랍니다.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Q. 서비스는 무료인가요?
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  A. 네, Voice Memo는 완전 무료 서비스입니다. 별도의 회원가입이나 결제 없이 모든 기능을 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 문의하기 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">더 많은 도움이 필요하신가요?</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                FAQ에서 답변을 찾지 못한 질문이 있으시면, 위의 연락처로 문의해 주세요. 최대한 빠르게 답변드리겠습니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:singingbird535@gmail.com?subject=Voice Memo 지원 문의"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  이메일로 문의하기
                </a>

                <a
                  href="tel:010-2849-0490"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  전화로 문의하기
                </a>
              </div>
            </div>
          </div>


        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}