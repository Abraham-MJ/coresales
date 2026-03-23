import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { CreateActivityModal } from '@presentation/components/CreateActivityModal';
import { FadeSlideView } from '@presentation/components/FadeSlideView';
import { TaskCardSkeleton } from '@presentation/components/TaskCardSkeleton';
import { useCreateTask } from '@presentation/hooks/useCreateTask';
import { useTasks } from '@presentation/hooks/useTasks';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activities_styles } from './styles/activities-styles';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function ActivitiesScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { tasks, loading, error, refresh } = useTasks();
  const { createTask, loading: creating, error: createError } = useCreateTask();

  useEffect(() => {
    if (scrollViewRef.current) {
      const itemWidth = 70;
      const scrollPosition = (today.getDate() - 1) * itemWidth - 100;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
      }, 100);
    }
  }, []);

  const handleSaveActivity = async (data: any) => {

    const workspace_id = await SecureStorage.getWorkspaceId();
    const sales_rep_id = await SecureStorage.getSalesRepId();


    if (!workspace_id || !sales_rep_id) {
      Alert.alert('Error', 'No se encontraron credenciales');
      return;
    }

    if (!data.title || !data.title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    const taskData: any = {
      workspace_id,
      assigned_to: sales_rep_id,
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      task_status: 'pending',
      due_date: data.date,
    };


    const result = await createTask(taskData);


    if (result) {
      Alert.alert('Éxito', 'Tarea creada correctamente');
      refresh();
    } else {
      Alert.alert('Error', createError || 'No se pudo crear la tarea');
    }
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

    return tasks.filter(task => {
      if (task.due_date) {
        const taskDate = new Date(task.due_date);

        const taskYear = taskDate.getUTCFullYear();
        const taskMonth = taskDate.getUTCMonth();
        const taskDay = taskDate.getUTCDate();

        const selectedYear = today.getFullYear();
        const selectedMonth = today.getMonth();

        const isSameDate =
          taskYear === selectedYear &&
          taskMonth === selectedMonth &&
          taskDay === selectedDate;

        if (!isSameDate) return false;
      }


      if (selectedFilter === 'Todas') return true;
      if (selectedFilter === 'Pendientes') return task.task_status === 'pending';
      if (selectedFilter === 'Pasadas') return task.task_status === 'completed';
      return true;
    });
  }, [tasks, selectedDate, selectedFilter, today]);

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
          ref={scrollViewRef}
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

        {!loading && tasks.length === 0 ? (
          <View style={activities_styles.listContent}>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </View>
        ) : filteredActivities.length === 0 ? (
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
            refreshControl={
              <RefreshControl
                refreshing={loading && tasks.length > 0}
                onRefresh={refresh}
                colors={['#0C352E']}
                tintColor="#0C352E"
              />
            }
            renderItem={({ item: task, index }) => (
              <FadeSlideView delay={index * 50}>
                <TouchableOpacity
                  style={[
                    activities_styles.activityCard,
                    task.task_status === 'completed' && activities_styles.activityCardCompleted
                  ]}
                  onPress={() => router.push(`/activities/${task.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={activities_styles.activityHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        activities_styles.activityTitle,
                        task.task_status === 'completed' && activities_styles.activityTitleCompleted
                      ]}>
                        {task.title}
                      </Text>
                      {task.type && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                          <Feather
                            name={task.type === 'call' ? 'phone' : task.type === 'meeting' ? 'users' : 'check-circle'}
                            size={12}
                            color="#61646B"
                          />
                          <Text style={{ fontSize: 11, color: '#61646B' }}>
                            {task.type === 'call' ? 'Llamada' : task.type === 'meeting' ? 'Reunión' : 'Seguimiento'}
                          </Text>
                        </View>
                      )}
                    </View>
                    {task.priority && (
                      <View style={[
                        activities_styles.priorityBadge,
                        task.priority === 'high' && activities_styles.priorityHigh,
                        task.priority === 'medium' && activities_styles.priorityMedium,
                        task.priority === 'low' && activities_styles.priorityLow,
                      ]}>
                        <Text style={activities_styles.priorityText}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={activities_styles.activityDescription}>
                    {task.description || 'Sin descripción'}
                  </Text>
                  <View style={activities_styles.activityFooter}>
                    <View style={activities_styles.activityStatus}>
                      <Text style={activities_styles.activityStatusText}>
                        {task.task_status === 'pending' ? 'Pendiente' :
                          task.task_status === 'completed' ? 'Completada' : 'Cancelada'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </FadeSlideView>
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
