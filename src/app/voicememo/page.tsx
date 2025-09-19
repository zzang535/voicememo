'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react';
import Header from '@/components/Header';

export default function VoiceMemoPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [memos, setMemos] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<unknown>(null);

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

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (recognitionRef.current) {
      (recognitionRef.current as any).stop();
    }

    if (currentTranscript.trim()) {
      setMemos(prev => [...prev, currentTranscript.trim()]);
    }

    setIsRecording(false);
    setCurrentTranscript('');
  };

  const deleteMemo = (index: number) => {
    setMemos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header title="Voice Memo" />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">음성 메모</h1>
          <p className="text-gray-400">버튼을 눌러 음성을 녹음하고 텍스트로 변환하세요</p>
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

          {memos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p>아직 저장된 메모가 없습니다.</p>
              <p className="text-sm">위의 녹음 버튼을 눌러 첫 번째 메모를 만들어보세요!</p>
            </div>
          ) : (
            memos.map((memo, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 relative group">
                <button
                  onClick={() => deleteMemo(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-sm"
                  title="메모 삭제"
                >
                  ✕
                </button>
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 mt-1">📝</div>
                  <div className="flex-1 pr-8">
                    <div className="text-xs text-gray-500 mb-1">
                      메모 #{index + 1} • {new Date().toLocaleString('ko-KR')}
                    </div>
                    <p className="text-white leading-relaxed">{memo}</p>
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