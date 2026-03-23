import { DynamicField } from "@presentation/components/DynamicField";
import { useCreateLead } from "@presentation/hooks/useCreateLead";
import { useWizardConfig } from "@presentation/hooks/useWizardConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { create_lead_styles } from "./styles/create-lead-styles";

export default function CreateLeadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { config, loading: configLoading } = useWizardConfig('lead');
  const { createLead, loading: createLoading } = useCreateLead();
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isPreFilled, setIsPreFilled] = useState(false);

  useEffect(() => {
    // Pre-llenar datos de ubicación si vienen de SalesScreen (solo una vez)
    if (params.prefilledAddress && config && !isPreFilled) {
      console.log('=== PRE-FILL DEBUG ===');
      console.log('Params received:', params);
      
      const prefilledData: Record<string, any> = {};
      
      // Mapear los parámetros a los campos correctos del wizard
      config.steps.forEach(step => {
        step.fields.forEach(field => {
          const fieldKey = field.is_system_field && field.system_field_mapping 
            ? field.system_field_mapping 
            : field.name;
          
          console.log(`Checking field: ${field.label} (key: ${fieldKey}, name: ${field.name})`);
          
          // Buscar coincidencias con los datos de SalesScreen
          if (params.prefilledAddress && 
              (fieldKey === 'installation_address' || 
               fieldKey === 'address' || 
               field.name === 'installation_address' ||
               field.name === 'address' ||
               field.name === 'direccion_instalacion')) {
            console.log(`✓ Matched address field: ${fieldKey}`);
            prefilledData[fieldKey] = params.prefilledAddress;
          }
          
          if (params.prefilledReference && 
              (fieldKey === 'installation_reference' || 
               fieldKey === 'reference' ||
               fieldKey === 'punto_de_referencia' ||
               field.name === 'installation_reference' ||
               field.name === 'reference' ||
               field.name === 'referencia' ||
               field.name === 'punto_de_referencia')) {
            console.log(`✓ Matched reference field: ${fieldKey}`);
            prefilledData[fieldKey] = params.prefilledReference;
          }
          
          // Para el campo de ubicación (mapa), guardar las coordenadas como objeto
          if ((params.prefilledLatitude || params.prefilledLongitude) &&
              (fieldKey === 'seleccion_de_ubicacion' || 
               field.name === 'seleccion_de_ubicacion' ||
               fieldKey === 'location' ||
               field.name === 'location')) {
            console.log(`✓ Matched location field: ${fieldKey}`);
            prefilledData[fieldKey] = {
              address: params.prefilledAddress || '',
              latitude: parseFloat(params.prefilledLatitude as string),
              longitude: parseFloat(params.prefilledLongitude as string)
            };
          }
          
          if (params.prefilledLatitude && 
              (fieldKey === 'latitude' || field.name === 'latitude' || field.name === 'latitud')) {
            console.log(`✓ Matched latitude field: ${fieldKey}`);
            prefilledData[fieldKey] = parseFloat(params.prefilledLatitude as string);
          }
          
          if (params.prefilledLongitude && 
              (fieldKey === 'longitude' || field.name === 'longitude' || field.name === 'longitud')) {
            console.log(`✓ Matched longitude field: ${fieldKey}`);
            prefilledData[fieldKey] = parseFloat(params.prefilledLongitude as string);
          }
          
          if (params.hasCoverage !== undefined && 
              (fieldKey === 'has_coverage' || field.name === 'has_coverage' || field.name === 'tiene_cobertura')) {
            console.log(`✓ Matched coverage field: ${fieldKey}`);
            prefilledData[fieldKey] = params.hasCoverage === '1' ? 1 : 0;
          }
        });
      });
      
      console.log('Pre-filled data:', prefilledData);
      setFormData(prefilledData);
      setIsPreFilled(true);
    }
  }, [params.prefilledAddress, config, isPreFilled]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar campos requeridos del wizard
    config?.steps.forEach(step => {
      step.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping 
          ? field.system_field_mapping 
          : field.name;
        
        if (field.is_required && !formData[fieldKey]) {
          newErrors[fieldKey] = `${field.label} es requerido`;
        }
      });
    });

    // Validar campos obligatorios de la entidad Lead
    if (!formData.first_name || !formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }
    if (!formData.last_name || !formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const body: Record<string, any> = {};
    const customData: Record<string, any> = {};

    config?.steps.forEach(step => {
      step.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping 
          ? field.system_field_mapping 
          : field.name;
        const value = formData[fieldKey];
        
        if (value !== undefined && value !== '') {
          if (field.is_system_field && field.system_field_mapping) {
            body[field.system_field_mapping] = value;
          } else {
            customData[field.name] = value;
          }
        }
      });
    });

    if (Object.keys(customData).length > 0) {
      body.custom_data = customData;
    }

    const result = await createLead(body);
    
    if (result) {
      Alert.alert('Éxito', 'Lead creado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  };

  if (configLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F1F3' }}>
        <ActivityIndicator size={80} color="#0C352E" />
        <Text style={{ marginTop: 16, color: '#666' }}>Cargando los campos...</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F1F3' }}>
        <Text style={{ color: '#E53935' }}>Error al cargar configuración</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={create_lead_styles.container}>
        <ScrollView
          style={create_lead_styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={create_lead_styles.form}>
            {config.steps.map((step, stepIndex) => (
              <View key={step.id}>
                {config.steps.length > 1 && (
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#0C352E',
                    marginBottom: 16,
                    marginTop: stepIndex > 0 ? 24 : 0,
                  }}>
                    {step.name}
                  </Text>
                )}
                
                {step.fields
                  .filter(field => {
                    // Filtrar sales_rep_id porque se asigna automáticamente
                    if (field.is_system_field && field.system_field_mapping === 'sales_rep_id') {
                      return false;
                    }
                    return true;
                  })
                  .sort((a, b) => a.order - b.order)
                  .map(field => {
                    const fieldKey = field.is_system_field && field.system_field_mapping 
                      ? field.system_field_mapping 
                      : field.name;
                    
                    return (
                      <DynamicField
                        key={field.id}
                        field={field}
                        value={formData[fieldKey]}
                        onChange={(value) => handleFieldChange(fieldKey, value)}
                        error={errors[fieldKey]}
                      />
                    );
                  })}
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={[
            create_lead_styles.nextButton,
            createLoading && { opacity: 0.6 }
          ]}
          onPress={handleSubmit}
          disabled={createLoading}
        >
          {createLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={create_lead_styles.nextButtonText}>Crear Lead</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
