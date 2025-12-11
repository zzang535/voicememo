/**
 * 자동생각(Automatic Thoughts) 상수
 * 인지행동치료(CBT)에서 다루는 자동생각 패턴과 연관된 감정, 핵심 욕구
 */

export interface AutomaticThought {
  code: string;
  label_ko: string;
  label_en: string;
  emotions: string[];
  core_needs: string[];
}

export const AUTOMATIC_THOUGHTS: AutomaticThought[] = [
  {
    code: 'ABANDONED',
    label_ko: '버림받은',
    label_en: 'Abandoned',
    emotions: ['두렵다', '슬프다', '외롭다'],
    core_needs: ['소속감', '돌봄']
  },
  {
    code: 'ABUSED',
    label_ko: '학대받은',
    label_en: 'Abused',
    emotions: ['겁나다', '무기력하다', '비참하다'],
    core_needs: ['보살핌', '신체·정서적 안전', '안정감']
  },
  {
    code: 'UNRECOGNIZED',
    label_ko: '인정받지 못한',
    label_en: 'Unrecognized',
    emotions: ['섭섭하다', '억울하다', '맥 빠지다'],
    core_needs: ['이해', '유대', '소속', '기억', '공정함']
  },
  {
    code: 'ATTACKED',
    label_ko: '공격당한',
    label_en: 'Attacked',
    emotions: ['겁나다', '위축되다', '격노하다'],
    core_needs: ['안전', '보호']
  },
  {
    code: 'BETRAYED',
    label_ko: '배신당한',
    label_en: 'Betrayed',
    emotions: ['분하다', '실망하다', '맥 빠지다'],
    core_needs: ['신뢰', '진정성', '정직', '명확함']
  },
  {
    code: 'BLAMED',
    label_ko: '비난받는',
    label_en: 'Blamed',
    emotions: ['두렵다', '불안하다', '위축되다'],
    core_needs: ['공정함', '수용', '이해']
  },
  {
    code: 'BULLIED',
    label_ko: '왕따당한',
    label_en: 'Bullied',
    emotions: ['불안하다', '외롭다', '두렵다'],
    core_needs: ['안전', '존중', '소속감', '수용']
  },
  {
    code: 'CONFINED',
    label_ko: '구속당하는',
    label_en: 'Confined',
    emotions: ['답답하다', '짜증 난다'],
    core_needs: ['자율성', '자유', '선택']
  },
  {
    code: 'DECEIVED',
    label_ko: '속은 듯한',
    label_en: 'Deceived',
    emotions: ['실망하다', '억울하다', '분하다'],
    core_needs: ['정직', '공정함', '신뢰']
  },
  {
    code: 'DISLIKED',
    label_ko: '싫어하는 것 같은',
    label_en: 'Disliked',
    emotions: ['외롭다', '슬프다', '서운하다'],
    core_needs: ['사랑', '인정', '우정', '유대']
  },
  {
    code: 'DISTRUSTED',
    label_ko: '의심받은',
    label_en: 'Distrusted',
    emotions: ['절망스럽다', '억울하다'],
    core_needs: ['진실', '정직', '신뢰']
  },
  {
    code: 'IGNORED',
    label_ko: '무시당한',
    label_en: 'Ignored',
    emotions: ['서운하다', '분하다', '민망하다'],
    core_needs: ['소속', '유대', '공동체', '참여']
  },
  {
    code: 'INSULTED',
    label_ko: '모욕당한',
    label_en: 'Insulted',
    emotions: ['화난다', '창피하다', '무기력하다'],
    core_needs: ['존중', '배려', '존재감']
  },
  {
    code: 'INTERRUPTED',
    label_ko: '방해받은',
    label_en: 'Interrupted',
    emotions: ['짜증 난다', '귀찮다'],
    core_needs: ['존중', '배려', '이해', '자율성']
  },
  {
    code: 'INTIMIDATED',
    label_ko: '위협받는',
    label_en: 'Intimidated',
    emotions: ['불안하다', '두렵다', '걱정된다'],
    core_needs: ['안전', '보호', '자율성', '선택']
  },
  {
    code: 'MISUNDERSTOOD',
    label_ko: '오해받은',
    label_en: 'Misunderstood',
    emotions: ['불편하다', '속상하다', '억울하다'],
    core_needs: ['이해', '명확성']
  },
  {
    code: 'OVERPOWERED',
    label_ko: '제압당한',
    label_en: 'Overpowered',
    emotions: ['무력하다', '당혹스럽다'],
    core_needs: ['공평함', '정의', '자율성', '자유']
  },
  {
    code: 'EXPLOITED',
    label_ko: '착취당한',
    label_en: 'Exploited',
    emotions: ['화나다', '피곤하다', '좌절하다'],
    core_needs: ['존중', '배려', '휴식', '보살핌']
  },
  {
    code: 'OVERDEMANDED',
    label_ko: '과외요구받는',
    label_en: 'Overdemanded',
    emotions: ['지쳤다', '무기력하다', '성가시다'],
    core_needs: ['인정', '공평함', '존중', '성실성']
  },
  {
    code: 'WITH_IRRITABLE_PERSON',
    label_ko: '신경질적으로 구는 사람과 있을 때',
    label_en: 'With Irritable Person',
    emotions: ['짜증 난다', '귀찮다'],
    core_needs: ['존중', '배려']
  },
  {
    code: 'RESTRAINED',
    label_ko: '억제당한',
    label_en: 'Restrained',
    emotions: ['슬프다', '답답하다', '맥 빠지다'],
    core_needs: ['존중', '이해', '인정']
  },
  {
    code: 'REJECTED',
    label_ko: '거절당한',
    label_en: 'Rejected',
    emotions: ['실망스럽다', '서운하다'],
    core_needs: ['소속', '친밀함', '인정']
  },
  {
    code: 'RIPPED_OFF',
    label_ko: '바가지 쓴',
    label_en: 'Ripped Off',
    emotions: ['분하다', '실망스럽다', '걱정된다'],
    core_needs: ['공정함', '정의', '신뢰', '배려']
  },
  {
    code: 'SUFFOCATED',
    label_ko: '숨이 막힐 듯한',
    label_en: 'Suffocated',
    emotions: ['두렵다', '절박하다'],
    core_needs: ['여유', '자유', '자율성', '진정성']
  },
  {
    code: 'TAKEN_FOR_GRANTED',
    label_ko: '당연하게 여겨진',
    label_en: 'Taken for Granted',
    emotions: ['슬프다', '서운하다', '실망스럽다'],
    core_needs: ['감사', '인정', '배려']
  },
  {
    code: 'THREATENED',
    label_ko: '협박받는',
    label_en: 'Threatened',
    emotions: ['무섭다', '두렵다', '위축되다'],
    core_needs: ['안전', '자율성', '선택']
  },
  {
    code: 'TRAMPLED',
    label_ko: '짓밟힘, 유린당함',
    label_en: 'Trampled',
    emotions: ['무력하다', '좌절하다'],
    core_needs: ['자신감', '유대', '공동체', '배려', '존중']
  },
  {
    code: 'UNLOVED',
    label_ko: '사랑받지 못한',
    label_en: 'Unloved',
    emotions: ['슬프다', '외롭다', '비참하다'],
    core_needs: ['사랑', '관심', '유대', '공감']
  },
  {
    code: 'UNSUPPORTED',
    label_ko: '지지받지 못한',
    label_en: 'Unsupported',
    emotions: ['무력하다', '슬프다', '외롭다'],
    core_needs: ['지지', '이해']
  },
  {
    code: 'USED',
    label_ko: '이용당한',
    label_en: 'Used',
    emotions: ['불안하다', '억울하다', '슬프다'],
    core_needs: ['자율성', '공평함', '배려', '상호성']
  },
  {
    code: 'VIOLATED',
    label_ko: '침해당한',
    label_en: 'Violated',
    emotions: ['짜증 난다', '혼란스럽다'],
    core_needs: ['개인 보호', '안전', '신뢰', '여유', '존중']
  },
  {
    code: 'WRONGED',
    label_ko: '부당하게 취급당한',
    label_en: 'Wronged',
    emotions: ['억울하다', '짜증 난다', '분하다'],
    core_needs: ['존중', '정의', '신뢰', '안전', '공평함']
  }
];

