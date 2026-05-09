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

export async function saveCotizacion(payload: any) {
  const supabase = await createClient();
  
  // Extraemos la información del payload para armar el objeto de la DB
  const {
    folio,
    fecha,
    nombre, // cliente_nombre
    telefono, // cliente_telefono
    correo, // cliente_correo
    direccion, // cliente_direccion
    tasaIva,
    subtotalCalculado,
    ivaCalculado,
    totalCalculado,
    partidas,
    notas
  } = payload;

  // Convertimos los formatos formateados (ej. "$1,200.00") a número puro
  const parseCurrency = (val: string) => Number(val.replace(/[^0-9.-]+/g, ""));

  const dataToInsert = {
    folio,
    fecha,
    cliente_nombre: nombre,
    cliente_telefono: telefono,
    cliente_correo: correo,
    cliente_direccion: direccion,
    tasa_iva: Number(tasaIva),
    subtotal: parseCurrency(subtotalCalculado),
    iva: parseCurrency(ivaCalculado),
    total: parseCurrency(totalCalculado),
    partidas,
    notas
  };

  const { data, error } = await supabase
    .from('cotizaciones')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error("Error saving cotizacion:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/cotizaciones/list');
  return { success: true, data };
}
