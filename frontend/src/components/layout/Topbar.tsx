"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, LogOut, Menu, User, Globe, ChevronDown } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface TopbarProps {
  user: any;
  onToggleSidebar?: () => void;
}

export function Topbar({ user, onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Colombo Head Office');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!showNotifications) return;
    apiFetch('/notifications').then(async (response) => {
      if (response.ok) setNotifications(await response.json());
    }).catch(() => setNotifications([]));
  }, [showNotifications]);

  const markNotificationRead = async (notification: any) => {
    if (!notification.isRead) {
      const response = await apiFetch(`/notifications/${notification._id}/read`, { method: 'PATCH' });
      if (!response.ok) return;
      setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, isRead: true } : item));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-3 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-2 sm:gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Welcome Chip matching screenshot */}
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 text-xs font-medium">
          <span>Welcome,</span>
          <span className="font-bold text-blue-900 truncate max-w-[120px] md:max-w-none">{user?.name || 'Administrator'}</span>
        </div>

        {/* Branch Selector */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent font-medium border-none focus:outline-none cursor-pointer"
          >
            <option value="Colombo Head Office">Colombo Head Office</option>
            <option value="Kandy Branch">Kandy Branch</option>
            <option value="Kurunegala Branch">Kurunegala Branch</option>
            <option value="Galle Branch">Galle Branch</option>
          </select>
        </div>
      </div>

      {/* Global Search - Desktop */}
      <form onSubmit={handleGlobalSearch} className="flex-1 max-w-md mx-4 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Global search: Vehicle ID, Chassis, Customer, Reg #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 text-xs text-gray-800 placeholder-gray-400 pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </form>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center gap-2 z-30 lg:hidden">
          <form onSubmit={handleGlobalSearch} className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search vehicles, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 text-xs text-gray-800 pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </form>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xs text-gray-500 font-semibold px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button on Mobile */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Public Website Link */}
        <button
          onClick={() => window.open('/', '_blank')}
          className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.some((item) => !item.isRead) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50 text-xs">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-bold text-gray-800">Notifications</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">{notifications.filter((item) => !item.isRead).length} New</span>
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">{notifications.map((item) => <button key={item._id} onClick={() => markNotificationRead(item)} className={`block w-full rounded-lg p-2 text-left ${item.isRead ? 'bg-slate-50' : 'bg-blue-50'}`}><p className="font-medium text-slate-900">{item.title}</p><p className="text-[11px] text-slate-600">{item.message}</p><p className="mt-1 text-[10px] text-slate-400">{item.createdAt && new Date(item.createdAt).toLocaleString()}</p></button>)}{notifications.length === 0 && <p className="p-3 text-slate-500">No notifications.</p>}</div>
            </div>
          )}
        </div>

        {/* User Pill matching screenshot */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-800 truncate max-w-[100px] md:max-w-none">{user?.name || 'Saman Kumara'}</p>
            <p className="text-[10px] text-gray-500 font-medium">{user?.role || 'Administrator'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1 ml-1 sm:ml-2 p-2 sm:px-2.5 sm:py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
