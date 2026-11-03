"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  LogOut,
  UserCheck,
  Calendar,
  FileQuestion,
  Heart,
  Settings,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  customerId?: string;
  avatar?: string;
}

export function CustomerAuthMenu() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const stored = localStorage.getItem('user');
      if (token && stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    const handleAuthEvent = () => checkAuth();
    window.addEventListener('storage', handleAuthEvent);
    window.addEventListener('user-profile-updated', handleAuthEvent);
    return () => {
      window.removeEventListener('storage', handleAuthEvent);
      window.removeEventListener('user-profile-updated', handleAuthEvent);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOpen(false);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const isCustomer = user?.role === 'Customer' || (!user?.role?.toLowerCase().includes('admin') && !user?.role?.toLowerCase().includes('sales') && !user?.role?.toLowerCase().includes('finance') && !user?.role?.toLowerCase().includes('inventory'));
  const isStaff = user && !isCustomer;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors group focus:outline-none"
        aria-label="User account menu"
      >
        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden border border-amber-400">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden xl:block text-left">
          <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[110px]">
            {user.name || 'My Account'}
          </p>
          <p className="text-[10px] text-amber-400 truncate max-w-[110px]">
            {user.role || 'Member'}
          </p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-950 border border-slate-800 shadow-xl py-2 z-50 text-xs">
          <div className="px-4 py-2 border-b border-slate-850">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              VSMS Dashboard
            </Link>

            <Link
              href="/account/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <UserCheck className="w-4 h-4 text-slate-400" />
              Personal Profile
            </Link>

            <Link
              href="/account/inquiries"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <FileQuestion className="w-4 h-4 text-slate-400" />
              My Inquiries
            </Link>

            <Link
              href="/account/test-drives"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              My Test Rides
            </Link>

            <Link
              href="/account/saved-vehicles"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              Saved Motorcycles
            </Link>
          </div>

          <div className="pt-1 border-t border-slate-850">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
