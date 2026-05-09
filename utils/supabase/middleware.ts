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

  // Proteger todas las rutas excepto el login y rutas estáticas
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth')
  const isRootRoute = request.nextUrl.pathname === '/'

  if (!user && !isAuthRoute) {
    // Si no hay usuario y no está en una ruta de auth, redirigir al login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // Si ya está logueado y trata de acceder a login, redirigir al inicio
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Bloquear acceso por email: si el usuario está en la lista negra
  // y trata de acceder a rutas restringidas, redirigir a página de acceso denegado
  if (user && user.email && BLOCKED_EMAILS.includes(user.email)) {
    const isRestrictedPath = RESTRICTED_PATHS.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );
    if (isRestrictedPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/acceso-denegado'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
