import { NextRequest, NextResponse } from 'next/server';
import { MEMO_ANALYSIS_SYSTEM_PROMPT_V4 } from '@/constants/promptsV4';

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
          summary: '(테스트) 메모 내용의 요약입니다.',
          emotions: ['불안하다', '걱정된다'],
          reasoning: '(테스트) 메모 내용에서 불안과 걱정이 느껴지는 표현들이 발견되었습니다.'
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
          content: MEMO_ANALYSIS_SYSTEM_PROMPT_V4
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
    summary: result.summary || '',
    emotions: result.emotions || [],
    reasoning: result.reasoning || ''
  };
}
