import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.9', '192.168.1.8', '192.168.1.10'], // Agregamos un par por si el IP de tu celular cambia ligeramente
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
};

export default nextConfig;
