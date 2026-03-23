import Feather from "@expo/vector-icons/Feather";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../components/ui/Input";
import { styles } from "./search-styles";
import { useLeads } from "@presentation/hooks/useLeads";
import { useSales } from "@presentation/hooks/useSales";
import { Lead } from "@domain/entities/Lead";

export const SearchScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"todos" | "leads" | "ventas">("todos");
  const [searchText, setSearchText] = useState("");
  
  const { data: leadsData, loading: leadsLoading, refresh: refreshLeads } = useLeads();
  const { data: salesData, loading: salesLoading, refresh: refreshSales } = useSales();

  // Refrescar cuando la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      refreshLeads();
      refreshSales();
    }, [])
  );

  const renderLeadItem = ({ item }: { item: Lead }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        router.push(`/(app)/leads/${item.id}`);
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>
          {item.first_name} {item.last_name}
        </Text>
        {item.email && (
          <Text style={styles.cardCC}>{item.email}</Text>
        )}
        {item.phone && (
          <Text style={styles.cardCC}>
            {item.phone_code} {item.phone}
          </Text>
        )}
        <View style={styles.cardDate}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.first_name.charAt(0)}{item.last_name.charAt(0)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSaleItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>
          {item.client_name || 'Cliente sin nombre'}
        </Text>
        <Text style={styles.cardCC}>
          Venta: {item.sale_number || item.code}
        </Text>
        <Text style={styles.cardCC}>
          Total: ${item.total_amount?.toLocaleString('es-CO') || '0'}
        </Text>
        <View style={styles.cardDate}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text>{new Date(item.sale_date || item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>💰</Text>
      </View>
    </TouchableOpacity>
  );

  // Filtrar leads por búsqueda
  const filteredLeads = leadsData?.items.filter((lead) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      lead.first_name.toLowerCase().includes(search) ||
      lead.last_name.toLowerCase().includes(search) ||
      lead.email?.toLowerCase().includes(search) ||
      lead.phone?.includes(search)
    );
  }) || [];

  // Filtrar ventas por búsqueda
  const filteredSales = salesData?.items?.filter((sale) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      sale.client_name?.toLowerCase().includes(search) ||
      sale.sale_number?.toLowerCase().includes(search) ||
      sale.code?.toLowerCase().includes(search)
    );
  }) || [];

  // Combinar y ordenar para tab "Todos"
  const allItems = [
    ...filteredLeads.map(item => ({ ...item, type: 'lead' })),
    ...filteredSales.map(item => ({ ...item, type: 'sale' }))
  ].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  const renderContent = () => {
    if ((leadsLoading && !leadsData) || (salesLoading && !salesData)) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
          <ActivityIndicator size="large" color="#0C352E" />
          <Text style={{ marginTop: 16, color: '#666' }}>Cargando...</Text>
        </View>
      );
    }

    if (activeTab === "todos") {
      return (
        <FlatList
          data={allItems}
          renderItem={({ item }) => item.type === 'lead' ? renderLeadItem({ item }) : renderSaleItem({ item })}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={leadsLoading || salesLoading} 
              onRefresh={() => {
                refreshLeads();
                refreshSales();
              }} 
              colors={["#0C352E"]} 
            />
          }
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#999' }}>
                {searchText ? 'No se encontraron resultados' : 'No hay datos disponibles'}
              </Text>
            </View>
          }
        />
      );
    }

    if (activeTab === "leads") {
      return (
        <FlatList
          data={filteredLeads}
          renderItem={renderLeadItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={leadsLoading} onRefresh={refreshLeads} colors={["#0C352E"]} />
          }
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#999' }}>
                {searchText ? 'No se encontraron resultados' : 'No hay leads disponibles'}
              </Text>
            </View>
          }
        />
      );
    }

    if (activeTab === "ventas") {
      return (
        <FlatList
          data={filteredSales}
          renderItem={renderSaleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={salesLoading} onRefresh={refreshSales} colors={["#0C352E"]} />
          }
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#999' }}>
                {searchText ? 'No se encontraron resultados' : 'No hay ventas disponibles'}
              </Text>
            </View>
          }
        />
      );
    }

    return null;
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "todos" && styles.tabActive]}
              onPress={() => setActiveTab("todos")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "todos" && styles.tabTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "leads" && styles.tabActive]}
              onPress={() => setActiveTab("leads")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "leads" && styles.tabTextActive,
                ]}
              >
                Leads
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "ventas" && styles.tabActive]}
              onPress={() => setActiveTab("ventas")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "ventas" && styles.tabTextActive,
                ]}
              >
                Ventas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Input
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar..."
              rightIcon={<Feather name="search" size={18} color="#9CA3AF" />}
            />
          </View>

          {renderContent()}
        </View>
      </SafeAreaView>
    </>
  );
};
