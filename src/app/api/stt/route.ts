import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('audio') as File | null;

    if (!file) {
      return NextResponse.json({
        error: 'audio file missing'
      }, { status: 400 });
    }

    console.log('🎤 STT 요청 수신:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type;

    // TODO: 실제 STT 엔진 연결 (Whisper, OpenAI, Deepgram 등)
    // 현재는 데모용 응답
    const text = await mockSTTProcessing(buffer, mime);

    console.log('📝 STT 결과:', text);

    return NextResponse.json({
      text,
      partial: true // 부분 결과임을 표시
    });

  } catch (error) {
    console.error('❌ STT 처리 중 오류:', error);

    return NextResponse.json({
      error: 'STT processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 임시 STT 처리 함수 (실제 STT 엔진으로 교체 예정)
async function mockSTTProcessing(buffer: Buffer, _mimeType: string): Promise<string> {
  // 오디오 크기에 따른 모의 텍스트 생성
  const sizeKB = buffer.length / 1024;

  const mockTexts = [
    '안녕하세요',
    '음성 인식이 잘 되고 있습니다',
    '서버에서 처리 중입니다',
    '모바일에서도 정상 동작합니다',
    '텍스트가 실시간으로 업데이트됩니다'
  ];

  // 오디오 크기에 따라 다른 응답 (실제로는 STT 결과)
  const index = Math.floor(sizeKB / 10) % mockTexts.length;

  // 실제 STT 처리 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockTexts[index];
}

// 실제 OpenAI Whisper API 사용 예시 (주석 처리)
/*
async function processWithWhisper(buffer: Buffer, mimeType: string): Promise<string> {
  const formData = new FormData();

  // 오디오 형식에 따른 확장자 결정
  let extension = 'webm';
  if (mimeType.includes('mp4')) extension = 'mp4';
  else if (mimeType.includes('wav')) extension = 'wav';

  const audioBlob = new Blob([buffer], { type: mimeType });
  formData.append('file', audioBlob, `audio.${extension}`);
  formData.append('model', 'whisper-1');
  formData.append('language', 'ko');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Whisper API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.text || '';
}
*/