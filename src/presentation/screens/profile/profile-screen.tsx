import Feather from "@expo/vector-icons/Feather";
import { useProfile } from "@presentation/hooks/useProfile";
import { API_CONFIG } from "@shared/constants/api.constants";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./profile-styles";

export const ProfileScreen = () => {
  const router = useRouter();
  const { data, loading, logout } = useProfile();
  
  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!data?.salesRep) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No se pudo cargar el perfil</Text>
      </SafeAreaView>
    );
  }

  const { salesRep, user } = data;
  const avatarUrl = user?.avatar ? `${API_CONFIG.DOMAIN_URL}${user.avatar}` : null;

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    backgroundColor: "#D7D9CF",
                  }}
                />
              ) : (
                <View style={{
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                  backgroundColor: "#D7D9CF",
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 40, color: '#fff' }}>
                    {salesRep.first_names.charAt(0)}{salesRep.last_names.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.userName}>
              {salesRep.first_names} {salesRep.last_names}
            </Text>
            <Text style={styles.userEmail}>{salesRep.email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información Personal</Text>
            {salesRep.document_number && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cédula</Text>
                <Text style={styles.infoValue}>{salesRep.document_number}</Text>
              </View>
            )}
            {salesRep.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{salesRep.phone}</Text>
              </View>
            )}
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
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
