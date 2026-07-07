import { useEffect, useRef, useState, useCallback } from 'react';
import { UseFormWatch, UseFormGetValues, FieldValues } from 'react-hook-form';
import { db } from '../lib/db';

interface UseAutoSaveProps<T extends FieldValues> {
  watch: UseFormWatch<T>;
  getValues: UseFormGetValues<T>;
  tableName: 'reportes_drafts' | 'cotizaciones_drafts';
  debounceMs?: number;
}

export function useAutoSave<T extends FieldValues & { id: string }>({ watch, getValues, tableName, debounceMs = 1000 }: UseAutoSaveProps<T>) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveNow = useCallback(async (dataToForce?: T) => {
    try {
      setIsSaving(true);
      const currentData = dataToForce || getValues() as T;
      if (!currentData.id) {
        setIsSaving(false);
        return;
      }
      
      const dataToSave = {
        ...currentData,
        updatedAt: Date.now(),
      };
      
      // @ts-ignore
      await db[tableName].put(dataToSave);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error(`[AutoSave] Error guardando en ${tableName}:`, error);
    } finally {
      setIsSaving(false);
    }
  }, [getValues, tableName]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsSaving(true);
      
      timeoutRef.current = setTimeout(() => {
        saveNow(value as T);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [watch, debounceMs, saveNow]);

  return { isSaving, lastSavedAt, saveNow };
}
