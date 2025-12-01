import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { activities_styles } from './styles/activities-styles';
import { CreateActivityModal } from '@presentation/components/CreateActivityModal';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const allActivities = [
  {
    id: 1,
    title: 'Prospeccion de Zona X',
    description: 'Inspeccionar zona para posibles clientes',
    time: '10:00 AM',
    status: 'Finalizada',
    completed: true,
    date: 23,
  },
  {
    id: 2,
    title: 'Reunion con Cliente A',
    description: 'Presentar propuesta de servicios',
    time: '02:00 PM',
    status: 'Finalizada',
    completed: true,
    date: 23,
  },
  {
    id: 3,
    title: 'Prospeccion de Zona X',
    description: 'Inspeccionar zona para posibles clientes',
    time: '10:00 AM',
    status: 'Pendiente',
    completed: false,
    date: 24,
  },
  {
    id: 4,
    title: 'Llamada con proveedor',
    description: 'Negociar precios de productos',
    time: '11:30 AM',
    status: 'Pendiente',
    completed: false,
    date: 24,
  },
  {
    id: 5,
    title: 'Prospeccion de Zona X',
    description: 'Inspeccionar zona para posibles clientes',
    time: '10:00 AM',
    status: 'Pendiente',
    completed: false,
    date: 25,
  },
  {
    id: 6,
    title: 'Reunion con equipo',
    description: 'Revisar objetivos del mes',
    time: '03:00 PM',
    status: 'Pendiente',
    completed: false,
    date: 25,
  },
  {
    id: 7,
    title: 'Visita a cliente',
    description: 'Seguimiento de venta',
    time: '09:00 AM',
    status: 'Pendiente',
    completed: false,
    date: 26,
  },
];

export default function ActivitiesScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSaveActivity = (data: any) => {
    console.log('Nueva actividad:', data);
    // Aquí agregarías la lógica para guardar la actividad
  };

  const dates = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        day: i + 1,
        dayName: dayNames[date.getDay()],
        month: monthNames[month],
      };
    });
  }, []);

  const filteredActivities = useMemo(() => {
    return allActivities.filter(activity => {
      // Filtrar por fecha
      if (activity.date !== selectedDate) return false;
      
      // Filtrar por estado
      if (selectedFilter === 'Todas') return true;
      if (selectedFilter === 'Pendientes') return !activity.completed;
      if (selectedFilter === 'Pasadas') return activity.completed;
      return true;
    });
  }, [selectedDate, selectedFilter]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={activities_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
          <View style={activities_styles.header}>
            <TouchableOpacity 
              style={activities_styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={activities_styles.headerTitle}>Actividades</Text>
            <TouchableOpacity 
              style={activities_styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={activities_styles.dateScroll}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {dates.map((date) => (
            <TouchableOpacity
              key={date.day}
              style={[
                activities_styles.dateItem,
                selectedDate === date.day && activities_styles.dateItemActive
              ]}
              onPress={() => setSelectedDate(date.day)}
            >
              <Text style={[
                activities_styles.dateMonth,
                selectedDate === date.day && activities_styles.dateMonthActive
              ]}>
                {date.month}
              </Text>
              <Text style={[
                activities_styles.dateDay,
                selectedDate === date.day && activities_styles.dateDayActive
              ]}>
                {date.day}
              </Text>
              <Text style={[
                activities_styles.dateDayName,
                selectedDate === date.day && activities_styles.dateDayNameActive
              ]}>
                {date.dayName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={activities_styles.filterTabs}>
          {['Todas', 'Pendientes', 'Pasadas'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                activities_styles.filterTab,
                selectedFilter === filter && activities_styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                activities_styles.filterTabText,
                selectedFilter === filter && activities_styles.filterTabTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredActivities.length === 0 ? (
          <View style={activities_styles.emptyState}>
            <View style={activities_styles.emptyCard}>
              <Image
                source={require('@/assets/images/icon-empty-list.png')}
                style={activities_styles.emptyIconImage}
                resizeMode="contain"
              />
              <Text style={activities_styles.emptyTitle}>Nada por aquí</Text>
              <Text style={activities_styles.emptyDescription}>
                No hay actividades para este día.
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredActivities}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={activities_styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: activity }) => (
              <TouchableOpacity 
                style={[
                  activities_styles.activityCard,
                  activity.completed && activities_styles.activityCardCompleted
                ]}
                onPress={() => router.push('/activity-detail')}
                activeOpacity={0.7}
              >
                <View style={activities_styles.activityHeader}>
                  <Text style={[
                    activities_styles.activityTitle,
                    activity.completed && activities_styles.activityTitleCompleted
                  ]}>
                    {activity.title}
                  </Text>
                  <View style={activities_styles.calendarIcon}>
                    <Feather name="calendar" size={16} color="#61646B" />
                  </View>
                </View>
                <Text style={activities_styles.activityDescription}>
                  {activity.description}
                </Text>
                <View style={activities_styles.activityFooter}>
                  <View style={activities_styles.activityTime}>
                    <Feather name="clock" size={16} color="#61646B" />
                    <Text style={activities_styles.activityTimeText}>
                      {activity.time}
                    </Text>
                  </View>
                  <View style={activities_styles.activityStatus}>
                    <Text style={activities_styles.activityStatusText}>
                      {activity.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <CreateActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveActivity}
      />
    </>
  );
}
