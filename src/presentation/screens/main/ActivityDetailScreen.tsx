import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { activity_detail_styles } from './styles/activity-detail-styles';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const statusOptions = [
  { id: 'agendada', label: 'Agendada' },
  { id: 'asistida', label: 'Asistida' },
  { id: 'completada', label: 'Completada' },
  { id: 'cancelada', label: 'Cancelada' },
  { id: 'anulada', label: 'Anulada' },
];

export default function ActivityDetailScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('agendada');
  const [notes, setNotes] = useState('');

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
          </View>
        </SafeAreaView>

        <ScrollView 
          style={activity_detail_styles.content} 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={activity_detail_styles.card}>
            <View style={activity_detail_styles.fieldContainer}>
              <View style={activity_detail_styles.fieldHeader}>
                <Text style={activity_detail_styles.fieldLabel}>Fecha</Text>
                <View style={activity_detail_styles.fieldIcon}>
                  <Feather name="calendar" size={16} color="#61646B" />
                </View>
              </View>
              <Text style={activity_detail_styles.fieldValue}>10 De Diciembre Del 2025</Text>
            </View>

            <View style={activity_detail_styles.fieldContainer}>
              <View style={activity_detail_styles.fieldHeader}>
                <Text style={activity_detail_styles.fieldLabel}>Hora</Text>
                <View style={activity_detail_styles.fieldIcon}>
                  <Feather name="clock" size={16} color="#61646B" />
                </View>
              </View>
              <Text style={activity_detail_styles.fieldValue}>10:00 AM</Text>
            </View>

            <View style={activity_detail_styles.fieldContainer}>
              <Text style={activity_detail_styles.fieldLabel}>Título</Text>
              <Text style={activity_detail_styles.fieldValue}>LLAMAR CLIENTE</Text>
            </View>

            <View style={activity_detail_styles.fieldContainer}>
              <Text style={activity_detail_styles.fieldLabel}>Descripción</Text>
              <Text style={activity_detail_styles.fieldValue}>
                EL CLIENTE REQUIERE LLAMADA PARA CERRAR LA VENTA
              </Text>
            </View>
          </View>

          <Text style={activity_detail_styles.notesLabel}>Notas</Text>
          <TextInput
            style={activity_detail_styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder=""
            multiline
            numberOfLines={6}
          />

          <View style={activity_detail_styles.statusSection}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={activity_detail_styles.statusOption}
                onPress={() => setSelectedStatus(option.id)}
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
        </ScrollView>

        <TouchableOpacity style={activity_detail_styles.updateButton}>
          <Text style={activity_detail_styles.updateButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
