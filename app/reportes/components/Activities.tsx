"use client";

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ReportFormData } from '../../../schema/reportSchema';
import { BRAND } from '../constants';
import { ActivityItem } from './ActivityItem';

export function Activities() {
  const { control } = useFormContext<ReportFormData>();
  
  // Array principal: Controla las actividades globales del reporte
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
    keyName: 'rhfId'
  });

  const addActivity = () => {
    append({
      id: uuidv4(),
      description: '',
      images: [],
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
        <span className="w-2 h-6 rounded-full" style={{ backgroundColor: BRAND.green }}></span>
        Registro de Actividades
      </h2>

      {fields.map((field, index) => (
        <ActivityItem
          key={field.rhfId}
          activityIndex={index}
          removeActivity={() => remove(index)}
        />
      ))}

      <button
        type="button"
        onClick={addActivity}
        className="w-full py-4 border-2 border-dashed rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white hover:bg-slate-50"
        style={{ borderColor: BRAND.teal, color: BRAND.teal }}
      >
        <Plus size={20} /> Añadir Nueva Actividad
      </button>
    </section>
  );
}
