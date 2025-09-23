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
    href: '/voicememo',
    icon: '🎤',
    label: '음성메모'
  },
  {
    href: '/memos',
    icon: '📝',
    label: '메모목록'
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
              className={`flex flex-col items-center py-3 px-4 transition-colors duration-200 ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}