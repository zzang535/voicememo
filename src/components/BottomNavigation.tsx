'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: '🎤',
    label: '음성노트'
  },
  {
    href: '/notes',
    icon: '📝',
    label: '노트목록'
  },
  {
    href: '/settings',
    icon: '⚙️',
    label: '설정'
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200"
            >
              <div className={`text-2xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-400 scale-110'
                  : 'text-gray-400 hover:text-gray-200'
              }`}>
                {item.icon}
              </div>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}