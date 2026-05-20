type FormFieldAccessibilityOptions = {
  hasDescription: boolean;
  hasError: boolean;
};

type FormFieldAccessibility = {
  descriptionId?: string;
  errorId?: string;
  describedBy?: string;
};

function getFormFieldAccessibility(
  fieldId: string,
  { hasDescription, hasError }: FormFieldAccessibilityOptions,
): FormFieldAccessibility {
  const descriptionId = hasDescription ? `${fieldId}-description` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;
  const describedBy = [hasError ? errorId : null, !hasError ? descriptionId : null]
    .filter(Boolean)
    .join(' ');

  const accessibility: FormFieldAccessibility = {};

  if (descriptionId) {
    accessibility.descriptionId = descriptionId;
  }

  if (errorId) {
    accessibility.errorId = errorId;
  }

  if (describedBy) {
    accessibility.describedBy = describedBy;
  }

  return accessibility;
}

export { getFormFieldAccessibility };
export type { FormFieldAccessibility, FormFieldAccessibilityOptions };
