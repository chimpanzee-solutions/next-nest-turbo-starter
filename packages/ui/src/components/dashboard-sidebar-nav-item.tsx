import type { ComponentType, ReactNode } from 'react';

import { Badge } from './badge';
import { cn } from '@repo/web-utils';

type NavIconComponent = ComponentType<{ size?: number; className?: string }>;

export type DashboardNavItem = {
  readonly label: string;
  readonly href?: string;
  readonly icon: NavIconComponent;
  readonly badge?: ReactNode;
  readonly disabled?: boolean;
};

type DashboardSidebarNavItemProps = {
  readonly item: DashboardNavItem;
  readonly active?: boolean;
  readonly onClick?: () => void;
  readonly renderLink?: (props: {
    href: string;
    className: string;
    onClick?: () => void;
    children: ReactNode;
  }) => ReactNode;
};

export function DashboardSidebarNavItem({
  item,
  active = false,
  onClick,
  renderLink,
}: DashboardSidebarNavItemProps) {
  const Icon = item.icon;
  const className = cn(
    'relative flex items-center gap-3 rounded-md py-1.5 pr-2.5 pl-3.5 text-sm transition-all',
    active &&
      'bg-accent font-medium text-accent-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_8%,transparent)]',
    item.href &&
      !active &&
      'font-normal text-muted-foreground hover:bg-foreground/4 hover:text-foreground',
    !item.href && 'cursor-default font-normal text-muted-foreground/80',
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 left-0 h-[60%] w-[3px] -translate-y-1/2 rounded-r-[3px] bg-primary transition-all',
          active ? 'scale-y-100 opacity-100' : 'scale-y-40 opacity-0',
        )}
      />
      <Icon
        size={16}
        className={cn(
          'shrink-0 transition-colors',
          active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? item.badge : null}
      {item.disabled ? (
        <Badge
          variant="secondary"
          className="rounded-full px-1.5 py-0 font-mono text-[10px] font-medium"
        >
          Soon
        </Badge>
      ) : null}
    </>
  );

  if (!item.href) {
    return (
      <div aria-disabled="true" className={className}>
        {content}
      </div>
    );
  }

  if (renderLink) {
    const linkProps = {
      href: item.href,
      className: cn(className, 'group'),
      children: content,
      ...(onClick ? { onClick } : {}),
    };

    return renderLink(linkProps);
  }

  return (
    <a href={item.href} className={cn(className, 'group')} onClick={onClick}>
      {content}
    </a>
  );
}
