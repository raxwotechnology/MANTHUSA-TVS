"use client";
import { apiFetch } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Camera, Upload, Paperclip } from 'lucide-react';

export default function NewVehiclePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    stockNumber: '',
    make: '',
    model: '',
    variant: '',
    manufacturingYear: '',
    registrationNumber: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: '',
    purchasePrice: '',
    transportCost: '',
    repairCost: '',
    detailingCost: '',
    sellingPrice: '',
    minimumSellingPrice: '',
    vehicleType: 'Car',
    status: 'Available',
    images: [''],
    mediaAngles: {
      front: '',
      rear: '',
      left: '',
      right: '',
      interior: '',
      dashboard: '',
      engine: '',
      wheels: '',
      damageText: '',
      documentsText: '',
      view360Url: '',
      videoUrl: '',
      youtubeUrl: ''
    }
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      mediaAngles: {
        ...formData.mediaAngles,
        [field]: value
      }
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSuccess(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultiFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentText: string,
    onSuccess: (combinedText: string) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve((ev.target?.result as string) || '');
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readPromises).then((newUrls) => {
      const existing = currentText.split(',').map((s) => s.trim()).filter(Boolean);
      const combined = [...existing, ...newUrls].join(', ');
      onSuccess(combined);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const damageArray = formData.mediaAngles.damageText.split(',').map(s => s.trim()).filter(Boolean);
    const docsArray = formData.mediaAngles.documentsText.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...formData,
      year: Number(formData.manufacturingYear),
      manufacturingYear: Number(formData.manufacturingYear),
      purchasePrice: Number(formData.purchasePrice || 0),
      transportCost: Number(formData.transportCost || 0),
      repairCost: Number(formData.repairCost || 0),
      detailingCost: Number(formData.detailingCost || 0),
      sellingPrice: Number(formData.sellingPrice || 0),
      minimumSellingPrice: Number(formData.minimumSellingPrice || 0),
      images: formData.images.filter(Boolean),
      mediaAngles: {
        front: formData.mediaAngles.front || undefined,
        rear: formData.mediaAngles.rear || undefined,
        left: formData.mediaAngles.left || undefined,
        right: formData.mediaAngles.right || undefined,
        interior: formData.mediaAngles.interior || undefined,
        dashboard: formData.mediaAngles.dashboard || undefined,
        engine: formData.mediaAngles.engine || undefined,
        wheels: formData.mediaAngles.wheels || undefined,
        damage: damageArray.length ? damageArray : undefined,
        documents: docsArray.length ? docsArray : undefined,
        view360Url: formData.mediaAngles.view360Url || undefined,
        videoUrl: formData.mediaAngles.videoUrl || undefined,
        youtubeUrl: formData.mediaAngles.youtubeUrl || undefined,
      }
    };

    try {
      const res = await apiFetch('/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        router.push('/dashboard/vehicles');
      } else {
        alert('Failed to add vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Add New Vehicle</h1>
          <p className="text-xs text-slate-500">Register new vehicle entry into showroom stock inventory</p>
        </div>
        <Link href="/dashboard/vehicles">
          <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-900">
          <div className="font-bold text-slate-900 border-b pb-1">1. Basic Vehicle Identification</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Number</label>
              <input required type="text" name="stockNumber" placeholder="e.g. STK-2026-001" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Make</label>
              <input required type="text" name="make" placeholder="e.g. Toyota" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model</label>
              <input required type="text" name="model" placeholder="e.g. Axio WxB" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
              <input required type="number" name="manufacturingYear" placeholder="e.g. 2024" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
          </div>

          {/* 5. Vehicle Images & Media Assets Specification */}
          <div className="border-t pt-3 font-bold text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>5. Vehicle Images & Multi-Angle Media Assets</span>
            </div>
            <span className="text-[11px] text-slate-500 font-normal">Paste URL or Click 📁 Upload File</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            {/* Main Cover Image */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Main Cover Image</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Paste Image URL or click Upload button →"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400"
                />
                <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shrink-0 text-xs shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setFormData({ ...formData, images: [url] }))}
                  />
                </label>
              </div>
              {formData.images[0] && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={formData.images[0]} alt="Preview" className="w-12 h-12 object-cover rounded border border-slate-300" />
                  <span className="text-[10px] text-emerald-700 font-semibold">✓ Main image uploaded/linked</span>
                </div>
              )}
            </div>

            {/* Exterior Multi-Angles */}
            <div className="font-semibold text-slate-700 pt-1">Exterior Multi-Angles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['front', 'Front Angle'],
                ['rear', 'Rear Angle'],
                ['left', 'Left Side'],
                ['right', 'Right Side'],
              ].map(([field, label]) => (
                <div key={field} className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder={`${label} URL`}
                    value={(formData.mediaAngles as any)[field] || ''}
                    onChange={(e) => handleMediaChange(field, e.target.value)}
                    className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                  />
                  <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-slate-300">
                    <Upload className="w-3 h-3 text-slate-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => handleMediaChange(field, url))}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Interior & Parts Angles */}
            <div className="font-semibold text-slate-700 pt-1">Interior & Parts Angles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['interior', 'Interior View'],
                ['dashboard', 'Dashboard View'],
                ['engine', 'Engine Bay'],
                ['wheels', 'Wheels View'],
              ].map(([field, label]) => (
                <div key={field} className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder={`${label} URL`}
                    value={(formData.mediaAngles as any)[field] || ''}
                    onChange={(e) => handleMediaChange(field, e.target.value)}
                    className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                  />
                  <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-slate-300">
                    <Upload className="w-3 h-3 text-slate-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => handleMediaChange(field, url))}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Damage & Documents Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Damage Photos (URLs or Upload)</label>
                <div className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="e.g. http://img1.jpg, http://img2.jpg"
                    value={formData.mediaAngles.damageText}
                    onChange={(e) => handleMediaChange('damageText', e.target.value)}
                    className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                  />
                  <label className="cursor-pointer px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-amber-300">
                    <Upload className="w-3 h-3 text-amber-700" />
                    <span>Upload Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMultiFileUpload(e, formData.mediaAngles.damageText, (combined) => handleMediaChange('damageText', combined))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Documents (Inspection/Reg)</label>
                <div className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="e.g. http://doc1.pdf, http://doc2.jpg"
                    value={formData.mediaAngles.documentsText}
                    onChange={(e) => handleMediaChange('documentsText', e.target.value)}
                    className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                  />
                  <label className="cursor-pointer px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-blue-300">
                    <Paperclip className="w-3 h-3 text-blue-700" />
                    <span>Upload Files</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMultiFileUpload(e, formData.mediaAngles.documentsText, (combined) => handleMediaChange('documentsText', combined))}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 360° View & Video Links */}
            <div className="font-semibold text-slate-700 pt-1">360° View & Video Links</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex gap-1 items-center bg-white p-1 rounded-lg border border-slate-200">
                <input type="text" placeholder="360° VR View Link" value={formData.mediaAngles.view360Url} onChange={(e) => handleMediaChange('view360Url', e.target.value)} className="flex-1 p-1 text-xs border-0 focus:outline-none placeholder:text-slate-400" />
              </div>
              <div className="flex gap-1 items-center bg-white p-1 rounded-lg border border-slate-200">
                <input type="text" placeholder="Video Link (MP4 or Upload)" value={formData.mediaAngles.videoUrl} onChange={(e) => handleMediaChange('videoUrl', e.target.value)} className="flex-1 p-1 text-xs border-0 focus:outline-none placeholder:text-slate-400" />
                <label className="cursor-pointer px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold flex items-center gap-0.5 shrink-0 border">
                  <Upload className="w-2.5 h-2.5" />
                  <span>Upload</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => handleMediaChange('videoUrl', url))} />
                </label>
              </div>
              <div className="flex gap-1 items-center bg-white p-1 rounded-lg border border-slate-200">
                <input type="text" placeholder="YouTube Video URL" value={formData.mediaAngles.youtubeUrl} onChange={(e) => handleMediaChange('youtubeUrl', e.target.value)} className="flex-1 p-1 text-xs border-0 focus:outline-none placeholder:text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <Link href="/dashboard/vehicles">
              <button type="button" className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-semibold">Cancel</button>
            </Link>
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs">Save Vehicle</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
