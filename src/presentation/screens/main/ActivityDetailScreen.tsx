import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { activity_detail_styles } from './styles/activity-detail-styles';
import { useTaskDetail } from '@presentation/hooks/useTaskDetail';
import { FadeSlideView } from '@presentation/components/FadeSlideView';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const statusOptions = [
  { id: 'pending', label: 'Pendiente' },
  { id: 'completed', label: 'Completada' },
  { id: 'cancelled', label: 'Cancelada' },
];

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { task, loading, updateTask } = useTaskDetail(id || '');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Inicializar estados cuando se carga la tarea
  React.useEffect(() => {
    if (task) {
      setSelectedStatus(task.task_status);
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    if (isEditing && !title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    
    setUpdating(true);
    
    const updateData: any = {
      task_status: selectedStatus,
    };

    if (isEditing) {
      updateData.title = title;
      updateData.description = description;
    }
    
    const result = await updateTask(updateData);
    setUpdating(false);
    
    if (result) {
      setIsEditing(false);
      Alert.alert('Éxito', 'Tarea actualizada correctamente');
    } else {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
        <View style={activity_detail_styles.container}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
            <View style={activity_detail_styles.header}>
              <TouchableOpacity 
                style={activity_detail_styles.backButton}
                onPress={() => router.back()}
              >
                <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={activity_detail_styles.headerTitle}>Detalles actividad</Text>
              <View style={activity_detail_styles.backButton} />
            </View>
          </SafeAreaView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F1F3' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#0C352E', justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="clock" size={28} color="#FFFFFF" />
            </View>
            <Text style={{ marginTop: 16, fontSize: 16, color: '#61646B' }}>Cargando detalles...</Text>
          </View>
        </View>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
        <View style={activity_detail_styles.container}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
            <View style={activity_detail_styles.header}>
              <TouchableOpacity 
                style={activity_detail_styles.backButton}
                onPress={() => router.back()}
              >
                <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={activity_detail_styles.headerTitle}>Detalles actividad</Text>
              <View style={activity_detail_styles.backButton} />
            </View>
          </SafeAreaView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F1F3', paddingHorizontal: 40 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Feather name="alert-circle" size={40} color="#EF4444" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#232323', marginBottom: 8, textAlign: 'center' }}>Tarea no encontrada</Text>
            <Text style={{ fontSize: 14, color: '#61646B', textAlign: 'center', marginBottom: 24 }}>La tarea que buscas no existe o fue eliminada</Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#0C352E', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
              onPress={() => router.back()}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={activity_detail_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
          <View style={activity_detail_styles.header}>
            <TouchableOpacity 
              style={activity_detail_styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={activity_detail_styles.headerTitle}>Detalles actividad</Text>
            <TouchableOpacity 
              style={activity_detail_styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Feather name={isEditing ? "x" : "edit-2"} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView 
          style={activity_detail_styles.content} 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <FadeSlideView delay={0}>
            <View style={activity_detail_styles.card}>
              {/* Estado de la tarea */}
              <View style={activity_detail_styles.fieldContainer}>
                <Text style={activity_detail_styles.fieldLabel}>Estado</Text>
                {isEditing ? (
                  <View style={activity_detail_styles.statusInlineSection}>
                    {statusOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={activity_detail_styles.statusInlineOption}
                        onPress={() => setSelectedStatus(option.id as 'pending' | 'completed' | 'cancelled')}
                        activeOpacity={0.7}
                      >
                        <View style={activity_detail_styles.radioOuter}>
                          {selectedStatus === option.id && (
                            <View style={activity_detail_styles.radioInner} />
                          )}
                        </View>
                        <Text style={activity_detail_styles.statusLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={activity_detail_styles.fieldValue}>
                    {selectedStatus === 'pending' ? 'Pendiente' : 
                     selectedStatus === 'completed' ? 'Completada' : 'Cancelada'}
                  </Text>
                )}
              </View>

              {/* Fecha */}
              <View style={activity_detail_styles.fieldContainer}>
                <View style={activity_detail_styles.fieldHeader}>
                  <Text style={activity_detail_styles.fieldLabel}>Fecha</Text>
                  <View style={activity_detail_styles.fieldIcon}>
                    <Feather name="calendar" size={16} color="#61646B" />
                  </View>
                </View>
                <Text style={activity_detail_styles.fieldValue}>
                  {task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Sin fecha'}
                </Text>
              </View>

              {/* Prioridad */}
              {task.priority && (
                <View style={activity_detail_styles.fieldContainer}>
                  <View style={activity_detail_styles.fieldHeader}>
                    <Text style={activity_detail_styles.fieldLabel}>Prioridad</Text>
                    <View style={activity_detail_styles.fieldIcon}>
                      <Feather name="flag" size={16} color="#61646B" />
                    </View>
                  </View>
                  <View style={[
                    activity_detail_styles.priorityBadge,
                    task.priority === 'high' && activity_detail_styles.priorityHigh,
                    task.priority === 'medium' && activity_detail_styles.priorityMedium,
                    task.priority === 'low' && activity_detail_styles.priorityLow,
                  ]}>
                    <Text style={activity_detail_styles.priorityText}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Título */}
              <View style={activity_detail_styles.fieldContainer}>
                <Text style={activity_detail_styles.fieldLabel}>Título</Text>
                {isEditing ? (
                  <TextInput
                    style={[activity_detail_styles.fieldValue, activity_detail_styles.inputField]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Título de la tarea"
                    placeholderTextColor="#D0D0D0"
                  />
                ) : (
                  <Text style={activity_detail_styles.fieldValue}>{task.title}</Text>
                )}
              </View>

              {/* Descripción */}
              <View style={activity_detail_styles.fieldContainer}>
                <Text style={activity_detail_styles.fieldLabel}>Descripción</Text>
                {isEditing ? (
                  <TextInput
                    style={[activity_detail_styles.fieldValue, activity_detail_styles.inputField, activity_detail_styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Descripción de la tarea"
                    placeholderTextColor="#D0D0D0"
                    multiline
                    numberOfLines={4}
                  />
                ) : (
                  <Text style={activity_detail_styles.fieldValue}>
                    {task.description || 'Sin descripción'}
                  </Text>
                )}
              </View>
            </View>
          </FadeSlideView>
        </ScrollView>

        {isEditing && (
          <TouchableOpacity 
            style={[activity_detail_styles.updateButton, updating && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={updating}
          >
            <Text style={activity_detail_styles.updateButtonText}>
              {updating ? 'Actualizando...' : 'Actualizar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
