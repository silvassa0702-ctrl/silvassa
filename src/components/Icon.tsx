export type IconName =
  | 'grid-fill' | 'square-fill' | 'circle-fill' | 'cup-hot-fill' | 'snow'
  | 'x-lg' | 'house-fill' | 'telephone-fill' | 'chat-heart-fill'
  | 'arrow-right' | 'arrow-left' | 'envelope-fill' | 'whatsapp' | 'geo-alt-fill'
  | 'emoji-frown' | 'star-fill' | 'clock' | 'heart' | 'heart-fill'
  | 'check2' | 'check2-circle' | 'check-circle-fill' | 'pie-chart' | 'bag-plus'
  | 'chevron-right' | 'pencil-square' | 'trash3' | 'arrow-repeat';

interface IconProps {
  name: IconName;
}

/** Renders an icon from src/icons.css (no icon library needed). */
export default function Icon({ name }: IconProps) {
  return <i className={`bi bi-${name}`} aria-hidden="true" />;
}
