import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({
        error: 'Content is required'
      }, { status: 400 });
    }

    console.log('🤖 OpenAI 분석 요청 수신:', { contentLength: content.length });

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY가 설정되지 않음 - 테스트 데이터 반환');

      // 테스트용 더미 데이터 반환
      return NextResponse.json({
        success: true,
        data: {
          thought: '(테스트) 이것은 자동생각 분석 결과입니다.',
          emotions: ['불안', '걱정', '스트레스'],
          core_needs: ['안정감', '인정', '소속감'],
          summary: '(테스트) 메모 내용의 요약입니다.'
        },
        test_mode: true
      });
    }

    // OpenAI API 호출
    const analysisResult = await analyzeWithOpenAI(content, apiKey);

    console.log('✅ OpenAI 분석 완료:', analysisResult);

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('❌ OpenAI 분석 중 오류:', error);

    return NextResponse.json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function analyzeWithOpenAI(content: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 심리 상담 전문가입니다. 사용자의 음성 메모를 분석하여 다음을 추출하세요:
1. thought (자동생각): 메모에서 드러나는 주요 생각이나 인지 패턴
2. emotions (감정들): 감정을 나타내는 단어 배열 (3-5개)
3. core_needs (핵심 욕구들): 근본적으로 원하는 것을 나타내는 단어 배열 (3-5개)
4. summary (요약): 메모 내용을 1-2문장으로 요약

반드시 JSON 형식으로만 응답하세요:
{
  "thought": "자동생각 내용",
  "emotions": ["감정1", "감정2", "감정3"],
  "core_needs": ["욕구1", "욕구2", "욕구3"],
  "summary": "요약 내용"
}`
        },
        {
          role: 'user',
          content: content
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);

  return {
    thought: result.thought || '',
    emotions: result.emotions || [],
    core_needs: result.core_needs || [],
    summary: result.summary || ''
  };
}
