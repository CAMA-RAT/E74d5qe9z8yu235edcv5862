-- 1. Crear tabla de roles de usuario
CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'reportero'))
);

-- Habilitar RLS en user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas para user_roles (solo lectura pública para que la app pueda consultarlos)
CREATE POLICY "Lectura publica de roles" ON user_roles FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar roles" ON user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur WHERE ur.id = auth.uid() AND ur.role = 'admin')
);

-- 2. Crear tabla de cotizaciones
CREATE TABLE cotizaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio TEXT NOT NULL UNIQUE,
  fecha DATE NOT NULL,
  cliente_nombre TEXT,
  cliente_telefono TEXT,
  cliente_correo TEXT,
  cliente_direccion TEXT,
  tasa_iva NUMERIC DEFAULT 16,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  iva NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  estado TEXT DEFAULT 'borrador', -- borrador, enviada, aceptada, rechazada
  partidas JSONB NOT NULL DEFAULT '[]', -- Array de objetos: { desc, cant, unit }
  notas JSONB NOT NULL DEFAULT '[]', -- Array de objetos: { text }
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en cotizaciones
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para cotizaciones

-- A. REPORTERO, EDITOR y ADMIN pueden LEER (SELECT)
CREATE POLICY "Lectura de cotizaciones para todos los roles" ON cotizaciones
FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.id = auth.uid())
);

-- B. EDITOR y ADMIN pueden CREAR (INSERT)
CREATE POLICY "Creación de cotizaciones (Editor/Admin)" ON cotizaciones
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.id = auth.uid() AND role IN ('admin', 'editor'))
);

-- C. EDITOR y ADMIN pueden ACTUALIZAR (UPDATE)
CREATE POLICY "Edición de cotizaciones (Editor/Admin)" ON cotizaciones
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.id = auth.uid() AND role IN ('admin', 'editor'))
);

-- D. Solo ADMIN puede ELIMINAR (DELETE)
CREATE POLICY "Eliminación de cotizaciones (Admin)" ON cotizaciones
FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.id = auth.uid() AND role = 'admin')
);
