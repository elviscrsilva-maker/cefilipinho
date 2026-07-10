
-- 1) Trigger para promover admin no signup
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

-- 2) Backfill para qualquer usuário já criado com esse email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'elviscrsilva@gmail.com'
ON CONFLICT DO NOTHING;

-- 3) Tabela de especialidades / serviços
CREATE TYPE public.specialty_category AS ENUM ('medica','nao_medica','procedimento','exame');

CREATE TABLE public.specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category specialty_category NOT NULL,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'Stethoscope',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.specialties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.specialties TO authenticated;
GRANT ALL ON public.specialties TO service_role;

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon specialties read" ON public.specialties FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth specialties read" ON public.specialties FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin specialties insert" ON public.specialties FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin specialties update" ON public.specialties FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin specialties delete" ON public.specialties FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER specialties_set_updated BEFORE UPDATE ON public.specialties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) Seed
INSERT INTO public.specialties (category,name,icon,sort_order) VALUES
('medica','Cardiologia','Heart',10),
('medica','Dermatologia','Sparkles',20),
('medica','Endocrinologia','Activity',30),
('medica','Hematologia','Droplet',40),
('medica','Gastroenterologia','Utensils',50),
('medica','Nefrologia','ShieldPlus',60),
('medica','Neurologia','Brain',70),
('medica','Otorrinolaringologia','Ear',80),
('medica','Pneumologia','Wind',90),
('medica','Proctologia','Baby',100),
('medica','Reumatologia','Stethoscope',110),
('medica','Urologia','HandHeart',120),
('medica','Ortopedia','Bone',130),
('nao_medica','Enfermagem','Syringe',10),
('nao_medica','Farmácia','Pill',20),
('nao_medica','Nutrição','Apple',30),
('nao_medica','Serviço Social','Users',40),
('nao_medica','Psicologia','Brain',50),
('nao_medica','Fisioterapia Pélvica','Waves',60),
('procedimento','Retirada de Cerúmen','Stethoscope',10),
('procedimento','Infiltração em Articulações','Stethoscope',20),
('procedimento','Coleta de exames Laboratoriais','TestTube',30),
('procedimento','Procedimentos Dermatológicos','Sparkles',40),
('exame','Eletroencefalograma','Zap',10),
('exame','Eletrocardiograma','HeartPulse',20),
('exame','Ecodopplercardiograma','ScanLine',30),
('exame','Holter','Activity',40),
('exame','MAPA','Radio',50),
('exame','Ultrassonografia','TestTube',60);
