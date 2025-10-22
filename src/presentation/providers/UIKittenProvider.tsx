import * as eva from '@eva-design/eva';
import { useColorScheme } from '@presentation/hooks/use-color-scheme';
import { customDarkTheme, customTheme } from '@shared/constants/theme';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';

interface UIKittenProviderProps {
  children: React.ReactNode;
}

export function UIKittenProvider({ children }: UIKittenProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? customDarkTheme : customTheme;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        {children}
      </ApplicationProvider>
    </>
  );
}