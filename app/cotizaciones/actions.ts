'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserRole() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error("Auth Error:", authError);
  }

  if (!user) {
    console.log("No hay usuario autenticado en la sesión.");
    return "No autenticado";
  }

  console.log("Usuario detectado:", user.email, "ID:", user.id);

  const { data: roleData, error: dbError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (dbError) {
    // Si no se encuentra el rol o la tabla está vacía, Supabase manda error (PGRST116 con .single())
    // Retornamos "Sin Rol" en lugar de imprimir un console.error que bloquea la app
    console.error("Error al obtener rol de BD:", dbError.message, dbError.code, dbError.details);
    return "Sin Rol";
  }

  if (!roleData) {
    console.log("El usuario está autenticado pero no existe en la tabla user_roles.");
    return "UUID no encontrado";
  }

  return roleData.role; 
}

export async function getCotizaciones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // Si la base está vacía o hay cualquier inconveniente inicial de RLS,
    // simplemente no usamos console.error para no bloquear la interfaz en Next.js.
    // Esto hace que la app "sepa que está OK" si no hay datos.
    return [];
  }
  
  // Si data es null, retornamos un array vacío para evitar que la app crashee al hacer .length
  return data || [];
}

export async function getNextFolio(fecha: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('folio')
    .eq('fecha', fecha);

  if (error || !data || data.length === 0) {
    return `${fecha}-#1`;
  }

  let maxNum = 0;
  for (const cot of data) {
    const parts = cot.folio.split('-#');
    if (parts.length === 2) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  return `${fecha}-#${maxNum + 1}`;
}

import { CotizacionFormData } from '../../schema/cotizacionSchema';

export async function saveCotizacion(payload: CotizacionFormData) {
  const supabase = await createClient();
  
  // Calculamos los totales en el servidor por seguridad
  const subtotal = payload.partidas.reduce((acc, p) => acc + (p.cant * p.unit), 0);
  const iva = subtotal * ((payload.tasaIva || 16) / 100);
  const total = subtotal + iva;

  const dataToInsert = {
    id: payload.id,
    folio: payload.folio,
    fecha: payload.fecha,
    cliente_nombre: payload.clienteData.nombre,
    cliente_telefono: payload.clienteData.telefono,
    cliente_correo: payload.clienteData.correo,
    cliente_direccion: payload.clienteData.direccion,
    tasa_iva: payload.tasaIva,
    subtotal: subtotal,
    iva: iva,
    total: total,
    partidas: payload.partidas,
    notas: payload.notas
  };

  const { data, error } = await supabase
    .from('cotizaciones')
    .upsert([dataToInsert]) // Upsert en caso de que quieran "sobreescribir" o actualizar una ya guardada
    .select()
    .single();

  if (error) {
    console.error("Error saving cotizacion:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/cotizaciones/list');
  return { success: true, data };
}

export async function getCotizacionById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching cotizacion:', error);
    return null;
  }
  
  if (data) {
    return {
      id: data.id,
      folio: data.folio,
      fecha: data.fecha,
      clienteData: {
        nombre: data.cliente_nombre || '',
        telefono: data.cliente_telefono || '',
        correo: data.cliente_correo || '',
        direccion: data.cliente_direccion || '',
      },
      tasaIva: data.tasa_iva || 16,
      partidas: data.partidas || [],
      notas: data.notas || [],
      syncStatus: 'synced',
      updatedAt: Date.now(),
    };
  }
  return null;
}

export async function deleteCotizacion(id: string) {
  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from('cotizaciones')
    .delete()
    .eq('id', id);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath('/cotizaciones/list');
  return { success: true };
}
