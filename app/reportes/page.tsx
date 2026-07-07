"use client";

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Printer } from 'lucide-react';
import { ReportSchema, ReportFormData } from '../../schema/reportSchema';
import { useAutoSave } from '../../hooks/useAutoSave';
import { BRAND } from './constants';

// Componentes modulares
import { ReportHeader } from './components/ReportHeader';
import { GeneralInfo } from './components/GeneralInfo';
import { Personnel } from './components/Personnel';
import { Activities } from './components/Activities';
import { PrintView } from './components/PrintView';
import { saveReporte } from './actions';

export default function ReportesPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // 1. Inicialización limpia de React Hook Form + Zod
  const methods = useForm<ReportFormData>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      id: '', // Se hidratará en el cliente para evitar mismatch de SSR
      fecha: '',
      clienteData: { nombre: '', direccion: '', contacto: '', telefono: '' },
      personnel: { elaboro: '', superviso: '', tecnico: '' },
      activities: [],
      syncStatus: 'draft',
      updatedAt: 0,
    }
  });

  // 2. Hidratación inicial del borrador (Offline-First local)
  useEffect(() => {
    const hydrateDraft = async () => {
      try {
        const { db } = await import('../../lib/db');
        // Buscar el último borrador guardado localmente
        const drafts = await db.reportes_drafts.where('syncStatus').equals('draft').reverse().sortBy('updatedAt');
        
        if (drafts.length > 0) {
          // Restauramos el borrador más reciente
          methods.reset(drafts[0]);
          console.log('[Dexie] Borrador restaurado automáticamente:', drafts[0].id);
        } else {
          // Si no hay borrador, inicializamos uno nuevo
          const newId = uuidv4();
          const today = new Date().toISOString().split('T')[0];
          methods.reset({
            id: newId,
            fecha: today,
            clienteData: { nombre: '', direccion: '', contacto: '', telefono: '' },
            personnel: { elaboro: '', superviso: '', tecnico: '' },
            syncStatus: 'draft',
            updatedAt: Date.now(),
            activities: [{ id: uuidv4(), description: '', images: [] }]
          });
        }
      } catch (err) {
        console.error('[Dexie] Error cargando borrador:', err);
      }
    };
    
    hydrateDraft();
  }, [methods]);

  // 3. Ejecución del hook de autoguardado (Dexie)
  const { isSaving, lastSavedAt, saveNow } = useAutoSave<ReportFormData>({
    watch: methods.watch,
    getValues: methods.getValues,
    tableName: 'reportes_drafts',
    debounceMs: 1000
  });

  const handleNuevoReporte = async () => {
    if (!confirm('¿Estás seguro de que quieres limpiar el formulario? Se perderá el borrador actual (no se borrarán de la nube si ya lo subiste).')) return;
    try {
      const { db } = await import('../../lib/db');
      await db.reportes_drafts.where('syncStatus').equals('draft').delete();
      const newId = uuidv4();
      const today = new Date().toISOString().split('T')[0];
      methods.reset({
        id: newId,
        fecha: today,
        clienteData: { nombre: '', direccion: '', contacto: '', telefono: '' },
        personnel: { elaboro: '', superviso: '', tecnico: '' },
        syncStatus: 'draft',
        updatedAt: Date.now(),
        activities: [{ id: uuidv4(), description: '', images: [] }]
      });
      alert('Formulario limpiado. Listo para un nuevo reporte.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubirNube = async () => {
    setIsSubmitting(true);
    try {
      const currentData = methods.getValues();
      if (!currentData.id) throw new Error("No hay un reporte válido para subir.");
      
      const response = await saveReporte(currentData);
      
      if (response.success) {
        // Marcamos el borrador como 'synced' para que ya no lo cargue y lo podemos borrar de Dexie
        const { db } = await import('../../lib/db');
        await db.reportes_drafts.where('id').equals(currentData.id).delete();
        alert('¡Reporte subido exitosamente a Supabase! (Las fotos y datos ya están en la nube).');
        
        // Limpiamos el formulario para el siguiente uso
        await handleNuevoReporte();
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

  // 4. Clean Architecture: La UI es simplemente un orquestador de componentes
  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#2bb6b1] selection:text-white print:min-h-0 print:bg-white">
        
        {/* Barra Superior */}
        <ReportHeader />

        {/* Área de Trabajo Interactiva */}
        <main className="max-w-4xl mx-auto px-4 py-8 print:hidden">
          <div className="space-y-8">
            
            <GeneralInfo />
            
            <Activities />
            
            <Personnel />

            {/* Acciones */}
            <div className="pt-8 pb-16 space-y-4 flex flex-col items-center">
              
              {/* Indicador de Autoguardado */}
              <div className="text-sm font-medium h-6 flex items-center justify-center print:hidden">
                {isSaving ? (
                  <span className="text-amber-500 animate-pulse">Guardando...</span>
                ) : lastSavedAt ? (
                  <span className="text-emerald-500">✅ Borrador guardado localmente ({lastSavedAt.toLocaleTimeString()})</span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl print:hidden">
                <button
                  type="button"
                  onClick={handleNuevoReporte}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-rose-500 border-2 border-rose-100 hover:bg-rose-50 transition-all shadow-sm"
                >
                  Nuevo Reporte
                </button>

                <button
                  type="button"
                  onClick={() => saveNow()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Guardar Borrador
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:-translate-y-1 transition-all"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  <Printer size={18} />
                  PDF
                </button>

                <button
                  type="button"
                  onClick={handleSubirNube}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:-translate-y-1 transition-all w-full sm:w-auto justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: BRAND.green }}
                >
                  {isSubmitting ? 'Subiendo...' : 'Subir a la Nube (Supabase)'}
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
