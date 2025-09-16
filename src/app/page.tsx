'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [memos, setMemos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      setError('');
      return true;
    } catch (err: any) {
      setPermissionGranted(false);
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please click the 🔒 icon in your browser\'s address bar and allow microphone access.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Unable to access microphone. Please check your browser settings.');
      }
      return false;
    }
  };

  const startRecording = async () => {
    setError('');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (permissionGranted === null) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    } else if (permissionGranted === false) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscription('');
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscription(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);

      switch (event.error) {
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone permission and try again.');
          setPermissionGranted(false);
          break;
        case 'no-speech':
          setError('No speech detected. Please try speaking again.');
          break;
        case 'audio-capture':
          setError('Microphone not available. Please check your microphone connection.');
          break;
        case 'network':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      if (transcription.trim()) {
        setMemos(prev => [...prev, transcription.trim()]);
        setTranscription('');
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'granted') {
          setPermissionGranted(true);
        } else if (permission.state === 'denied') {
          setPermissionGranted(false);
          setError('Microphone access is blocked. Please enable microphone permission in your browser settings.');
        }
      } catch (error) {
        // Permissions API not supported, will check when user clicks record
      }
    };

    checkPermissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Memo</h1>
          <p className="text-gray-600">
            {permissionGranted === false
              ? "Enable microphone permission to start recording"
              : permissionGranted === null
              ? "Click record button to allow microphone access"
              : "Tap to record, speak your memo"
            }
          </p>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <div>
                    <p className="text-red-700 text-sm mb-2">{error}</p>
                    {permissionGranted === false && (
                      <div className="text-xs text-red-600">
                        <p className="mb-1">To enable microphone access:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Click the 🔒 or camera icon in your browser's address bar</li>
                          <li>Select "Allow" for microphone access</li>
                          <li>Refresh the page if needed</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={toggleRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-2xl font-semibold transition-all duration-300 transform ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse'
                : permissionGranted === null
                ? 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
                : permissionGranted === false
                ? 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            } shadow-lg hover:shadow-xl`}
          >
            {isRecording ? (
              <div className="flex flex-col items-center">
                <span className="text-lg">🎤</span>
                <span className="text-sm">Stop</span>
              </div>
            ) : permissionGranted === null ? (
              <div className="flex flex-col items-center">
                <span className="text-lg">🔒</span>
                <span className="text-sm">Allow</span>
              </div>
            ) : permissionGranted === false ? (
              <div className="flex flex-col items-center">
                <span className="text-lg">🔒</span>
                <span className="text-sm">Allow</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-lg">🎙️</span>
                <span className="text-sm">Record</span>
              </div>
            )}
          </button>

          {transcription && (
            <div className="w-full p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Recording:</h3>
              <p className="text-gray-800">{transcription}</p>
            </div>
          )}
        </div>

        {memos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Memos:</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {memos.map((memo, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">Memo #{index + 1}</span>
                    <button
                      onClick={() => setMemos(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-800">{memo}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}