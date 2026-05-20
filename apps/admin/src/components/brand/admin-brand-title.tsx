import { cn } from '@repo/web-utils';

type AdminBrandTitleProps = {
  readonly className?: string;
};

export function AdminBrandTitle({ className }: AdminBrandTitleProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="font-mono flex size-10 items-center justify-center rounded-lg border bg-background text-xs font-medium text-muted-foreground">
        LOGO
      </div>
      <div>
        <div className="text-sm font-semibold">Starter Template</div>
      </div>
    </div>
  );
}
