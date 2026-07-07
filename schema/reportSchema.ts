import { z } from 'zod';

export const ActivityImageSchema = z.object({
  localId: z.string(),
  dataUrl: z.string(),
  description: z.string(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  description: z.string(),
  images: z.array(ActivityImageSchema),
});

export const ReportSchema = z.object({
  id: z.string(),
  folio: z.string().optional(),
  fecha: z.string(),
  clienteData: z.object({
    nombre: z.string(),
    direccion: z.string(),
    telefono: z.string(),
    contacto: z.string(),
  }),
  personnel: z.object({
    elaboro: z.string(),
    superviso: z.string(),
    tecnico: z.string(),
  }),
  activities: z.array(ActivitySchema),
  syncStatus: z.enum(['draft', 'pending_sync', 'synced']),
  updatedAt: z.number(),
});

// Inferir tipos de TypeScript a partir de los esquemas de Zod
export type ReportFormData = z.infer<typeof ReportSchema>;
export type ActivityData = z.infer<typeof ActivitySchema>;
export type ActivityImageData = z.infer<typeof ActivityImageSchema>;