/**
 * 자동생각 코드로 항목 찾기
 */
export const getAutomaticThoughtByCode = (code: string): AutomaticThought | undefined => {
  return AUTOMATIC_THOUGHTS.find(thought => thought.code === code);
};

/**
 * 특정 감정을 포함하는 자동생각 목록 가져오기
 */
export const getAutomaticThoughtsByEmotion = (emotion: string): AutomaticThought[] => {
  return AUTOMATIC_THOUGHTS.filter(thought =>
    thought.emotions.includes(emotion)
  );
};

/**
 * 특정 핵심 욕구를 포함하는 자동생각 목록 가져오기
 */
export const getAutomaticThoughtsByNeed = (need: string): AutomaticThought[] => {
  return AUTOMATIC_THOUGHTS.filter(thought =>
    thought.core_needs.includes(need)
  );
};

/**
 * 감정별 색상 및 아이콘 스타일
 */
export const EMOTION_STYLES: Record<string, { color: string; bgColor: string; icon: string }> = {
  // 불안/긴장 계열 (주황 #FF9F1C)
  '두렵다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '불안하다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '걱정된다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '겁나다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '무섭다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '위축되다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '절박하다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },

  // 답답/막힘 계열 (보라 #7D7ABC)
  '답답하다': { color: '#7D7ABC', bgColor: 'rgba(125, 122, 188, 0.15)', icon: '🌀' },
  '무기력하다': { color: '#7D7ABC', bgColor: 'rgba(125, 122, 188, 0.15)', icon: '🌀' },
  '맥 빠지다': { color: '#7D7ABC', bgColor: 'rgba(125, 122, 188, 0.15)', icon: '🌀' },
  '무력하다': { color: '#7D7ABC', bgColor: 'rgba(125, 122, 188, 0.15)', icon: '🌀' },
  '지쳤다': { color: '#7D7ABC', bgColor: 'rgba(125, 122, 188, 0.15)', icon: '🌀' },
  '피곤하다': { color: '#7D7ABC', bgColor: 'rgba(125, 122, 188, 0.15)', icon: '🌀' },

  // 분노 계열 (빨강 #FF4B4B)
  '화나다': { color: '#FF4B4B', bgColor: 'rgba(255, 75, 75, 0.15)', icon: '💢' },
  '짜증 난다': { color: '#FF4B4B', bgColor: 'rgba(255, 75, 75, 0.15)', icon: '💢' },
  '분하다': { color: '#FF4B4B', bgColor: 'rgba(255, 75, 75, 0.15)', icon: '💢' },
  '격노하다': { color: '#FF4B4B', bgColor: 'rgba(255, 75, 75, 0.15)', icon: '💢' },
  '귀찮다': { color: '#FF4B4B', bgColor: 'rgba(255, 75, 75, 0.15)', icon: '💢' },

  // 슬픔/우울 계열 (파랑 #5B8FF9)
  '슬프다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },
  '외롭다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },
  '서운하다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },
  '비참하다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },

  // 혼란/판단 어려움 계열 (황토 #CBCB00)
  '혼란스럽다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },
  '당혹스럽다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },
  '민망하다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },

  // 억울함/부당함 계열 (황토 #CBCB00)
  '억울하다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },
  '섭섭하다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },
  '속상하다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },
  '불편하다': { color: '#CBCB00', bgColor: 'rgba(203, 203, 0, 0.15)', icon: '❓' },

  // 실망 계열 (파랑 #5B8FF9)
  '실망하다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },
  '실망스럽다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },
  '좌절하다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },
  '절망스럽다': { color: '#5B8FF9', bgColor: 'rgba(91, 143, 249, 0.15)', icon: '💧' },

  // 기타
  '창피하다': { color: '#FF9F1C', bgColor: 'rgba(255, 159, 28, 0.15)', icon: '⚠️' },
  '성가시다': { color: '#FF4B4B', bgColor: 'rgba(255, 75, 75, 0.15)', icon: '💢' },
};

