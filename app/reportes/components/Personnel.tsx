"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Users, ChevronDown } from 'lucide-react';
import { ReportFormData } from '../../../schema/reportSchema';
import { BRAND, DEFAULT_COLLABORATORS } from '../constants';

export function Personnel() {
  const { register } = useFormContext<ReportFormData>();

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex items-center gap-2 mb-6">
        <Users size={20} style={{ color: BRAND.blue }} />
        <h2 className="text-lg font-bold text-slate-800">Personal Responsable</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(['elaboro', 'superviso', 'tecnico'] as const).map((field) => (
          <div key={field} className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              {{ elaboro: 'Elaboró', superviso: 'Supervisó', tecnico: 'Técnico' }[field]}
            </label>

            {/* Select de asignación rápida usando register de RHF */}
            <div className="relative">
              <select
                {...register(`personnel.${field}`)}
                className="w-full p-3 pr-10 appearance-none bg-slate-50 border-2 border-slate-50 rounded-xl text-sm focus:ring-4 outline-none transition-all focus:bg-white text-slate-700"
              >
                <option value="">Selecciona un responsable...</option>
                {DEFAULT_COLLABORATORS.map(collab => (
                  <option key={collab.id} value={collab.initials}>
                    {collab.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
