import type { ReactNode } from 'react';

import { LogOut, Moon, Sun } from 'lucide-react';

import { Avatar, AvatarFallback } from './avatar';
import { Button } from './button';
import { cn } from '@repo/web-utils';

type DashboardSidebarFooterProps = {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly avatarFallback: ReactNode;
  readonly theme: 'light' | 'dark';
  readonly onToggleTheme: () => void;
  readonly onLogout: () => void;
  readonly className?: string;
};

export function DashboardSidebarFooter({
  title,
  subtitle,
  avatarFallback,
  theme,
  onToggleTheme,
  onLogout,
  className,
}: DashboardSidebarFooterProps) {
  return (
    <div className={cn('flex items-center gap-2.5 rounded-md py-3', className)}>
      <Avatar className="size-8 after:border-transparent">
        <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{title}</div>
        {subtitle ? <div className="truncate text-xs text-muted-foreground">{subtitle}</div> : null}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className="text-muted-foreground hover:text-foreground"
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Sign out"
        className="text-muted-foreground hover:text-foreground"
        onClick={onLogout}
      >
        <LogOut size={16} />
      </Button>
    </div>
  );
}
