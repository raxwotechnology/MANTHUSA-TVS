"use client";
import React from 'react';
import { PublicVehicle } from '@/lib/publicApi';
import {
  Zap,
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';

interface Props {
  vehicle: PublicVehicle;
}

export function SpecificationList({ vehicle }: Props) {
  const specs = [
    { label: 'Category', value: vehicle.category || 'Sport Motorcycles', icon: Compass },
    { label: 'Engine Capacity', value: vehicle.engineCapacity || '159.7 cc', icon: Zap },
    { label: 'Max Power', value: vehicle.maxPower || '17.55 PS @ 9250 rpm', icon: Activity },
    { label: 'Max Torque', value: vehicle.maxTorque || '14.73 Nm @ 7250 rpm', icon: Gauge },
    { label: 'Engine Type', value: vehicle.engineType || 'SI, 4 stroke, Oil cooled, SOHC, Fuel Injection', icon: Cpu },
    { label: 'Fuel System', value: vehicle.fuelSystem || 'RT-Fi (Race Tuned Fuel Injection)', icon: Fuel },
    { label: 'Cooling System', value: vehicle.coolingSystem || 'Oil Cooled with Ram-Air Assist', icon: Sparkles },
    { label: 'Transmission', value: vehicle.transmission || '5-Speed Manual with A&S Clutch', icon: Settings2 },
    { label: 'Starting System', value: vehicle.startingSystem || 'Electric Start', icon: Zap },
    { label: 'Braking Technology', value: vehicle.brakingSystem || 'Single Channel Super-Moto ABS', icon: ShieldCheck },
    { label: 'Front Brake', value: vehicle.frontBrake || '270mm Roto-Petal Disc', icon: ShieldCheck },
    { label: 'Rear Brake', value: vehicle.rearBrake || '200mm Roto-Petal Disc', icon: ShieldCheck },
    { label: 'Front Suspension', value: vehicle.frontSuspension || 'Telescopic Forks', icon: Layers },
    { label: 'Rear Suspension', value: vehicle.rearSuspension || 'Monoshock with Gas Assist', icon: Layers },
    { label: 'Fuel Tank Capacity', value: vehicle.fuelTankCapacity || '12 Liters', icon: Fuel },
    { label: 'Ground Clearance', value: vehicle.groundClearance || '180 mm', icon: Compass },
    { label: 'Seat Height', value: vehicle.seatHeight || '800 mm', icon: Compass },
    { label: 'Kerb Weight', value: vehicle.kerbWeight || '144 kg', icon: Gauge },
  ];

  const smartTech = vehicle.smartFeatures && vehicle.smartFeatures.length > 0
    ? vehicle.smartFeatures
    : [
        'TVS SmartXonnect Bluetooth Connectivity',
        'Turn-by-Turn Navigation on Instrument Cluster',
        'Call & SMS Alert Notification on Speedometer',
        'Race Telemetry & Lean Angle Indicator',
        'Multi-Ride Modes (Urban, Rain, Sport)',
        'Glide Through Technology (GTT) for Low Speed Crawling',
        'Full LED Headlamp with Signature TVS Claw DRL',
        'Gear Shift Assist Indicator & 0-60 Timer',
      ];

  const safetyAndBraking = [
    'Super-Moto ABS (Single / Dual Channel Anti-Lock Braking)',
    'Synchronized Braking Technology (SBT) on Drum Variants',
    'Roto-Petal Heat Dissipation Disc Rotors',
    'Tubeless Radial Racing Tyres with Superior Wet Grip',
    'Emergency Hazard Warning Flashers',
    'Engine Cut-Off on Side Stand Sensor',
  ];

  return (
    <div className="space-y-8">
      {/* 18-Point Technical Specs Grid */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Official Technical & Performance Specifications</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{item.label}</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SmartXonnect & Racing Technology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4" />
            <span>TVS SmartXonnect & Digital Features</span>
          </h4>
          <ul className="space-y-2">
            {smartTech.map((feat: string, i: number) => (
              <li key={i} className="text-xs flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Safety, Braking & Chassis Dynamics</span>
          </h4>
          <ul className="space-y-2">
            {safetyAndBraking.map((feat: string, i: number) => (
              <li key={i} className="text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
