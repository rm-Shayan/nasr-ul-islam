// Sidebar.tsx
import {
  LayoutDashboard,
  BookOpenCheck,
  User2,
  ChevronDown,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom'; // ✅ Only NavLink needed now

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-30
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none
      `}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-green-700">نصر الإسلام</h2>
        <button className="md:hidden" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <nav className="p-4 space-y-2 bg-white md:border-l h-full md:border-green-600 md:shadow-[0_0_10px_2px_rgba(34,197,94,0.4)]">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-3 rounded-lg text-base hover:bg-green-100 transition ${
              isActive ? 'bg-green-50 font-semibold text-green-700' : ''
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* Prayer Section */}
        <details className="group">
          <summary className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-green-100 text-base cursor-pointer">
            <span className="flex items-center gap-2">
              <BookOpenCheck size={20} />
              Prayer
            </span>
            <ChevronDown
              size={18}
              className="transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="pl-10 mt-1 space-y-1 text-base">
            <NavLink
              to="/prayer"
              className={({ isActive }) =>
                `block px-2 py-2 rounded hover:bg-green-50 ${
                  isActive ? 'bg-green-100 font-semibold text-green-700' : ''
                }`
              }
            >
              Namaz Aukaat
            </NavLink>
          
            <NavLink
              to="/prayer/PrayerCards"
              className={({ isActive }) =>
                `block px-2 py-2 rounded hover:bg-green-50 ${
                  isActive ? 'bg-green-100 font-semibold text-green-700' : ''
                }`
              }
            >
              Tracker
            </NavLink>

            <NavLink
              to="/prayer/PrayerLedger"
              className={({ isActive }) =>
                `block px-2 py-2 rounded hover:bg-green-50 ${
                  isActive ? 'bg-green-100 font-semibold text-green-700' : ''
                }`
              }
            >
              Ledger
            </NavLink>

            <NavLink
              to="/prayer/PrayerHistory"
              className={({ isActive }) =>
                `block px-2 py-2 rounded hover:bg-green-50 ${
                  isActive ? 'bg-green-100 font-semibold text-green-700' : ''
                }`
              }
            >
              History
            </NavLink>

          
          </div>
        </details>

        {/* Profile Section */}
        <details className="group">
          <summary className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-green-100 text-base cursor-pointer">
            <span className="flex items-center gap-2">
              <User2 size={20} />
              Profile
            </span>
            <ChevronDown
              size={18}
              className="transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="pl-10 mt-1 space-y-1 text-base">
                 <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block px-2 py-2 rounded hover:bg-green-50 ${
                  isActive ? 'bg-green-100 font-semibold text-green-700' : ''
                }`
              }
            >
              Settings
            </NavLink>
          </div>
        </details>
      </nav>
    </aside>
  );
}
