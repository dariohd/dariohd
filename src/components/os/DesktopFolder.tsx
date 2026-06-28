import { DesktopIcon } from './DesktopIcon';

interface DesktopFolderProps {
  icon: string;
  label: string;
  color: string;
  onOpen: () => void;
}

export function DesktopFolder({ icon, label, color, onOpen }: DesktopFolderProps) {
  return (
    <div className="desktop-folder">
      <DesktopIcon
        icon={icon}
        label={label}
        color={color}
        onOpen={onOpen}
      />
    </div>
  );
}
