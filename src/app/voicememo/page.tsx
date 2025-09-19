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

    // 메모 목록 조회
    fetchMemos(initUserId);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCurrentTranscript(transcript);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      mediaRecorder.start();
      setIsRecording(true);
      setCurrentTranscript('');

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (recognitionRef.current) {
      (recognitionRef.current as any).stop();
    }

    // 음성 인식 결과를 데이터베이스에 저장
    if (currentTranscript.trim()) {
      await saveMemo(currentTranscript.trim());
    }

    setIsRecording(false);
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