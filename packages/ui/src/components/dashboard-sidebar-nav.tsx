import type { ReactNode } from 'react';

import { cn } from '@repo/web-utils';
import { DashboardSidebarNavItem, type DashboardNavItem } from './dashboard-sidebar-nav-item';

export type DashboardNavSection = {
  readonly label: string;
  readonly items: readonly DashboardNavItem[];
};

type DashboardSidebarNavProps = {
  readonly sections: readonly DashboardNavSection[];
  readonly pathname?: string;
  readonly onItemClick?: () => void;
  readonly renderLink?: (props: {
    href: string;
    className: string;
    onClick?: () => void;
    children: ReactNode;
  }) => ReactNode;
  readonly className?: string;
};

export function DashboardSidebarNav({
  sections,
  pathname,
  onItemClick,
  renderLink,
  className,
}: DashboardSidebarNavProps) {
  return (
    <nav className={cn('py-3', className)}>
      {sections.map((section) => (
        <div key={section.label} className="mb-3.5 last:mb-0">
          <div className="px-3 pb-1 font-mono text-[10px] font-semibold uppercase text-muted-foreground">
            {section.label}
          </div>

          <div className="space-y-px">
            {section.items.map((item) => {
              const itemProps = {
                item,
                active: item.href ? pathname === item.href : false,
                ...(onItemClick ? { onClick: onItemClick } : {}),
                ...(renderLink ? { renderLink } : {}),
              };

              return <DashboardSidebarNavItem key={item.label} {...itemProps} />;
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
