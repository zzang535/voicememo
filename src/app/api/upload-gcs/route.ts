import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { GCS_CONFIG } from '@/config/recordingPolicy';

export const runtime = 'nodejs';

// Google Cloud Storage 클라이언트 초기화
let storage: Storage;

try {
  storage = new Storage();
  console.log('✅ Google Cloud Storage 클라이언트 초기화 성공');
  console.log('📦 GCS 버킷:', GCS_CONFIG.BUCKET_NAME);
} catch (error) {
  console.error('❌ Google Cloud Storage 클라이언트 초기화 실패:', error);
  throw error;
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

    console.log('📤 GCS 업로드 요청 수신:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    // 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.type.includes('webm') ? 'webm' : 'mp4';
    const fileName = `${GCS_CONFIG.FILE_PATH_PREFIX}${timestamp}-${randomStr}.${extension}`;

    console.log('📁 GCS 파일명:', fileName);

    // GCS에 업로드
    const bucket = storage.bucket(GCS_CONFIG.BUCKET_NAME);
    const gcsFile = bucket.file(fileName);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedAt: new Date().toISOString(),
          retentionDays: GCS_CONFIG.RETENTION_DAYS.toString(),
        }
      }
    });

    console.log('✅ GCS 업로드 완료:', fileName);

    // GCS URI 반환
    const gcsUri = `gs://${GCS_CONFIG.BUCKET_NAME}/${fileName}`;

    return NextResponse.json({
      success: true,
      gcsUri,
      fileName,
      bucket: GCS_CONFIG.BUCKET_NAME
    });

  } catch (error) {
    console.error('❌ GCS 업로드 오류:', error);

    return NextResponse.json({
      error: 'GCS upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
