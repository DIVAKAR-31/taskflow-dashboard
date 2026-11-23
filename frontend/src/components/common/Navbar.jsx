import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, Shield, User, Bell } from 'lucide-react';
import Badge from './Badge';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">TaskFlow Core</span>
        </div>
      </div>

      {/* Right: Notifications, Role & User Avatar dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role indicator */}
        <div className="hidden md:flex items-center gap-1.5">
          {isAdmin ? (
            <Badge variant="admin" size="sm">
              <Shield className="w-3 h-3 mr-0.5 text-indigo-600" />
              Admin
            </Badge>
          ) : (
            <Badge variant="member" size="sm">
              <User className="w-3 h-3 mr-0.5 text-slate-500" />
              Member
            </Badge>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.name || 'User'
              )}`
            }
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[140px] mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          title="Sign out"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
