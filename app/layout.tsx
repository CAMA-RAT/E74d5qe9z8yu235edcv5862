import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@/utils/supabase/server';
import { signout } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'Ecotermic',
  description: 'Ecotermic application',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="es-MX">
      <body>
        {children}
        {user && (
          <form action={signout}>
            <button className="fixed bottom-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition-all text-xs font-bold print:hidden z-50" title="Cerrar Sesión">
              Cerrar Sesión
            </button>
          </form>
        )}
      </body>
    </html>
  );
}
