import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./profile-styles";

export const ProfileScreen = () => {
  const router = useRouter();

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("@/assets/images/user-image.jpg")}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                  backgroundColor: "#D7D9CF",
                }}
              />
            </View>
            <Text style={styles.userName}>Abraham Moreno</Text>
            <Text style={styles.userEmail}>morenoabraham.j@coresales.com</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información Personal</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cédula</Text>
              <Text style={styles.infoValue}>V-31228673</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>(412) 0263093</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Cargo</Text>
              <Text style={styles.infoValue}>Vendedor</Text>
            </View>
          </View>

          <View style={styles.secondCard}>
            <Text style={styles.cardTitle}>Configuración</Text>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Feather
                  name="bell"
                  size={20}
                  color="#61646B"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Notificaciones</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Feather
                  name="lock"
                  size={20}
                  color="#61646B"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Privacidad</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <Feather
                  name="help-circle"
                  size={20}
                  color="#61646B"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Ayuda</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
