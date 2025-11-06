'use client';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function AlertModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  onConfirm
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onConfirm}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
        {title && (
          <h3 className="text-lg font-semibold text-white mb-3">
            {title}
          </h3>
        )}
        <p className={`text-gray-300 text-sm mb-6 leading-relaxed ${!title ? 'text-center' : ''}`}>
          {message}
        </p>

        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
