import { InputProps, Input as UIKittenInput } from '@ui-kitten/components';
import React from 'react';

interface CustomInputProps extends Omit<InputProps, 'status' | 'caption'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText,
  ...props 
}: CustomInputProps) {
  return (
    <UIKittenInput
      label={label}
      caption={error || helperText}
      status={error ? 'danger' : 'basic'}
      size="medium"
      {...props}
    />
  );
}