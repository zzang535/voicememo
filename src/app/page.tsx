'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { getUserId } from '@/utils/userUtils';
import { getDisplayUserId } from '@/policies/userIdDisplayPolicy';
import { RECORDING_POLICY } from '@/config/recordingPolicy';
import { COLORS } from '@/constants/colors';
import { APP_NAME } from '@/constants/app';

interface MemoData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'completed' | 'failed';

export default function VoiceMemoPage() {
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [userId, setUserId] = useState<string>('');
  const [latestMemo, setLatestMemo] = useState<MemoData | null>(null);
  const [dotCount, setDotCount] = useState(1);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const dotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 모든 타이머 정리 함수
  const clearAllTimers = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setRemainingTime(null);
  };

  // 자동 정지 함수
  const autoStopRecording = async () => {
    console.log('⏰ 최대 녹음 시간 도달 - 자동 정지 실행');
    await stopRecording();
  };

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
  const saveMemo = async (
    content: string,
    analysis?: {
      thought?: string;
      emotions?: string[];
      core_needs?: string[];
      summary?: string;
    }
  ) => {
    if (!userId || !content.trim()) return;

    try {
      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          content: content.trim(),
          thought: analysis?.thought,
          emotions: analysis?.emotions,
          core_needs: analysis?.core_needs,
          summary: analysis?.summary
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

  // 개발용 샘플 데이터 삽입
  const insertSampleData = async () => {
    if (!userId) return;

    const confirmed = confirm('샘플 노트 데이터를 삽입하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/dev/insert-samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ ${result.message}`);
        await fetchMemos(userId);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error inserting sample data:', error);
      alert('❌ 샘플 데이터 삽입 중 오류가 발생했습니다.');
    }
  };


  // Initialize user ID and fetch data on component mount
  useEffect(() => {
    // 사용자 ID 초기화 (async 함수)
    const initializeUserId = async () => {
      const initUserId = await getUserId();
      setUserId(initUserId);
      console.log('사용자 ID 초기화:', initUserId);

      // 메모 목록 조회
      await fetchMemos(initUserId);
    };

    initializeUserId();
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

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      clearAllTimers();
      if (dotIntervalRef.current) {
        clearInterval(dotIntervalRef.current);
        dotIntervalRef.current = null;
      }
    };
  }, []);

  // Google Speech API로 오디오 업로드 및 텍스트 인식
  const uploadAudioChunk = async (audioBlob: Blob) => {
    try {
      console.log('📤 오디오 청크 업로드 시작:', { size: audioBlob.size, type: audioBlob.type });
      console.log('🔧 STT 모드:', RECORDING_POLICY.STT_MODE);

      let text: string;

      if (RECORDING_POLICY.STT_MODE === 'gcs') {
        // GCS 모드: GCS에 업로드 후 LongRunningRecognize 사용
        console.log('📤 GCS 업로드 중...');

        const formData = new FormData();
        formData.append('audio', audioBlob, `chunk.${audioBlob.type.includes('webm') ? 'webm' : 'mp4'}`);

        // 1단계: GCS 업로드
        const uploadResponse = await fetch('/api/upload-gcs', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error('❌ GCS 업로드 오류:', errorData);
          throw new Error(errorData.message || 'GCS 업로드 실패');
        }

        const uploadResult = await uploadResponse.json();
        console.log('✅ GCS 업로드 완료:', uploadResult.gcsUri);

        // 2단계: LongRunningRecognize 호출
        console.log('🎤 LongRunningRecognize 시작...');
        const sttResponse = await fetch('/api/stt-long', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gcsUri: uploadResult.gcsUri,
            mimeType: audioBlob.type
          })
        });

        if (!sttResponse.ok) {
          const errorData = await sttResponse.json();
          console.error('❌ LongRunningRecognize 오류:', {
            status: sttResponse.status,
            statusText: sttResponse.statusText,
            error: errorData.error,
            message: errorData.message,
            details: errorData.details,
            originalError: errorData.originalError
          });

          if (errorData.details) {
            console.error('📋 Google API 에러 상세:', errorData.details);
          }

          throw new Error(errorData.message || 'LongRunningRecognize 실패');
        }

        const sttResult = await sttResponse.json();
        console.log('📝 LongRunningRecognize 결과 수신:', sttResult);
        text = sttResult.text;

      } else {
        // Direct 모드: 직접 Speech API 호출
        console.log('🎤 Direct STT 모드');

        const formData = new FormData();
        formData.append('audio', audioBlob, `chunk.${audioBlob.type.includes('webm') ? 'webm' : 'mp4'}`);

        const response = await fetch('/api/stt', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ STT API 오류:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData.error,
            message: errorData.message,
            details: errorData.details,
            originalError: errorData.originalError
          });

          if (errorData.details) {
            console.error('📋 Google API 에러 상세:', errorData.details);
          }

          throw new Error(errorData.message || `STT API 오류: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📝 STT 결과 수신:', result);
        text = result.text;
      }

      // 결과 처리
      if (text && text.trim()) {
        console.log('📄 텍스트 변환 완료:', text.trim());

        // OpenAI 분석 처리
        console.log('🤖 OpenAI 분석 시작...');
        let analysisResult;

        try {
          const analysisResponse = await fetch('/api/analyze-memo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: text.trim()
            })
          });

          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            if (analysisData.success) {
              analysisResult = analysisData.data;
              console.log('✅ OpenAI 분석 완료:', analysisResult);
              if (analysisData.test_mode) {
                console.log('⚠️ 테스트 모드로 실행됨 (OPENAI_API_KEY 미설정)');
              }
            }
          } else {
            console.error('❌ OpenAI 분석 실패:', await analysisResponse.json());
          }
        } catch (error) {
          console.error('❌ OpenAI 분석 오류:', error);
          // 분석 실패해도 메모는 저장
        }

        // 즉시 저장 처리 (분석 결과 포함)
        console.log('💾 메모 자동 저장 시작...');
        await saveMemo(text.trim(), analysisResult);
        console.log('✅ 메모 저장 완료');

        // 완료 상태로 변경
        setRecordingStatus('completed');

        // 2초 후 초기 상태로 복구
        setTimeout(() => {
          setRecordingStatus('idle');
        }, 2000);
      } else {
        console.log('❌ STT 결과가 없음 - 실패 처리');

        // 실패 상태로 변경
        setRecordingStatus('failed');

        // 3초 후 초기 상태로 복구
        setTimeout(() => {
          setRecordingStatus('idle');
        }, 3000);
      }

    } catch (error) {
      console.error('❌ STT 업로드 오류:', error);

      // 실패 상태로 변경
      setRecordingStatus('failed');

      // 3초 후 초기 상태로 복구
      setTimeout(() => {
        setRecordingStatus('idle');
      }, 3000);
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
      console.log('✅ 녹음 시작 완료 - Google Speech API 모드');

      // 타이머 설정
      // 녹음 시작과 동시에 카운트다운 시작
      const maxSeconds = Math.floor(RECORDING_POLICY.MAX_RECORDING_DURATION / 1000);
      setRemainingTime(maxSeconds);
      console.log(`⏱️ ${maxSeconds}초 카운트다운 시작`);

      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // MAX_RECORDING_DURATION 후 자동 정지
      recordingTimerRef.current = setTimeout(() => {
        autoStopRecording();
      }, RECORDING_POLICY.MAX_RECORDING_DURATION);

    } catch (error) {
      console.error('❌ 녹음 시작 중 오류:', error);
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
  };

  const stopRecording = async () => {
    console.log('🛑 음성 녹음 중지 버튼 클릭...');

    // 즉시 처리 중 상태로 UI 변경
    setRecordingStatus('processing');

    // 모든 타이머 정리
    clearAllTimers();

    // STOP_DELAY 만큼 대기 (마지막 음성 캡처)
    console.log(`⏳ ${RECORDING_POLICY.STOP_DELAY}ms 대기 중 (마지막 음성 캡처)...`);
    await new Promise(resolve => setTimeout(resolve, RECORDING_POLICY.STOP_DELAY));

    // MediaRecorder 중지
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      console.log('✅ MediaRecorder 중지 완료');
    }

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
    <div className={`min-h-screen ${COLORS.PAGE_BG} text-white pb-20`}>
      <Header title={APP_NAME.KO} />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <p className="text-gray-400">목소리로 생각이나 순간을 기록하세요.</p>

          {/* User ID Display */}
          {userId && (
            <div className={`mt-6 inline-flex items-center gap-2 px-3 py-1 ${COLORS.BOX_BG} rounded-full`}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">
                사용자 ID: {getDisplayUserId(userId)}
              </span>
            </div>
          )}
        </div>

        {/* Recording Button */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
            disabled={recordingStatus === 'processing' || recordingStatus === 'completed' || recordingStatus === 'failed'}
            className={`w-40 h-40 rounded-full border-4 transition-all duration-200 ${recordingStatus === 'recording'
              ? 'bg-red-600 border-red-400 animate-pulse'
              : recordingStatus === 'processing'
                ? 'bg-yellow-600 border-yellow-400'
                : recordingStatus === 'completed'
                  ? 'bg-green-600 border-green-400'
                  : recordingStatus === 'failed'
                    ? 'bg-red-800 border-red-500'
                    : 'bg-blue-600 border-blue-400 hover:bg-blue-700'
              } ${(recordingStatus === 'processing' || recordingStatus === 'completed' || recordingStatus === 'failed') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-3">
                {recordingStatus === 'recording' ? '🎤' :
                  recordingStatus === 'processing' ? '⏳' :
                    recordingStatus === 'completed' ? '✅' :
                      recordingStatus === 'failed' ? '❌' : '🎤'}
              </div>
              <div className="text-sm font-semibold">
                {recordingStatus === 'recording' && remainingTime !== null ? (
                  <span className={`tabular-nums ${remainingTime <= RECORDING_POLICY.DANGER_THRESHOLD
                    ? 'text-red-200'
                    : remainingTime <= RECORDING_POLICY.WARNING_THRESHOLD
                      ? 'text-yellow-200'
                      : 'text-green-200'
                    }`}>
                    {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                  </span>
                ) : recordingStatus === 'recording' ? '녹음 중...' :
                  recordingStatus === 'processing' ? `처리 중${'.'.repeat(dotCount)}` :
                    recordingStatus === 'completed' ? '완료!' :
                      recordingStatus === 'failed' ? '실패' : '녹음 시작'}
              </div>
            </div>
          </button>
        </div>

        {/* 최근 메모 박스 */}
        <div className={`${COLORS.BOX_BG} rounded-lg p-4 border ${COLORS.BORDER}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">최근 노트</h3>
            {latestMemo && (
              <span className="text-xs text-gray-500">
                {new Date(latestMemo.created_at).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
          <div className="text-sm leading-relaxed">
            {latestMemo ? (
              <span className="text-white">
                {latestMemo.content.length > 150
                  ? `${latestMemo.content.substring(0, 150)}...`
                  : latestMemo.content}
              </span>
            ) : (
              <span className="text-gray-500 italic">
                작성된 노트가 없습니다
              </span>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* 개발 환경 전용 샘플 데이터 삽입 버튼 */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={insertSampleData}
          className="fixed bottom-24 right-4 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
          title="샘플 데이터 삽입"
        >
          <span className="text-2xl">📝</span>
        </button>
      )}
    </div>
  );
}
