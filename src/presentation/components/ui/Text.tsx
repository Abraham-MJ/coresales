import { TextProps, Text as UIKittenText } from '@ui-kitten/components';
import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveFontSize = (baseSize: number, variant: string): number => {
  const scale = SCREEN_WIDTH / 390;
  const newSize = baseSize * scale;

  let minScale = 0.8;
  let maxScale = 1.4;

  if (variant === 'hero' || variant === 'display') {
    minScale = 0.7;
    maxScale = 2.5;
  } else if (variant === 'h1' || variant === 'h2') {
    minScale = 0.75;
    maxScale = 2.0;
  } else if (variant === 'h3' || variant === 'h4') {
    minScale = 0.8;
    maxScale = 1.7;
  }

  const minSize = baseSize * minScale;
  const maxSize = baseSize * maxScale;

  return Math.round(PixelRatio.roundToNearestPixel(
    Math.max(minSize, Math.min(newSize, maxSize))
  ));
};

interface CustomTextProps extends TextProps {
  variant?: 'hero' | 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'paragraph1' | 'paragraph2' | 'caption1' | 'caption2' | 'label';
  children: React.ReactNode;
}

export function Text({
  variant = 'paragraph1',
  children,
  category,
  style,
  ...props
}: CustomTextProps) {
  const getCategory = () => {
    if (category) return category;

    switch (variant) {
      case 'hero': return 'h1';
      case 'display': return 'h1';
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'subtitle1': return 's1';
      case 'subtitle2': return 's2';
      case 'paragraph1': return 'p1';
      case 'paragraph2': return 'p2';
      case 'caption1': return 'c1';
      case 'caption2': return 'c2';
      case 'label': return 'label';
      default: return 'p1';
    }
  };

  const getBaseFontSize = () => {
    switch (variant) {
      case 'hero': return 48;
      case 'display': return 40;
      case 'h1': return 32;
      case 'h2': return 28;
      case 'h3': return 24;
      case 'h4': return 20;
      case 'h5': return 18;
      case 'h6': return 16;
      case 'subtitle1': return 16;
      case 'subtitle2': return 14;
      case 'paragraph1': return 16;
      case 'paragraph2': return 14;
      case 'caption1': return 12;
      case 'caption2': return 10;
      case 'label': return 12;
      default: return 16;
    }
  };

  const responsiveFontSize = getResponsiveFontSize(getBaseFontSize(), variant);

  const responsiveStyle = {
    fontSize: responsiveFontSize,
    lineHeight: responsiveFontSize * 1.3,
  };

  const combinedStyle = [responsiveStyle, style];

  return (
    <UIKittenText category={getCategory()} style={combinedStyle} {...props}>
      {children}
    </UIKittenText>
  );
}