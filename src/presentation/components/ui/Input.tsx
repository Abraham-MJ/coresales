import { InputProps, Text, Input as UIKittenInput } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CustomInputProps extends Omit<InputProps, 'status' | 'caption'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: object;
  required?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  containerStyle,
  required = false,
  style,
  ...props
}: CustomInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} category="label">
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <UIKittenInput
        status={error ? 'danger' : 'basic'}
        size="large"
        style={[styles.input, style]}
        textStyle={styles.inputText}
        {...props}
      />
      
      <Text 
        style={[
          styles.caption, 
          error ? styles.errorText : styles.helperText
        ]}
        category="c1"
      >
        {error || helperText || ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  required: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e1e5e9',
    backgroundColor: '#ffffff',
    minHeight: 48,
  },
  inputText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 20,
  },
  caption: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    minHeight: 16,
  },
  errorText: {
    color: '#e74c3c',
  },
  helperText: {
    color: '#7f8c8d',
  },
});