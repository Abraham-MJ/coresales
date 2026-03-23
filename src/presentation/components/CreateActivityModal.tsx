import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface CreateActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateActivityModal({ visible, onClose, onSave }: CreateActivityModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<'call' | 'meeting' | 'follow_up'>('call');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }
    
    const dataToSend = { 
      title, 
      description, 
      date: date.toISOString(), 
      type,
      priority,
    };
    
    
    onSave(dataToSend);
    setTitle('');
    setDescription('');
    setDate(new Date());
    setType('call');
    setPriority('medium');
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      useNativeDriver
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Actividad</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#232323" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>
                {date.toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
              <Feather name="calendar" size={18} color="#D0D0D0" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                value={title}
                onChangeText={setTitle}
                placeholder="Ej: Llamar a cliente"
                placeholderTextColor="#D0D0D0"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeOption, type === 'call' && styles.typeOptionActive]}
                onPress={() => setType('call')}
              >
                <Feather name="phone" size={18} color={type === 'call' ? '#FFFFFF' : '#61646B'} />
                <Text style={[styles.typeOptionText, type === 'call' && styles.typeOptionTextActive]}>
                  Llamada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeOption, type === 'meeting' && styles.typeOptionActive]}
                onPress={() => setType('meeting')}
              >
                <Feather name="users" size={18} color={type === 'meeting' ? '#FFFFFF' : '#61646B'} />
                <Text style={[styles.typeOptionText, type === 'meeting' && styles.typeOptionTextActive]}>
                  Reunión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeOption, type === 'follow_up' && styles.typeOptionActive]}
                onPress={() => setType('follow_up')}
              >
                <Feather name="check-circle" size={18} color={type === 'follow_up' ? '#FFFFFF' : '#61646B'} />
                <Text style={[styles.typeOptionText, type === 'follow_up' && styles.typeOptionTextActive]}>
                  Seguimiento
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.priorityContainer}>
              <TouchableOpacity
                style={[styles.priorityOption, priority === 'low' && styles.priorityLowActive]}
                onPress={() => setPriority('low')}
              >
                <Text style={[styles.priorityOptionText, priority === 'low' && styles.priorityOptionTextActive]}>
                  Baja
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priorityOption, priority === 'medium' && styles.priorityMediumActive]}
                onPress={() => setPriority('medium')}
              >
                <Text style={[styles.priorityOptionText, priority === 'medium' && styles.priorityOptionTextActive]}>
                  Media
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priorityOption, priority === 'high' && styles.priorityHighActive]}
                onPress={() => setPriority('high')}
              >
                <Text style={[styles.priorityOptionText, priority === 'high' && styles.priorityOptionTextActive]}>
                  Alta
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.inputText, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Detalles adicionales..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#D0D0D0"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.createButton, !title.trim() && styles.createButtonDisabled]} 
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.createButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as '600',
    color: '#232323',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfField: {
    width: '48%',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#61646B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: '#232323',
  },
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    height: '100%',
  },
  createButton: {
    backgroundColor: '#0C352E',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as '600',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  typeOptionActive: {
    backgroundColor: '#0C352E',
    borderColor: '#0C352E',
  },
  typeOptionText: {
    fontSize: 13,
    color: '#61646B',
    fontWeight: '500' as '500',
  },
  typeOptionTextActive: {
    color: '#FFFFFF',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  priorityLowActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  priorityMediumActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  priorityHighActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  priorityOptionText: {
    fontSize: 13,
    color: '#61646B',
    fontWeight: '500' as '500',
  },
  priorityOptionTextActive: {
    color: '#232323',
    fontWeight: '600' as '600',
  },
});
