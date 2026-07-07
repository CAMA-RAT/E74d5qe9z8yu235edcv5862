"use client";
import React from 'react';

export function CotizacionHeader({ userRole }: { userRole?: string | null }) {
  return (
    <header className="bg-slate-800 text-white p-6 rounded-t-xl shadow-lg border-b border-slate-700 flex justify-between items-center print:hidden relative overflow-hidden">
      
      <div className="flex items-center gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Cotización <span className="text-[#8cc63f]">Nueva</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Generador de presupuestos</p>
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="text-right pl-4">
          <span className="font-semibold text-slate-300">Rol:</span> <span className="uppercase font-bold text-teal-400">{userRole === null ? 'Cargando...' : userRole}</span>
        </div>
      </div>
    </header>
  );
}
