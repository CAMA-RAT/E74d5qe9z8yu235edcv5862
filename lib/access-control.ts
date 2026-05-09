// Utilidad centralizada para control de acceso por email
// Importar en Server Components o Actions para verificar permisos.

export const BLOCKED_EMAILS = ['asisttup@gmail.com'];

/**
 * Retorna true si el email NO está bloqueado (tiene acceso).
 */
export function hasAccess(email: string | undefined | null): boolean {
  if (!email) return false;
  return !BLOCKED_EMAILS.includes(email.toLowerCase());
}
