import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#DDEFFF] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#4DA6FF]" />
      </div>

      <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-[#6B7280] mb-6 max-w-sm">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