/**
 * 감정 단어의 스타일 가져오기 (없으면 기본값)
 */
export const getEmotionStyle = (emotion: string) => {
  return EMOTION_STYLES[emotion] || {
    color: '#6EC5D9',
    bgColor: 'rgba(110, 197, 217, 0.15)',
    icon: '🌿'
  };
};

/**
 * 핵심 욕구별 색상 및 아이콘 스타일
 */
export const CORE_NEED_STYLES: Record<string, { color: string; bgColor: string; icon: string }> = {
  // 1) 연결/소속/유대/공동체 계열 (핑크/퍼플 계열)
  '소속감':       { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '👥' },
  '소속':         { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '👥' },
  '유대':         { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '👥' },
  '공동체':       { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '👥' },
  '참여':         { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '👥' },
  '친밀함':       { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '💞' },
  '우정':         { color: '#F48FB1', bgColor: 'rgba(244, 143, 177, 0.15)', icon: '🤝' },

  // 2) 사랑/돌봄/배려/지지/관심 계열 (부드러운 초록/민트)
  '사랑':         { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '💚' },
  '돌봄':         { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '🤗' },
  '보살핌':       { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '🤗' },
  '관심':         { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '👀' },
  '배려':         { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '🫶' },
  '지지':         { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '🧱' },

  // 3) 안전/보호/안정감/개인 보호 계열 (파랑/블루)
  '안전':             { color: '#4A90E2', bgColor: 'rgba(74, 144, 226, 0.15)', icon: '🛡️' },
  '신체·정서적 안전': { color: '#4A90E2', bgColor: 'rgba(74, 144, 226, 0.15)', icon: '🛡️' },
  '보호':             { color: '#4A90E2', bgColor: 'rgba(74, 144, 226, 0.15)', icon: '🏡' },
  '개인 보호':        { color: '#4A90E2', bgColor: 'rgba(74, 144, 226, 0.15)', icon: '🔒' },
  '안정감':           { color: '#4A90E2', bgColor: 'rgba(74, 144, 226, 0.15)', icon: '⚓' },

  // 4) 공정함/정의/공평함/상호성/성실성 계열 (골드/옐로)
  '공정함':       { color: '#F7B500', bgColor: 'rgba(247, 181, 0, 0.15)', icon: '⚖️' },
  '공평함':       { color: '#F7B500', bgColor: 'rgba(247, 181, 0, 0.15)', icon: '⚖️' },
  '정의':         { color: '#F7B500', bgColor: 'rgba(247, 181, 0, 0.15)', icon: '🏛️' },
  '상호성':       { color: '#F7B500', bgColor: 'rgba(247, 181, 0, 0.15)', icon: '🔁' },
  '성실성':       { color: '#F7B500', bgColor: 'rgba(247, 181, 0, 0.15)', icon: '📜' },

  // 5) 신뢰/정직/진실/진정성 계열 (청록/티얼)
  '신뢰':         { color: '#00B8D9', bgColor: 'rgba(0, 184, 217, 0.15)', icon: '🤝' },
  '정직':         { color: '#00B8D9', bgColor: 'rgba(0, 184, 217, 0.15)', icon: '🔍' },
  '진실':         { color: '#00B8D9', bgColor: 'rgba(0, 184, 217, 0.15)', icon: '💡' },
  '진정성':       { color: '#00B8D9', bgColor: 'rgba(0, 184, 217, 0.15)', icon: '🎯' },

  // 6) 존중/인정/존재감 계열 (보라)
  '존중':         { color: '#7E57C2', bgColor: 'rgba(126, 87, 194, 0.15)', icon: '🙇‍♀️' },
  '인정':         { color: '#7E57C2', bgColor: 'rgba(126, 87, 194, 0.15)', icon: '🌟' },
  '존재감':       { color: '#7E57C2', bgColor: 'rgba(126, 87, 194, 0.15)', icon: '✨' },

  // 7) 자율성/자유/선택 계열 (민트/초록)
  '자율성':       { color: '#2ECC71', bgColor: 'rgba(46, 204, 113, 0.15)', icon: '🕊️' },
  '자유':         { color: '#2ECC71', bgColor: 'rgba(46, 204, 113, 0.15)', icon: '🕊️' },
  '선택':         { color: '#2ECC71', bgColor: 'rgba(46, 204, 113, 0.15)', icon: '✅' },

  // 8) 이해/명확함/명확성/기억 계열 (하늘색)
  '이해':         { color: '#29B6F6', bgColor: 'rgba(41, 182, 246, 0.15)', icon: '🧠' },
  '명확함':       { color: '#29B6F6', bgColor: 'rgba(41, 182, 246, 0.15)', icon: '📌' },
  '명확성':       { color: '#29B6F6', bgColor: 'rgba(41, 182, 246, 0.15)', icon: '📌' },
  '기억':         { color: '#29B6F6', bgColor: 'rgba(41, 182, 246, 0.15)', icon: '📝' },

  // 9) 감사/여유/휴식 계열 (파스텔 그린/블루)
  '감사':         { color: '#81C784', bgColor: 'rgba(129, 199, 132, 0.15)', icon: '🙏' },
  '여유':         { color: '#81C784', bgColor: 'rgba(129, 199, 132, 0.15)', icon: '🌿' },
  '휴식':         { color: '#81C784', bgColor: 'rgba(129, 199, 132, 0.15)', icon: '🛋️' },

  // 10) 자신감/자기 가치 계열
  '자신감':       { color: '#FF7043', bgColor: 'rgba(255, 112, 67, 0.15)', icon: '💪' },

  // 11) 공감
  '공감':         { color: '#5EC576', bgColor: 'rgba(94, 197, 118, 0.15)', icon: '💞' },
};

/**
 * 핵심 욕구 단어의 스타일 가져오기 (없으면 기본값)
 */
export const getCoreNeedStyle = (need: string) => {
  return CORE_NEED_STYLES[need] || {
    color: '#6EC5D9',
    bgColor: 'rgba(110, 197, 217, 0.15)',
    icon: '🌱',
  };
};
