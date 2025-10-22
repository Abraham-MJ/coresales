import { useColorScheme } from '@presentation/hooks/use-color-scheme';
import { Colors } from '@shared/constants/theme';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  
  const backgroundColor = lightColor && darkColor 
    ? (colorScheme === 'dark' ? darkColor : lightColor)
    : Colors[colorScheme ?? 'light'].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
