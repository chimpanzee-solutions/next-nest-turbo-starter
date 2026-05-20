'use client';

import * as React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { getFormFieldAccessibility } from '../lib/form-field-accessibility';
import { cn } from '@repo/web-utils';
import { FormField } from './form-field';
import { Input } from './input';

type FormInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  labelAction?: ReactNode;
  required?: boolean;
  description?: ReactNode;
  icon?: ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
  labelRowClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
} & Omit<
  ComponentProps<typeof Input>,
  'defaultValue' | 'id' | 'name' | 'onBlur' | 'onChange' | 'value'
>;

function FormInputField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  labelAction,
  required,
  description,
  icon,
  id,
  disabled,
  className,
  labelRowClassName,
  inputClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  type = 'text',
  ...inputProps
}: FormInputFieldProps<TFieldValues, TName>) {
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
  const formFieldProps = {
    htmlFor: fieldId,
    label,
    ...(labelAction ? { labelAction } : {}),
    ...(required !== undefined ? { required } : {}),
    ...(description ? { description } : {}),
    ...(descriptionId ? { descriptionId } : {}),
    ...(fieldState.error?.message ? { error: fieldState.error.message } : {}),
    ...(errorId ? { errorId } : {}),
    ...(className ? { className } : {}),
    ...(labelRowClassName ? { labelRowClassName } : {}),
    ...(labelClassName ? { labelClassName } : {}),
    ...(descriptionClassName ? { descriptionClassName } : {}),
    ...(errorClassName ? { errorClassName } : {}),
  };

  return (
    <FormField {...formFieldProps}>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <Input
          {...inputProps}
          {...field}
          id={fieldId}
          type={type}
          value={field.value ?? ''}
          disabled={disabled}
          aria-invalid={!!fieldState.error}
          aria-describedby={describedBy}
          className={cn(icon ? 'pl-9' : undefined, inputClassName)}
        />
      </div>
    </FormField>
  );
}

export { FormInputField };
export type { FormInputFieldProps };
