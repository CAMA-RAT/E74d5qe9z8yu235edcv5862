import Dexie, { type EntityTable } from 'dexie';
import { ReportFormData } from '../schema/reportSchema';
import { CotizacionFormData } from '../schema/cotizacionSchema';

// Extendemos Dexie para tipar nuestras tablas
const db = new Dexie('EcotermicDB') as Dexie & {
  reportes_drafts: EntityTable<ReportFormData, 'id'>;
  cotizaciones_drafts: EntityTable<CotizacionFormData, 'id'>;
};

// Versión 1 original
db.version(1).stores({
  reportes_drafts: 'id, fecha, syncStatus, updatedAt' 
});

// Versión 2: Añadimos cotizaciones_drafts
db.version(2).stores({
  cotizaciones_drafts: 'id, folio, fecha, syncStatus, updatedAt'
});

export { db };
