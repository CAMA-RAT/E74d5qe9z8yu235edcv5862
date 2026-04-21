"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Printer, 
  X, 
  Camera, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Building2,
  MapPin,
  Globe
} from 'lucide-react';

// --- INTERFACES ---
interface Activity {
  id: number;
  images: string[];
  description: string;
}

interface Personnel {
  elaboro: string;
  superviso: string;
  tecnico: string;
}

interface Company {
  name: string;
  addressLine1: string;
  addressLine2: string;
  contact: string;
  whatsapp: string;
  website: string;
  email: string;
}

// --- FUNCIÓN DE COMPRESIÓN ---
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; 
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(img.src);
        }
      };
    };
  });
};

export default function App() {
  // --- ESTADOS ---
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, images: [], description: '' }
  ]);
  const [personnel, setPersonnel] = useState<Personnel>({
    elaboro: '',
    superviso: '',
    tecnico: ''
  });

  // DATOS FIJOS (Texto Plano)
  const COMPANY_DATA: Company = {
    name: 'ECOTERMIC SOLAR S.A. DE C.V.',
    addressLine1: 'Bahamas 1388 D',
    addressLine2: '09880 CDMX Iztapalapa',
    contact: '55 5037 3767',
    whatsapp: '55 3652 7139',
    website: 'ecotermicsolar.com.mx',
    email: 'ecotermicsolar@gmail.com'
  };

  const FIXED_HASHTAG = '#SoyParteDelCambio';

  // --- MANEJADORES ---
  const addActivity = () => {
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    setActivities([...activities, { id: newId, images: [], description: '' }]);
  };

  const removeActivity = (id: number) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleDescriptionChange = (id: number, text: string) => {
    setActivities(activities.map(a => a.id === id ? { ...a, description: text } : a));
  };

  const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const compressedImages = await Promise.all(files.map(compressImage));
    setActivities(prev => prev.map(a => a.id === id ? { ...a, images: [...a.images, ...compressedImages] } : a));
  };

  const removeImage = (activityId: number, imageIndex: number) => {
    setActivities(activities.map(a => {
      if (a.id === activityId) {
        const newImages = [...a.images];
        newImages.splice(imageIndex, 1);
        return { ...a, images: newImages };
      }
      return a;
    }));
  };

  const handlePersonnelChange = (field: keyof Personnel, value: string) => {
    setPersonnel({ ...personnel, [field]: value });
  };

  const formattedDate = date.split('-').reverse().join(' de ')
    .replace('de 01', 'de Enero').replace('de 02', 'de Febrero').replace('de 03', 'de Marzo')
    .replace('de 04', 'de Abril').replace('de 05', 'de Mayo').replace('de 06', 'de Junio')
    .replace('de 07', 'de Julio').replace('de 08', 'de Agosto').replace('de 09', 'de Septiembre')
    .replace('de 10', 'de Octubre').replace('de 11', 'de Noviembre').replace('de 12', 'de Diciembre');

  const BRAND = {
    green: '#8cc63f',
    teal: '#2bb6b1',
    blue: '#175ca8'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#2bb6b1] selection:text-white print:min-h-0 print:bg-white">
      
      {/* BARRA SUPERIOR */}
      <header className="bg-white shadow-sm sticky top-0 z-30 print:hidden">
        <div className="h-1.5 w-full flex">
          <div className="h-full flex-1" style={{ backgroundColor: BRAND.green }}></div>
          <div className="h-full flex-1" style={{ backgroundColor: BRAND.teal }}></div>
          <div className="h-full flex-1" style={{ backgroundColor: BRAND.blue }}></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* LOGO PARA INTERFAZ WEB */}
            <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-black text-blue tracking-tight" style={{ color: BRAND.blue }}>
              Trabajos Realizados
            </h1>
          </div>
        </div>
      </header>

      {/* ÁREA DE TRABAJO */}
      <main className="max-w-4xl mx-auto px-4 py-8 print:hidden">
        <div className="space-y-8">
          
          {/* CABECERA DEL REPORTE (FECHA + DATOS EMPRESA) */}
          <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Lado Izquierdo: Fecha */}
              <div className="p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} style={{ color: BRAND.blue }} />
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Información General</span>
                </div>
                <label className="block text-2xl font-black mb-2" style={{ color: BRAND.blue }}>Fecha:</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full max-w-60 px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-lg font-bold focus:ring-4 outline-none transition-all"
                  style={{ '--tw-ring-color': `${BRAND.teal}22`, borderColor: `${BRAND.teal}44` } as any}
                />
              </div>

              {/* Lado Derecho: Datos Empresa (Texto Plano) */}
              <div className="p-8 bg-white">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 size={20} style={{ color: BRAND.teal }} />
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Datos de Empresa</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-black leading-tight" style={{ color: BRAND.blue }}>
                    {COMPANY_DATA.name}
                  </h2>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 text-slate-600">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-slate-400" />
                      <div className="text-sm font-medium">
                        <p>{COMPANY_DATA.addressLine1}</p>
                        <p>{COMPANY_DATA.addressLine2}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={18} className="shrink-0 text-slate-400" />
                      <p className="text-sm font-bold">{COMPANY_DATA.contact}</p>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={18} className="shrink-0 text-slate-400" />
                      <p className="text-sm font-medium">{COMPANY_DATA.email}</p>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <Globe size={18} className="shrink-0 text-slate-400" />
                      <p className="text-sm font-medium">{COMPANY_DATA.website}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SECCIÓN 2: ACTIVIDADES */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: BRAND.green }}></span>
              Registro de Actividades
            </h2>
            
            {activities.map((activity, index) => (
              <div key={activity.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
                  <h3 className="font-bold text-slate-700">Actividad {index + 1}</h3>
                  <button 
                    onClick={() => removeActivity(activity.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-white transition-all">
                      <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-500 uppercase">Galería</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(activity.id, e)} />
                    </label>

                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all" style={{ borderColor: `${BRAND.teal}44`, backgroundColor: `${BRAND.teal}05`, color: BRAND.teal }}>
                      <Camera className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold uppercase">Cámara</span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleImageUpload(activity.id, e)} />
                    </label>
                  </div>

                  {activity.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl">
                      {activity.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative group/img">
                          <img src={img} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                          <button 
                            onClick={() => removeImage(activity.id, imgIdx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover/img:opacity-100 transition-all"
                          >
                            <X size={12} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea 
                    value={activity.description}
                    onChange={(e) => handleDescriptionChange(activity.id, e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:ring-4 outline-none transition-all min-h-30 focus:bg-white"
                    style={{ '--tw-ring-color': `${BRAND.teal}11` } as any}
                    placeholder="Describe los trabajos realizados..."
                  />
                </div>
              </div>
            ))}

            <button 
              onClick={addActivity}
              className="w-full py-4 border-2 border-dashed rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white"
              style={{ borderColor: BRAND.teal, color: BRAND.teal }}
            >
              <Plus size={20} /> Nueva Actividad
            </button>
          </section>

          {/* SECCIÓN 3: FIRMAS */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['elaboro', 'superviso', 'tecnico'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{field}</label>
                <input 
                  type="text" 
                  value={(personnel as any)[field]} 
                  onChange={(e) => handlePersonnelChange(field as keyof Personnel, e.target.value)}
                  className="w-full p-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm focus:ring-4 outline-none transition-all focus:bg-white"
                  placeholder="Nombre y cargo"
                />
              </div>
            ))}
          </section>

          <div className="pt-8 pb-16 flex flex-col items-center">
            <button 
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all"
              style={{ backgroundColor: BRAND.blue }}
            >
              <Printer size={24} />
              Generar Reporte PDF
            </button>
          </div>
        </div>
      </main>

      {/* =========================================================
          VERSIÓN PARA IMPRESIÓN
          ========================================================= */}
      <div className="hidden print:block print:w-full print:bg-white text-black font-sans">
        
        {/* ENCABEZADO A DOS COLUMNAS */}
        <div className="flex justify-between items-start mb-8 border-b-[3px] pb-6" style={{ borderColor: BRAND.blue }}>
          <div className="flex flex-col justify-start w-1/2">
            {/* LOGO PARA IMPRESIÓN */}
            <img src="/ecologo.svg" alt="Ecotermic" className="h-16 w-auto object-contain mb-4" />
            <h1 className="text-[24px] font-black uppercase tracking-wider mb-1" style={{ color: BRAND.blue }}>Trabajos Realizados</h1>
            <p className="text-[16px] font-bold" style={{ color: BRAND.blue }}>Fecha: <span className="text-gray-900">{formattedDate}</span></p>
          </div>

          <div className="flex flex-col items-start w-1/2 pl-8 border-l border-gray-200">
            <h2 className="text-[14px] font-black uppercase mb-2 tracking-widest text-gray-400">DATOS DE EMPRESA:</h2>
            <p className="text-[16px] font-black uppercase leading-tight mb-1" style={{ color: BRAND.blue }}>{COMPANY_DATA.name}</p>
            <p className="text-[14px] font-medium text-gray-800 leading-tight mb-1">{COMPANY_DATA.addressLine1}</p>
            <p className="text-[14px] font-medium text-gray-800 leading-tight mb-1">{COMPANY_DATA.addressLine2}</p>
            <p className="text-[14px] font-bold text-gray-900">{COMPANY_DATA.contact}</p>
          </div>
        </div>

        {/* TABLA DE ACTIVIDADES */}
        <table className="w-full border-collapse border border-black mb-8 table-fixed">
          <thead>
            <tr>
              <th className="border border-black p-2 bg-gray-100 w-[5%] text-center">No.</th>
              <th className="border border-black p-2 bg-gray-100 w-[60%] text-center uppercase font-bold text-xs">Evidencia Fotográfica</th>
              <th className="border border-black p-2 bg-gray-100 w-[35%] text-center uppercase font-bold text-xs" style={{ color: BRAND.blue }}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id} className="break-inside-avoid">
                <td className="border border-black text-center align-middle p-2 font-bold text-lg">
                  {index + 1}
                </td>
                <td className="border border-black p-2 align-middle">
                  {activity.images.length > 0 ? (
                    <div className={`grid gap-2 items-center justify-items-center w-full ${
                      activity.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                    }`}>
                      {activity.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={`Evidencia ${index + 1}`} 
                          className="w-full h-auto max-h-55 object-contain border border-gray-100 p-0.5" 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-300 text-center py-6 italic text-sm">Sin evidencia fotográfica</div>
                  )}
                </td>
                <td className="border border-black p-4 align-middle">
                  <p className="text-justify whitespace-pre-line text-[13px] text-gray-800 leading-snug">
                    {activity.description || "Sin descripción registrada."}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FIRMAS */}
        <div className="mt-8 break-inside-avoid border border-black p-4 w-full max-w-sm">
          <h3 className="text-xs font-bold uppercase mb-3 tracking-widest text-gray-400">Personal Responsable</h3>
          <div className="space-y-1">
            {personnel.elaboro && <p className="text-xs"><span className="font-bold mr-2">Elaboró:</span> {personnel.elaboro}</p>}
            {personnel.superviso && <p className="text-xs"><span className="font-bold mr-2">Supervisó:</span> {personnel.superviso}</p>}
            {personnel.tecnico && <p className="text-xs"><span className="font-bold mr-2">Técnico:</span> {personnel.tecnico}</p>}
          </div>
        </div>

        {/* FOOTER CORPORATIVO MEJORADO */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-nowrap justify-between items-center w-full break-inside-avoid text-[10px]">
          
          {/* Lado Izquierdo: Hashtag con Hoja */}
          <div className="flex items-center gap-1 shrink-0" style={{ color: BRAND.green }}>
            <span className="font-bold tracking-tight text-[11px]">{FIXED_HASHTAG}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C14.5 5.5 11 4 7 4C7 8 8.5 11.5 11 14C13.5 16.5 17 18 21 18C21 14 19.5 10.5 17 8Z" />
              <path d="M11 14L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Centro: Datos de contacto con iconos circulares */}
          <div className="flex items-center gap-2 shrink-0" style={{ color: BRAND.blue }}>
            <div className="flex items-center gap-1">
              <span className="font-bold">{COMPANY_DATA.contact}</span>
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-current">
                <Phone size={8} strokeWidth={2} />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold">{COMPANY_DATA.whatsapp}</span>
              <div className="flex items-center justify-center w-4 h-4 rounded-full text-white" style={{ backgroundColor: BRAND.blue }}>
                <MessageCircle size={8} strokeWidth={2} />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold">{COMPANY_DATA.email}</span>
              <div className="flex items-center justify-center w-4 h-4 rounded-full text-white" style={{ backgroundColor: BRAND.blue }}>
                <Mail size={8} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Lado Derecho: Sitio Web en caja azul */}
          <div className="text-white px-2 py-1 font-bold tracking-wide rounded-sm shrink-0 whitespace-nowrap" style={{ backgroundColor: BRAND.blue }}>
            {COMPANY_DATA.website}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; }
          @page { size: letter; margin: 15mm; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          tr { page-break-inside: avoid; }
          .break-inside-avoid { break-inside: avoid; }
        }
      `}} />
    </div>
  );
}
