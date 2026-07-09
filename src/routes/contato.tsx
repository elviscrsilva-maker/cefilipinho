import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useContactContent } from "@/lib/content";

const TITLE = "Contato — Centro de Especialidades Filipinho";
const DESC =
  "Fale com o Centro de Especialidades Filipinho — endereço, telefone, e-mail e horários de atendimento em São Luís/MA.";

export const Route = createFileRoute("/contato")({
  component: Contato,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
});

function Contato() {
  const [sent, setSent] = useState(false);
  const { data: contact } = useContactContent();
  const c = contact!;
  const phoneHref = "tel:+" + c.whatsapp.replace(/\D/g, "");
  const waHref = `https://wa.me/${c.whatsapp.replace(/\D/g, "")}`;
  const mapSrc =
    c.map_embed_url ||
    `https://www.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`;
  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-widest text-gold">Contato</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Fale conosco</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
            Estamos à disposição para dúvidas, orientações e informações sobre atendimento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <InfoCard icon={MapPin} title="Endereço" text={c.address} />
          <InfoCard icon={Phone} title="Telefone" text={c.phone} href={phoneHref} />
          <InfoCard icon={MessageCircle} title="WhatsApp" text={c.phone} href={waHref} />
          <InfoCard icon={Mail} title="E-mail" text={c.email} href={`mailto:${c.email}`} />
          <InfoCard icon={Clock} title="Horário" text={c.hours} />

          <div className="rounded-2xl overflow-hidden border border-border shadow-card">
            <iframe
              title="Mapa - Centro Filipinho"
              src={mapSrc}
              width="100%"
              height="280"
              loading="lazy"
              className="block"
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-2xl bg-card border border-border p-8 shadow-card space-y-5"
        >
          <h2 className="font-display text-2xl text-primary font-semibold">Envie uma mensagem</h2>
          <Field label="Nome completo" name="nome" required />
          <Field label="E-mail" name="email" type="email" required />
          <Field label="Telefone" name="telefone" type="tel" />
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Mensagem</label>
            <textarea
              name="mensagem"
              required
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card hover:brightness-110 transition"
          >
            <Send className="h-4 w-4" /> Enviar mensagem
          </button>
          {sent && (
            <p className="text-sm text-primary bg-secondary rounded-md p-3">
              Obrigado! Sua mensagem foi registrada. Retornaremos em breve.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            * Este formulário é ilustrativo. Podemos conectar a um e-mail real ou WhatsApp no próximo ajuste.
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof MapPin;
  title: string;
  text: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-elegant transition">
      <div className="h-11 w-11 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-primary">{title}</div>
        <div className="text-muted-foreground text-sm mt-0.5">{text}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
