/**
 * 감정 태그 상수
 * 사용자 메모에 태깅할 수 있는 감정 목록
 */

export interface EmotionTag {
  code: string;
  label_ko: string;
  label_en: string;
  category: string;
}

export const EMOTION_CATEGORIES = {
  ANXIETY: '불안/긴장',
  BLOCKED: '답답/막힘',
  ANGER: '짜증/분노',
  SADNESS: '슬픔/우울',
  CONFUSION: '혼란/판단 어려움',
  REFLECTION: '성찰/마음정리',
  CALM: '안정/평온',
  INSPIRATION: '영감/상승',
} as const;

export const EMOTION_TAGS: EmotionTag[] = [
  // 불안/긴장
  { code: 'MILD_ANXIETY', label_ko: '가벼운 불안', label_en: 'Mild Anxiety', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'FREE_FLOATING_ANXIETY', label_ko: '이유 없는 불안', label_en: 'Free-floating Anxiety', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'PERFORMANCE_PRESSURE', label_ko: '성과 압박감', label_en: 'Performance Pressure', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'FUTURE_WORRY', label_ko: '미래 걱정', label_en: 'Future Worry', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'FEAR_OF_MISTAKES', label_ko: '실수 두려움', label_en: 'Fear of Mistakes', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'RELATIONAL_ANXIETY', label_ko: '관계 불안', label_en: 'Relational Anxiety', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'FEAR_OF_JUDGEMENT', label_ko: '평가받는 느낌', label_en: 'Fear of Judgement', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'FAILURE_FEAR', label_ko: '실패 공포', label_en: 'Failure Fear', category: EMOTION_CATEGORIES.ANXIETY },
  { code: 'RESPONSIBILITY_PRESSURE', label_ko: '책임 부담', label_en: 'Responsibility Pressure', category: EMOTION_CATEGORIES.ANXIETY },

  // 답답/막힘
  { code: 'UNABLE_TO_EXPRESS', label_ko: '말 못함', label_en: 'Unable to Express', category: EMOTION_CATEGORIES.BLOCKED },
  { code: 'MENTAL_BLOCK', label_ko: '생각 막힘', label_en: 'Mental Block', category: EMOTION_CATEGORIES.BLOCKED },
  { code: 'SITUATIONAL_BLOCK', label_ko: '상황 막힘', label_en: 'Situational Block', category: EMOTION_CATEGORIES.BLOCKED },
  { code: 'EMOTIONAL_SUPPRESSION', label_ko: '감정 억눌림', label_en: 'Emotional Suppression', category: EMOTION_CATEGORIES.BLOCKED },
  { code: 'LOW_DRIVE', label_ko: '무기력', label_en: 'Low Drive', category: EMOTION_CATEGORIES.BLOCKED },
  { code: 'GIVING_UP', label_ko: '체념', label_en: 'Giving Up', category: EMOTION_CATEGORIES.BLOCKED },

  // 짜증/분노
  { code: 'IRRITATION', label_ko: '짜증', label_en: 'Irritation', category: EMOTION_CATEGORIES.ANGER },
  { code: 'FRUSTRATION', label_ko: '답답 + 분노 혼합', label_en: 'Frustration', category: EMOTION_CATEGORIES.ANGER },
  { code: 'UNFAIRNESS', label_ko: '억울함', label_en: 'Unfairness', category: EMOTION_CATEGORIES.ANGER },
  { code: 'FEELING_INVALIDATED', label_ko: '무시당한 느낌', label_en: 'Feeling Invalidated', category: EMOTION_CATEGORIES.ANGER },
  { code: 'ANGER_AT_INEFFICIENCY', label_ko: '비효율 분노', label_en: 'Anger at Inefficiency', category: EMOTION_CATEGORIES.ANGER },
  { code: 'LOSS_OF_CONTROL', label_ko: '통제 잃음', label_en: 'Loss of Control', category: EMOTION_CATEGORIES.ANGER },

  // 슬픔/우울
  { code: 'HURT_FEELINGS', label_ko: '서운함', label_en: 'Hurt Feelings', category: EMOTION_CATEGORIES.SADNESS },
  { code: 'DISAPPOINTMENT', label_ko: '실망', label_en: 'Disappointment', category: EMOTION_CATEGORIES.SADNESS },
  { code: 'LONELINESS', label_ko: '외로움', label_en: 'Loneliness', category: EMOTION_CATEGORIES.SADNESS },
  { code: 'SENSE_OF_LOSS', label_ko: '상실감', label_en: 'Sense of Loss', category: EMOTION_CATEGORIES.SADNESS },
  { code: 'SADNESS', label_ko: '슬픔', label_en: 'Sadness', category: EMOTION_CATEGORIES.SADNESS },
  { code: 'EMPTINESS', label_ko: '공허함', label_en: 'Emptiness', category: EMOTION_CATEGORIES.SADNESS },
  { code: 'MEANINGLESSNESS', label_ko: '의미 상실', label_en: 'Meaninglessness', category: EMOTION_CATEGORIES.SADNESS },

  // 혼란/판단 어려움
  { code: 'OVERTHINKING', label_ko: '생각 과부하', label_en: 'Overthinking', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'INDECISION', label_ko: '판단 보류', label_en: 'Indecision', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'ROLE_CONFUSION', label_ko: '역할 혼란', label_en: 'Role Confusion', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'VALUE_CONFLICT', label_ko: '가치관 충돌', label_en: 'Value Conflict', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'SHAKEN_BELIEF', label_ko: '신념 흔들림', label_en: 'Shaken Belief', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'LOST_SENSE_OF_DIRECTION', label_ko: '방향 상실', label_en: 'Lost Sense of Direction', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'TOO_MANY_OPTIONS', label_ko: '선택지 과다', label_en: 'Too Many Options', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'NO_CLEAR_ANSWER', label_ko: '해답 없음', label_en: 'No Clear Answer', category: EMOTION_CATEGORIES.CONFUSION },
  { code: 'DIRECTION_UNCERTAINTY', label_ko: '방향성 혼란', label_en: 'Direction Uncertainty', category: EMOTION_CATEGORIES.CONFUSION },

  // 성찰/마음정리
  { code: 'REFLECTION', label_ko: '반성', label_en: 'Reflection', category: EMOTION_CATEGORIES.REFLECTION },
  { code: 'MENTAL_CLARITY', label_ko: '정리됨', label_en: 'Mental Clarity', category: EMOTION_CATEGORIES.REFLECTION },
  { code: 'PERSPECTIVE_SHIFT', label_ko: '관점 변화', label_en: 'Perspective Shift', category: EMOTION_CATEGORIES.REFLECTION },
  { code: 'REALIZATION', label_ko: '깨달음', label_en: 'Realization', category: EMOTION_CATEGORIES.REFLECTION },
  { code: 'SELF_AWARENESS_INCREASE', label_ko: '자기이해 상승', label_en: 'Self-awareness Increase', category: EMOTION_CATEGORIES.REFLECTION },
  { code: 'SELF_COMPASSION', label_ko: '따뜻한 자기이해', label_en: 'Self-compassion', category: EMOTION_CATEGORIES.REFLECTION },
  { code: 'INSIGHT', label_ko: '새로운 통찰', label_en: 'Insight', category: EMOTION_CATEGORIES.REFLECTION },

  // 안정/평온
  { code: 'CALM', label_ko: '평온', label_en: 'Calm', category: EMOTION_CATEGORIES.CALM },
  { code: 'RELAXED', label_ko: '느긋함', label_en: 'Relaxed', category: EMOTION_CATEGORIES.CALM },
  { code: 'STABILITY', label_ko: '안정감', label_en: 'Stability', category: EMOTION_CATEGORIES.CALM },

  // 영감/상승
  { code: 'INSPIRATION', label_ko: '영감', label_en: 'Inspiration', category: EMOTION_CATEGORIES.INSPIRATION },
  { code: 'CREATIVE_DRIVE', label_ko: '창조적 동기', label_en: 'Creative Drive', category: EMOTION_CATEGORIES.INSPIRATION },
  { code: 'EXCITEMENT', label_ko: '설렘', label_en: 'Excitement', category: EMOTION_CATEGORIES.INSPIRATION },
  { code: 'FORWARD_ENERGY', label_ko: '앞으로 나아갈 힘', label_en: 'Forward Energy', category: EMOTION_CATEGORIES.INSPIRATION },
];

/**
 * 카테고리별로 감정 태그를 그룹화
 */
export const getEmotionsGroupedByCategory = () => {
  const grouped: Record<string, EmotionTag[]> = {};

  EMOTION_TAGS.forEach(emotion => {
    if (!grouped[emotion.category]) {
      grouped[emotion.category] = [];
    }
    grouped[emotion.category].push(emotion);
  });

  return grouped;
};

/**
 * 감정 코드로 감정 태그 찾기
 */
export const getEmotionByCode = (code: string): EmotionTag | undefined => {
  return EMOTION_TAGS.find(emotion => emotion.code === code);
};

/**
 * 카테고리로 감정 태그 목록 가져오기
 */
export const getEmotionsByCategory = (category: string): EmotionTag[] => {
  return EMOTION_TAGS.filter(emotion => emotion.category === category);
};
