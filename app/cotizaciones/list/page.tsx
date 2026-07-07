import React from 'react';
import { getCotizaciones, getUserRole } from '../actions';
import Link from 'next/link';
import CotizacionesTable from '@/components/CotizacionesTable';

export default async function CotizacionesListPage() {
  const cotizaciones = await getCotizaciones();
  const role = await getUserRole();

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-100 text-slate-800 font-sans">
      <main className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#175ca8]">Base de Datos de Cotizaciones</h1>
            <p className="text-sm text-slate-500 mt-1">
              Tu rol actual es: <span className="font-bold text-slate-700 uppercase">{role || 'No autenticado'}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/cotizaciones"
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded shadow-sm hover:bg-slate-200 transition-all text-sm"
            >
              Ir a Generador
            </Link>
            {/* Ocultamos el botón de crear si es reportero */}
            {role !== 'reportero' && (
              <Link 
                href="/cotizaciones"
                className="px-6 py-2 bg-[#2bb6b1] text-white font-bold rounded shadow hover:-translate-y-0.5 transition-all text-sm"
              >
                Nueva Cotización
              </Link>
            )}
          </div>
        </div>

        <CotizacionesTable cotizaciones={cotizaciones} />
      </main>
    </div>
  );
}
