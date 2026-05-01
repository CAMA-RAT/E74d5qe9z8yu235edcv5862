"use client";

import React, { useState, useEffect } from 'react';
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
  Globe,
  User,
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  Users
} from 'lucide-react';

// --- INTERFACES ---
interface ActivityImage {
  url: string;
  description: string;
}

interface Activity {
  id: number;
  images: ActivityImage[];
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
  oficina: string;
  whatsapp: string;
  website: string;
  email: string;
}

interface ClientData {
  nombre: string;
  direccion: string;
  telefono: string;
  contacto: string;
}

interface ReportData {
  id: string;
  date: string;
  activities: Activity[];
  personnel: Personnel;
  clientData: ClientData;
  timestamp: number;
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

// --- DATOS FIJOS ---
const COMPANY_DATA: Company = {
  name: 'ECOTERMIC SOLAR S.A. DE C.V.',
  addressLine1: 'Bahamas 1388 D',
  addressLine2: '09880 CDMX Iztapalapa',
  oficina: '55 5037 3767',
  whatsapp: '55 3652 7139',
  website: 'ecotermicsolar.com.mx',
  email: 'ecotermicsolar@gmail.com'
};

const FIXED_HASHTAG = '#SoyParteDelCambio';

const DEFAULT_COLLABORATORS = [
  { id: 1, name: 'Israel Tapia', initials: 'Israel T.' },
  { id: 2, name: 'Angelica', initials: 'Angelica' },
  { id: 3, name: 'Guillermo', initials: 'Guillermo' },
  { id: 4, name: 'Andy', initials: 'Andy' },
  { id: 5, name: 'Mari', initials: 'Mari' }
];

export default function App() {
  // --- ESTADOS ---
  const [reportId, setReportId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, images: [], description: '' }
  ]);
  const [personnel, setPersonnel] = useState<Personnel>({
    elaboro: '',
    superviso: '',
    tecnico: ''
  });
  
  // Cliente
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    nombre: '',
    direccion: '',
    telefono: '',
    contacto: ''
  });

  // Historial Local (Autoguardado/Persistencia)
  const [savedReports, setSavedReports] = useState<ReportData[]>([]);

  // Inicialización (Client-side)
  useEffect(() => {
    const id = Date.now().toString();
    setReportId(id);
    
    // Cargar reportes guardados localmente
    const localReports = localStorage.getItem('ecotermic_reports');
    if (localReports) {
      setSavedReports(JSON.parse(localReports));
    }
  }, []);

  // Autoguardado simple: si hay un id, guardamos en localStorage al cambiar algo
  useEffect(() => {
    if (!reportId) return;
    
    const timeoutId = setTimeout(() => {
      const currentReport: ReportData = {
        id: reportId,
        date,
        activities,
        personnel,
        clientData,
        timestamp: Date.now()
      };
      
      setSavedReports(prev => {
        const filtered = prev.filter(r => r.id !== reportId);
        const updated = [...filtered, currentReport].sort((a, b) => b.timestamp - a.timestamp);
        localStorage.setItem('ecotermic_reports', JSON.stringify(updated));
        return updated;
      });
    }, 2000); // Autoguardar después de 2 segundos de inactividad

    return () => clearTimeout(timeoutId);
  }, [reportId, date, activities, personnel, clientData]);

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
    const newImages = compressedImages.map(url => ({ url, description: '' }));
    setActivities(prev => prev.map(a => a.id === id ? { ...a, images: [...a.images, ...newImages] } : a));
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

  const handleImageDescriptionChange = (activityId: number, imageIndex: number, text: string) => {
    setActivities(activities.map(a => {
      if (a.id === activityId) {
        const newImages = [...a.images];
        newImages[imageIndex].description = text;
        return { ...a, images: newImages };
      }
      return a;
    }));
  };

  const handlePersonnelChange = (field: keyof Personnel, value: string) => {
    setPersonnel({ ...personnel, [field]: value });
  };

  const handleClientChange = (field: keyof ClientData, value: string) => {
    setClientData({ ...clientData, [field]: value });
  };

  const setCollaborator = (field: keyof Personnel, initials: string) => {
    // Si ya tiene el valor, lo quitamos, si no, lo agregamos (o reemplazamos)
    setPersonnel(prev => ({
      ...prev,
      [field]: prev[field] === initials ? '' : initials
    }));
  };

  const concluirReporte = () => {
    if (confirm("¿Estás seguro de concluir este reporte y comenzar uno nuevo? El actual se guardará en tu historial local.")) {
      // Reiniciar estado para uno nuevo
      setReportId(Date.now().toString());
      setDate(new Date().toISOString().split('T')[0]);
      setActivities([{ id: 1, images: [], description: '' }]);
      setPersonnel({ elaboro: '', superviso: '', tecnico: '' });
      setClientData({ nombre: '', direccion: '', telefono: '', contacto: '' });
      setShowClientForm(false);
      window.scrollTo(0, 0);
    }
  };

  const loadReport = (id: string) => {
    const report = savedReports.find(r => r.id === id);
    if (report) {
      setReportId(report.id);
      setDate(report.date);
      setActivities(report.activities);
      setPersonnel(report.personnel);
      setClientData(report.clientData);
      setShowClientForm(!!report.clientData.nombre || !!report.clientData.direccion);
    }
  };

  // --- DISTRIBUCIÓN BÁSICA ---
  const sendWhatsApp = () => {
    const text = encodeURIComponent(`Hola, te comparto el Reporte de Actividades del ${formattedDate}. Por favor adjunta el archivo PDF aquí.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`Reporte de Actividades - ${formattedDate}`);
    const body = encodeURIComponent(`Adjunto el reporte de actividades correspondiente a la fecha: ${formattedDate}. \n\n[Por favor no olvides adjuntar el archivo PDF antes de enviar el correo]`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-black text-blue tracking-tight" style={{ color: BRAND.blue }}>
              Reporte de Actividades
            </h1>
          </div>
          
          {/* Historial rápido (dropdown nativo simple) */}
          {savedReports.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">Historial</span>
              <select 
                value={reportId}
                onChange={(e) => loadReport(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-2 py-1 outline-none focus:ring-2"
                style={{ '--tw-ring-color': BRAND.teal } as any}
              >
                {savedReports.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.clientData.nombre ? `${r.date} - ${r.clientData.nombre.substring(0,15)}` : `Reporte del ${r.date}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {/* ÁREA DE TRABAJO */}
      <main className="max-w-4xl mx-auto px-4 py-8 print:hidden">
        <div className="space-y-8">
          
          {/* CABECERA DEL REPORTE */}
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
                
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Folio Interno (Autoguardado)</span>
                  <p className="text-sm font-mono text-slate-600 mt-1">{reportId}</p>
                </div>
              </div>

              {/* Lado Derecho: Datos Empresa */}
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
                      <p className="text-sm font-bold">Oficina: {COMPANY_DATA.oficina}</p>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <MessageCircle size={18} className="shrink-0 text-slate-400" />
                      <p className="text-sm font-bold text-green-600">WhatsApp: {COMPANY_DATA.whatsapp}</p>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={18} className="shrink-0 text-slate-400" />
                      <p className="text-sm font-medium">{COMPANY_DATA.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Cliente Dinámico */}
            <div className="border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setShowClientForm(!showClientForm)}
                className="w-full px-8 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                  <User size={20} style={{ color: BRAND.green }} />
                  Datos del Cliente {showClientForm ? '(Ocultar)' : '(Opcional)'}
                </div>
                {showClientForm ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              {showClientForm && (
                <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Nombre / Razón Social</label>
                    <input 
                      type="text" 
                      value={clientData.nombre} 
                      onChange={(e) => handleClientChange('nombre', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                      placeholder="Ej. Comercializadora del Norte"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Dirección de Servicio</label>
                    <input 
                      type="text" 
                      value={clientData.direccion} 
                      onChange={(e) => handleClientChange('direccion', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                      placeholder="Calle, Número, Colonia..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Nombre de Contacto</label>
                    <input 
                      type="text" 
                      value={clientData.contacto} 
                      onChange={(e) => handleClientChange('contacto', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                      placeholder="Persona en sitio"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Teléfono de Contacto</label>
                    <input 
                      type="text" 
                      value={clientData.telefono} 
                      onChange={(e) => handleClientChange('telefono', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                      placeholder="55..."
                    />
                  </div>
                </div>
              )}
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

                  <textarea 
                    value={activity.description}
                    onChange={(e) => handleDescriptionChange(activity.id, e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:ring-4 outline-none transition-all min-h-20 focus:bg-white"
                    style={{ '--tw-ring-color': `${BRAND.teal}11` } as any}
                    placeholder="Descripción general de la actividad (opcional)..."
                  />

                  {activity.images.length > 0 && (
                    <div className="flex flex-col gap-4 mt-4">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Fotos de la Actividad</h4>
                      {activity.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                          <div className="relative group/img shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="preview" className="w-full sm:w-32 h-40 sm:h-32 rounded-xl object-cover border border-slate-200" />
                            <button 
                              onClick={() => removeImage(activity.id, imgIdx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          </div>
                          <textarea
                            value={img.description}
                            onChange={(e) => handleImageDescriptionChange(activity.id, imgIdx, e.target.value)}
                            className="flex-1 p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 outline-none transition-all resize-none min-h-32 sm:min-h-full"
                            style={{ '--tw-ring-color': `${BRAND.teal}22`, borderColor: `${BRAND.teal}44` } as any}
                            placeholder="Añade una descripción específica para esta foto..."
                          />
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            <button 
              onClick={addActivity}
              className="w-full py-4 border-2 border-dashed rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white hover:bg-slate-50"
              style={{ borderColor: BRAND.teal, color: BRAND.teal }}
            >
              <Plus size={20} /> Añadir Nueva Actividad
            </button>
          </section>

          {/* SECCIÓN 3: FIRMAS Y COLABORADORES */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Users size={20} style={{ color: BRAND.blue }} />
              <h2 className="text-lg font-bold text-slate-800">Personal Responsable</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(['elaboro', 'superviso', 'tecnico'] as const).map((field) => (
                <div key={field} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{field}</label>
                  
                  {/* Select de asignación rápida */}
                  <div className="relative">
                    <select
                      value={personnel[field]}
                      onChange={(e) => handlePersonnelChange(field, e.target.value)}
                      className="w-full p-3 pr-10 appearance-none bg-slate-50 border-2 border-slate-50 rounded-xl text-sm focus:ring-4 outline-none transition-all focus:bg-white text-slate-700"
                    >
                      <option value="">Selecciona un responsable...</option>
                      {DEFAULT_COLLABORATORS.map(collab => (
                        <option key={collab.id} value={collab.initials}>
                          {collab.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACCIONES Y DISTRIBUCIÓN */}
          <div className="pt-8 pb-16 space-y-6 flex flex-col items-center">
            
            {/* Acciones Principales */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={concluirReporte}
                className="flex items-center justify-center gap-2 text-slate-700 bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all"
              >
                <Save size={20} />
                Concluir Reporte
              </button>
              
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-3 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all"
                style={{ backgroundColor: BRAND.blue }}
              >
                <Printer size={24} />
                Generar Reporte PDF
              </button>
            </div>

            {/* Opciones de Distribución (Nativas) */}
            <div className="pt-6 border-t border-slate-200 w-full max-w-lg">
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Compartir Documento Generado</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={sendWhatsApp}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold shadow-md hover:bg-[#1ebd59] transition-all text-sm"
                >
                  <MessageCircle size={18} />
                  Enviar por WhatsApp
                </button>
                <button 
                  onClick={sendEmail}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-md hover:bg-slate-700 transition-all text-sm"
                >
                  <Mail size={18} />
                  Enviar por Correo
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-3 italic">* Debes adjuntar manualmente el PDF al abrir la aplicación.</p>
            </div>

          </div>
        </div>
      </main>

      {/* =========================================================
          VERSIÓN PARA IMPRESIÓN
          ========================================================= */}
      <div className="hidden print:block print:w-full print:bg-white text-black font-sans">
        
        {/* ENCABEZADO A DOS COLUMNAS */}
        <div className="flex justify-between items-start mb-6 border-b-[3px] pb-4" style={{ borderColor: BRAND.blue }}>
          <div className="flex flex-col justify-start w-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ecologo.svg" alt="Ecotermic" className="h-14 w-auto object-contain mb-3" />
            <h1 className="text-[20px] font-black uppercase tracking-wider mb-1" style={{ color: BRAND.blue }}>Reporte de Actividades</h1>
            <p className="text-[14px] font-bold" style={{ color: BRAND.blue }}>Fecha: <span className="text-gray-900">{formattedDate}</span></p>
            <p className="text-[12px] font-bold text-gray-500 mt-1">Folio: <span className="font-mono">{reportId}</span></p>
          </div>

          <div className="flex flex-col items-start w-1/2 pl-6 border-l border-gray-200">
            <h2 className="text-[12px] font-black uppercase mb-1 tracking-widest text-gray-400">DATOS DE EMPRESA:</h2>
            <p className="text-[14px] font-black uppercase leading-tight mb-1" style={{ color: BRAND.blue }}>{COMPANY_DATA.name}</p>
            <p className="text-[12px] font-medium text-gray-800 leading-tight">{COMPANY_DATA.addressLine1}</p>
            <p className="text-[12px] font-medium text-gray-800 leading-tight mb-1">{COMPANY_DATA.addressLine2}</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[12px]"><span className="font-bold text-gray-500">Oficina:</span> {COMPANY_DATA.oficina}</p>
              <p className="text-[12px]"><span className="font-bold text-green-600">WhatsApp:</span> {COMPANY_DATA.whatsapp}</p>
            </div>
          </div>
        </div>

        {/* DATOS DEL CLIENTE (Si existen) */}
        {(clientData.nombre || clientData.direccion || clientData.contacto) && (
          <div className="mb-6 p-4 border border-gray-200 bg-gray-50/50 rounded-lg">
            <h2 className="text-[12px] font-black uppercase mb-2 tracking-widest text-gray-500 border-b border-gray-200 pb-1">Datos del Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              {clientData.nombre && <p className="text-[13px]"><span className="font-bold text-gray-700">Cliente/Razón Social:</span> {clientData.nombre}</p>}
              {clientData.contacto && <p className="text-[13px]"><span className="font-bold text-gray-700">Atención a:</span> {clientData.contacto}</p>}
              {clientData.direccion && <p className="text-[13px] col-span-2"><span className="font-bold text-gray-700">Dirección:</span> {clientData.direccion}</p>}
              {clientData.telefono && <p className="text-[13px]"><span className="font-bold text-gray-700">Teléfono:</span> {clientData.telefono}</p>}
            </div>
          </div>
        )}

        {/* TABLA DE ACTIVIDADES */}
        <table className="w-full border-collapse border border-black mb-6 table-fixed">
          <thead>
            <tr>
              <th className="border border-black p-2 bg-gray-100 w-[5%] text-center text-xs">No.</th>
              <th className="border border-black p-2 bg-gray-100 w-[45%] text-center uppercase font-bold text-xs">Evidencia Fotográfica</th>
              <th className="border border-black p-2 bg-gray-100 w-[50%] text-center uppercase font-bold text-xs" style={{ color: BRAND.blue }}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                {activity.images.length === 0 ? (
                  <tr className="break-inside-avoid">
                    <td className="border border-black text-center align-middle p-2 font-bold text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-black p-2 align-middle text-gray-300 text-center italic text-xs">
                      Sin evidencia fotográfica
                    </td>
                    <td className="border border-black p-3 align-middle">
                      <p className="text-justify whitespace-pre-line text-[12px] text-gray-800 leading-snug">
                        {activity.description || "Sin descripción registrada."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  activity.images.map((img, imgIdx) => (
                    <tr key={imgIdx} className="break-inside-avoid">
                      {imgIdx === 0 && (
                        <td rowSpan={activity.images.length} className="border border-black text-center align-middle p-2 font-bold text-sm bg-gray-50/30">
                          {index + 1}
                        </td>
                      )}
                      <td className="border border-black p-2 align-middle text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.url} 
                          alt={`Evidencia ${index + 1}.${imgIdx + 1}`} 
                          className="max-w-full h-auto max-h-48 object-contain inline-block border border-gray-100 p-0.5" 
                        />
                      </td>
                      <td className="border border-black p-3 align-middle">
                        {imgIdx === 0 && activity.description && (
                          <div className="mb-2 pb-2 border-b border-gray-200">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Descripción General</span>
                            <p className="text-justify whitespace-pre-line text-[12px] text-gray-900 font-medium">
                              {activity.description}
                            </p>
                          </div>
                        )}
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Detalle de la Foto</span>
                        <p className="text-justify whitespace-pre-line text-[12px] text-gray-800 leading-snug">
                          {img.description || "Sin descripción."}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* FIRMAS */}
        <div className="mt-6 break-inside-avoid border border-black p-3 w-full max-w-sm">
          <h3 className="text-[10px] font-bold uppercase mb-2 tracking-widest text-gray-400">Personal Responsable</h3>
          <div className="space-y-1">
            {personnel.elaboro && <p className="text-[11px]"><span className="font-bold mr-2">Elaboró:</span> {personnel.elaboro}</p>}
            {personnel.superviso && <p className="text-[11px]"><span className="font-bold mr-2">Supervisó:</span> {personnel.superviso}</p>}
            {personnel.tecnico && <p className="text-[11px]"><span className="font-bold mr-2">Técnico:</span> {personnel.tecnico}</p>}
          </div>
        </div>

        {/* FOOTER CORPORATIVO MEJORADO */}
        <div className="mt-6 pt-3 border-t border-gray-200 flex flex-nowrap justify-between items-center w-full break-inside-avoid text-[9px]">
          
          <div className="flex items-center gap-1 shrink-0" style={{ color: BRAND.green }}>
            <span className="font-bold tracking-tight text-[10px]">{FIXED_HASHTAG}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C14.5 5.5 11 4 7 4C7 8 8.5 11.5 11 14C13.5 16.5 17 18 21 18C21 14 19.5 10.5 17 8Z" />
              <path d="M11 14L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="flex items-center gap-2 shrink-0" style={{ color: BRAND.blue }}>
            <div className="flex items-center gap-1">
              <span className="font-bold">Oficina: {COMPANY_DATA.oficina}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-green-600">WA: {COMPANY_DATA.whatsapp}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{COMPANY_DATA.email}</span>
            </div>
          </div>

          <div className="text-white px-2 py-1 font-bold tracking-wide rounded-sm shrink-0 whitespace-nowrap" style={{ backgroundColor: BRAND.blue }}>
            {COMPANY_DATA.website}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; }
          @page { size: letter; margin: 10mm; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          tr { page-break-inside: avoid; }
          .break-inside-avoid { break-inside: avoid; }
        }
      `}} />
    </div>
  );
}
