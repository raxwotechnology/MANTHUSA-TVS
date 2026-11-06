'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  FileDown,
  FileSpreadsheet,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  Copy,
  Check,
  X,
  Filter,
  Plus,
  Minus,
  Search
} from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { useSettings } from '@/lib/useSettings';

export interface TVSStockRequisitionPlannerProps {
  vehicles: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function TVSStockRequisitionPlanner({
  vehicles,
  isOpen,
  onClose,
}: TVSStockRequisitionPlannerProps) {
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Requisition items: map of modelKey -> { requestedQty: number, notes: string, isSelected: boolean }
  const [requisitionState, setRequisitionState] = useState<
    Record<string, { requestedQty: number; notes: string; isSelected: boolean }>
  >({});

  // Group vehicles by Category & Model
  const stockSummary = useMemo(() => {
    const map = new Map<string, {
      category: string;
      model: string;
      variant?: string;
      total: number;
      available: number;
      reserved: number;
      sold: number;
      samplePrice: number;
      chassisList: string[];
      roundNumbers: string[];
      colors: string[];
    }>();

    vehicles.forEach((v) => {
      const category = v.category || 'Sport Motorcycles';
      const model = v.model || 'Unknown TVS Model';
      const key = `${category}:::${model}`;

      const existing = map.get(key) || {
        category,
        model,
        variant: v.variant || '',
        total: 0,
        available: 0,
        reserved: 0,
        sold: 0,
        samplePrice: v.sellingPrice || 0,
        chassisList: [] as string[],
        roundNumbers: [] as string[],
        colors: [] as string[],
      };

      existing.total += 1;
      const statusLower = (v.status || '').toLowerCase();
      if (statusLower.includes('sold') || statusLower.includes('delivered')) {
        existing.sold += 1;
      } else if (statusLower.includes('reserve') || statusLower.includes('booking')) {
        existing.reserved += 1;
      } else {
        existing.available += 1;
      }

      if (v.chassisNumber && !existing.chassisList.includes(v.chassisNumber)) {
        existing.chassisList.push(v.chassisNumber);
      }
      if (v.roundNumber && !existing.roundNumbers.includes(v.roundNumber)) {
        existing.roundNumbers.push(v.roundNumber);
      }
      if (v.color && !existing.colors.includes(v.color)) {
        existing.colors.push(v.color);
      }

      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.model.localeCompare(b.model);
    });
  }, [vehicles]);

  // Unique categories & models for dropdowns
  const categories = useMemo(() => {
    return Array.from(new Set(stockSummary.map((s) => s.category))).filter(Boolean);
  }, [stockSummary]);

  const models = useMemo(() => {
    const list = selectedCategory === 'ALL'
      ? stockSummary
      : stockSummary.filter((s) => s.category === selectedCategory);
    return Array.from(new Set(list.map((s) => s.model))).filter(Boolean);
  }, [stockSummary, selectedCategory]);

  // Filtered summary list
  const filteredList = useMemo(() => {
    return stockSummary.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedModel !== 'ALL' && item.model !== selectedModel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesModel = item.model.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesVariant = (item.variant || '').toLowerCase().includes(q);
        if (!matchesModel && !matchesCat && !matchesVariant) return false;
      }
      return true;
    });
  }, [stockSummary, selectedCategory, selectedModel, searchQuery]);

  // Update requested quantity for a model
  const setQuantity = (key: string, qty: number) => {
    const safeQty = Math.max(0, qty);
    setRequisitionState((prev) => ({
      ...prev,
      [key]: {
        requestedQty: safeQty,
        notes: prev[key]?.notes || '',
        isSelected: safeQty > 0 ? true : prev[key]?.isSelected ?? false,
      },
    }));
  };

  const toggleSelect = (key: string) => {
    setRequisitionState((prev) => {
      const current = prev[key] || { requestedQty: 1, notes: '', isSelected: false };
      return {
        ...prev,
        [key]: {
          ...current,
          isSelected: !current.isSelected,
          requestedQty: !current.isSelected && current.requestedQty === 0 ? 1 : current.requestedQty,
        },
      };
    });
  };

  const updateNotes = (key: string, notes: string) => {
    setRequisitionState((prev) => ({
      ...prev,
      [key]: {
        requestedQty: prev[key]?.requestedQty || 0,
        isSelected: prev[key]?.isSelected ?? true,
        notes,
      },
    }));
  };

  // Selected items calculation
  const selectedItems = useMemo(() => {
    return stockSummary.filter((item) => {
      const key = `${item.category}:::${item.model}`;
      const state = requisitionState[key];
      return state?.isSelected && (state?.requestedQty || 0) > 0;
    }).map((item) => {
      const key = `${item.category}:::${item.model}`;
      const state = requisitionState[key];
      return {
        ...item,
        requestedQty: state.requestedQty,
        notes: state.notes,
      };
    });
  }, [stockSummary, requisitionState]);

  const totalRequestedUnits = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.requestedQty, 0);
  }, [selectedItems]);

  const totalShowroomAvailable = useMemo(() => {
    return stockSummary.reduce((sum, item) => sum + item.available, 0);
  }, [stockSummary]);

  // Export PDF
  const handleExportPdf = () => {
    const listToExport = selectedItems.length > 0 ? selectedItems : filteredList.map(item => ({
      ...item,
      requestedQty: requisitionState[`${item.category}:::${item.model}`]?.requestedQty || 0,
      notes: requisitionState[`${item.category}:::${item.model}`]?.notes || '',
    }));

    const columns = [
      { label: 'Category', value: (r: any) => r.category },
      { label: 'TVS Motorcycle Model', value: (r: any) => `${r.model} ${r.variant || ''}`.trim() },
      { label: 'Current Showroom Stock', value: (r: any) => `${r.available} Available (${r.total} Total)` },
      { label: 'Order / Requested Qty', value: (r: any) => r.requestedQty > 0 ? `${r.requestedQty} Units` : 'Needs Replenishment' },
      { label: 'Special Notes / Colors', value: (r: any) => r.notes || r.colors?.slice(0, 3).join(', ') || 'Standard TVS Specs' },
    ];

    exportPdf(
      `TVS Motorcycle Stock Requisition & Order Request - ${settings?.dealershipName || 'Showroom'}`,
      `TVS-Stock-Order-Request-${new Date().toISOString().slice(0, 10)}.pdf`,
      columns,
      listToExport
    );
  };

  // Export Excel
  const handleExportExcel = () => {
    const listToExport = selectedItems.length > 0 ? selectedItems : filteredList.map(item => ({
      ...item,
      requestedQty: requisitionState[`${item.category}:::${item.model}`]?.requestedQty || 0,
      notes: requisitionState[`${item.category}:::${item.model}`]?.notes || '',
    }));

    const columns = [
      { label: 'Category', value: (r: any) => r.category },
      { label: 'Model', value: (r: any) => r.model },
      { label: 'Variant', value: (r: any) => r.variant || '' },
      { label: 'Available Stock', value: (r: any) => r.available },
      { label: 'Reserved Stock', value: (r: any) => r.reserved },
      { label: 'Total In Showroom', value: (r: any) => r.total },
      { label: 'Requested from TVS', value: (r: any) => r.requestedQty || 0 },
      { label: 'Preferred Colors / Notes', value: (r: any) => r.notes || '' },
    ];

    exportExcel(
      `TVS-Stock-Order-Request-${new Date().toISOString().slice(0, 10)}.xlsx`,
      columns,
      listToExport
    );
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const dealer = settings?.dealershipName || 'TVS Authorized Dealership';
    const date = new Date().toLocaleDateString('en-GB');

    let text = `📋 *TVS MOTORCYCLE STOCK REQUISITION & REPLENISHMENT REQUEST*\n`;
    text += `Dealer: ${dealer}\nDate: ${date}\n`;
    text += `Total Units Requested from TVS: ${totalRequestedUnits} Units\n\n`;

    const list = selectedItems.length > 0 ? selectedItems : filteredList.map(item => ({
      ...item,
      requestedQty: requisitionState[`${item.category}:::${item.model}`]?.requestedQty || 0,
      notes: requisitionState[`${item.category}:::${item.model}`]?.notes || '',
    })).filter(x => x.requestedQty > 0 || x.available === 0);

    list.forEach((item, index) => {
      text += `${index + 1}. *${item.model}* [${item.category}]\n`;
      text += `   - Current Showroom Stock: ${item.available} Available (Total: ${item.total})\n`;
      text += `   - Requested Order: *${item.requestedQty || 1} Units*\n`;
      if (item.notes) text += `   - Notes: ${item.notes}\n`;
      text += `\n`;
    });

    text += `Authorized by: Showroom Inventory Manager\nPlease confirm batch dispatch & round number allocations.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Package className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                TVS Motorcycle Stock Count & Requisition Generator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select motorcycle category and model to review current stock on hand and generate an official stock request list for TVS Lanka.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedModel('ALL');
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">All Categories ({stockSummary.length} models)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Model Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Filter by TVS Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">All TVS Models ({models.length})</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Search Model */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Quick Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Apache, NTORQ, Raider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Bike Models</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{filteredList.length}</p>
            <span className="text-[10px] text-slate-500">In current selection</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Showroom Stock Available</span>
            <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
              {filteredList.reduce((acc, curr) => acc + curr.available, 0)} Units
            </p>
            <span className="text-[10px] text-emerald-600">Ready to deliver</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-800">Customer Bookings Held</span>
            <p className="text-xl font-extrabold text-amber-700 mt-0.5">
              {filteredList.reduce((acc, curr) => acc + curr.reserved, 0)} Units
            </p>
            <span className="text-[10px] text-amber-600">Reserved bikes</span>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-blue-800">To Request from TVS</span>
            <p className="text-xl font-extrabold text-blue-700 mt-0.5">
              {totalRequestedUnits} Units
            </p>
            <span className="text-[10px] text-blue-600">{selectedItems.length} models selected</span>
          </div>
        </div>

        {/* Stock Breakdown & Requisition Table */}
        <div className="overflow-y-auto flex-1 border border-slate-200 rounded-xl shadow-2xs mb-4">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-200 z-10">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">Select</th>
                <th className="py-2.5 px-3">Category & Model</th>
                <th className="py-2.5 px-3 text-center">Available Stock</th>
                <th className="py-2.5 px-3 text-center">Booked</th>
                <th className="py-2.5 px-3 text-center">Total Stock</th>
                <th className="py-2.5 px-3">Stock Status</th>
                <th className="py-2.5 px-3 text-center w-36">Request from TVS</th>
                <th className="py-2.5 px-3">Order Notes / Colors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => {
                const key = `${item.category}:::${item.model}`;
                const state = requisitionState[key] || {
                  requestedQty: 0,
                  notes: '',
                  isSelected: false,
                };
                const isUrgent = item.available <= 1;

                return (
                  <tr
                    key={key}
                    className={`transition-colors ${
                      state.isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelect(key)}
                        className="text-slate-500 hover:text-blue-600 cursor-pointer"
                      >
                        {state.isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {item.model}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-semibold text-slate-700 text-[10px]">
                          {item.category}
                        </span>
                        {item.variant && <span>• {item.variant}</span>}
                        {item.roundNumbers.length > 0 && (
                          <span className="text-emerald-700 font-mono text-[10px]">
                            • Round No: {item.roundNumbers.join(', ')}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-extrabold text-sm ${
                          item.available === 0
                            ? 'text-rose-600'
                            : item.available <= 2
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {item.available}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-600 font-semibold">
                      {item.reserved}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {item.total}
                    </td>

                    <td className="py-3 px-3">
                      {item.available === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : item.available <= 2 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          Low ({item.available} left)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock ({item.available})
                        </span>
                      )}
                    </td>

                    {/* Order Quantity Counter */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setQuantity(key, (state.requestedQty || 0) - 1)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={state.requestedQty || 0}
                          onChange={(e) => setQuantity(key, parseInt(e.target.value) || 0)}
                          className="w-12 text-center text-xs font-bold py-1 focus:outline-hidden bg-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(key, (state.requestedQty || 0) + 1)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="e.g. 3 Red, 2 Black disc"
                        value={state.notes || ''}
                        onChange={(e) => updateNotes(key, e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No TVS motorcycle stock records found for the selected category/model filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
          <div className="text-xs text-slate-600">
            {selectedItems.length > 0 ? (
              <span>
                <strong>{totalRequestedUnits} units</strong> selected across <strong>{selectedItems.length} models</strong> to request from TVS.
              </span>
            ) : (
              <span>Select models and specify quantities above to request stock from TVS Lanka.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary (WhatsApp)'}</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download TVS Order (PDF)</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel Export</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
