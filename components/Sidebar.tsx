'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Family', href: '/dashboard/family', icon: '👨‍👩‍👧' },
  { name: 'Health', href: '/dashboard/health', icon: '📊' },
  { name: 'Medicines', href: '/dashboard/medicines', icon: '💊' },
  { name: 'Doctors', href: '/dashboard/doctors', icon: '🩺' },
  { name: 'Appointments', href: '/dashboard/appointments', icon: '📅' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📄' },
  { name: 'Emergency', href: '/dashboard/emergency', icon: '🚨' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[140px] bg-white border-r border-gray-200 py-4 flex-shrink-0 hidden md:block">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs transition ${
              isActive
                ? 'bg-[#E6F1FB] text-[#0C447C] font-medium border-l-2 border-[#0C447C]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}