"use client";
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CotizacionFormData } from '../../../schema/cotizacionSchema';
import { v4 as uuidv4 } from 'uuid';
import { formatter } from '../utils';
import { Plus, Trash2 } from 'lucide-react';

export function Partidas() {
  const { control, register, watch } = useFormContext<CotizacionFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'partidas',
    keyName: 'rhfId'
  });

  const partidasWatch = watch('partidas') || [];
  const tasaIva = watch('tasaIva') || 16;
  
  const subtotal = partidasWatch.reduce((sum, item) => sum + ((Number(item.cant) || 0) * (Number(item.unit) || 0)), 0);
  const iva = (subtotal * tasaIva) / 100;
  const total = subtotal + iva;

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header - Desktop & Print */}
      <div className="hidden md:grid print:grid grid-cols-[60px_1fr_120px_120px_40px] gap-4 bg-slate-800 text-white text-[10px] uppercase tracking-wider p-3 rounded-t-lg">
        <div className="text-center font-bold">Cant</div>
        <div className="font-bold">Descripción de la Partida</div>
        <div className="text-right font-bold">P. Unitario</div>
        <div className="text-right font-bold">Importe</div>
        <div className="text-center no-print"></div>
      </div>

      <div className="divide-y divide-gray-200 text-sm bg-white">
        {fields.map((item, index) => {
          const cant = Number(partidasWatch[index]?.cant || 0);
          const unit = Number(partidasWatch[index]?.unit || 0);
          const importe = cant * unit;
          
          return (
            <div key={item.rhfId} className="flex flex-col md:grid print:grid md:grid-cols-[60px_1fr_120px_120px_40px] print:grid-cols-[60px_1fr_120px_120px_40px] gap-4 p-4 items-start hover:bg-slate-50 transition-colors">
              
              {/* Descripción (Full width en mobile) */}
              <div className="w-full order-2 md:order-2 print:order-2">
                <textarea 
                  {...register(`partidas.${index}.desc`)} 
                  rows={3} 
                  placeholder="Descripción del material o servicio..." 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-[#8cc63f] outline-none text-sm resize-none bg-white font-medium text-slate-800 leading-tight" 
                />
              </div>

              {/* Controles Agrupados en Mobile */}
              <div className="w-full flex flex-col gap-2 order-1 md:contents print:contents">
                {/* Cantidad */}
                <div className="flex items-center justify-between md:block print:block w-full md:w-full print:w-full order-1 md:order-1 print:order-1">
                  <span className="text-xs font-bold text-slate-400 uppercase md:hidden print:hidden">Cant:</span>
                  <input 
                    type="number" 
                    {...register(`partidas.${index}.cant`, { valueAsNumber: true })} 
                    className="w-1/2 md:w-full print:w-full border border-gray-300 rounded px-2 py-1.5 text-center focus:ring-1 focus:ring-[#8cc63f] outline-none text-sm font-medium text-slate-800 bg-white" 
                  />
                </div>
                
                {/* Precio Unitario */}
                <div className="flex items-center justify-between md:block print:block w-full md:w-full print:w-full order-3 md:order-3 print:order-3">
                  <span className="text-xs font-bold text-slate-400 uppercase md:hidden print:hidden">P.Unit:</span>
                  <input 
                    type="number" 
                    {...register(`partidas.${index}.unit`, { valueAsNumber: true })} 
                    className="w-1/2 md:w-full print:w-full border border-gray-300 rounded px-2 py-1.5 text-right focus:ring-1 focus:ring-[#8cc63f] outline-none text-sm font-medium text-slate-800 bg-white" 
                  />
                </div>
              </div>

              {/* Importe y Botón Eliminar */}
              <div className="w-full flex justify-between items-center mt-2 md:mt-0 print:mt-0 order-3 md:contents print:contents">
                <div className="flex items-center gap-2 md:block print:block w-auto md:w-full print:w-full order-4 md:order-4 print:order-4 text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase md:hidden print:hidden">Importe:</span>
                  <div className="font-bold text-slate-800 p-2 md:p-1.5 print:p-1.5 bg-slate-50 md:bg-transparent print:bg-transparent rounded md:rounded-none">
                    {formatter.format(importe)}
                  </div>
                </div>
                
                <div className="order-5 md:order-5 print:order-5 flex justify-center no-print">
                  <button type="button" onClick={() => remove(index)} className="text-rose-400 hover:text-rose-600 p-2 rounded bg-rose-50 hover:bg-rose-100 transition-colors" title="Eliminar partida">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
        {/* Botón Añadir Partida (Sólo móvil, aparece primero) */}
        <div className="md:hidden mb-6">
          <button 
            type="button" 
            onClick={() => append({ id: uuidv4(), cant: 1, desc: '', unit: 0 })}
            className="no-print bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md w-full"
          >
            <Plus size={16} /> Añadir Partida
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Lado Izquierdo: Botón (Desktop) y Datos Bancarios */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 order-2 md:order-1">
            <div className="hidden md:block">
              <button 
                type="button" 
                onClick={() => append({ id: uuidv4(), cant: 1, desc: '', unit: 0 })}
                className="no-print bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-colors flex items-center justify-start gap-2 shadow-md hover:-translate-y-0.5 w-auto"
              >
                <Plus size={16} /> Añadir Partida
              </button>
            </div>
            
            <div className="bg-[#004481] text-white p-5 rounded-xl border border-[#003366] shadow-inner">
              <p className="font-black text-white mb-3 border-b border-blue-400/30 pb-2 text-sm uppercase tracking-wider">Datos Bancarios</p>
              <div className="space-y-1.5 text-xs">
                <p><span className="font-semibold text-blue-200">Banco:</span> BBVA Bancomer</p>
                <p><span className="font-semibold text-blue-200">Titular:</span> ECOTERMIC SOLAR S.A. DE C.V.</p>
                <p><span className="font-semibold text-blue-200">RFC:</span> ESO090216HH3</p>
                <p><span className="font-semibold text-blue-200">Cuenta:</span> 0164964551</p>
                <p><span className="font-semibold text-blue-200">CLABE Interbancaria:</span> 012180001649645513</p>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Totales */}
          <div className="w-full md:w-5/12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden order-1 md:order-2">
            <div className="flex justify-between p-4 text-sm font-semibold border-b border-gray-100 text-slate-600">
              <span>Subtotal:</span>
              <span className="text-slate-800">{formatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center p-4 text-sm font-semibold border-b border-gray-100 text-slate-600">
              <div className="flex items-center gap-2">
                <span>IVA</span>
                <div className="flex items-center bg-white border border-gray-300 rounded-md px-2 w-20 no-print shadow-inner">
                  <input 
                    type="number" 
                    {...register('tasaIva', { valueAsNumber: true })} 
                    className="w-full text-right outline-none text-sm py-1" 
                  />
                  <span className="text-xs text-gray-400 pl-1">%</span>
                </div>
                <span className="print:inline hidden">{tasaIva}%</span>
              </div>
              <span className="text-slate-800">{formatter.format(iva)}</span>
            </div>
            <div className="flex justify-between p-4 text-lg font-black bg-slate-800 text-white shadow-inner">
              <span>Total:</span>
              <span>{formatter.format(total)}</span>
            </div>
            <div className="p-4 text-xs md:text-sm bg-slate-50 text-slate-600 text-center border-t border-gray-200">
              <p className="font-medium leading-relaxed">Precios sujetos a cambio sin previo aviso. Esta cotización tiene una vigencia de 15 días.</p>
              <p className="mt-1 font-black text-slate-800 uppercase tracking-wide">GRACIAS POR SU PREFERENCIA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
