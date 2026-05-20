'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { getFormFieldAccessibility } from '../lib/form-field-accessibility';
import { cn } from '@repo/web-utils';
import { Checkbox } from './checkbox';

type FormCheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

function FormCheckboxField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  id,
  disabled,
  className,
  checkboxClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: FormCheckboxFieldProps<TFieldValues, TName>) {
  const generatedId = React.useId();
  const fieldId = id ?? `${generatedId}-${String(name)}`;
  const { field, fieldState } = useController({
    control,
    name,
  });
  const { descriptionId, errorId, describedBy } = getFormFieldAccessibility(fieldId, {
    hasDescription: !!description,
    hasError: !!fieldState.error,
  });

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-2.5">
        <Checkbox
          id={fieldId}
          checked={field.value === true}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          onBlur={field.onBlur}
          disabled={disabled}
          aria-invalid={!!fieldState.error}
          aria-describedby={describedBy}
          className={checkboxClassName}
        />
        <div className="space-y-1">
          {label ? (
            <label
              htmlFor={fieldId}
              className={cn(
                'cursor-pointer text-sm text-foreground',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName,
              )}
            >
              {label}
            </label>
          ) : null}
          {!fieldState.error && description ? (
            <p
              id={descriptionId}
              className={cn('text-xs text-muted-foreground', descriptionClassName)}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {fieldState.error ? (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className={cn('text-xs text-destructive', errorClassName)}
        >
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  );
}

export { FormCheckboxField };
export type { FormCheckboxFieldProps };
