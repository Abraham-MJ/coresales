import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function AppLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="leads/create"
        options={{
          title: "Lead",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0C352E",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back-ios" size={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="activities/index" />
      <Stack.Screen name="activities/[id]" />
      <Stack.Screen
        name="content/[id]"
        options={{
          title: "Contenido",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0C352E",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back-ios" size={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="sales/create" />
    </Stack>
  );
}
