"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  Calendar,
  Heart,
  User,
  ArrowRight,
  ShieldCheck,
  Clock,
  Car,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';

export default function AccountOverviewPage() {
  const { count: favoritesCount } = useFavorites();
  const [profile, setProfile] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [testDrives, setTestDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    Promise.all([
      fetch(getApiUrl('/customers/me'), { headers }).then((res) => (res.ok ? res.json() : null)),
      fetch(getApiUrl('/leads/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
      fetch(getApiUrl('/test-drives/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([profData, leadsData, drivesData]) => {
        setProfile(profData);
        setInquiries(Array.isArray(leadsData) ? leadsData : []);
        setTestDrives(Array.isArray(drivesData) ? drivesData : []);
      })
      .catch((err) => console.error('Error fetching account data:', err))
      .finally(() => setLoading(false));
  }, []);

  const pendingDrives = testDrives.filter((d) => d.status === 'Scheduled');
  const activeInquiries = inquiries.filter((i) => i.status !== 'Won/Lost' && i.status !== 'Closed');

  return (
    <div className="space-y-6 customer-account-page">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/20 p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Customer
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              Welcome back, {profile?.fullName || 'Valued Client'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track vehicle inquiries, scheduled test drives, and customized leasing proposals in one place.
            </p>
          </div>

          <Link
            href="/vehicles"
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all"
          >
            <Car className="w-4 h-4" />
            <span>Explore Inventory</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/inquiries"
          className="bg-slate-900 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{inquiries.length}</span>
            <span className="text-[11px] text-amber-400 font-medium">({activeInquiries.length} active)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-slate-300">
            View inquiry history <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        <Link
          href="/account/test-drives"
          className="bg-slate-900 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Test Drive Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{testDrives.length}</span>
            <span className="text-[11px] text-emerald-400 font-medium">({pendingDrives.length} upcoming)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-slate-300">
            Manage reservations <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        <Link
          href="/account/saved-vehicles"
          className="bg-slate-900 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Saved Vehicles</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{favoritesCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">in wishlist</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-slate-300">
            Browse saved stock <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
      </div>

      {/* Two Column Section: Recent Inquiries & Upcoming Test Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-amber-400" />
              Recent Vehicle Inquiries
            </h3>
            <Link href="/account/inquiries" className="text-xs text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-500">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">No active inquiries submitted yet.</p>
              <Link
                href="/vehicles"
                className="mt-3 inline-block text-xs font-bold text-amber-400 hover:underline"
              >
                Browse showroom vehicles →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">
                      {item.interestedVehicle
                        ? `${item.interestedVehicle.year || ''} ${item.interestedVehicle.make || ''} ${item.interestedVehicle.model || ''}`.trim()
                        : item.inquiryType || 'General Inquiry'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.inquiryMessage || 'No specific notes'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                    {item.status || 'New'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Test Drives Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Scheduled Test Drives
            </h3>
            <Link href="/account/test-drives" className="text-xs text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-500">Loading bookings...</div>
          ) : testDrives.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">No test drives scheduled at this time.</p>
              <Link
                href="/book-test-drive"
                className="mt-3 inline-block text-xs font-bold text-amber-400 hover:underline"
              >
                Book a test drive today →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {testDrives.slice(0, 3).map((drive) => (
                <div
                  key={drive._id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">
                      {drive.vehicle
                        ? `${drive.vehicle.year || ''} ${drive.vehicle.make || ''} ${drive.vehicle.model || ''}`
                        : 'Showroom Vehicle'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {drive.date ? new Date(drive.date).toLocaleDateString() : 'Date pending'}{' '}
                      {drive.startTime ? `at ${drive.startTime}` : ''}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    {drive.status || 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
