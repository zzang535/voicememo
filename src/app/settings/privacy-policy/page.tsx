'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { APP_NAME, COMPANY_INFO } from '@/constants/app';
import { COLORS } from '@/constants/colors';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className={`min-h-screen ${COLORS.PAGE_BG} text-white`}>
      <Header title="개인정보처리방침" showBackButton onBackClick={() => router.back()} />

      <div className="pt-14 px-4 pb-8 max-w-4xl mx-auto">
        <div className="mt-4 space-y-6">

          {/* 섹션 1: 개인정보의 처리 목적 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">1. 개인정보의 처리 목적</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {APP_NAME.FULL}(이하 &quot;서비스&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>음성 메모 기록 및 관리 서비스 제공</li>
              <li>음성 인식 및 텍스트 변환 서비스 제공</li>
              <li>사용자 맞춤형 메모 관리 기능 제공</li>
              <li>서비스 개선 및 사용성 향상</li>
              <li>고객 지원 및 문의 대응</li>
              <li>서비스 안정성 확보 및 부정 이용 방지</li>
              <li>법령 및 이용약관 위반 행위에 대한 대응</li>
            </ul>
          </div>

          {/* 섹션 2: 수집하는 개인정보 항목 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">2. 수집하는 개인정보 항목</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 다음과 같은 개인정보를 수집합니다:
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-white">▶ 필수 수집 항목</p>
                <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1 leading-relaxed">
                  <li>기기 식별 정보</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">※ 데이터 복구 및 기기 간 동기화 목적으로 사용됩니다.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">▶ 선택 수집 항목</p>
                <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1 leading-relaxed">
                  <li>마이크 권한</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">※ 음성 녹음 시에만 사용됩니다.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">▶ 서비스 이용 과정에서 생성 및 저장되는 정보</p>
                <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1 leading-relaxed">
                  <li>음성 메모 파일</li>
                  <li>텍스트 변환 결과</li>
                  <li>메모 작성 일시 및 관리 정보</li>
                  <li>서비스 이용 기록 및 접속 로그</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">※ 음성 메모, 텍스트, 메모 정보는 서버에 안전하게 보관됩니다.</p>
              </div>
            </div>
          </div>

          {/* 섹션 3: 개인정보 수집 및 저장 방법 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">3. 개인정보 수집 및 저장 방법</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 다음과 같은 방법으로 개인정보를 수집하고 저장합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>사용자가 음성 메모 서비스 이용 과정에서 직접 제공</li>
              <li>음성 녹음 및 텍스트 변환 과정에서 자동으로 생성되어 서버에 저장</li>
              <li>서비스 이용 과정에서 자동으로 생성되어 수집되는 정보</li>
              <li>고객 지원을 통한 상담 과정에서 수집</li>
            </ul>
          </div>

          {/* 섹션 4: 개인정보의 처리 및 보유기간 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">4. 개인정보의 처리 및 보유기간</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 사용자의 데이터를 서버에 저장하며, 다음과 같은 보유기간을 적용합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>음성 메모 파일: 사용자가 직접 삭제하기 전까지 서버에 보관</li>
              <li>텍스트 변환 결과: 사용자가 직접 삭제하기 전까지 서버에 보관</li>
              <li>기기 식별 정보: 사용자가 서비스를 이용하는 동안 보관</li>
              <li>서비스 이용 기록: 브라우저 종료 시 자동 삭제</li>
              <li>관련 법령에 따른 보존이 필요한 경우: 해당 법령에서 정한 기간</li>
            </ul>
          </div>

          {/* 섹션 5: 개인정보의 제3자 제공 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">5. 개인정보의 제3자 제공</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 원칙적으로 사용자의 개인정보를 제3자에게 제공하지 않습니다. 다음의 경우에만 예외로 합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>사용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </div>

          {/* 섹션 6: 개인정보 안전성 확보 조치 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">6. 개인정보 안전성 확보 조치</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>브라우저의 보안 정책 준수</li>
              <li>HTTPS 프로토콜을 통한 안전한 데이터 전송</li>
              <li>정기적인 보안 점검 및 업데이트</li>
              <li>개인정보 처리시스템 접근 제한 및 기록 관리</li>
              <li>서버 보안 시스템 운영 및 모니터링</li>
            </ul>
          </div>

          {/* 섹션 7: 쿠키 및 자동수집 도구 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">7. 쿠키 및 자동수집 도구</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 사용자 편의성 향상을 위해 로컬 저장소와 서버 데이터베이스를 사용합니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>로컬 저장소 사용 목적: 사용자 설정 유지, 임시 데이터 저장</li>
              <li>서버 저장 목적: 음성 메모 및 텍스트 정보의 영구 보관, 기기 간 동기화 및 복구</li>
              <li>로컬 저장소 삭제 방법: 브라우저 설정을 통해 삭제할 수 있습니다</li>
              <li>서버 데이터 삭제 방법: 서비스 내 메모 삭제 기능을 통해 삭제할 수 있습니다</li>
            </ul>
          </div>

          {/* 섹션 8: 미성년자 개인정보 보호 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">8. 미성년자 개인정보 보호</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 만 14세 미만 아동의 개인정보 보호에 특별한 주의를 기울입니다:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>만 14세 미만 아동의 서비스 이용 시 법정대리인의 동의 권장</li>
              <li>미성년자 개인정보는 더욱 엄격하게 관리</li>
              <li>미성년자에게 부적절한 기능 사용 방지 조치</li>
            </ul>
          </div>

          {/* 섹션 9: 정보주체의 권리·의무 및 행사방법 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">9. 정보주체의 권리·의무 및 행사방법</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              정보주체는 서비스에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
              <li>개인정보 열람 요구 (서비스 내 메모 목록에서 확인 가능)</li>
              <li>오류 등이 있을 경우 정정 요구 (서비스 내 메모 수정 기능 이용)</li>
              <li>삭제 요구 (서비스 내 메모 삭제 기능 이용 또는 고객센터 문의)</li>
              <li>처리정지 요구</li>
              <li>데이터 다운로드 요구 (향후 제공 예정)</li>
            </ul>
            <p className="text-xs text-gray-400 leading-relaxed mt-2">
              권리 행사는 서비스 내 기능 또는 개인정보 보호책임자에게 서면, 전화, 전자우편을 통하여 하실 수 있으며 서비스는 이에 대해 지체없이 조치하겠습니다.
            </p>
          </div>

          {/* 섹션 10: 개인정보 보호책임자 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">10. 개인정보 보호책임자</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className={`${COLORS.BOX_BG} border ${COLORS.BORDER} p-4 rounded-lg`}>
              <p className="text-sm text-gray-300">▶ 개인정보 보호책임자</p>
              <p className="text-sm text-gray-300">- 회사명: {COMPANY_INFO.NAME}</p>
              <p className="text-sm text-gray-300">- 담당부서: {COMPANY_INFO.DEPARTMENT}</p>
              <p className="text-sm text-gray-300">- 담당자: 황윤</p>
              <p className="text-sm text-gray-300">- 이메일: {COMPANY_INFO.CONTACT.EMAIL}</p>
              <p className="text-sm text-gray-300">- 전화번호: {COMPANY_INFO.CONTACT.PHONE}</p>
            </div>
          </div>

          {/* 섹션 11: 개인정보 처리방침의 변경 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">11. 개인정보 처리방침의 변경</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </div>

          {/* 시행일 */}
          <div className={`mt-8 pt-6 border-t ${COLORS.BORDER}`}>
            <p className="text-sm text-gray-400 text-center">
              본 방침은 2025년 1월 1일부터 시행됩니다.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}