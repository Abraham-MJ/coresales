import { Tabs } from "expo-router";
import React from "react";
import { CustomTabBar } from "@presentation/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Venta",
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: "Contenido",
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
