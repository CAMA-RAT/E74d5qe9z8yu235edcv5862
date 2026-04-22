import React from 'react';
import Link from 'next/link';
import { FileText, FileSpreadsheet, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
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
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-800">
              Bienvenido
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Selecciona la herramienta que necesitas utilizar el día de hoy para gestionar tus proyectos y clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* TARJETA DE COTIZACIONES */}
            <Link href="/cotizaciones" className="group block h-full">
              <div className="bg-white rounded-3xl p-8 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8cc63f]/20 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.green}15`, color: BRAND.green }}>
                  <FileSpreadsheet size={32} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl font-black mb-3 text-slate-800 group-hover:text-[#8cc63f] transition-colors">
                  Generador de Cotizaciones
                </h3>
                
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Crea cotizaciones profesionales, calcula automáticamente el IVA, incluye notas personalizadas y expórtalo a PDF para enviar a tus clientes.
                </p>
                
                <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider" style={{ color: BRAND.green }}>
                  Ir a Cotizaciones
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* TARJETA DE REPORTES */}
            <Link href="/reportes" className="group block h-full">
              <div className="bg-white rounded-3xl p-8 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2bb6b1]/20 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}>
                  <FileText size={32} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl font-black mb-3 text-slate-800 group-hover:text-[#2bb6b1] transition-colors">
                  Armador de Reportes
                </h3>
                
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Elabora reportes de trabajos realizados con evidencia fotográfica. Carga múltiples imágenes por actividad y genera un documento listo para firmar.
                </p>
                
                <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider" style={{ color: BRAND.teal }}>
                  Ir a Reportes
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
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