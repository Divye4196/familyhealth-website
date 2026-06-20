'use client';

import { useAuth } from '@/lib/auth-context';

export default function Topbar() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="bg-[#0C447C] px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[#E6F1FB] text-sm font-medium">
        <svg width="22" height="22" viewBox="0 0 52 52">
          <path d="M26 46 C26 46 6 34 6 20 C6 13 11 8 18 8 C21.5 8 24.5 9.5 26 12 C27.5 9.5 30.5 8 34 8 C41 8 46 13 46 20 C46 34 26 46 26 46Z" fill="#fff"/>
          <path d="M12 26 Q15 19 19 22 L22 29 L24 21 L27 26 L40 26" stroke="#0C447C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        FamilyHealth+
      </div>
      <div className="flex items-center gap-3">
        <button className="text-[#85B7EB] text-lg">🔔</button>
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center text-[#E1F5EE] text-xs font-medium cursor-pointer">
            {initials}
          </div>
          <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-40 hidden group-hover:block z-50">
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">{user?.email}</div>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}