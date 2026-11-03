"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Car,
  User,
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

export default function CustomerTestDrivesPage() {
  const [testDrives, setTestDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/test-drives/my'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTestDrives(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'No Show':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 customer-account-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            My TVS Test Ride Appointments
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review upcoming showroom viewings and scheduled TVS test ride appointments.
          </p>
        </div>

        <Link
          href="/book-test-drive"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Test Drive</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading your test drive appointments...</div>
      ) : testDrives.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No test drives booked yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Experience our premium vehicles on the road. Schedule a 30-minute private test drive at our Colombo showroom.
          </p>
          <Link
            href="/book-test-drive"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Test Drive</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {testDrives.map((drive) => {
            const vehicle = drive.vehicle;
            const staff = drive.salesperson;
            return (
              <div
                key={drive._id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      {vehicle
                        ? `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.variant || ''}`.trim()
                        : 'Showroom Vehicle'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        drive.status || 'Scheduled'
                      )}`}
                    >
                      {drive.status || 'Scheduled'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {drive.date ? new Date(drive.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending date'}
                      {drive.startTime ? ` at ${drive.startTime}` : ''}
                    </span>

                    {drive.drivingLicenseNo && (
                      <span className="text-slate-500">
                        License Reg: {drive.drivingLicenseNo}
                      </span>
                    )}
                  </div>

                  {staff && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      Assigned Relationship Manager: <span className="text-white font-medium">{staff.name || 'Sales Staff'}</span>
                      {staff.phone && ` (${staff.phone})`}
                    </p>
                  )}

                  {drive.feedback && (
                    <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <strong>Staff Feedback:</strong> {drive.feedback}
                    </div>
                  )}
                </div>

                {vehicle?._id && (
                  <Link
                    href={`/bikes/${vehicle._id}`}
                    className="self-start md:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-red-400 border border-slate-800 transition-colors whitespace-nowrap"
                  >
                    View Specs
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
