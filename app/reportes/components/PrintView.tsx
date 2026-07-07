import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ReportFormData } from '../../../schema/reportSchema';
import { BRAND, COMPANY_DATA, FIXED_HASHTAG } from '../constants';

export function PrintView() {
  const { control } = useFormContext<ReportFormData>();
  
  // useWatch se suscribe a los cambios reactivos del formulario (mucho más ligero que renderizar el Provider raíz completo)
  const formValues = useWatch({ control }) as ReportFormData;

  // Evitamos renderizar hasta que los datos iniciales existan
  if (!formValues || !formValues.id) return null;

  const { id, fecha, activities, personnel, clienteData } = formValues;

  const date = fecha || new Date().toISOString().split('T')[0];
  const formattedDate = date.split('-').reverse().join(' de ')
    .replace('de 01', 'de Enero').replace('de 02', 'de Febrero').replace('de 03', 'de Marzo')
    .replace('de 04', 'de Abril').replace('de 05', 'de Mayo').replace('de 06', 'de Junio')
    .replace('de 07', 'de Julio').replace('de 08', 'de Agosto').replace('de 09', 'de Septiembre')
    .replace('de 10', 'de Octubre').replace('de 11', 'de Noviembre').replace('de 12', 'de Diciembre');

  return (
    <div className="hidden print:block print:w-full print:bg-white text-black font-sans">

      {/* ENCABEZADO A DOS COLUMNAS */}
      <div className="flex justify-between items-start mb-6 border-b-[3px] pb-4" style={{ borderColor: BRAND.blue }}>
        <div className="flex flex-col justify-start w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ecologo.svg" alt="Ecotermic" className="h-14 w-auto object-contain object-left mb-3" />
          <h1 className="text-[20px] font-black uppercase tracking-wider mb-1" style={{ color: BRAND.blue }}>Reporte de Actividades</h1>
          <p className="text-[14px] font-bold" style={{ color: BRAND.blue }}>Fecha: <span className="text-gray-900">{formattedDate}</span></p>
          <p className="text-[12px] font-bold text-gray-500 mt-1">Folio (Borrador local): <span className="font-mono">{id}</span></p>
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

      {/* DATOS DEL CLIENTE */}
      {(clienteData.nombre || clienteData.direccion || clienteData.contacto) && (
        <div className="mb-6 p-4 border border-gray-200 bg-gray-50/50 rounded-lg">
          <h2 className="text-[12px] font-black uppercase mb-2 tracking-widest text-gray-500 border-b border-gray-200 pb-1">Datos del Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            {clienteData.nombre && <p className="text-[13px]"><span className="font-bold text-gray-700">Cliente/Razón Social:</span> {clienteData.nombre}</p>}
            {clienteData.contacto && <p className="text-[13px]"><span className="font-bold text-gray-700">Atención a:</span> {clienteData.contacto}</p>}
            {clienteData.direccion && <p className="text-[13px] col-span-2"><span className="font-bold text-gray-700">Dirección:</span> {clienteData.direccion}</p>}
            {clienteData.telefono && <p className="text-[13px]"><span className="font-bold text-gray-700">Teléfono:</span> {clienteData.telefono}</p>}
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
              {(!activity.images || activity.images.length === 0) ? (
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
                  <tr key={img.localId} className="break-inside-avoid">
                    {imgIdx === 0 && (
                      <td rowSpan={activity.images.length} className="border border-black text-center align-middle p-2 font-bold text-sm bg-gray-50/30">
                        {index + 1}
                      </td>
                    )}
                    <td className="border border-black p-2 align-middle text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.dataUrl}
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

      {/* FOOTER CORPORATIVO */}
      <div className="mt-6 pt-3 border-t border-gray-200 flex flex-nowrap justify-between items-center w-full break-inside-avoid text-[9px]">
        <div className="flex items-center gap-1 shrink-0" style={{ color: BRAND.green }}>
          <span className="font-bold tracking-tight text-[10px]">{FIXED_HASHTAG}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8C14.5 5.5 11 4 7 4C7 8 8.5 11.5 11 14C13.5 16.5 17 18 21 18C21 14 19.5 10.5 17 8Z" />
            <path d="M11 14L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex items-center gap-2 shrink-0" style={{ color: BRAND.blue }}>
          <div className="flex items-center gap-1"><span className="font-bold">Oficina: {COMPANY_DATA.oficina}</span></div>
          <div className="flex items-center gap-1"><span className="font-bold text-green-600">WA: {COMPANY_DATA.whatsapp}</span></div>
          <div className="flex items-center gap-1"><span className="font-bold">{COMPANY_DATA.email}</span></div>
        </div>

        <div className="text-white px-2 py-1 font-bold tracking-wide rounded-sm shrink-0 whitespace-nowrap" style={{ backgroundColor: BRAND.blue }}>
          {COMPANY_DATA.website}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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
