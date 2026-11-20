import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { User } from 'firebase/auth';
import { GoogleMark } from './GoogleMark';

interface HeaderProps {
  user: User | null;
  bookingsCount: number;
  authBusy: boolean;
  onSignIn: () => void;
  onOpenPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  bookingsCount,
  authBusy,
  onSignIn,
  onOpenPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Member';
  const initials = firstName.slice(0, 2).toUpperCase();
  const signedInLabel =
    bookingsCount > 0 ? `${firstName} (${bookingsCount})` : `${firstName} Portal`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#3B82F6]/20 bg-[#04060A]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-6 py-4 lg:px-10">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-sm"
        >
          CloudCrest Stayz
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#CBD5E1]"
        >
          <a
            href="#sanctuaries"
            className="relative py-1 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#3B82F6] hover:after:w-full after:transition-all"
          >
            Sanctuaries
          </a>
          <a
            href="#mussoorie"
            className="relative py-1 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#3B82F6] hover:after:w-full after:transition-all"
          >
            Mussoorie
          </a>
          <a
            href="#experiences"
            className="relative py-1 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#3B82F6] hover:after:w-full after:transition-all"
          >
            Experiences
          </a>
          <a
            href="#chronicles"
            className="relative py-1 hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#3B82F6] hover:after:w-full after:transition-all"
          >
            Chronicles
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onOpenPortal}
              className="hidden sm:inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
            >
              {user.photoURL && !avatarFailed ? (
                <img
                  src={user.photoURL}
                  alt={firstName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="h-5 w-5 rounded-full object-cover border border-white/30"
                />
              ) : (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#090F1C] text-[10px] font-bold text-[#93C5FD]">
                  {initials}
                </span>
              )}
              <span>{signedInLabel}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={authBusy}
              onClick={onSignIn}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <GoogleMark className="h-3.5 w-3.5" />
              </span>
              <span>{authBusy ? 'Signing In...' : 'Sign in with Google'}</span>
            </button>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 text-[#F8FAFC] border border-[#3B82F6]/30 rounded-md hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3B82F6]/15 bg-[#04060A] px-6 py-4 space-y-3">
          <nav className="flex flex-col gap-3 text-sm font-medium text-[#CBD5E1]">
            <a
              href="#sanctuaries"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#60A5FA]"
            >
              Sanctuaries
            </a>
            <a
              href="#mussoorie"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#60A5FA]"
            >
              Mussoorie
            </a>
            <a
              href="#experiences"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#60A5FA]"
            >
              Experiences
            </a>
            <a
              href="#chronicles"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#60A5FA]"
            >
              Chronicles
            </a>
          </nav>

          {user ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              {signedInLabel}
            </button>
          ) : (
            <button
              type="button"
              disabled={authBusy}
              onClick={() => {
                setMobileMenuOpen(false);
                onSignIn();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <GoogleMark className="h-3.5 w-3.5" />
              </span>
              <span>{authBusy ? 'Signing In...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
