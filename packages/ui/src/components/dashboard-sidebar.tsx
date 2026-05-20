import type { ReactNode } from 'react';

import { cn } from '@repo/web-utils';

type DashboardSidebarProps = {
  readonly header: ReactNode;
  readonly nav: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string;
};

export function DashboardSidebar({ header, nav, footer, className }: DashboardSidebarProps) {
  return (
    <div className={cn('flex h-full flex-col overflow-hidden border-r bg-background', className)}>
      <div className="flex h-20 w-full items-center border-b px-3">{header}</div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3">{nav}</div>
      {footer ? <div className="shrink-0 border-t px-3">{footer}</div> : null}
    </div>
  );
}
