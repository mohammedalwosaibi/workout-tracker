'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { cn, getDayOfWeek } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(() => [
    { href: '/', label: 'Dashboard', icon: '⌂' },
    { href: `/day/${getDayOfWeek()}`, label: 'Today', icon: '💪', matchPrefix: '/day/' },
    { href: '/exercises', label: 'Exercises', icon: '📋' },
    { href: '/history', label: 'History', icon: '📊' },
  ], []);

  const isActive = (link: typeof navLinks[number]) => {
    if (link.matchPrefix) return pathname.startsWith(link.matchPrefix);
    return pathname === link.href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            IronLog
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive(link)
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-xl">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive(link)
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50',
                )}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
