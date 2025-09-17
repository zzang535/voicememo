'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div
            className={`h-0.5 bg-gray-600 transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <div
            className={`h-0.5 bg-gray-600 transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <div
            className={`h-0.5 bg-gray-600 transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="text-xl font-bold text-gray-800 mb-8 mt-8">
            Voice Memo App
          </div>

          <nav className="space-y-4">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🎙️ Voice Memo
            </Link>

            <Link
              href="/terminal"
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive('/terminal')
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              💻 Terminal
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}