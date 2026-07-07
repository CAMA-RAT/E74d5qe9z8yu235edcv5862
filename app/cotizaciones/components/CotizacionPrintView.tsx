"use client";
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CotizacionFormData } from '../../../schema/cotizacionSchema';
import { formatter } from '../utils';
import { Phone, MessageCircle, Mail } from 'lucide-react';

export function CotizacionPrintView() {
  const { control } = useFormContext<CotizacionFormData>();
  const formValues = useWatch({ control }) as CotizacionFormData;

  if (!formValues || !formValues.id) return null;

  const { folio, fecha, clienteData, partidas, tasaIva } = formValues;
  const subtotal = (partidas || []).reduce((sum, item) => sum + ((Number(item.cant) || 0) * (Number(item.unit) || 0)), 0);
  const iva = (subtotal * (tasaIva || 16)) / 100;
  const total = subtotal + iva;

  return (
    <div className="hidden print:block w-full print-content bg-white print:p-0">
      <style type="text/css" media="print">
        {`
          @page {
            size: letter;
            margin: 1.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `}
      </style>
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-5">
        <div className="w-1/3">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-16 object-contain" />
        </div>
        <div className="w-2/3 text-right">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-widest">Cotización</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Folio: <span className="text-red-600">{folio}</span></p>
          <p className="text-sm text-slate-500">Fecha: {fecha}</p>
        </div>
      </div>
      
      {/* DATOS DE LA EMPRESA Y CLIENTE */}
      <div className="grid grid-cols-2 gap-8 mb-5">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Datos de la Empresa</h2>
          <h3 className="text-lg font-bold text-slate-800">ECOTERMIC SOLAR S.A. DE C.V.</h3>
          <p className="text-sm text-slate-600">Bahamas 1388 D, 09880 CDMX Iztapalapa</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Phone size={14} className="text-slate-500" />
              <span>55 5037 3767</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MessageCircle size={14} className="text-[#25D366]" />
              <span>55 3652 7139</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Atención A:</h2>
          <h3 className="text-lg font-bold text-slate-800">{clienteData?.nombre || '-'}</h3>
          <p className="text-sm text-slate-600 mb-2">{clienteData?.direccion || '-'}</p>
          <div className="flex flex-col gap-1">
            {clienteData?.telefono && (
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Phone size={14} className="text-slate-500" />
                <span>{clienteData.telefono}</span>
              </div>
            )}
            {clienteData?.correo && (
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Mail size={14} className="text-slate-500" />
                <span>{clienteData.correo}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PARTIDAS */}
      <table className="w-full text-left border-collapse mb-4">
        <thead>
          <tr className="bg-slate-800 text-white text-xs uppercase">
            <th className="p-2 w-16 text-center border border-slate-800">Cant</th>
            <th className="p-2 border border-slate-800">Descripción</th>
            <th className="p-2 w-32 text-right border border-slate-800">P. Unitario</th>
            <th className="p-2 w-32 text-right border border-slate-800">Importe</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {(partidas || []).map((item, index) => {
            const cant = Number(item.cant) || 0;
            const unit = Number(item.unit) || 0;
            const importe = cant * unit;
            return (
              <tr key={item.id || index}>
                <td className="p-2 text-center border-b border-l border-r border-slate-300 align-top font-semibold">{cant}</td>
                <td className="p-2 border-b border-r border-slate-300 align-top whitespace-pre-wrap">{item.desc}</td>
                <td className="p-2 text-right border-b border-r border-slate-300 align-top">{formatter.format(unit)}</td>
                <td className="p-2 text-right border-b border-r border-slate-300 align-top font-semibold">{formatter.format(importe)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* TOTALES Y DATOS BANCARIOS */}
      <div className="flex flex-row justify-between items-start gap-8 mb-2">
        {/* Datos Bancarios */}
        <div className="w-1/2 bg-[#004481] text-white p-4 rounded-lg border border-[#003366] break-inside-avoid shadow-sm">
          <p className="font-black text-white mb-2 border-b border-blue-400/30 pb-1.5 text-sm uppercase tracking-wider">Datos Bancarios</p>
          <div className="space-y-1 text-xs">
            <p><span className="font-semibold text-blue-200">Banco:</span> BBVA Bancomer</p>
            <p><span className="font-semibold text-blue-200">Titular:</span> ECOTERMIC SOLAR S.A. DE C.V.</p>
            <p><span className="font-semibold text-blue-200">RFC:</span> ESO090216HH3</p>
            <p><span className="font-semibold text-blue-200">Cuenta:</span> 0164964551</p>
            <p><span className="font-semibold text-blue-200">CLABE Interbancaria:</span> 012180001649645513</p>
          </div>
        </div>

        {/* Totales */}
        <div className="w-1/2 max-w-sm border border-slate-300 rounded-lg overflow-hidden break-inside-avoid shadow-sm">
          <div className="flex justify-between p-3 text-sm border-b border-slate-200 bg-white">
            <span className="font-semibold text-slate-600">Subtotal:</span>
            <span className="font-bold text-slate-800">{formatter.format(subtotal)}</span>
          </div>
          <div className="flex justify-between p-3 text-sm border-b border-slate-200 bg-white">
            <span className="font-semibold text-slate-600">IVA ({tasaIva || 16}%):</span>
            <span className="font-bold text-slate-800">{formatter.format(iva)}</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-800 text-white font-black text-lg">
            <span>Total:</span>
            <span>{formatter.format(total)}</span>
          </div>
          <div className="p-3 text-xs bg-slate-50 text-slate-600 text-center border-t border-slate-200">
            <p className="font-medium leading-relaxed">Precios sujetos a cambio sin previo aviso. Esta cotización tiene una vigencia de 15 días.</p>
            <p className="mt-1 font-black text-slate-800 uppercase tracking-wide">GRACIAS POR SU PREFERENCIA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
