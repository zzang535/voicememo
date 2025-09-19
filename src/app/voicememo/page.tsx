'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { getUserId, getShortUserId } from '@/utils/userUtils';

interface MemoData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function VoiceMemoPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [memos, setMemos] = useState<MemoData[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isLoadingMemos, setIsLoadingMemos] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<{
    userAgent: string;
    speechSupport: boolean;
    mediaDevicesSupport: boolean;
    isMobile: boolean;
  } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<unknown>(null);

  // 메모 목록 조회 함수
  const fetchMemos = async (userIdParam: string) => {
    try {
      const response = await fetch(`/api/memo?userId=${encodeURIComponent(userIdParam)}`);
      const result = await response.json();

      if (result.success) {
        setMemos(result.data);
      } else {
        console.error('Failed to fetch memos:', result.message);
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
    } finally {
      setIsLoadingMemos(false);
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
        // 메모 목록 새로고침
        await fetchMemos(userId);
      } else {
        console.error('Failed to save memo:', result.message);
      }
    } catch (error) {
      console.error('Error saving memo:', error);
    }
  };

  // 메모 삭제 함수
  const deleteMemo = async (memoId: number) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/memo?id=${memoId}&userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        console.log('메모 삭제 성공');
        // 메모 목록 새로고침
        await fetchMemos(userId);
      } else {
        console.error('Failed to delete memo:', result.message);
      }
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };

  // Initialize user ID and fetch data on component mount
  useEffect(() => {
    // 사용자 ID 초기화
    const initUserId = getUserId();
    setUserId(initUserId);
    console.log('사용자 ID 초기화:', initUserId);

    // 디버그 정보 설정
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const speechSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const mediaDevicesSupport = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

    setDebugInfo({
      userAgent: navigator.userAgent,
      speechSupport,
      mediaDevicesSupport,
      isMobile
    });

    console.log('🔍 디버그 정보:', {
      isMobile,
      speechSupport,
      mediaDevicesSupport,
      userAgent: navigator.userAgent
    });

    // 메모 목록 조회
    fetchMemos(initUserId);
  }, []);

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

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Web Speech API 지원 확인 및 초기화
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('✅ Web Speech API 지원됨');

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';
        recognition.maxAlternatives = 1;

        // 모바일 환경을 위한 추가 설정
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          console.log('📱 모바일 환경 감지 - Speech Recognition 설정 조정');
          recognition.continuous = false; // 모바일에서는 continuous false가 더 안정적
          recognition.interimResults = false; // 모바일에서는 interim results 비활성화
        }

        recognition.onstart = () => {
          console.log('🎤 Speech Recognition 시작됨');
        };

        recognition.onresult = (event: any) => {
          console.log('📝 음성 인식 결과 수신:', event);
          let transcript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              transcript += result[0].transcript;
            }
          }

          const currentText = finalTranscript || transcript;
          console.log('📝 인식된 텍스트:', currentText);
          setCurrentTranscript(currentText);
        };

        recognition.onerror = (event: any) => {
          console.error('❌ Speech Recognition 오류:', event.error);
          console.error('오류 세부사항:', event);

          // 오류 타입별 처리
          if (event.error === 'no-speech') {
            console.log('⚠️ 음성이 감지되지 않음');
          } else if (event.error === 'audio-capture') {
            console.log('❌ 오디오 캡처 실패');
            alert('마이크 접근에 문제가 있습니다.');
          } else if (event.error === 'not-allowed') {
            console.log('❌ 마이크 권한 거부됨');
            alert('마이크 권한을 허용해주세요.');
          }
        };

        recognition.onend = () => {
          console.log('🛑 Speech Recognition 종료됨');

          // 모바일에서는 자동으로 재시작
          if (isRecording && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            console.log('📱 모바일 환경에서 Speech Recognition 재시작');
            setTimeout(() => {
              if (isRecording && recognitionRef.current) {
                try {
                  (recognitionRef.current as any).start();
                } catch (error) {
                  console.log('재시작 중 오류:', error);
                }
              }
            }, 100);
          }
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
          console.log('🎤 Speech Recognition 시작 명령 실행');
        } catch (speechError) {
          console.error('❌ Speech Recognition 시작 실패:', speechError);
        }
      } else {
        console.log('❌ Web Speech API가 지원되지 않는 브라우저');
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      }

      mediaRecorder.start();
      setIsRecording(true);
      setCurrentTranscript('');
      console.log('✅ 녹음 시작 완료');

    } catch (error) {
      console.error('❌ 녹음 시작 중 오류:', error);
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
  };

  const stopRecording = async () => {
    console.log('🛑 음성 녹음 중지 시작...');

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      console.log('✅ MediaRecorder 중지 완료');
    }

    if (recognitionRef.current) {
      (recognitionRef.current as any).stop();
      console.log('✅ Speech Recognition 중지 완료');
    }

    setIsRecording(false);
    console.log('📝 현재 인식된 텍스트:', currentTranscript);

    // 음성 인식 결과를 데이터베이스에 저장
    if (currentTranscript.trim()) {
      console.log('💾 메모 저장 시작...');
      await saveMemo(currentTranscript.trim());
      console.log('✅ 메모 저장 완료');
    } else {
      console.log('⚠️ 저장할 텍스트가 없습니다');
    }

    setCurrentTranscript('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header title="Voice Memo" />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">음성 메모</h1>
          <p className="text-gray-400">버튼을 눌러 음성을 녹음하고 텍스트로 변환하세요</p>

          {/* User ID Display */}
          {userId && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">
                사용자 ID: {getShortUserId(userId)}
              </span>
            </div>
          )}
        </div>

        {/* Debug Information for Mobile Testing */}
        {debugInfo && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2 text-yellow-400">🔍 디버그 정보</h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div>
                <span className="text-gray-500">환경:</span> {debugInfo.isMobile ? '📱 모바일' : '💻 데스크톱'}
              </div>
              <div>
                <span className="text-gray-500">Speech API:</span>
                <span className={debugInfo.speechSupport ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.speechSupport ? ' ✅ 지원됨' : ' ❌ 지원되지 않음'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">MediaDevices:</span>
                <span className={debugInfo.mediaDevicesSupport ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.mediaDevicesSupport ? ' ✅ 지원됨' : ' ❌ 지원되지 않음'}
                </span>
              </div>
              <div className="text-gray-500 text-xs truncate">
                브라우저: {debugInfo.userAgent.split(' ').slice(-2).join(' ')}
              </div>
            </div>
          </div>
        )}

        {/* Recording Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-32 h-32 rounded-full border-4 transition-all duration-200 ${
              isRecording
                ? 'bg-red-600 border-red-400 animate-pulse'
                : 'bg-blue-600 border-blue-400 hover:bg-blue-700'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🎤</div>
              <div className="text-sm font-semibold">
                {isRecording ? '중지' : '녹음'}
              </div>
            </div>
          </button>
        </div>

        {/* Current Recording Status */}
        {isRecording && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-red-400">🔴 녹음 중...</h3>
            <div className="bg-gray-900 rounded p-3 min-h-[80px]">
              <p className="text-gray-300">
                {currentTranscript || '음성을 인식하고 있습니다...'}
              </p>
            </div>
          </div>
        )}

        {/* Saved Memos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            저장된 메모 ({memos.length})
          </h2>

          {isLoadingMemos ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : memos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p>아직 저장된 메모가 없습니다.</p>
              <p className="text-sm">위의 녹음 버튼을 눌러 첫 번째 메모를 만들어보세요!</p>
            </div>
          ) : (
            memos.map((memo) => (
              <div key={memo.id} className="bg-gray-800 rounded-lg p-4 relative group">
                <button
                  onClick={() => deleteMemo(memo.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-sm"
                  title="메모 삭제"
                >
                  ✕
                </button>
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 mt-1">📝</div>
                  <div className="flex-1 pr-8">
                    <div className="text-xs text-gray-500 mb-1">
                      메모 #{memo.id} • {new Date(memo.created_at).toLocaleString('ko-KR')}
                    </div>
                    <p className="text-white leading-relaxed">{memo.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}