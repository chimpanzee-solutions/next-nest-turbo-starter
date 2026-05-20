import type { ReactNode } from 'react';

type PageHeaderProps = {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-20 border-b bg-background/95 backdrop-blur">
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="text-md font-semibold">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
