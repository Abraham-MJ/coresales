import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { styles } from './search-styles';

interface SearchResult {
  id: string;
  name: string;
  cc: string;
  date: string;
  type: 'lead' | 'sale';
}

const results: SearchResult[] = [
  { id: '1', name: 'Nelson Vivas Lobo', cc: '12345678987654', date: '10/10/2025', type: 'lead' },
  { id: '2', name: 'Nelson Vivas Lobo', cc: '12345678987654', date: '10/10/2025', type: 'sale' },
  { id: '3', name: 'Nelson Vivas Lobo', cc: '12345678987654', date: '10/10/2025', type: 'lead' },
  { id: '4', name: 'Nelson Vivas Lobo', cc: '12345678987654', date: '10/10/2025', type: 'sale' },
];

export const SearchScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'todos' | 'leads' | 'ventas'>('todos');
  const [searchText, setSearchText] = useState('');

  const filteredResults = results.filter((item) => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'leads') return item.type === 'lead';
    if (activeTab === 'ventas') return item.type === 'sale';
    return true;
  });

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardCC}>CC: {item.cc}</Text>
        <View style={styles.cardDate}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text>{item.date}</Text>
        </View>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B4D3E" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#1B4D3E' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'todos' && styles.tabActive]}
            onPress={() => setActiveTab('todos')}
          >
            <Text style={[styles.tabText, activeTab === 'todos' && styles.tabTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leads' && styles.tabActive]}
            onPress={() => setActiveTab('leads')}
          >
            <Text style={[styles.tabText, activeTab === 'leads' && styles.tabTextActive]}>
              Leads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ventas' && styles.tabActive]}
            onPress={() => setActiveTab('ventas')}
          >
            <Text style={[styles.tabText, activeTab === 'ventas' && styles.tabTextActive]}>
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

        <FlatList
          data={filteredResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
    </>
  );
};
