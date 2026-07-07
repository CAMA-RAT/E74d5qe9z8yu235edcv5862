"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { deleteCotizacion } from '../app/cotizaciones/actions';
import { useRouter } from 'next/navigation';

export default function CotizacionesTable({ cotizaciones }: { cotizaciones: any[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, folio: string) => {
    const confirm1 = window.confirm(`¿Estás seguro de que deseas eliminar la cotización ${folio}?`);
    if (!confirm1) return;

    const confirm2 = window.confirm(`⚠️ ESTA ACCIÓN ES IRREVERSIBLE. ¿Estás TOTALMENTE SEGURO de querer eliminar esta cotización?`);
    if (!confirm2) return;

    setIsDeleting(id);
    try {
      const result = await deleteCotizacion(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(`Error al eliminar: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error inesperado al intentar eliminar la cotización.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
              <th className="p-4">Folio</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-center">Partidas</th>
              <th className="p-4 text-center">Acciones</th>
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
                <tr key={cot.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-mono font-medium text-slate-700">{cot.folio}</td>
                  <td className="p-4">{cot.fecha}</td>
                  <td className="p-4 font-semibold text-slate-800">
                    {cot.cliente_nombre || <span className="text-slate-400 italic">Sin Cliente</span>}
                  </td>
                  <td className="p-4 font-bold text-green-700">
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cot.total)}
                  </td>
                  <td className="p-4 text-center">
                    <details className="cursor-pointer">
                      <summary className="text-blue-600 hover:text-blue-800 font-semibold text-xs outline-none">
                        Ver Detalle ({cot.partidas?.length || 0})
                      </summary>
                      <div className="mt-2 text-left bg-slate-100 p-3 rounded text-xs border border-slate-200 absolute right-20 w-80 shadow-2xl z-10">
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
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/cotizaciones/edit/${cot.id}`}
                        className="inline-block px-4 py-2 bg-[#8cc63f] text-white text-xs font-bold rounded shadow-sm hover:bg-[#7ab135] transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(cot.id, cot.folio)}
                        disabled={isDeleting === cot.id}
                        className={`p-2 rounded bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors shadow-sm ${isDeleting === cot.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Eliminar Cotización"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
