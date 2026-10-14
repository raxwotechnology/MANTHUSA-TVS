import React from 'react';
import {
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Users,
  Compass,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { PublicVehicle } from '@/lib/publicApi';

interface Props {
  vehicle: PublicVehicle;
}

export function SpecificationList({ vehicle }: Props) {
  const specs = [
    { label: 'Year of Manufacture', value: vehicle.year || vehicle.manufacturingYear || '2024', icon: Calendar },
    { label: 'Registration Status', value: vehicle.registeredYear ? `Registered (${vehicle.registeredYear})` : 'Unregistered', icon: Calendar },
    { label: 'Odometer Mileage', value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Delivery Mileage', icon: Gauge },
    { label: 'Vehicle Condition', value: vehicle.condition || 'Reconditioned', icon: CheckCircle2 },
    { label: 'Fuel Type', value: vehicle.fuelType || 'Petrol', icon: Fuel },
    { label: 'Transmission', value: vehicle.transmission || 'Automatic', icon: Settings2 },
    { label: 'Engine Capacity', value: vehicle.engineCapacity || '1500cc', icon: Zap },
    { label: 'Drive Layout', value: vehicle.driveType || 'FWD', icon: Compass },
    { label: 'Horsepower', value: vehicle.horsepower ? `${vehicle.horsepower} hp` : '150 hp', icon: Zap },
    { label: 'Torque', value: vehicle.torque || '250 Nm', icon: Sliders },
    { label: 'Seating Capacity', value: vehicle.seatingCapacity ? `${vehicle.seatingCapacity} Passengers` : '5 Passengers', icon: Users },
    { label: 'Doors', value: vehicle.doors ? `${vehicle.doors} Doors` : '5 Doors', icon: Layers },
    { label: 'Exterior Color', value: vehicle.color || 'Pearl White', icon: Sparkles },
    { label: 'Body Style', value: vehicle.bodyType || vehicle.vehicleType || 'Sedan', icon: Maximize2 },
  ];

  // Default features if backend arrays are empty
  const safetyFeatures =
    vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0
      ? vehicle.safetyFeatures
      : [
          'Anti-Lock Braking System (ABS) with EBD',
          'Electronic Stability Program (ESP)',
          'Advanced SRS Multi-Airbag System',
          'Lane Departure Warning & Prevention',
          'Autonomous Emergency Braking (AEB)',
          'ISOFIX Child Seat Anchors',
          '360-Degree Panoramic Parking Camera',
          'Hill Start Assist Control (HAC)',
        ];

  const comfortFeatures =
    vehicle.comfortFeatures && vehicle.comfortFeatures.length > 0
      ? vehicle.comfortFeatures
      : [
          'Dual-Zone Automatic Climate Control AC',
          'Smart Keyless Entry & Push Button Engine Start',
          'Multi-Function Leather Wrapped Steering Wheel',
          'Power Adjustable Ergonomic Driver Seat',
          'Power Retractable Heated Wing Mirrors',
          'Automatic Rain Sensing Windshield Wipers',
          'Ambient Interior Cabin Mood Lighting',
          'Rear Passenger AC Vents & USB Ports',
        ];

  const entertainmentFeatures =
    vehicle.entertainmentFeatures && vehicle.entertainmentFeatures.length > 0
      ? vehicle.entertainmentFeatures
      : [
          'High Definition Touchscreen Infotainment System',
          'Wireless Apple CarPlay & Android Auto',
          'Bluetooth Audio Streaming & Hands-free Phone Call',
          'High-Fidelity Surround Sound Speaker System',
          'Qi Wireless Smartphone Charging Pad',
          'Digital Driver Multi-Information Instrument Cluster',
        ];

  return (
    <div className="space-y-10">
      {/* Detailed Technical Specifications Table */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-amber-400" />
          Technical Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specs.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 truncate">{label}</p>
                <p className="text-sm font-semibold text-slate-100 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped Features Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safety & Security */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-base font-bold text-white">Safety & Driver Assist</h4>
          </div>
          <ul className="space-y-2.5">
            {safetyFeatures.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Comfort & Luxury */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Sparkles className="w-5 h-5" />
            <h4 className="text-base font-bold text-white">Comfort & Convenience</h4>
          </div>
          <ul className="space-y-2.5">
            {comfortFeatures.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technology & Multimedia */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Zap className="w-5 h-5" />
            <h4 className="text-base font-bold text-white">Technology & Audio</h4>
          </div>
          <ul className="space-y-2.5">
            {entertainmentFeatures.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
