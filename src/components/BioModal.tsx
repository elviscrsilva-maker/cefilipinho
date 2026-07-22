import { X } from "lucide-react";
import { useEffect } from "react";

export function BioModal({
  open,
  onClose,
  name,
  role,
  photoUrl,
  bio,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  role?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-card shadow-elegant overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fechar" className="absolute top-3 right-3 z-10 h-9 w-9 grid place-items-center rounded-full bg-background/90 border border-border hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
        <div className="grid sm:grid-cols-[220px_1fr]">
          <div className="aspect-square sm:aspect-auto bg-secondary">
            {photoUrl ? (
              <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-muted-foreground text-xs">Sem foto</div>
            )}
          </div>
          <div className="p-6">
            {role && <div className="text-xs uppercase tracking-widest text-primary/70">{role}</div>}
            <h3 className="mt-1 font-display text-2xl text-primary font-semibold">{name}</h3>
            <div className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-h-[50vh] overflow-y-auto">
              {bio?.trim() ? bio : "Currículo em breve."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
