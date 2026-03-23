import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { WizardField } from '@domain/entities/WizardConfig';
import { Input } from '@presentation/components/ui/Input';
import { Select } from '@presentation/components/ui/Select';
import { ApiCatalogRepository } from '@infrastructure/repositories/ApiCatalogRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';

interface DynamicFieldProps {
  field: WizardField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(
    value?.latitude && value?.longitude
      ? { latitude: value.latitude, longitude: value.longitude }
      : { latitude: 4.711, longitude: -74.0721 }
  );
  const [selectOptions, setSelectOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const catalogRepository = new ApiCatalogRepository();

  // Actualizar location cuando value cambie (pre-llenado)
  useEffect(() => {
    if (value?.latitude && value?.longitude) {
      setLocation({ latitude: value.latitude, longitude: value.longitude });
    }
  }, [value]);

  useEffect(() => {
    if (field.field_type === 'select' && field.data_source) {
      loadSelectOptions();
    } else if (field.field_type === 'select' && field.options) {
      // Opciones estáticas
      const staticOptions = Array.isArray(field.options)
        ? field.options.map((opt: any) => 
            typeof opt === 'string' 
              ? { label: opt, value: opt }
              : { label: opt.label || opt.name, value: opt.value || opt.id }
          )
        : [];
      setSelectOptions(staticOptions);
    }
  }, [field.field_type, field.data_source, field.options]);

  const loadSelectOptions = async () => {
    setLoadingOptions(true);
    try {
      const workspace_id = await SecureStorage.getWorkspaceId();
      if (!workspace_id) return;

      let data: any[] = [];

      switch (field.data_source) {
        case 'isp_plans':
          data = await catalogRepository.getIspPlans(workspace_id);
          setSelectOptions(data.map(item => ({ label: item.name, value: item.id })));
          break;
        case 'products':
          data = await catalogRepository.getProducts(workspace_id);
          setSelectOptions(data.map(item => ({ label: item.name, value: item.id })));
          break;
        case 'lead_statuses':
          data = await catalogRepository.getLeadStatuses(workspace_id);
          setSelectOptions(data.map(item => ({ label: item.name, value: item.id })));
          break;
        case 'sales_reps':
          data = await catalogRepository.getSalesReps(workspace_id);
          setSelectOptions(data.map(item => ({ 
            label: `${item.first_names} ${item.last_names}`, 
            value: item.id 
          })));
          break;
      }
    } catch (error) {
      console.error('Error loading select options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const getKeyboardType = () => {
    switch (field.field_type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  // Campo tipo select
  if (field.field_type === 'select') {
    if (loadingOptions) {
      return (
        <View style={{ marginBottom: 16, padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#0C352E" />
          <Text style={{ marginTop: 8, color: '#666' }}>Cargando opciones...</Text>
        </View>
      );
    }

    return (
      <Select
        label={field.label}
        value={value || ''}
        onChange={onChange}
        placeholder={field.placeholder || 'Seleccionar...'}
        error={error}
        required={field.is_required}
        options={selectOptions}
      />
    );
  }

  // Campo tipo location (mapa)
  if (field.field_type === 'location') {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>
          {field.label}
          {field.is_required && <Text style={styles.required}> *</Text>}
        </Text>
        
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setShowMap(true)}
        >
          <Text style={styles.mapButtonText}>
            {value?.latitude && value?.longitude 
              ? `Lat: ${value.latitude.toFixed(6)}, Lng: ${value.longitude.toFixed(6)}`
              : 'Seleccionar ubicación en el mapa'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        <Modal visible={showMap} animationType="slide">
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
              <Marker coordinate={location} />
            </MapView>

            <View style={styles.mapActions}>
              <TouchableOpacity
                style={[styles.mapActionButton, styles.cancelButton]}
                onPress={() => setShowMap(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mapActionButton, styles.confirmButton]}
                onPress={() => {
                  onChange({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
                  });
                  setShowMap(false);
                }}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Campos normales
  return (
    <Input
      label={field.label}
      value={value?.toString() || ''}
      onChangeText={onChange}
      placeholder={field.placeholder || ''}
      error={error}
      required={field.is_required}
      keyboardType={getKeyboardType()}
      autoCapitalize={field.field_type === 'email' ? 'none' : 'words'}
      multiline={field.field_type === 'textarea'}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#61646B',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  mapButton: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  mapButtonText: {
    fontSize: 16,
    color: '#232323',
  },
  error: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  mapActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
  },
  mapActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#0C352E',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
