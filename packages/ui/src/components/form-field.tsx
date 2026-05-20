'use client';

import * as React from 'react';

import { cn } from '@repo/web-utils';
import { Label } from './label';

type FormFieldProps = {
  children: React.ReactNode;
  description?: React.ReactNode;
  descriptionId?: string;
  error?: React.ReactNode;
  errorId?: string;
  htmlFor?: string;
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  required?: boolean;
  className?: string;
  labelRowClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

function FormField({
  children,
  description,
  descriptionId,
  error,
  errorId,
  htmlFor,
  label,
  labelAction,
  required,
  className,
  labelRowClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <div className={cn('flex items-center justify-between gap-3', labelRowClassName)}>
          <Label htmlFor={htmlFor} className={labelClassName}>
            {label}
            {required ? (
              <span aria-hidden="true" className="ml-0.5 text-destructive">
                *
              </span>
            ) : null}
          </Label>
          {labelAction}
        </div>
      ) : null}
      {children}
      {!error && description ? (
        <p id={descriptionId} className={cn('text-xs text-muted-foreground', descriptionClassName)}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className={cn('text-xs text-destructive', errorClassName)}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
