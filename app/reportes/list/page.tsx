import React from 'react';
import Link from 'next/link';
import { getReportes } from '../actions';
import ReportesTable from '@/components/ReportesTable';
import { getUserRole } from '../../cotizaciones/actions'; // Usamos la misma función de auth si existe

export default async function ReportesListPage() {
  const reportes = await getReportes();
  const role = await getUserRole();

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-100 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#2bb6b1]">Base de Datos de Reportes</h1>
            <p className="text-sm text-slate-500 mt-1">
              Tu rol actual es: <span className="font-bold text-slate-700 uppercase">{role || 'No autenticado'}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/reportes"
              className="px-6 py-2 bg-[#2bb6b1] text-white font-bold rounded shadow hover:-translate-y-0.5 transition-all text-sm"
            >
              Nuevo Reporte
            </Link>
          </div>
        </div>

        <ReportesTable reportes={reportes} />
      </div>
    </div>
  );
}
