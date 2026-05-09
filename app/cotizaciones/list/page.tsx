import React from 'react';
import { getCotizaciones, getUserRole } from '../actions';
import Link from 'next/link';

export default async function CotizacionesListPage() {
  const cotizaciones = await getCotizaciones();
  const role = await getUserRole();

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-100 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium">
                ← Menú Principal
              </Link>
            </div>
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

        <div className="bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                  <th className="p-4">Folio</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Partidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {cotizaciones.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                      No hay cotizaciones registradas.
                    </td>
                  </tr>
                ) : (
                  cotizaciones.map((cot: any) => (
                    <tr key={cot.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-medium text-slate-700">{cot.folio}</td>
                      <td className="p-4">{cot.fecha}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        {cot.cliente_nombre || <span className="text-slate-400 italic">Sin Cliente</span>}
                      </td>
                      <td className="p-4 font-bold text-green-700">
                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cot.total)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full uppercase tracking-widest font-semibold">
                          {cot.estado}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <details className="cursor-pointer group">
                          <summary className="text-blue-600 hover:text-blue-800 font-semibold text-xs outline-none">
                            Ver Detalle ({cot.partidas?.length || 0})
                          </summary>
                          <div className="mt-2 text-left bg-slate-100 p-3 rounded text-xs border border-slate-200 absolute right-10 w-80 shadow-2xl z-10">
                            <p className="font-bold border-b border-slate-300 pb-1 mb-2">Artículos Cotizados:</p>
                            <ul className="space-y-2">
                              {cot.partidas?.map((p: any, i: number) => (
                                <li key={i} className="flex justify-between border-b border-slate-200 pb-1">
                                  <span className="truncate w-40" title={p.desc}>{p.cant}x {p.desc || 'Sin descripción'}</span>
                                  <span className="font-semibold text-slate-700">${(p.unit * p.cant).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
