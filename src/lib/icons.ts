import {
  BookOpen,
  Brain,
  Compass,
  Flame,
  Globe2,
  Lightbulb,
  Mountain,
  PenLine,
  Rocket,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Brain,
  BookOpen,
  Compass,
  Flame,
  Globe2,
  Mountain,
  PenLine,
  Rocket,
  Sparkles,
  Target,
  Zap,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIconComponent(name: string): LucideIcon {
  return ICON_MAP[name] || Lightbulb;
}
