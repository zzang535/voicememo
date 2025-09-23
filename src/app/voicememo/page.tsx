'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { getUserId, getShortUserId } from '@/utils/userUtils';

interface MemoData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'completed';

export default function VoiceMemoPage() {
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [userId, setUserId] = useState<string>('');
  const [latestMemo, setLatestMemo] = useState<MemoData | null>(null);
  const [dotCount, setDotCount] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const dotIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 메모 목록 조회 함수
  const fetchMemos = async (userIdParam: string) => {
    try {
      const response = await fetch(`/api/memo?userId=${encodeURIComponent(userIdParam)}`);
      const result = await response.json();

      if (result.success) {
        // 최신 메모 설정 (첫 번째 메모가 최신)
        if (result.data && result.data.length > 0) {
          setLatestMemo(result.data[0]);
        }
      } else {
        console.error('Failed to fetch memos:', result.message);
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
    }
  };

  // 메모 저장 함수
  const saveMemo = async (content: string) => {
    if (!userId || !content.trim()) return;

    try {
      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          content: content.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('메모 저장 성공:', result.data);
        // 새로 저장된 메모를 최신 메모로 즉시 설정
        const newMemo = result.data;
        setLatestMemo(newMemo);
        // 메모 목록 새로고침
        await fetchMemos(userId);
      } else {
        console.error('Failed to save memo:', result.message);
      }
    } catch (error) {
      console.error('Error saving memo:', error);
    }
  };


  // Initialize user ID and fetch data on component mount
  useEffect(() => {
    // 사용자 ID 초기화
    const initUserId = getUserId();
    setUserId(initUserId);
    console.log('사용자 ID 초기화:', initUserId);


    // 메모 목록 조회
    fetchMemos(initUserId);
  }, []);

  // Dots 애니메이션 관리
  useEffect(() => {
    if (recordingStatus === 'processing') {
      dotIntervalRef.current = setInterval(() => {
        setDotCount(prev => prev === 3 ? 1 : prev + 1);
      }, 500);
    } else {
      if (dotIntervalRef.current) {
        clearInterval(dotIntervalRef.current);
        dotIntervalRef.current = null;
      }
      setDotCount(1);
    }

    return () => {
      if (dotIntervalRef.current) {
        clearInterval(dotIntervalRef.current);
        dotIntervalRef.current = null;
      }
    };
  }, [recordingStatus]);

  // Google Speech API로 오디오 업로드 및 텍스트 인식
  const uploadAudioChunk = async (audioBlob: Blob) => {
    try {
      console.log('📤 오디오 청크 업로드 시작:', { size: audioBlob.size, type: audioBlob.type });

      const formData = new FormData();
      formData.append('audio', audioBlob, `chunk.${audioBlob.type.includes('webm') ? 'webm' : 'mp4'}`);

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`STT API 오류: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📝 STT 결과 수신:', result);

      if (result.text) {
        console.log('📄 텍스트 변환 완료:', result.text.trim());

        // 즉시 저장 처리
        console.log('💾 메모 자동 저장 시작...');
        await saveMemo(result.text.trim());
        console.log('✅ 메모 저장 완료');

        // 완료 상태로 변경
        setRecordingStatus('completed');

        // 2초 후 초기 상태로 복구
        setTimeout(() => {
          setRecordingStatus('idle');
        }, 2000);
      }

    } catch (error) {
      console.error('❌ STT 업로드 오류:', error);
      setRecordingStatus('idle'); // 오류 시 초기 상태로 복구
    }
  };

  const startRecording = async () => {
    try {
      console.log('🎤 음성 녹음 시작 시도...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('✅ 마이크 스트림 획득 성공');

      // MediaRecorder mimeType 호환성 처리
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4'; // iOS Safari 대비
        }
      }
      console.log('📼 사용할 MIME 타입:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // 오디오 청크 초기화
      audioChunksRef.current = [];

      // MediaRecorder 이벤트 설정
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📦 오디오 청크 수집:', event.data.size, 'bytes');
        }
      };


      // 모든 환경에서 Google Speech API 사용
      console.log('🎤 Google Speech API 사용 모드');

      // MediaRecorder 시작 (1초 간격으로 dataavailable 이벤트 발생)
      mediaRecorder.start(1000);
      setRecordingStatus('recording');
      console.log('✅ 녹음 시작 완룼 - Google Speech API 모드');

    } catch (error) {
      console.error('❌ 녹음 시작 중 오류:', error);
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
  };

  const stopRecording = async () => {
    console.log('🛑 음성 녹음 중지 시작...');

    // MediaRecorder 중지
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      console.log('✅ MediaRecorder 중지 완료');
    }

    // 처리 중 상태로 변경
    setRecordingStatus('processing');

    // 녹음된 오디오 파일을 Google Speech API로 처리
    if (audioChunksRef.current.length > 0) {
      console.log('📤 녹음 완료 - Google Speech API로 텍스트 변환 시작...');

      const chunks = audioChunksRef.current.splice(0);
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(chunks, { type: mimeType });

      console.log('📤 오디오 파일 정보:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      if (audioBlob.size > 0) {
        try {
          // Google Speech API로 텍스트 변환 요청 (여기서 자동 저장도 처리됨)
          await uploadAudioChunk(audioBlob);
        } catch (error) {
          console.error('❌ 텍스트 변환 오류:', error);
          setRecordingStatus('idle'); // 오류 시 초기 상태로 복구
        }
      } else {
        setRecordingStatus('idle'); // 녹음 데이터가 없으면 초기 상태로
      }
    } else {
      setRecordingStatus('idle'); // 녹음 데이터가 없으면 초기 상태로
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header title="Voice Memo" />

      {/* Main Content - Centered Vertically */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-20">
        <div className="text-center px-4 max-w-md mx-auto">
          {/* Title Section */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-4">음성 메모</h1>
            <p className="text-gray-400">버튼을 눌러 음성을 녹음하고 텍스트로 변환하세요</p>

            {/* User ID Display */}
            {userId && (
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-300">
                  사용자 ID: {getShortUserId(userId)}
                </span>
              </div>
            )}
          </div>

          {/* Recording Button */}
          <div className="flex justify-center">
            <button
              onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
              disabled={recordingStatus === 'processing' || recordingStatus === 'completed'}
              className={`w-40 h-40 rounded-full border-4 transition-all duration-200 ${
                recordingStatus === 'recording'
                  ? 'bg-red-600 border-red-400 animate-pulse'
                  : recordingStatus === 'processing'
                  ? 'bg-yellow-600 border-yellow-400'
                  : recordingStatus === 'completed'
                  ? 'bg-green-600 border-green-400'
                  : 'bg-blue-600 border-blue-400 hover:bg-blue-700'
              } ${(recordingStatus === 'processing' || recordingStatus === 'completed') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-3">
                  {recordingStatus === 'recording' ? '🎤' :
                   recordingStatus === 'processing' ? '⏳' :
                   recordingStatus === 'completed' ? '✅' : '🎤'}
                </div>
                <div className="text-sm font-semibold">
                  {recordingStatus === 'recording' ? '녹음 중...' :
                   recordingStatus === 'processing' ? `처리 중${'.'.repeat(dotCount)}` :
                   recordingStatus === 'completed' ? '완료!' : '녹음 시작'}
                </div>
              </div>
            </button>
          </div>

          {/* 최근 메모 박스 */}
          {latestMemo && (
            <div className="mt-8 px-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-300">최근 메모</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(latestMemo.created_at).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="text-sm text-white leading-relaxed">
                  {latestMemo.content.length > 100
                    ? `${latestMemo.content.substring(0, 100)}...`
                    : latestMemo.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}