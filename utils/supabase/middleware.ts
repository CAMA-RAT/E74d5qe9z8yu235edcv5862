import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Lista de emails sin acceso a módulos restringidos
const BLOCKED_EMAILS = ['asisttup@gmail.com'];
// Rutas protegidas que los usuarios bloqueados no pueden ver
const RESTRICTED_PATHS = ['/cotizaciones'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refrescar el token de sesión (muy importante)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth')
    const isDeniedRoute = pathname.startsWith('/acceso-denegado')

    if (!user && !isAuthRoute && !isDeniedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Bloquear acceso por email a rutas restringidas
    if (user && user.email && BLOCKED_EMAILS.includes(user.email.toLowerCase())) {
      const isRestrictedPath = RESTRICTED_PATHS.some(path => pathname.startsWith(path))
      if (isRestrictedPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/acceso-denegado'
        return NextResponse.redirect(url)
      }
    }
  } catch (e) {
    // Si algo falla en el middleware, dejamos pasar la request
    // para no bloquear la app entera en producción
    console.warn('Middleware error:', e)
  }

  return supabaseResponse
}
