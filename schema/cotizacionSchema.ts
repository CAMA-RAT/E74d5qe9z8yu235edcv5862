import { z } from 'zod';

export const PartidaSchema = z.object({
  id: z.string(),
  desc: z.string(),
  cant: z.number().min(1),
  unit: z.number().min(0),
});

export const NotaSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const CotizacionSchema = z.object({
  id: z.string(), // UUID interno para borrador
  folio: z.string(),
  fecha: z.string(),
  clienteData: z.object({
    nombre: z.string(),
    direccion: z.string(),
    telefono: z.string(),
    correo: z.string(),
  }),
  partidas: z.array(PartidaSchema),
  notas: z.array(NotaSchema),
  tasaIva: z.number(),
  syncStatus: z.enum(['draft', 'pending_sync', 'synced']),
  updatedAt: z.number(),
});

export type CotizacionFormData = z.infer<typeof CotizacionSchema>;
export type PartidaData = z.infer<typeof PartidaSchema>;
export type NotaData = z.infer<typeof NotaSchema>;
