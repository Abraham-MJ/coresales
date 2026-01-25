import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

import { CustomTabBar } from "@presentation/components/CustomTabBar";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          position: "absolute",
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
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0C352E",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
              }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: "Contenido",
          tabBarStyle: { display: "none" },
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0C352E",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
              }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarStyle: { display: "none" },
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0C352E",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
              }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
