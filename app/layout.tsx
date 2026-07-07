import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@/utils/supabase/server';
import { signout } from '@/app/actions/auth';

import { GlobalNav } from '@/components/GlobalNav';

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
  const isAuthenticated = !!user;

  return (
    <html lang="es-MX">
      {/* Añadimos padding inferior en móviles y superior en escritorio para que el contenido no quede debajo de la barra */}
      <body className="pb-16 md:pb-0 md:pt-16">
        <GlobalNav isAuthenticated={isAuthenticated} />
        {children}
      </body>
    </html>
  );
}
