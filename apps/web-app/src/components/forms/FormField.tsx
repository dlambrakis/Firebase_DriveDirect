import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Input, Label, Textarea, InputProps, TextareaProps } from '@directdrive/ui';

// Base props common to all form fields
type CommonProps<T extends FieldValues> = {
  label: string;
  name: Path<T>; // Use Path<T> for strong typing with react-hook-form
  error?: string;
  register?: UseFormRegister<T>; // Allow passing the register function
};

// Discriminated union for specific input/textarea props
type FormFieldProps<T extends FieldValues> = CommonProps<T> &
  (
    | ({ as?: 'input' } & Omit<InputProps, 'name'>)
    | ({ as: 'textarea' } & Omit<TextareaProps, 'name'>)
  );

// The component is now generic to accept the form's value types
export const FormField = <T extends FieldValues>({
  label,
  name,
  error,
  register,
  ...props
}: FormFieldProps<T>) => {
  const id = `field-${name}`;
  const registration = register ? register(name) : { name };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id} className={error ? 'text-error' : ''}>
        {label}
      </Label>
      {props.as === 'textarea' ? (
        <Textarea
          id={id}
          {...(props as Omit<TextareaProps, 'as'>)}
          {...registration}
          aria-invalid={!!error}
        />
      ) : (
        <Input
          id={id}
          {...(props as Omit<InputProps, 'as'>)}
          {...registration}
          aria-invalid={!!error}
        />
      )}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
};

// It's good practice to provide a default export if it's the main export of the file
export default FormField;
