import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient, protos } from '@google-cloud/speech';

export const runtime = 'nodejs';

// Google Cloud Speech-to-Text 클라이언트 초기화
let speechClient: SpeechClient;

try {
  // 환경 변수에서 서비스 계정 JSON 파싱
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON 환경 변수가 설정되지 않았습니다.');
  }

  const credentials = JSON.parse(credentialsJson);

  speechClient = new SpeechClient({
    projectId: credentials.project_id,
    credentials: credentials,
  });

  console.log('✅ Google Speech 클라이언트 초기화 성공 (LongRunning)');
  console.log('🔑 프로젝트 ID:', credentials.project_id);
} catch (error) {
  console.error('❌ Google Speech 클라이언트 초기화 실패:', error);
  throw error;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gcsUri, mimeType } = body;

    if (!gcsUri) {
      return NextResponse.json({
        error: 'GCS URI missing'
      }, { status: 400 });
    }

    console.log('🎤 LongRunningRecognize 요청 수신:', {
      gcsUri,
      mimeType
    });

    // LongRunningRecognize로 텍스트 변환
    const text = await processWithLongRunningRecognize(gcsUri, mimeType);

    console.log('📝 LongRunningRecognize 결과:', text);

    return NextResponse.json({
      text,
      success: true
    });

  } catch (error) {
    console.error('❌ LongRunningRecognize 처리 중 오류:', error);

    // 에러 메시지 상세 정보 추출
    let errorMessage = 'Unknown error';
    let errorCode = 500;
    let errorDetails = null;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Google API 에러 메시지 파싱 시도
      try {
        const errorJson = JSON.parse(error.message);
        if (errorJson.error) {
          errorDetails = errorJson.error;
          errorMessage = errorJson.error.message || errorMessage;
          errorCode = errorJson.error.code || errorCode;
        }
      } catch {
        // JSON 파싱 실패 시 원본 메시지 사용
      }
    }

    return NextResponse.json({
      error: 'LongRunningRecognize failed',
      message: errorMessage,
      details: errorDetails,
      originalError: error instanceof Error ? error.message : String(error)
    }, { status: errorCode });
  }
}

// GCS URI를 사용한 LongRunningRecognize 처리
async function processWithLongRunningRecognize(gcsUri: string, mimeType: string): Promise<string> {
  try {
    // 오디오 인코딩 타입 결정
    let encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;

    if (mimeType.includes('webm')) {
      encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
    } else if (mimeType.includes('mp4')) {
      encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
    } else if (mimeType.includes('wav')) {
      encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16;
    } else {
      encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
    }

    console.log('🔍 오디오 인코딩 타입:', encoding);

    // LongRunningRecognize 요청 설정
    const request = {
      audio: {
        uri: gcsUri,
      },
      config: {
        encoding: encoding,
        sampleRateHertz: 48000,
        languageCode: 'ko-KR',
        alternativeLanguageCodes: ['en-US'],
        enableAutomaticPunctuation: true,
        model: 'latest_long', // 긴 오디오에 최적화된 모델
      },
    };

    console.log('📤 LongRunningRecognize API 요청 전송...');

    // LongRunningRecognize 호출 (비동기 작업 시작)
    const [operation] = await speechClient.longRunningRecognize(request);

    console.log('⏳ LongRunningRecognize 작업 진행 중...');

    // 작업 완료 대기
    const [response] = await operation.promise();

    console.log('✅ LongRunningRecognize 작업 완료');

    // 결과 추출
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join(' ') || '';

    console.log('✅ LongRunningRecognize 변환 완료:', transcription);

    return transcription;

  } catch (error) {
    console.error('❌ LongRunningRecognize 오류:', error);
    throw error;
  }
}
