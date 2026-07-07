import Link from 'next/link';

export default function AccesoDenegadoPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ecologo.svg" alt="Ecotermic" className="h-16 w-auto object-contain mx-auto mb-6" />

        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-slate-800 mb-2">Acceso Restringido</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Lo sentimos, tu cuenta no tiene los permisos necesarios para acceder a este módulo. Si crees que esto es un error, contacta a tu administrador.
        </p>

      </div>
    </div>
  );
}
