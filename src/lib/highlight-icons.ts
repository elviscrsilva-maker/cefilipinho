import {
  Stethoscope,
  Users,
  Microscope,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Activity,
  Baby,
  Brain,
  Syringe,
  Eye,
  Bone,
  Clock,
  MapPin,
  Phone,
  Award,
  type LucideIcon,
} from "lucide-react";

export const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  Users,
  Microscope,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Activity,
  Baby,
  Brain,
  Syringe,
  Eye,
  Bone,
  Clock,
  MapPin,
  Phone,
  Award,
};

export const HIGHLIGHT_ICON_NAMES = Object.keys(HIGHLIGHT_ICONS);

export function highlightIcon(name: string | undefined): LucideIcon {
  return (name && HIGHLIGHT_ICONS[name]) || Stethoscope;
}
