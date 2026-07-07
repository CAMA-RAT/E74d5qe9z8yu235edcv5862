import React from 'react';
import Link from 'next/link';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { getUserRole } from './cotizaciones/actions';

export default async function Home() {
  const role = await getUserRole();
  const isAdminOrEditor = role === 'admin' || role === 'editor' || role === 'super_admin';

  const BRAND = {
    green: '#8cc63f',
    teal: '#2bb6b1',
    blue: '#175ca8'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* BARRA SUPERIOR */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="h-1.5 w-full flex">
          <div className="h-full flex-1" style={{ backgroundColor: BRAND.green }}></div>
          <div className="h-full flex-1" style={{ backgroundColor: BRAND.teal }}></div>
          <div className="h-full flex-1" style={{ backgroundColor: BRAND.blue }}></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest hidden md:block">
            Rol: <span className="text-[#2bb6b1]">{role}</span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-800">
              Panel de Control
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Selecciona el módulo con el que necesitas trabajar hoy.
            </p>
            {role === 'Sin Rol' && (
              <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl font-medium inline-block shadow-sm">
                ⚠️ <b>Atención:</b> Tu cuenta aparece "Sin Rol". Necesitas pedirle al Administrador que te asigne tu rol en la Base de Datos para desbloquear todas las funciones.
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 gap-8 ${isAdminOrEditor ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
            
            {/* MÓDULO DE COTIZACIONES (Oculto para reporteros y usuarios sin rol asignado) */}
            {isAdminOrEditor && (
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8cc63f]/10 to-transparent rounded-bl-full -z-10"></div>
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.green}15`, color: BRAND.green }}>
                  <FileSpreadsheet size={32} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl font-black mb-3 text-slate-800">
                  Cotizaciones
                </h3>
                
                <p className="text-slate-500 mb-8 flex-grow">
                  Gestión de cotizaciones con cálculo automático de IVA y exportación profesional a PDF.
                </p>
                
                <div className="flex flex-col gap-3 mt-auto">
                  <Link href="/cotizaciones" className="w-full text-center py-3 rounded-xl font-bold text-white shadow-md hover:-translate-y-0.5 transition-transform" style={{ backgroundColor: BRAND.green }}>
                    Nueva Cotización
                  </Link>
                  <Link href="/cotizaciones/list" className="w-full text-center py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:-translate-y-0.5 transition-transform">
                    Base de Datos
                  </Link>
                </div>
              </div>
            )}

            {/* MÓDULO DE REPORTES (Visible para todos) */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2bb6b1]/10 to-transparent rounded-bl-full -z-10"></div>
              
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                <FileText size={32} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-2xl font-black mb-3 text-slate-800">
                Reportes de Trabajo
              </h3>
              
              <p className="text-slate-500 mb-8 flex-grow">
                Armado de reportes técnicos con evidencia fotográfica. Generación automática del documento para firmas.
              </p>
              
              <div className="flex flex-col gap-3 mt-auto">
                <Link href="/reportes" className="w-full text-center py-3 rounded-xl font-bold text-white shadow-md hover:-translate-y-0.5 transition-transform" style={{ backgroundColor: BRAND.teal }}>
                  Nuevo Reporte
                </Link>
                <Link href="/reportes/list" className="w-full text-center py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:-translate-y-0.5 transition-transform">
                  Base de Datos
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER SENCILLO */}
      <footer className="py-6 text-center text-sm font-medium text-slate-400">
        &copy; {new Date().getFullYear()} Ecotermic Solar S.A. de C.V.
      </footer>
    </div>
  );
}