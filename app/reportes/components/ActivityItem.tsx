"use client";

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, ImageIcon, Camera, X } from 'lucide-react';
import { ReportFormData } from '../../../schema/reportSchema';
import { compressImage } from '../utils/imageHelpers';
import { BRAND } from '../constants';

interface ActivityItemProps {
  activityIndex: number;
  removeActivity: () => void;
}

export function ActivityItem({ activityIndex, removeActivity }: ActivityItemProps) {
  // register nos permite enlazar los inputs de texto directamente al estado
  // control se usa para manejar arrays dinámicos (images)
  const { register, control } = useFormContext<ReportFormData>();
  
  // Array anidado: Controla las imágenes específicas de esta actividad
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: `activities.${activityIndex}.images` as const,
    keyName: 'rhfId'
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Procesamos cada imagen por el helper asíncrono y la agregamos al estado
    for (const file of files) {
      const dataUrl = await compressImage(file);
      appendImage({
        localId: uuidv4(),
        dataUrl,
        description: '',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Actividad {activityIndex + 1}</h3>
        <button
          type="button"
          onClick={removeActivity}
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
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all" style={{ borderColor: `${BRAND.teal}44`, backgroundColor: `${BRAND.teal}05`, color: BRAND.teal }}>
            <Camera className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold uppercase">Cámara</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <textarea
          {...register(`activities.${activityIndex}.description` as const)}
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:ring-4 outline-none transition-all min-h-20 focus:bg-white"
          style={{ '--tw-ring-color': `${BRAND.teal}11` } as any}
          placeholder="Descripción general de la actividad (opcional)..."
        />

        {imageFields.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Fotos de la Actividad</h4>
            {imageFields.map((imgField, imgIdx) => (
              <div key={imgField.rhfId} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                <div className="relative group/img shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgField.dataUrl} alt="preview" className="w-full sm:w-32 h-40 sm:h-32 rounded-xl object-cover border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeImage(imgIdx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
                <textarea
                  {...register(`activities.${activityIndex}.images.${imgIdx}.description` as const)}
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
  );
}
