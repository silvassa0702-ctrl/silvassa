import Icon from './Icon';

interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  return (
    <div className={`toast-notification${show ? ' show' : ''}`}>
      <Icon name="check-circle-fill" /> <span>{message}</span>
    </div>
  );
}
