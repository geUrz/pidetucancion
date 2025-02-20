/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Manténlo en desarrollo para detectar errores
  images: {
    domains: ['localhost'], // Permitir imágenes desde localhost
  },
};

export default nextConfig;
