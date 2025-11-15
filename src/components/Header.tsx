'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDisconnect?: boolean;
  onDisconnect?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ title, subtitle, showDisconnect = false, onDisconnect, showBackButton = false, onBackClick }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-center px-4 h-14 relative">
        {/* Back button (if needed) */}
        {showBackButton && onBackClick && (
          <button
            onClick={onBackClick}
            className="absolute left-4 w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
            title="뒤로가기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Title or connection info */}
        <div className="flex items-center justify-center">
          {subtitle ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-mono">
                {subtitle}
              </span>
            </div>
          ) : (
            <h1 className="text-white text-lg font-semibold">{title}</h1>
          )}
        </div>

        {/* Disconnect button (if needed) */}
        {showDisconnect && onDisconnect && (
          <button
            onClick={onDisconnect}
            className="absolute right-4 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
            title="Disconnect"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}