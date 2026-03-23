import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { create_lead_styles } from "./styles/create-lead-styles";
import { useWizardConfig } from "@presentation/hooks/useWizardConfig";
import { useLeadDetail } from "@presentation/hooks/useLeadDetail";
import { useUpdateLead } from "@presentation/hooks/useUpdateLead";
import { DynamicField } from "@presentation/components/DynamicField";

export default function EditLeadScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { config, loading: configLoading } = useWizardConfig('lead');
  const { lead, loading: leadLoading } = useLeadDetail(id || '');
  const { updateLead, loading: updateLoading } = useUpdateLead();
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-cargar datos del lead cuando se obtiene
  useEffect(() => {
    if (lead && config) {
      const initialData: Record<string, any> = {};
      
      config.steps.forEach(step => {
        step.fields.forEach(field => {
          const fieldKey = field.is_system_field && field.system_field_mapping 
            ? field.system_field_mapping 
            : field.name;
          
          if (field.is_system_field && field.system_field_mapping) {
            // Campos de sistema
            const value = (lead as any)[field.system_field_mapping];
            if (value !== undefined && value !== null) {
              initialData[fieldKey] = value;
            }
          } else {
            // Campos custom
            const value = lead.custom_data?.[field.name];
            if (value !== undefined && value !== null) {
              initialData[fieldKey] = value;
            }
          }
        });
      });
      
      setFormData(initialData);
    }
  }, [lead, config]);

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

    if (!id) return;

    const body: Record<string, any> = {
      workspace_id: lead?.workspace_id,
    };
    const customData: Record<string, any> = {};

    config?.steps.forEach(step => {
      step.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping 
          ? field.system_field_mapping 
          : field.name;
        const value = formData[fieldKey];
        
        if (value !== undefined && value !== '') {
          if (field.is_system_field && field.system_field_mapping) {
            // Filtrar sales_rep_id
            if (field.system_field_mapping !== 'sales_rep_id') {
              body[field.system_field_mapping] = value;
            }
          } else {
            customData[field.name] = value;
          }
        }
      });
    });

    if (Object.keys(customData).length > 0) {
      body.custom_data = customData;
    }

    const result = await updateLead(id, body);
    
    if (result) {
      Alert.alert('Éxito', 'Lead actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  };

  if (configLoading || leadLoading) {
    return (
      <View style={[create_lead_styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0C352E" />
        <Text style={{ marginTop: 16, color: '#666' }}>Cargando...</Text>
      </View>
    );
  }

  if (!config || !lead) {
    return (
      <View style={[create_lead_styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#E53935' }}>Error al cargar lead</Text>
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
                    // Filtrar sales_rep_id
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
            updateLoading && { opacity: 0.6 }
          ]}
          onPress={handleSubmit}
          disabled={updateLoading}
        >
          {updateLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={create_lead_styles.nextButtonText}>Actualizar Lead</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
