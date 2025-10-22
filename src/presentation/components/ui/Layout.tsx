import { LayoutProps, Layout as UIKittenLayout } from '@ui-kitten/components';
import React from 'react';

interface CustomLayoutProps extends LayoutProps {
  children: React.ReactNode;
  level?: '1' | '2' | '3' | '4';
}

export function Layout({ 
  children, 
  level = '1',
  ...props 
}: CustomLayoutProps) {
  return (
    <UIKittenLayout level={level} {...props}>
      {children}
    </UIKittenLayout>
  );
}