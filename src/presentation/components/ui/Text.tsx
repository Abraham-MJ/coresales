import { TextProps, Text as UIKittenText } from '@ui-kitten/components';
import React from 'react';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'paragraph1' | 'paragraph2' | 'caption1' | 'caption2' | 'label';
  children: React.ReactNode;
}

export function Text({ 
  variant = 'paragraph1', 
  children, 
  category,
  ...props 
}: CustomTextProps) {
  const getCategory = () => {
    if (category) return category;
    
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'h6':
        return 'h6';
      case 'subtitle1':
        return 's1';
      case 'subtitle2':
        return 's2';
      case 'paragraph1':
        return 'p1';
      case 'paragraph2':
        return 'p2';
      case 'caption1':
        return 'c1';
      case 'caption2':
        return 'c2';
      case 'label':
        return 'label';
      default:
        return 'p1';
    }
  };

  return (
    <UIKittenText category={getCategory()} {...props}>
      {children}
    </UIKittenText>
  );
}