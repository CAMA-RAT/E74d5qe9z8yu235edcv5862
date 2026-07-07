"use client";
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CotizacionFormData } from '../../../schema/cotizacionSchema';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

export function CotizacionGeneralInfo({ folio, fecha, onFechaChange }: { folio: string, fecha: string, onFechaChange: (f: string) => void }) {
  const { register } = useFormContext<CotizacionFormData>();
  const [mostrarDireccion, setMostrarDireccion] = useState(false);

  const toggleDireccion = () => setMostrarDireccion(!mostrarDireccion);

  return (
    <>
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 border-gray-200 gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-widest text-center md:text-left w-full md:w-auto">Cotización</h1>
        
        <div className="flex flex-row md:flex-row items-center justify-between md:justify-end w-full md:w-auto gap-6">
          <div className="inline-flex flex-col items-start md:items-end">
            <label htmlFor="fecha" className="text-[10px] font-semibold text-gray-500 uppercase">Fecha</label>
            <input 
              type="date" 
              id="fecha" 
              value={fecha} 
              onChange={(e) => onFechaChange(e.target.value)} 
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" 
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-12 w-auto object-contain" />
        </div>
      </div>

      {/* DATOS DE EMPRESA Y CLIENTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Datos Empresa */}
        <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Datos de Empresa</h2>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">ECOTERMIC SOLAR S.A. DE C.V.</h2>
          <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Domicilio:</span> Bahamas 1388 D</p>
          <p className="text-sm text-gray-600">09880 CDMX Iztapalapa</p>
          <div className="text-sm text-gray-600 mt-3 flex flex-col gap-2">
            <span className="flex items-center gap-2"><MessageCircle size={16} className="text-[#25D366]" /> 55 5037 3767</span>
            <span className="flex items-center gap-2"><Phone size={16} className="text-slate-500" /> 55 3652 7139</span>
          </div>
        </div>

        {/* Datos Cliente */}
        <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-100 shadow-inner">
          <div className="flex justify-between items-center mb-3 border-b pb-1">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Datos de Cliente</h2>
            <button type="button" onClick={toggleDireccion} className="text-xs text-blue-600 hover:text-blue-800 font-semibold no-print flex items-center gap-1">
              <MapPin size={14} /> Mostrar Dirección
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Folio</label>
              <input type="text" {...register('folio')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-slate-100" readOnly />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Teléfono</label>
              <input type="text" {...register('clienteData.telefono')} placeholder="Ej. 55 1234 5678" className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Nombre / Razón Social</label>
              <input type="text" {...register('clienteData.nombre')} placeholder="Ej. Nombre del Cliente o Empresa" className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Correo Electrónico</label>
              <input type="email" {...register('clienteData.correo')} placeholder="correo@hospital.com" className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
            </div>
            {mostrarDireccion && (
              <div className="flex flex-col col-span-2">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Dirección</label>
                <input type="text" {...register('clienteData.direccion')} placeholder="Ej. Calle, Número, Colonia, C.P." className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white w-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
