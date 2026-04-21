import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ecotermic',
  description: 'Ecotermic application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <body>
        {children}
      </body>
    </html>
  );
}
