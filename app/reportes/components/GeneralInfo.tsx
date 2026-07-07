"use client";

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar, Building2, MapPin, Phone, MessageCircle, Mail, User, ChevronUp, ChevronDown } from 'lucide-react';
import { ReportFormData } from '../../../schema/reportSchema';
import { BRAND, COMPANY_DATA } from '../constants';

export function GeneralInfo() {
  const { register } = useFormContext<ReportFormData>();
  const [showClientForm, setShowClientForm] = useState(false);

  return (
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
            {...register('fecha')}
            className="w-full max-w-60 px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-lg font-bold focus:ring-4 outline-none transition-all"
            style={{ '--tw-ring-color': `${BRAND.teal}22`, borderColor: `${BRAND.teal}44` } as any}
          />
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
          type="button"
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
                {...register('clienteData.nombre')}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                placeholder="Ej. Comercializadora del Norte"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Dirección de Servicio</label>
              <input
                type="text"
                {...register('clienteData.direccion')}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                placeholder="Calle, Número, Colonia..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Nombre de Contacto</label>
              <input
                type="text"
                {...register('clienteData.contacto')}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                placeholder="Persona en sitio"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Teléfono de Contacto</label>
              <input
                type="text"
                {...register('clienteData.telefono')}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 outline-none transition-all"
                placeholder="55..."
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
