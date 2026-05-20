'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

import { cn } from '@repo/web-utils';
import { Button } from './button';
import { DashboardSidebar } from './dashboard-sidebar';
import { Menu, X } from 'lucide-react';

export type DashboardFrameSidebar = {
  readonly header: ReactNode;
  readonly nav: ReactNode;
  readonly footer?: ReactNode;
  readonly widthClassName?: string;
};

type DashboardFrameProps = {
  readonly sidebar: DashboardFrameSidebar;
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
};

export function DashboardFrame({
  sidebar,
  children,
  className,
  contentClassName,
}: DashboardFrameProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [mobileSidebarOpen]);

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
  }

  function openMobileSidebar() {
    setMobileSidebarOpen(true);
  }

  function handleMobileNavClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest('a[href]')) {
      closeMobileSidebar();
    }
  }

  return (
    <div
      className={cn('h-screen overflow-hidden bg-background text-foreground lg:flex', className)}
    >
      <aside className={cn('hidden lg:block', sidebar.widthClassName ?? 'w-60 shrink-0')}>
        <DashboardSidebar header={sidebar.header} nav={sidebar.nav} footer={sidebar.footer} />
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          className={cn(
            'absolute inset-0 bg-slate-950/35 backdrop-blur-[1px] transition-opacity duration-200 ease-out',
            mobileSidebarOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={closeMobileSidebar}
        />

        <aside
          className={cn(
            'absolute inset-y-0 left-0 flex w-72 max-w-[86vw] flex-col shadow-xl transition-transform duration-300 ease-out',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <DashboardSidebar
            className="h-full"
            header={
              <div className="w-full flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">{sidebar.header}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close sidebar"
                  onClick={closeMobileSidebar}
                >
                  <X size={16} />
                </Button>
              </div>
            }
            nav={<div onClickCapture={handleMobileNavClick}>{sidebar.nav}</div>}
            footer={sidebar.footer}
          />
        </aside>
      </div>

      <div className={cn('flex min-w-0 flex-1 flex-col overflow-hidden', contentClassName)}>
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Open sidebar"
              onClick={openMobileSidebar}
            >
              <Menu size={16} />
            </Button>
            <div className="min-w-0 flex-1">{sidebar.header}</div>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
