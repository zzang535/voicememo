'use client';

import { useState } from 'react';
import Navigation from './Navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDisconnect?: boolean;
  onDisconnect?: () => void;
}

export default function Header({ title, subtitle, showDisconnect = false, onDisconnect }: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <>
      <Navigation isOpen={isNavOpen} onClose={closeNav} />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center px-3 py-3 min-h-[60px]">
          {/* Left side - hamburger button */}
          <div className="w-12 flex-shrink-0 flex items-center">
            <button
              onClick={toggleNav}
              className="w-10 h-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className="h-0.5 bg-gray-600" />
                <div className="h-0.5 bg-gray-600" />
                <div className="h-0.5 bg-gray-600" />
              </div>
            </button>
          </div>

          {/* Middle - Title or connection info */}
          <div className="flex-1 flex items-center justify-center min-w-0 px-2">
            {subtitle ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-white text-sm font-mono truncate">
                  {subtitle}
                </span>
              </div>
            ) : (
              <h1 className="text-white text-lg font-semibold">{title}</h1>
            )}
          </div>

          {/* Right side - Disconnect button with same width as left side */}
          <div className="w-12 flex justify-end flex-shrink-0">
            {showDisconnect && onDisconnect ? (
              <button
                onClick={onDisconnect}
                className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                title="Disconnect"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <div className="w-10 h-10"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}