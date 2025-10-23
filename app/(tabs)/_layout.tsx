import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@presentation/components/haptic-tab";
import { IconSymbol } from "@presentation/components/ui/icon-symbol";
import { useColorScheme } from "@presentation/hooks/use-color-scheme";
import { Colors } from "@shared/constants/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
