declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  export type LucideIcon = React.FC<LucideProps>;
  export const Sparkles: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Compass: LucideIcon;
  export const HeartHandshake: LucideIcon;
  export const Settings: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Menu: LucideIcon;
  export const Activity: LucideIcon;
  export const Zap: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Bookmark: LucideIcon;
  export const Trash2: LucideIcon;
  export const X: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Search: LucideIcon;
  export const Volume2: LucideIcon;
  export const VolumeX: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const Share2: LucideIcon;
  export const Loader2: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Filter: LucideIcon;
  export const Shield: LucideIcon;
  export const Scale: LucideIcon;
  export const Heart: LucideIcon;
  export const Sliders: LucideIcon;
  export const Server: LucideIcon;
  export const Type: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Send: LucideIcon;
  export const Square: LucideIcon;
  export const CornerDownLeft: LucideIcon;
  export const Globe: LucideIcon;
  export const Layers: LucideIcon;
  export const User: LucideIcon;
  const icons: { [key: string]: LucideIcon };
  export default icons;
}
