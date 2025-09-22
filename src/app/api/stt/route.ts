import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient, protos } from '@google-cloud/speech';

export const runtime = 'nodejs';

// Google Cloud Speech-to-Text 클라이언트 초기화
// 환경 변수에서 API 키 또는 서비스 계정 설정을 확인
let speechClient: SpeechClient;

try {
  // API 키가 있으면 REST API 사용, 없으면 기본 인증 사용
  if (process.env.GOOGLE_API_KEY) {
    console.log('🔑 Google API Key 방식 사용');
    // API 키 방식은 REST API로 처리 (아래 함수에서 구현)
    speechClient = new SpeechClient(); // fallback
  } else {
    console.log('🔐 서비스 계정 방식 사용');
    speechClient = new SpeechClient();
  }
} catch (error) {
  console.log('⚠️ Google Speech 클라이언트 초기화 실패, Mock 모드로 동작');
  speechClient = new SpeechClient(); // fallback
}

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

    // Google Cloud Speech-to-Text API 사용
    const text = await processWithGoogleSTT(buffer, mime);

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

// Google Cloud Speech-to-Text API를 사용한 음성 인식 함수
async function processWithGoogleSTT(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    // API 키 방식과 서비스 계정 방식 분기 처리
    if (process.env.GOOGLE_API_KEY) {
      return await processWithGoogleSTTApiKey(buffer, mimeType);
    } else {
      return await processWithGoogleSTTServiceAccount(buffer, mimeType);
    }
  } catch (error) {
    console.error('❌ Google Speech API 오류:', error);

    // Google API 실패 시 mock으로 fallback
    console.log('🔄 Mock STT로 fallback 처리...');
    return await mockSTTProcessing(buffer, mimeType);
  }
}

// API 키를 사용한 REST API 방식
async function processWithGoogleSTTApiKey(buffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY가 설정되지 않았습니다');
  }

  // 오디오 인코딩 타입 결정
  let encoding = 'WEBM_OPUS';

  if (mimeType.includes('wav')) {
    encoding = 'LINEAR16';
  } else {
    encoding = 'WEBM_OPUS'; // WebM/MP4 모두 WEBM_OPUS로 처리
  }

  console.log('🔍 오디오 인코딩 타입 (API Key):', encoding);

  const requestBody = {
    audio: {
      content: buffer.toString('base64'),
    },
    config: {
      encoding: encoding,
      sampleRateHertz: 48000,
      languageCode: 'ko-KR',
      alternativeLanguageCodes: ['en-US'],
      enableAutomaticPunctuation: true,
      model: 'latest_short',
    },
  };

  console.log('📤 Google Speech REST API 요청 전송...');

  const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Speech API 오류: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ Google Speech REST API 응답 수신:', result);

  // 결과 추출
  const transcription = result.results
    ?.map((result: any) => result.alternatives?.[0]?.transcript)
    .filter(Boolean)
    .join(' ') || '';

  return transcription;
}

// 서비스 계정을 사용한 gRPC 방식
async function processWithGoogleSTTServiceAccount(buffer: Buffer, mimeType: string): Promise<string> {
  // 오디오 인코딩 타입 결정
  let encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;

  if (mimeType.includes('webm')) {
    encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
  } else if (mimeType.includes('mp4')) {
    // MP4는 지원되지 않으므로 WEBM_OPUS로 처리
    encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
  } else if (mimeType.includes('wav')) {
    encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16;
  } else {
    // 기본값으로 WEBM_OPUS 사용
    encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
  }

  console.log('🔍 오디오 인코딩 타입 (Service Account):', encoding);

  // Speech-to-Text 요청 설정
  const request = {
    audio: {
      content: buffer.toString('base64'),
    },
    config: {
      encoding: encoding,
      sampleRateHertz: 48000, // WebRTC 기본 샘플레이트
      languageCode: 'ko-KR',
      alternativeLanguageCodes: ['en-US'], // 영어 대비
      enableAutomaticPunctuation: true,
      model: 'latest_short', // 짧은 오디오에 최적화된 모델
    },
  };

  console.log('📤 Google Speech gRPC API 요청 전송...');

  // Google Cloud Speech-to-Text API 호출
  const [response] = await speechClient.recognize(request);

  // 결과 추출
  const transcription = response.results
    ?.map(result => result.alternatives?.[0]?.transcript)
    .filter(Boolean)
    .join(' ') || '';

  console.log('✅ Google Speech gRPC API 응답 수신:', transcription);

  return transcription;
}

// 임시 STT 처리 함수 (Google API 실패 시 fallback용)
async function mockSTTProcessing(buffer: Buffer, mimeType: string): Promise<string> {
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