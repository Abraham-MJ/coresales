import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useLeadDetail } from "@presentation/hooks/useLeadDetail";
import { StyleSheet } from "react-native";

export default function LeadDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { lead, loading } = useLeadDetail(id || '');

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0C352E" />
          <Text style={styles.loadingText}>Cargando lead...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lead) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Lead no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Lead</Text>
          <TouchableOpacity 
            onPress={() => router.push(`/(app)/leads/${id}/edit` as any)}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Información Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={20} color="#0C352E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre Completo</Text>
                <Text style={styles.infoValue}>
                  {lead.first_name} {lead.last_name}
                </Text>
              </View>
            </View>

            {lead.email && (
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Feather name="mail" size={20} color="#0C352E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{lead.email}</Text>
                </View>
              </View>
            )}

            {lead.phone && (
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Feather name="phone" size={20} color="#0C352E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Teléfono</Text>
                  <Text style={styles.infoValue}>
                    {lead.phone_code} {lead.phone}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Información Adicional */}
          {lead.custom_data && Object.keys(lead.custom_data).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Adicional</Text>
              
              {Object.entries(lead.custom_data).map(([key, value]) => {
                // Saltar objetos complejos como ubicación
                if (typeof value === 'object' && value !== null) {
                  if ('latitude' in value && 'longitude' in value) {
                    return (
                      <View key={key} style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                          <Feather name="map-pin" size={20} color="#0C352E" />
                        </View>
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Text>
                          <Text style={styles.infoValue}>
                            {(value as any).address || `${(value as any).latitude}, ${(value as any).longitude}`}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                  return null;
                }

                return (
                  <View key={key} style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                      <Feather name="file-text" size={20} color="#0C352E" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                      <Text style={styles.infoValue}>{String(value)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Metadata */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Sistema</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Feather name="calendar" size={20} color="#0C352E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Fecha de Creación</Text>
                <Text style={styles.infoValue}>
                  {new Date(lead.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Feather name="activity" size={20} color="#0C352E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Estado</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {lead.status === 'A' ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botón de Editar Flotante */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push(`/(app)/leads/${id}/edit` as any)}
        >
          <Feather name="edit-2" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#E53935',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C352E',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C352E',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#232323',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0C352E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
