"use client";

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { getUserRole, saveCotizacion, getCotizacionById } from '../../actions';
import { CotizacionSchema, CotizacionFormData } from '../../../../schema/cotizacionSchema';

import { CotizacionHeader } from '../../components/CotizacionHeader';
import { CotizacionGeneralInfo } from '../../components/CotizacionGeneralInfo';
import { Partidas } from '../../components/Partidas';
import { CotizacionPrintView } from '../../components/CotizacionPrintView';

export default function EditCotizacionPage() {
  const params = useParams();
  const router = useRouter();
  const cotizacionId = params?.id as string;

  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const methods = useForm<CotizacionFormData>({
    resolver: zodResolver(CotizacionSchema),
    defaultValues: {
      id: '', 
      folio: 'Cargando...',
      fecha: '',
      clienteData: { nombre: '', direccion: '', correo: '', telefono: '' },
      partidas: [],
      notas: [],
      tasaIva: 16,
      syncStatus: 'synced',
      updatedAt: 0,
    }
  });

  // 1. Cargar rol
  useEffect(() => {
    getUserRole().then(role => setUserRole(role || 'desconocido'));
  }, []);

  // 2. Hidratación desde Supabase
  useEffect(() => {
    const fetchCotizacion = async () => {
      if (!cotizacionId) return;
      try {
        const data = await getCotizacionById(cotizacionId);
        if (data) {
          methods.reset(data as CotizacionFormData);
        } else {
          alert("No se encontró la cotización o no tienes acceso.");
          router.push('/cotizaciones/list');
        }
      } catch (err) {
        console.error("Error fetching cotizacion:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCotizacion();
  }, [cotizacionId, methods, router]);

  const handleFechaChange = async (newFecha: string) => {
    // Al editar, no cambiamos el folio automáticamente para no sobreescribir el consecutivo original
    methods.setValue('fecha', newFecha);
  };

  const handleActualizarNube = async () => {
    setIsSubmitting(true);
    try {
      const currentData = methods.getValues();
      const response = await saveCotizacion(currentData);
      
      if (response.success) {
        alert('¡Cotización actualizada exitosamente en Supabase!');
        router.push('/cotizaciones/list');
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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8cc63f]"></div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <main className="min-h-screen bg-slate-100 p-4 font-sans print:p-0 print:bg-white text-slate-800">
        <div className="max-w-4xl mx-auto space-y-6 print:m-0 print:max-w-none print:w-full">
          <div className="print:hidden">
            <CotizacionHeader userRole={userRole} />
            <div className="bg-white p-6 shadow-2xl rounded-b-xl border border-gray-200">
              
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm font-medium text-center mb-6">
                Estás editando la cotización <b>{methods.watch('folio') || cotizacionId}</b>
              </div>

              <CotizacionGeneralInfo 
                folio={methods.watch('folio')} 
                fecha={methods.watch('fecha')} 
                onFechaChange={handleFechaChange}
              />
              <Partidas />

              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200 print:hidden">
                <button
                  type="button"
                  onClick={() => router.push('/cotizaciones/list')}
                  className="px-6 py-3 rounded-lg font-bold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancelar Edición
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow"
                >
                  <i className="fas fa-file-pdf"></i>
                  Generar PDF
                </button>

                <button
                  type="button"
                  onClick={handleActualizarNube}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 bg-[#8cc63f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#7ab135] transition-colors shadow w-full sm:w-auto justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                  {isSubmitting ? 'Actualizando...' : 'Guardar Cambios (Nube)'}
                </button>
              </div>
            </div>
          </div>
          <CotizacionPrintView />
        </div>
      </main>
      </form>
    </FormProvider>
  );
}
