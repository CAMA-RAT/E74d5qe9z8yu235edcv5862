"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ArrowLeft, LogOut } from 'lucide-react';
import { signout } from '../app/actions/auth';

export function GlobalNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isAuthenticated) return null;
  if (pathname === '/login') return null;

  const isHome = pathname === '/';

  const navItemClass = "flex flex-col items-center justify-center p-2 text-slate-500 hover:text-[#175ca8] transition-colors w-20";
  const iconClass = "mb-1";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:bottom-auto md:top-0 md:border-t-0 md:border-b md:h-16 flex items-center print:hidden">
      <div className="max-w-6xl mx-auto w-full px-4 h-16 flex items-center justify-between md:justify-end md:gap-4">
        
        {/* Retroceder (Oculto en Home) */}
        <div className="flex-1 md:flex-none flex justify-start md:justify-center">
          {!isHome && (
            <button 
              onClick={() => router.back()} 
              className={navItemClass}
              title="Retroceder"
            >
              <ArrowLeft size={24} className={iconClass} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Atrás</span>
            </button>
          )}
        </div>

        {/* Menú Principal */}
        <div className="flex-1 md:flex-none flex justify-center">
          {!isHome && (
            <button 
              onClick={() => router.push('/')} 
              className={navItemClass}
              title="Ir al Menú Principal"
            >
              <Home size={24} className={iconClass} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Menú</span>
            </button>
          )}
        </div>

        {/* Cerrar Sesión */}
        <div className="flex-1 md:flex-none flex justify-end md:justify-center">
          <form action={signout} className="flex">
            <button 
              type="submit" 
              className={`${navItemClass} !text-rose-500 hover:!text-rose-700`}
              title="Cerrar Sesión"
            >
              <LogOut size={24} className={iconClass} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Salir</span>
            </button>
          </form>
        </div>

      </div>
    </nav>
  );
}
