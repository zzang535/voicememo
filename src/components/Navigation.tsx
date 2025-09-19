'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="text-xl font-bold text-white mb-8 mt-8">
            Voice Memo App
          </div>

          <nav className="space-y-4">
            <Link
              href="/voicememo"
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive('/voicememo')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              🎤 음성 녹음
            </Link>
            <Link
              href="/memos"
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive('/memos')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              📝 메모 목록
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}