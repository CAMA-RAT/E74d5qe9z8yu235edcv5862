import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Camera, FileText } from 'lucide-react';

export function ReportHeader() {
  return (
    <header className="bg-slate-800 text-white p-6 rounded-t-xl shadow-lg border-b border-slate-700 flex justify-between items-center print:hidden relative overflow-hidden">
      
      <div className="flex items-center gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Reporte <span className="text-[#2bb6b1]">Técnico</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Documentación y Evidencia</p>
        </div>
      </div>
    </header>
  );
}
