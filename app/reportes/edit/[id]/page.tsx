"use client";

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { Printer } from 'lucide-react';
import { ReportSchema, ReportFormData } from '../../../../schema/reportSchema';
import { BRAND } from '../../constants';

// Componentes modulares reutilizados
import { ReportHeader } from '../../components/ReportHeader';
import { GeneralInfo } from '../../components/GeneralInfo';
import { Personnel } from '../../components/Personnel';
import { Activities } from '../../components/Activities';
import { PrintView } from '../../components/PrintView';
import { saveReporte, getReporteById } from '../../actions';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const methods = useForm<ReportFormData>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      id: '',
      fecha: '',
      clienteData: { nombre: '', direccion: '', contacto: '', telefono: '' },
      personnel: { elaboro: '', superviso: '', tecnico: '' },
      activities: [],
      syncStatus: 'synced',
      updatedAt: 0,
    }
  });

  // Hidratación desde Supabase
  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;
      try {
        const data = await getReporteById(reportId);
        if (data) {
          methods.reset(data as ReportFormData);
        } else {
          alert("No se encontró el reporte o no tienes acceso.");
          router.push('/reportes/list');
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId, methods, router]);

  const handleActualizarNube = async () => {
    setIsSubmitting(true);
    try {
      const currentData = methods.getValues();
      // saveReporte usa un .upsert(), por lo que sirve perfectamente para actualizar
      const response = await saveReporte(currentData);
      
      if (response.success) {
        alert('¡Reporte actualizado exitosamente en Supabase!');
        router.push('/reportes/list');
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error al actualizar en la nube: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2bb6b1]"></div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#2bb6b1] selection:text-white print:min-h-0 print:bg-white">
        
        {/* Barra Superior */}
        <ReportHeader />

        {/* Área de Trabajo Interactiva */}
        <main className="max-w-4xl mx-auto px-4 py-8 print:hidden">
          <div className="space-y-8">
            
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm font-medium text-center">
              Estás editando el reporte <b>{methods.watch('folio') || reportId}</b>
            </div>

            <GeneralInfo />
            
            <Activities />
            
            <Personnel />

            {/* Acciones */}
            <div className="pt-8 pb-16 space-y-4 flex flex-col items-center">
              
              <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl print:hidden">
                <button
                  type="button"
                  onClick={() => router.push('/reportes/list')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Cancelar Edición
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:-translate-y-1 transition-all"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  <Printer size={18} />
                  Generar PDF
                </button>

                <button
                  type="button"
                  onClick={handleActualizarNube}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:-translate-y-1 transition-all w-full sm:w-auto justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: BRAND.green }}
                >
                  {isSubmitting ? 'Actualizando...' : 'Guardar Cambios (Nube)'}
                </button>
              </div>

            </div>
            
          </div>
        </main>

        {/* Versión de Impresión Recreada */}
        <PrintView />
        
        </div>
      </form>
    </FormProvider>
  );
}
