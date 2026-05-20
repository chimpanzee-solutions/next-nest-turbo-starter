type AppBrandTitleProps = {
  readonly title?: string;
};

export function AppBrandTitle({ title }: AppBrandTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="font-mono flex size-10 items-center justify-center rounded-lg border bg-background text-xs font-medium text-muted-foreground">
        LOGO
      </div>
      <div>
        <div className="text-sm font-semibold">{title || 'Starter Template'}</div>
      </div>
    </div>
  );
}
