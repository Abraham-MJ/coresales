import { CardProps, Card as UIKittenCard } from '@ui-kitten/components';
import React from 'react';

interface CustomCardProps extends CardProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CustomCardProps) {
  return (
    <UIKittenCard {...props}>
      {children}
    </UIKittenCard>
  );
}