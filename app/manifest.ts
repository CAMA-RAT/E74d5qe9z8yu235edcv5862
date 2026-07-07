import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ecotermic Reportes',
    short_name: 'Ecotermic',
    description: 'Sistema de Reportes y Cotizaciones Ecotermic',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#175ca8',
    icons: [
      {
        src: '/ecologo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/ecologo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
