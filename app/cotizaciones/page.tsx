"use client";
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { getUserRole, getNextFolio, saveCotizacion } from './actions';
import { CotizacionSchema, CotizacionFormData } from '../../schema/cotizacionSchema';
import { useAutoSave } from '../../hooks/useAutoSave';
import { CotizacionHeader } from './components/CotizacionHeader';
import { CotizacionGeneralInfo } from './components/CotizacionGeneralInfo';
import { Partidas } from './components/Partidas';
import { CotizacionPrintView } from './components/CotizacionPrintView';

export default function CotizacionesPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      syncStatus: 'draft',
      updatedAt: 0,
    }
  });

  // 1. Cargar rol
  useEffect(() => {
    getUserRole().then(role => setUserRole(role || 'desconocido'));
  }, []);

  // 2. Hidratación inicial del borrador
  useEffect(() => {
    const hydrateDraft = async () => {
      try {
        const { db } = await import('../../lib/db');
        const drafts = await db.cotizaciones_drafts.where('syncStatus').equals('draft').reverse().sortBy('updatedAt');
        
        if (drafts.length > 0) {
          methods.reset(drafts[0]);
          console.log('[Dexie] Cotización restaurada:', drafts[0].id);
        } else {
          const newId = uuidv4();
          const today = new Date().toISOString().split('T')[0];
          const newFolio = await getNextFolio(today);
          methods.reset({
            id: newId,
            folio: newFolio,
            fecha: today,
            clienteData: { nombre: '', direccion: '', correo: '', telefono: '' },
            partidas: [{ id: uuidv4(), cant: 1, desc: '', unit: 0 }],
            notas: [],
            tasaIva: 16,
            syncStatus: 'draft',
            updatedAt: Date.now(),
          });
        }
      } catch (err) {
        console.error('[Dexie] Error cargando cotización:', err);
      }
    };
    hydrateDraft();
  }, [methods]);

  // Actualizar folio si cambia la fecha y no es de hoy
  const handleFechaChange = async (newFecha: string) => {
    methods.setValue('fecha', newFecha);
    const newFolio = await getNextFolio(newFecha);
    methods.setValue('folio', newFolio);
  };

  // 3. Autoguardado
  const { isSaving, lastSavedAt, saveNow } = useAutoSave<CotizacionFormData>({
    watch: methods.watch,
    getValues: methods.getValues,
    tableName: 'cotizaciones_drafts',
    debounceMs: 1000
  });

  const handleNuevaCotizacion = async () => {
    if (!confirm('¿Estás seguro de que quieres limpiar el formulario? Se perderá el borrador actual.')) return;
    try {
      const { db } = await import('../../lib/db');
      await db.cotizaciones_drafts.where('syncStatus').equals('draft').delete();
      const newId = uuidv4();
      const today = new Date().toISOString().split('T')[0];
      const newFolio = await getNextFolio(today);
      methods.reset({
        id: newId,
        folio: newFolio,
        fecha: today,
        clienteData: { nombre: '', direccion: '', correo: '', telefono: '' },
        partidas: [{ id: uuidv4(), cant: 1, desc: '', unit: 0 }],
        notas: [],
        tasaIva: 16,
        syncStatus: 'draft',
        updatedAt: Date.now(),
      });
      alert('Cotización limpiada. Listo para empezar.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubirNube = async () => {
    setIsSubmitting(true);
    try {
      const currentData = methods.getValues();
      if (!currentData.id) throw new Error("No hay una cotización válida para subir.");
      
      const response = await saveCotizacion(currentData);
      
      if (response.success) {
        const { db } = await import('../../lib/db');
        await db.cotizaciones_drafts.where('id').equals(currentData.id).delete();
        alert('¡Cotización subida exitosamente a Supabase!');
        await handleNuevaCotizacion();
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error al subir a la nube: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <main className="min-h-screen bg-slate-100 p-4 font-sans print:min-h-0 print:bg-white text-slate-800">
        <div className="max-w-4xl mx-auto space-y-6 print:space-y-0 print:m-0 print:max-w-none print:w-full">
          <div className="print:hidden">
            <CotizacionHeader userRole={userRole} />
            <div className="bg-white p-6 shadow-2xl rounded-b-xl border border-gray-200">
              <CotizacionGeneralInfo 
                folio={methods.watch('folio')} 
                fecha={methods.watch('fecha')} 
                onFechaChange={handleFechaChange}
              />
              <Partidas />

              {/* Indicador de Guardado */}
              <div className="mt-4 text-center text-sm font-medium h-6 print:hidden">
                {isSaving ? (
                  <span className="text-amber-500 animate-pulse">Guardando...</span>
                ) : lastSavedAt ? (
                  <span className="text-emerald-500">✅ Borrador guardado localmente ({lastSavedAt.toLocaleTimeString()})</span>
                ) : null}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-4 pt-6 border-t border-gray-200 print:hidden">
                <button
                  type="button"
                  onClick={handleNuevaCotizacion}
                  className="px-6 py-3 rounded-lg font-bold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors shadow-sm"
                >
                  Nueva Cotización
                </button>
                
                <button
                  type="button"
                  onClick={() => saveNow()}
                  className="px-6 py-3 rounded-lg font-bold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Guardar Borrador
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow"
                >
                  <i className="fas fa-file-pdf"></i>
                  PDF
                </button>

                <button
                  type="button"
                  onClick={handleSubirNube}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow w-full sm:w-auto justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
                  {isSubmitting ? 'Subiendo...' : 'Subir a Supabase'}
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