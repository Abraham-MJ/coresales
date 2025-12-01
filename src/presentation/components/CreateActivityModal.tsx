import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Feather from '@expo/vector-icons/Feather';

interface CreateActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateActivityModal({ visible, onClose, onSave }: CreateActivityModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    onSave({ title, description, date, time });
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    onClose();
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
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Fecha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputText}
                  placeholder="DD/MM/AAAA"
                  value={date}
                  onChangeText={setDate}
                  placeholderTextColor="#D0D0D0"
                />
                <Feather name="calendar" size={18} color="#D0D0D0" />
              </View>
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Hora</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputText}
                  placeholder="00:00"
                  value={time}
                  onChangeText={setTime}
                  placeholderTextColor="#D0D0D0"
                />
                <Feather name="clock" size={18} color="#D0D0D0" />
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#D0D0D0"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.inputText, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#D0D0D0"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleSave}>
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
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as '600',
  },
});
