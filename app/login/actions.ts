'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient()
  } catch (e) {
    console.error('Error al crear cliente de Supabase:', e)
    redirect('/login?error=Error+de+configuración+del+servidor.+Contacta+al+administrador.')
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  let error;
  try {
    const result = await supabase.auth.signInWithPassword(data)
    error = result.error
  } catch (e) {
    console.error('Error de red al contactar Supabase:', e)
    redirect('/login?error=No+se+pudo+conectar+con+el+servidor.+Verifica+tu+conexión+o+intenta+más+tarde.')
  }

  if (error) {
    const msg =
      error.message === 'Invalid login credentials'
        ? 'Correo o contraseña incorrectos.'
        : encodeURIComponent(error.message)
    console.error('Error de Supabase al iniciar sesión:', error.message)
    redirect(`/login?error=${msg}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
