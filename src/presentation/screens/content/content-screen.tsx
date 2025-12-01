import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { styles } from './content-styles';

interface Folder {
  id: string;
  name: string;
  itemCount: number;
  size: string;
}

const folders: Folder[] = [
  { id: '1', name: 'Ventas', itemCount: 2, size: '1.2 Gb' },
  { id: '2', name: 'Contratos', itemCount: 4, size: '13.5 Gb' },
  { id: '3', name: 'Promociones', itemCount: 5, size: '184.3 Gb' },
  { id: '4', name: 'Fotos', itemCount: 7, size: '131.1 Gb' },
];

export const ContentScreen = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState('A - Z');
  const [searchText, setSearchText] = useState('');

  const renderGridItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push({ pathname: '/content-detail', params: { folder: JSON.stringify(item) } })}
    >
      <View style={styles.gridItemHeader}>
        <Image 
          source={require('../../../../assets/images/icon-step-1.png')} 
          style={styles.folderIcon}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.folderName}>{item.name}</Text>
      <Text style={styles.folderInfo}>
        {item.itemCount} items · {item.size}
      </Text>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => router.push({ pathname: '/content-detail', params: { folder: JSON.stringify(item) } })}
    >
      <Image 
        source={require('../../../../assets/images/icon-step-1.png')} 
        style={styles.folderIcon}
        resizeMode="contain"
      />
      <View style={styles.listItemContent}>
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.folderInfo}>
          {item.itemCount} item{item.itemCount > 1 ? 's' : ''} · {item.size}
        </Text>
      </View>
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B4D3E" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#1B4D3E' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contenido</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>{sortOrder} ▼</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <MaterialCommunityIcons 
              name={viewMode === 'grid' ? 'format-list-text' : 'grid-large'}
              size={24} 
              color="#9CA3AF" 
            />
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
          data={folders}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
    </>
  );
};
