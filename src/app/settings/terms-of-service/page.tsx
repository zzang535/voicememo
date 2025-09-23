'use client';

import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="이용약관" />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">

          {/* 섹션 1: 목적 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">1. 목적</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              이 약관은 Voice Memo(이하 "서비스")의 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          {/* 섹션 2: 약관의 효력 및 변경 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">2. 약관의 효력 및 변경</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              이 약관은 서비스를 이용하고자 하는 모든 사용자에게 적용됩니다. 서비스는 약관의 규제에 관한 법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
            </p>
          </div>

          {/* 섹션 3: 서비스의 제공 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">3. 서비스의 제공</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 다음과 같은 기능을 제공합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>음성 녹음 및 저장 기능</li>
              <li>음성 인식을 통한 텍스트 변환 기능</li>
              <li>음성 메모 관리 및 검색 기능</li>
              <li>로컬 저장소를 활용한 데이터 보관 서비스</li>
              <li>음성 메모 재생 및 편집 기능</li>
              <li>기타 서비스가 추가 개발하는 음성 메모 관련 기능</li>
            </ul>
          </div>

          {/* 섹션 4: 서비스 이용 규칙 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">4. 서비스 이용 규칙</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              사용자는 다음 행위를 해서는 안 됩니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>법령 또는 약관에 위배되는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>타인의 개인정보나 사생활을 무단으로 녹음하는 행위</li>
              <li>저작권이나 초상권을 침해하는 내용의 녹음</li>
              <li>허위 정보나 조작된 음성 내용을 악용하는 행위</li>
              <li>자동화된 프로그램을 이용한 서비스 남용</li>
              <li>상업적 목적의 무단 이용</li>
              <li>미성년자에게 부적절한 내용 녹음</li>
              <li>서비스의 보안 시스템을 무력화하려는 행위</li>
            </ul>
          </div>

          {/* 섹션 5: 서비스 중단 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">5. 서비스 중단</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 다음과 같은 경우 서비스 제공을 중단할 수 있습니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>시스템 점검, 보수, 업데이트 등의 경우</li>
              <li>천재지변, 전쟁, 인터넷 서비스 중단 등의 불가항력적인 사유가 있는 경우</li>
            </ul>
          </div>

          {/* 섹션 6: 사용자의 의무 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">6. 사용자의 의무</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              사용자는 다음 사항을 준수해야 합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>서비스 이용 시 관련법령과 약관을 준수할 것</li>
              <li>타인의 권리를 침해하지 않는 범위에서 서비스를 이용할 것</li>
              <li>개인정보보호 및 저작권 관련 법령을 준수할 것</li>
            </ul>
          </div>

          {/* 섹션 7: 음성 데이터 정책 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">7. 음성 데이터 정책</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              사용자가 녹음하는 음성 데이터는 다음 기준을 준수해야 합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>녹음 대상자의 동의 없는 무단 녹음 금지</li>
              <li>타인의 저작권을 침해하는 음성 내용 금지</li>
              <li>음란물, 폭력적 내용, 혐오 표현 등 부적절한 내용 금지</li>
              <li>개인정보가 포함된 내용의 신중한 관리</li>
              <li>불법적인 목적으로의 음성 데이터 활용 금지</li>
            </ul>
          </div>

          {/* 섹션 8: 데이터 소유권 및 책임 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">8. 데이터 소유권 및 책임</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              사용자가 생성한 음성 메모에 대하여:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>사용자는 음성 메모에 대한 모든 권리와 책임을 가집니다</li>
              <li>모든 데이터는 사용자의 로컬 기기에 저장되며, 서비스는 이에 접근하지 않습니다</li>
              <li>데이터 삭제 및 관리는 사용자가 직접 수행합니다</li>
              <li>사용자는 음성 메모 내용에 대한 모든 법적 책임을 집니다</li>
            </ul>
          </div>

          {/* 섹션 9: 프라이버시 보호 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">9. 프라이버시 보호</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 사용자의 프라이버시 보호를 위해 다음과 같이 운영됩니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>모든 음성 데이터는 사용자의 로컬 기기에만 저장됩니다</li>
              <li>서비스는 사용자의 음성 데이터에 접근하거나 수집하지 않습니다</li>
              <li>외부 서버로의 음성 데이터 전송은 사용자의 명시적 동의 하에만 수행됩니다</li>
              <li>음성 인식 기능 사용 시에도 데이터는 로컬에서 처리됩니다</li>
            </ul>
          </div>

          {/* 섹션 10: 기술적 제한사항 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">10. 기술적 제한사항</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스 이용 시 다음 사항을 숙지해야 합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>브라우저 및 기기의 성능에 따라 서비스 품질이 달라질 수 있습니다</li>
              <li>로컬 저장소 용량 한계로 인한 데이터 저장 제한이 있을 수 있습니다</li>
              <li>음성 인식 정확도는 환경 및 음질에 따라 차이가 날 수 있습니다</li>
              <li>인터넷 연결이 필요한 일부 기능은 오프라인에서 제한될 수 있습니다</li>
            </ul>
          </div>

          {/* 섹션 11: 면책사항 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">11. 면책사항</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 다음에 대해 책임을 지지 않습니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>사용자의 부주의로 인한 데이터 손실</li>
              <li>기기 고장, 브라우저 오류 등으로 인한 서비스 중단</li>
              <li>사용자가 생성한 음성 메모 내용으로 인한 법적 문제</li>
              <li>제3자에 의한 불법적인 접근이나 데이터 유출</li>
              <li>음성 인식 오류로 인한 텍스트 변환 부정확성</li>
            </ul>
          </div>

          {/* 섹션 12: 미성년자 보호 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">12. 미성년자 보호</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              미성년자 보호를 위하여:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>만 14세 미만의 경우 법정대리인의 동의가 권장됩니다</li>
              <li>미성년자 대상 유해 내용 녹음은 제한됩니다</li>
              <li>미성년자의 개인정보는 특별히 보호됩니다</li>
              <li>미성년자 관련 문제 발생 시 즉시 조치합니다</li>
            </ul>
          </div>

          {/* 섹션 13: 분쟁 해결 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">13. 분쟁 해결</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스 이용과 관련된 분쟁이 발생한 경우:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>우선적으로 상호 협의를 통해 해결합니다</li>
              <li>협의가 이루어지지 않을 경우 관련 법령에 따라 처리됩니다</li>
              <li>본 약관과 관련된 소송은 대한민국 법원이 관할합니다</li>
            </ul>
          </div>

          {/* 섹션 14: 연락처 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">14. 연락처</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스 관련 문의사항이 있을 경우 아래로 연락주시기 바랍니다:
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300">- 서비스명: Voice Memo</p>
              <p className="text-sm text-gray-300">- 담당부서: 개발팀</p>
              <p className="text-sm text-gray-300">- 담당자: 황윤</p>
              <p className="text-sm text-gray-300">- 이메일: hwangyoon@example.com</p>
              <p className="text-sm text-gray-300">- 전화번호: 010-0000-0000</p>
            </div>
          </div>

          {/* 시행일 */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              본 약관은 2024년 1월 1일부터 시행됩니다.
            </p>
          </div>

        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}