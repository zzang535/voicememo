'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'red' | 'blue';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  confirmButtonColor = 'blue'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmColorClass = confirmButtonColor === 'red'
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
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

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 ${confirmColorClass} text-white rounded-lg transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
