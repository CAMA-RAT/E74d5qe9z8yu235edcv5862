'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { ReportFormData } from '../../schema/reportSchema';

export async function saveReporte(payload: ReportFormData) {
  const supabase = await createClient();

  try {
    // 1. Procesar y subir imágenes a Supabase Storage
    const activitiesWithUrls = await Promise.all(
      payload.activities.map(async (activity) => {
        const imagesWithUrls = await Promise.all(
          activity.images.map(async (image) => {
            // Si ya es una URL pública (de una edición futura), la dejamos
            if (image.dataUrl.startsWith('http')) {
              return image;
            }

            // Es base64, hay que subirlo
            const base64Data = image.dataUrl.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `reportes/${payload.id}/${image.localId}.jpg`;

            const { error: uploadError } = await supabase.storage
              .from('reportes-fotos')
              .upload(fileName, buffer, {
                contentType: 'image/jpeg',
                upsert: true,
              });

            if (uploadError) {
              console.error('Error subiendo imagen:', uploadError);
              throw new Error(`Error subiendo imagen a Supabase Storage: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
              .from('reportes-fotos')
              .getPublicUrl(fileName);

            return {
              ...image,
              dataUrl: publicUrlData.publicUrl,
            };
          })
        );

        return {
          ...activity,
          images: imagesWithUrls,
        };
      })
    );

    // 2. Preparar el payload final para la BD
    const dataToInsert = {
      id: payload.id,
      folio: `REP-${payload.id.substring(0, 8).toUpperCase()}`, // Autogenerado corto
      fecha: payload.fecha,
      cliente_nombre: payload.clienteData.nombre,
      cliente_direccion: payload.clienteData.direccion,
      cliente_contacto: payload.clienteData.contacto,
      cliente_telefono: payload.clienteData.telefono,
      personnel_elaboro: payload.personnel.elaboro,
      personnel_superviso: payload.personnel.superviso,
      personnel_tecnico: payload.personnel.tecnico,
      activities: activitiesWithUrls,
    };

    // 3. Insertar en la tabla 'reportes'
    const { error: dbError } = await supabase
      .from('reportes')
      .upsert([dataToInsert]); // Usamos upsert para permitir sobreescritura

    if (dbError) {
      console.error('Error guardando en BD:', dbError);
      throw new Error(dbError.message);
    }

    revalidatePath('/reportes');
    return { success: true };
  } catch (error: any) {
    console.error('Error general saveReporte:', error);
    return { success: false, error: error.message || 'Error desconocido' };
  }
}

export async function getReportes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reportes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }
  
  return data || [];
}

export async function getReporteById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reportes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching reporte:', error);
    return null;
  }
  
  // Transform db structure back to ReportFormData structure
  if (data) {
    return {
      id: data.id,
      folio: data.folio,
      fecha: data.fecha,
      clienteData: {
        nombre: data.cliente_nombre || '',
        direccion: data.cliente_direccion || '',
        contacto: data.cliente_contacto || '',
        telefono: data.cliente_telefono || '',
      },
      personnel: {
        elaboro: data.personnel_elaboro || '',
        superviso: data.personnel_superviso || '',
        tecnico: data.personnel_tecnico || '',
      },
      activities: data.activities || [],
      syncStatus: 'synced',
      updatedAt: Date.now(),
    };
  }
  
  return null;
}

export async function deleteReporte(id: string) {
  const supabase = await createClient();

  // 1. Obtener el reporte para saber qué imágenes borrar
  const { data: reporte, error: fetchError } = await supabase
    .from('reportes')
    .select('activities')
    .eq('id', id)
    .single();

  if (fetchError) {
    return { success: false, error: 'No se pudo encontrar el reporte para eliminar.' };
  }

  // 2. Extraer las rutas de las imágenes en el Storage
  const pathsToDelete: string[] = [];
  if (reporte?.activities) {
    reporte.activities.forEach((act: any) => {
      act.images?.forEach((img: any) => {
        if (img.dataUrl && img.dataUrl.includes('reportes-fotos')) {
          // La URL es tipo: https://.../storage/v1/object/public/reportes-fotos/reportes/UUID/foto.jpg
          // Extraemos la ruta relativa al bucket: "reportes/UUID/foto.jpg"
          const urlParts = img.dataUrl.split('reportes-fotos/');
          if (urlParts.length > 1) {
            pathsToDelete.push(urlParts[1]);
          }
        }
      });
    });
  }

  // 3. Borrar imágenes del Bucket si existen
  if (pathsToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('reportes-fotos')
      .remove(pathsToDelete);
    
    if (storageError) {
      console.error('Error borrando fotos del bucket:', storageError);
      // No detenemos el proceso, permitimos borrar la BD aunque queden fotos huérfanas
    }
  }

  // 4. Borrar el registro de la Base de Datos
  const { error: dbError } = await supabase
    .from('reportes')
    .delete()
    .eq('id', id);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath('/reportes/list');
  return { success: true };
}
