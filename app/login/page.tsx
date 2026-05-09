import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error as string | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 selection:bg-[#2bb6b1] selection:text-white">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-md w-full">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-16 w-auto object-contain" />
        </div>
        <h2 className="text-2xl font-black text-center text-[#175ca8] tracking-tight mb-8">Iniciar Sesión</h2>

        <form className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:ring-4 outline-none transition-all focus:bg-white text-slate-700"
              style={{ '--tw-ring-color': '#2bb6b122' } as any}
              placeholder="usuario@ecotermicsolar.com.mx"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:ring-4 outline-none transition-all focus:bg-white text-slate-700"
              style={{ '--tw-ring-color': '#2bb6b122' } as any}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button
            formAction={login}
            className="w-full flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:-translate-y-1 transition-all"
            style={{ backgroundColor: '#175ca8' }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}
