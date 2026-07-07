"use client";
import React, { useState } from 'react';
import Link from 'next/link';

import { Trash2 } from 'lucide-react';
import { deleteReporte } from '../app/reportes/actions';
import { useRouter } from 'next/navigation';

interface ReportesTableProps {
  reportes: any[];
}

export default function ReportesTable({ reportes }: ReportesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filtered = reportes.filter((rep) => {
    const term = searchTerm.toLowerCase();
    return (
      rep.folio?.toLowerCase().includes(term) ||
      rep.cliente_nombre?.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: string, folio: string) => {
    const confirm1 = window.confirm(`¿Estás seguro de que deseas eliminar el reporte ${folio}?`);
    if (!confirm1) return;

    const confirm2 = window.confirm(`⚠️ ESTA ACCIÓN ES IRREVERSIBLE. Se borrarán todas las fotos asociadas de la nube. ¿Estás TOTALMENTE SEGURO?`);
    if (!confirm2) return;

    setIsDeleting(id);
    try {
      const result = await deleteReporte(id);
      if (result.success) {
        // La action ya hace revalidatePath, pero router.refresh() actualiza el Client Component
        router.refresh();
      } else {
        alert(`Error al eliminar: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error inesperado al intentar eliminar el reporte.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <input
          type="text"
          placeholder="Buscar por folio o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2bb6b1]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-bold">Folio</th>
              <th className="p-4 font-bold">Fecha</th>
              <th className="p-4 font-bold">Cliente</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No se encontraron reportes.
                </td>
              </tr>
            ) : (
              filtered.map((rep) => (
                <tr key={rep.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-medium text-slate-800">{rep.folio}</td>
                  <td className="p-4 text-slate-600">{rep.fecha}</td>
                  <td className="p-4 text-slate-600">{rep.cliente_nombre || 'Sin cliente'}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/reportes/edit/${rep.id}`}
                        className="inline-block px-4 py-2 bg-[#2bb6b1] text-white text-xs font-bold rounded shadow-sm hover:bg-[#239c98] transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(rep.id, rep.folio)}
                        disabled={isDeleting === rep.id}
                        className={`p-2 rounded bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors shadow-sm ${isDeleting === rep.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Eliminar Reporte"
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
