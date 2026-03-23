import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Modal, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignatureCanvas from 'react-native-signature-canvas';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { CreateClientDto } from '../../../domain/entities/Client';
import { CreateContractDto } from '../../../domain/entities/Contract';
import { ApiCatalogRepository } from '../../../infrastructure/repositories/ApiCatalogRepository';
import { SecureStorage } from '../../../infrastructure/storage/SecureStorage';
import { Select } from '../../components/ui/Select';
import { useCheckFtthViability } from '../../hooks/useCheckFtthViability';
import { useCreateClient } from '../../hooks/useCreateClient';
import { useCreateContract } from '../../hooks/useCreateContract';
import { useCreateSale } from '../../hooks/useCreateSale';
import { useSearchClient } from '../../hooks/useSearchClient';
import { useUploadFile } from '../../hooks/useUploadFile';
import { useWizardConfig } from '../../hooks/useWizardConfig';
import { sales_styles } from './styles/sales-styles';

const catalogRepository = new ApiCatalogRepository();

export default function SalesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [step, setStep] = useState(1);

  // Paso 1: Ubicación
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [location, setLocation] = useState({ latitude: 4.7110, longitude: -74.0721 });
  const [hasAvailability, setHasAvailability] = useState<boolean | null>(null);
  const [napsFound, setNapsFound] = useState<number>(0);
  const [showMapModal, setShowMapModal] = useState(false);

  // Paso 2: Cliente
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentType, setDocumentType] = useState('CC');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+57');
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [showPhoneCodeModal, setShowPhoneCodeModal] = useState(false);
  const [hasSearchedClient, setHasSearchedClient] = useState(false);
  const [clientFormData, setClientFormData] = useState<Record<string, any>>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Paso 3: Contrato
  const [contractFormData, setContractFormData] = useState<Record<string, any>>({});
  const [contractErrors, setContractErrors] = useState<Record<string, string>>({});
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [saleDate, setSaleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [isSignaturePadActive, setIsSignaturePadActive] = useState(false);
  const signatureRef = useRef<any>(null);

  // Paso 4: Pago
  const [payments, setPayments] = useState<Array<{ method: string; amount: string; reference: string }>>([]);

  // Modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saleCreated, setSaleCreated] = useState<any>(null);

  // IDs necesarios
  const [workspaceId, setWorkspaceId] = useState('');
  const [salesRepId, setSalesRepId] = useState('');
  const [leadId, setLeadId] = useState<string | null>(params.leadId as string || null);
  const [createdContractId, setCreatedContractId] = useState<string | null>(null);

  // Hooks
  const { client, loading: searchingClient, error: searchClientError, searchByDocument } = useSearchClient();
  const { loading: creatingClient, error: createClientError, createClient } = useCreateClient();
  const { loading: creatingContract, error: createContractError, createContract } = useCreateContract();
  const { loading: creatingSale, error: createSaleError, createSale } = useCreateSale();
  const { config: clientWizard, loading: loadingClientWizard } = useWizardConfig('client');
  const { config: contractWizard, loading: loadingContractWizard } = useWizardConfig('contract');
  const { loading: checkingViability, error: viabilityError, checkViability } = useCheckFtthViability();
  const { uploadFile, loading: uploadingFile } = useUploadFile();

  // Loading states
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  useEffect(() => {
    loadStorageData();
    loadCatalogData();
  }, []);

  useEffect(() => {
    if (leadId && workspaceId) {
      prePopulateFromLead();
    }
  }, [leadId, workspaceId]);

  useEffect(() => {
    if (workspaceId && step === 1) {
      handleCheckViability(location.latitude, location.longitude);
    }
  }, [workspaceId]);

  const loadStorageData = async () => {
    const ws = await SecureStorage.getWorkspaceId();
    const sr = await SecureStorage.getSalesRepId();
    if (ws) setWorkspaceId(ws);
    if (sr) setSalesRepId(sr);
  };

  const loadCatalogData = async () => {
    console.log('=== LOADING CATALOG DATA ===');
    setLoadingCatalog(true);
    try {
      const ws = await SecureStorage.getWorkspaceId();
      console.log('Workspace ID:', ws);
      if (ws) {
        const [plansData, branchesData] = await Promise.all([
          catalogRepository.getIspPlans(ws),
          catalogRepository.getBranches(ws),
        ]);
        console.log('Plans response:', plansData);
        console.log('Branches response:', branchesData);
        console.log('Plans isArray:', Array.isArray(plansData));
        console.log('Branches isArray:', Array.isArray(branchesData));
        setPlans(Array.isArray(plansData) ? plansData : []);
        setBranches(Array.isArray(branchesData) ? branchesData : []);
      }
    } catch (error) {
      console.error('Error cargando catálogo:', error);
      Alert.alert('Error', 'No se pudo cargar el catálogo');
      setPlans([]);
      setBranches([]);
    } finally {
      setLoadingCatalog(false);
      console.log('=== CATALOG LOADED ===');
    }
  };

  const loadZones = async (branchId: string) => {
    console.log('=== LOADING ZONES ===');
    console.log('Branch ID:', branchId);
    console.log('Workspace ID:', workspaceId);
    try {
      const zonesData = await catalogRepository.getZones(workspaceId, branchId);
      console.log('Zones response:', zonesData);
      console.log('Zones isArray:', Array.isArray(zonesData));
      setZones(Array.isArray(zonesData) ? zonesData : []);
      console.log('Zones set to state:', Array.isArray(zonesData) ? zonesData : []);
    } catch (error) {
      console.error('Error cargando zonas:', error);
      setZones([]);
    }
  };

  const handleCheckViability = async (lat: number, lng: number) => {
    if (!workspaceId) return;

    // TODO: Descomentar cuando se tengan zonas configuradas
    // setHasAvailability(null);
    // setNapsFound(0);
    // const hasViability = await checkViability(workspaceId, lat, lng);
    // setHasAvailability(hasViability);
    // if (hasViability) {
    //   setNapsFound(1);
    // }
    
    // Por ahora, siempre permitir continuar
    setHasAvailability(true);
    setNapsFound(1);
  };

  const prePopulateFromLead = async () => {
    try {
      const { getFieldMappings } = useCreateClient();
      const mappings = await getFieldMappings(workspaceId);

      // Cargar el lead completo
      const leadRepository = new (await import('../../../infrastructure/repositories/ApiLeadRepository')).ApiLeadRepository();
      const lead = await leadRepository.getLeadById(leadId!, workspaceId);

      // Pre-llenar campos del cliente según el mapeo
      const preFilledData: Record<string, any> = {};
      mappings.forEach(m => {
        const sourceValue = lead[m.source_field as keyof typeof lead];
        if (sourceValue !== undefined && sourceValue !== null && sourceValue !== '') {
          preFilledData[m.target_field] = sourceValue;
        }
      });

      setClientFormData(preFilledData);
    } catch (error) {
      console.error('Error pre-llenando desde lead:', error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAddress('');
    setReference('');
    setLocation({ latitude: 4.7110, longitude: -74.0721 });
    setHasAvailability(null);
    setNapsFound(0);
    setDocumentNumber('');
    setDocumentType('CC');
    setClientFormData({});
    setClientErrors({});
    setSelectedClient(null);
    setContractFormData({});
    setContractErrors({});
    setSelectedPlan(null);
    setSignatureUrl('');
    setPayments([]);
    setLeadId(null);
    setCreatedContractId(null);
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return 'map-pin';
      case 2: return 'user';
      case 3: return 'file-text';
      case 4: return 'credit-card';
      default: return 'map-pin';
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Ubicación';
      case 2: return 'Cliente';
      case 3: return 'Contrato';
      case 4: return 'Pago';
      default: return 'Ubicación';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return 'Dónde te conectaremos';
      case 2: return '¿Quién será el titular del servicio?';
      case 3: return 'Elige tu plan ideal';
      case 4: return 'Configura tu forma de pago';
      default: return 'Dónde te conectaremos';
    }
  };

  // Handlers
  const handleNextStep = async () => {
    Keyboard.dismiss();

    if (step === 1) {
      if (!address) {
        Alert.alert('Error', 'Ingresa la dirección');
        return;
      }
      // TODO: Descomentar cuando se active verificación de cobertura
      // if (hasAvailability === null) {
      //   Alert.alert('Verificando', 'Espera mientras verificamos la cobertura');
      //   return;
      // }
      // if (hasAvailability === false) {
      //   router.push({
      //     pathname: '/leads/create',
      //     params: {
      //       prefilledAddress: address,
      //       prefilledReference: reference,
      //       prefilledLatitude: location.latitude.toString(),
      //       prefilledLongitude: location.longitude.toString(),
      //       hasCoverage: '0',
      //     },
      //   });
      //   return;
      // }
      setStep(2);
    } else if (step === 2) {
      await handleClientStep();
    } else if (step === 3) {
      await handleContractStep();
    } else if (step === 4) {
      await handleSaleStep();
    }
  };

  const handleSearchClient = async () => {
    if (!documentNumber) {
      Alert.alert('Error', 'Ingresa el número de documento');
      return;
    }
    const result = await searchByDocument(workspaceId, documentNumber, documentType);
    setHasSearchedClient(true);
    if (result) {
      setSelectedClient(result);
    }
  };

  const validateClientForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Datos completos incluyendo los de búsqueda
    const completeData: Record<string, any> = {
      ...clientFormData,
      client_type: 'persona_natural',
      document_type: documentType,
      document_number: documentNumber,
    };

    // Validar campos requeridos del wizard
    clientWizard?.steps.forEach(wizardStep => {
      wizardStep.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping
          ? field.system_field_mapping
          : field.name;

        if (field.is_required && !completeData[fieldKey]) {
          newErrors[fieldKey] = `${field.label} es requerido`;
        }
      });
    });

    // Validar campos obligatorios de la entidad Client (NOT NULL en DB)
    if (!completeData.email || !completeData.email.trim()) {
      newErrors.email = 'El email es requerido';
    }
    if (!completeData.phone || !completeData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientStep = async () => {
    if (selectedClient) {
      setStep(3);
      return;
    }

    // Agregar campos que ya tenemos del paso de búsqueda
    const completeFormData: Record<string, any> = {
      ...clientFormData,
      client_type: 'persona_natural',
      document_type: documentType,
      document_number: documentNumber,
    };

    // Actualizar el estado con los datos completos
    setClientFormData(completeFormData);

    if (!validateClientForm()) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    const body: Record<string, any> = {
      workspace_id: workspaceId,
      client_type: 'persona_natural',
      document_type: documentType,
      document_number: documentNumber,
      phone_code: phoneCountryCode,
    };
    const customData: Record<string, any> = {};

    clientWizard?.steps.forEach(wizardStep => {
      wizardStep.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping
          ? field.system_field_mapping
          : field.name;
        const value = completeFormData[fieldKey];

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

    // Agregar lead_id si existe (trazabilidad)
    if (leadId) {
      body.lead_id = leadId;
    }

    const newClient = await createClient(body as CreateClientDto);
    if (newClient) {
      setSelectedClient(newClient);
      setStep(3);
    } else if (createClientError) {
      Alert.alert('Error', createClientError);
    }
  };

  const validateContractForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedPlan) {
      Alert.alert('Error', 'Selecciona un plan');
      return false;
    }

    if (!selectedBranch) {
      Alert.alert('Error', 'Selecciona una sucursal');
      return false;
    }

    // Validar campos requeridos del wizard
    contractWizard?.steps.forEach(wizardStep => {
      wizardStep.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping
          ? field.system_field_mapping
          : field.name;

        if (field.is_required && !contractFormData[fieldKey]) {
          newErrors[fieldKey] = `${field.label} es requerido`;
        }
      });
    });

    setContractErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContractStep = async () => {
    if (!validateContractForm()) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    // Subir firma a S3 si existe
    let uploadedSignatureUrl = '';
    if (signatureUrl) {
      const url = await uploadFile(workspaceId, signatureUrl, `signature_${Date.now()}.png`);
      if (url) {
        uploadedSignatureUrl = url;
      } else {
        Alert.alert('Error', 'No se pudo subir la firma. Intenta de nuevo.');
        return;
      }
    }

    const body: Record<string, any> = {
      workspace_id: workspaceId,
      client_id: selectedClient.id,
      sales_rep_id: salesRepId,
      service_plan_id: selectedPlan.id,
      sale_product_id: selectedPlan.id,
      branch_id: selectedBranch,
      contract_date: saleDate.toISOString().split('T')[0],
      start_date: saleDate.toISOString().split('T')[0],
      installation_address: address,
      latitude: location.latitude,
      longitude: location.longitude,
      has_coverage: hasAvailability ? 1 : 0,
      monthly_amount: selectedPlan.price,
      total_amount: selectedPlan.price * 12,
      plan: selectedPlan.name,
    };
    const customData: Record<string, any> = {};

    if (uploadedSignatureUrl) {
      customData.signature_url = uploadedSignatureUrl;
    }

    contractWizard?.steps.forEach(wizardStep => {
      wizardStep.fields.forEach(field => {
        const fieldKey = field.is_system_field && field.system_field_mapping
          ? field.system_field_mapping
          : field.name;
        const value = contractFormData[fieldKey];

        if (value !== undefined && value !== '') {
          if (field.is_system_field && field.system_field_mapping) {
            if (!['service_plan_id', 'sales_rep_id', 'client_id', 'branch_id'].includes(field.system_field_mapping)) {
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

    const contract = await createContract(body as CreateContractDto);
    if (contract) {
      setCreatedContractId(contract.id);
      setStep(4);
    } else if (createContractError) {
      Alert.alert('Error', createContractError);
    }
  };

  const handleSaleStep = async () => {
    if (payments.length === 0) {
      Alert.alert('Error', 'Agrega al menos un método de pago');
      return;
    }

    const invalidPayment = payments.find(p => !p.method || !p.amount);
    if (invalidPayment) {
      Alert.alert('Error', 'Completa todos los campos de los métodos de pago');
      return;
    }

    const totalAmount = selectedPlan?.price || 0;

    const body: any = {
      workspace_id: workspaceId,
      client_id: selectedClient.id,
      sales_rep_id: salesRepId,
      lead_id: leadId || undefined,
      sale_date: saleDate.toISOString().split('T')[0],
      total_amount: totalAmount,
      sale_status: 'pending',
      payments: payments.map(p => ({
        method: p.method,
        amount: parseFloat(p.amount),
        reference: p.reference || undefined,
      })),
      items: [{
        item_id: selectedPlan.id,
        name: selectedPlan.name,
        type: 'service',
        quantity: 1,
        unit_price: selectedPlan.price,
        tax_rate: 0,
        tax_type: 'exento',
        description: selectedPlan.description || '',
      }],
    };

    const sale = await createSale(body);
    if (sale) {
      setSaleCreated(sale);
      setShowSuccessModal(true);
    } else if (createSaleError) {
      Alert.alert('Error', createSaleError);
    }
  };

  const handleFieldChange = (fieldName: string, value: any, isClient: boolean) => {
    if (isClient) {
      setClientFormData(prev => ({ ...prev, [fieldName]: value }));
      if (clientErrors[fieldName]) {
        setClientErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      setContractFormData(prev => ({ ...prev, [fieldName]: value }));
      if (contractErrors[fieldName]) {
        setContractErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <View style={sales_styles.form}>
          <TextInput
            style={sales_styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Dirección"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={sales_styles.input}
            value={reference}
            onChangeText={setReference}
            placeholder="Referencia"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={sales_styles.label}>Ubicación en el mapa</Text>
          <TouchableOpacity
            style={sales_styles.mapButton}
            onPress={() => setShowMapModal(true)}
          >
            <Feather name="map-pin" size={20} color="#0C352E" style={{ marginRight: 8 }} />
            <Text style={sales_styles.mapButtonText}>
              {location.latitude !== 4.7110 || location.longitude !== -74.0721
                ? `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`
                : 'Seleccionar ubicación en el mapa'}
            </Text>
          </TouchableOpacity>

          <Modal visible={showMapModal} animationType="slide">
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
                <Circle
                  center={location}
                  radius={200}
                  fillColor="rgba(15, 229, 139, 0.15)"
                  strokeColor="rgba(15, 229, 139, 0.4)"
                  strokeWidth={2}
                />
              </MapView>

              <View style={sales_styles.mapActions}>
                <TouchableOpacity
                  style={[sales_styles.mapActionButton, sales_styles.cancelButton]}
                  onPress={() => setShowMapModal(false)}
                >
                  <Text style={sales_styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[sales_styles.mapActionButton, sales_styles.confirmButton]}
                  onPress={() => {
                    handleCheckViability(location.latitude, location.longitude);
                    setShowMapModal(false);
                  }}
                >
                  <Text style={sales_styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {checkingViability && (
            <View style={sales_styles.coverageCard}>
              <ActivityIndicator size="small" color="#0C352E" />
              <Text style={[sales_styles.coverageSubtext, { marginLeft: 12, textAlign: 'left' }]}>
                Verificando cobertura...
              </Text>
            </View>
          )}

          {!checkingViability && hasAvailability === true && (
            <View style={[sales_styles.coverageCard, { backgroundColor: '#E8F9F3', borderColor: '#0FE58B' }]}>
              <View style={sales_styles.coverageContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ backgroundColor: '#0FE58B', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                    <Feather name="check" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={[sales_styles.coverageTitle, { color: '#0C352E' }]}>
                    ¡Hay cobertura disponible en esta zona!
                  </Text>
                </View>
                <Text style={sales_styles.coverageSubtext}>
                  Puedes continuar con el registro de la venta
                </Text>
              </View>
            </View>
          )}

          {!checkingViability && hasAvailability === false && (
            <View style={sales_styles.coverageCard}>
              <View style={sales_styles.coverageContent}>
                <Text style={sales_styles.coverageTitle}>
                  Esta zona no tiene cobertura actualmente
                </Text>
                <Text style={sales_styles.coverageSubtext}>
                  El cliente puede ser registrado como lead para contactarlo cuando esté disponible
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }

    if (step === 2) {
      const documentTypes = [
        { label: 'CC', value: 'CC' },
        { label: 'CE', value: 'CE' },
        { label: 'NIT', value: 'NIT' },
        { label: 'Pasaporte', value: 'Pasaporte' },
      ];

      const countryCodes = [
        { label: '+57', value: '+57' },
        { label: '+1', value: '+1' },
        { label: '+52', value: '+52' },
      ];

      return (
        <View style={sales_styles.form}>
          {/* Buscar Cliente */}
          <Text style={sales_styles.sectionTitle}>Buscar cliente existente</Text>
          <View style={sales_styles.documentInputRow}>
            <TouchableOpacity
              style={sales_styles.documentTypeButton}
              onPress={() => setShowDocumentTypeModal(true)}
            >
              <Text style={sales_styles.documentTypeButtonText}>{documentType}</Text>
              <Feather name="chevron-down" size={16} color="#61646B" />
            </TouchableOpacity>
            <View style={sales_styles.documentDivider} />
            <TextInput
              style={sales_styles.documentInput}
              value={documentNumber}
              onChangeText={(text) => {
                setDocumentNumber(text);
                setSelectedClient(null);
                setHasSearchedClient(false);
              }}
              placeholder="Número de documento"
              placeholderTextColor="#D3D3D3"
              keyboardType="numeric"
              returnKeyType="search"
              onSubmitEditing={handleSearchClient}
            />
            <TouchableOpacity
              style={sales_styles.searchIconButton}
              onPress={handleSearchClient}
              disabled={searchingClient || !documentNumber}
            >
              {searchingClient ? (
                <ActivityIndicator size="small" color="#0C352E" />
              ) : (
                <Feather name="search" size={20} color={documentNumber ? "#0C352E" : "#D3D3D3"} />
              )}
            </TouchableOpacity>
          </View>

          {selectedClient ? (
            <View style={sales_styles.clientFoundCard}>
              <View style={sales_styles.clientFoundIcon}>
                <Feather name="check" size={20} color="#0FE58B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={sales_styles.clientFoundName}>
                  {selectedClient.first_name} {selectedClient.last_name}
                </Text>
                <Text style={sales_styles.clientFoundDoc}>
                  {selectedClient.document_type} {selectedClient.document_number}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedClient(null)}>
                <Text style={sales_styles.clientFoundChange}>Cambiar</Text>
              </TouchableOpacity>
            </View>
          ) : hasSearchedClient ? (
            <>
              <View style={sales_styles.clientNotFoundCard}>
                <Feather name="user-plus" size={20} color="#61646B" />
                <Text style={sales_styles.clientNotFoundText}>
                  Cliente no encontrado. Completa el formulario para crear uno nuevo
                </Text>
              </View>

              {loadingClientWizard ? (
                <ActivityIndicator size="small" color="#0C352E" style={{ marginTop: 16 }} />
              ) : (
                clientWizard?.steps.map((wizardStep, stepIndex) => (
                  <View key={stepIndex}>
                    {clientWizard.steps.length > 1 && (
                      <Text style={[sales_styles.sectionTitle, { marginTop: 16 }]}>
                        {wizardStep.name}
                      </Text>
                    )}
                    {wizardStep.fields.map((field, fieldIndex) => {
                      const fieldKey = field.is_system_field && field.system_field_mapping
                        ? field.system_field_mapping
                        : field.name;

                      // Campos que ya se manejan en la búsqueda
                      if (['document_type', 'document_number'].includes(fieldKey)) {
                        return null;
                      }

                      return (
                        <View key={fieldIndex}>
                          <Text style={sales_styles.label}>
                            {field.label}
                            {field.is_required && <Text style={{ color: '#FF3B30' }}> *</Text>}
                          </Text>

                          {field.field_type === 'phone' ? (
                            <View style={sales_styles.documentInputRow}>
                              <TouchableOpacity
                                style={sales_styles.documentTypeButton}
                                onPress={() => setShowPhoneCodeModal(true)}
                              >
                                <Text style={sales_styles.documentTypeButtonText}>{phoneCountryCode}</Text>
                                <Feather name="chevron-down" size={16} color="#61646B" />
                              </TouchableOpacity>
                              <View style={sales_styles.documentDivider} />
                              <TextInput
                                style={sales_styles.documentInput}
                                value={clientFormData[fieldKey] || ''}
                                onChangeText={(value) => handleFieldChange(fieldKey, value, true)}
                                placeholder={field.placeholder || ''}
                                placeholderTextColor="#D3D3D3"
                                keyboardType="phone-pad"
                              />
                            </View>
                          ) : field.field_type === 'email' ? (
                            <TextInput
                              style={sales_styles.input}
                              value={clientFormData[fieldKey] || ''}
                              onChangeText={(value) => handleFieldChange(fieldKey, value, true)}
                              placeholder={field.placeholder || ''}
                              placeholderTextColor="#D3D3D3"
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          ) : field.field_type === 'number' ? (
                            <TextInput
                              style={sales_styles.input}
                              value={clientFormData[fieldKey]?.toString() || ''}
                              onChangeText={(value) => handleFieldChange(fieldKey, value, true)}
                              placeholder={field.placeholder || ''}
                              placeholderTextColor="#D3D3D3"
                              keyboardType="numeric"
                            />
                          ) : field.field_type === 'textarea' ? (
                            <TextInput
                              style={[sales_styles.input, sales_styles.textArea]}
                              value={clientFormData[fieldKey] || ''}
                              onChangeText={(value) => handleFieldChange(fieldKey, value, true)}
                              placeholder={field.placeholder || ''}
                              placeholderTextColor="#D3D3D3"
                              multiline
                              numberOfLines={4}
                              textAlignVertical="top"
                            />
                          ) : field.field_type === 'select' ? (
                            <Select
                              options={field.options?.map(opt => ({
                                label: typeof opt === 'string' ? opt : (opt as any).label,
                                value: typeof opt === 'string' ? opt : (opt as any).value
                              })) || []}
                              value={clientFormData[fieldKey] || ''}
                              onChange={(value) => handleFieldChange(fieldKey, value, true)}
                              placeholder={field.placeholder || 'Seleccionar'}
                            />
                          ) : (
                            <TextInput
                              style={sales_styles.input}
                              value={clientFormData[fieldKey] || ''}
                              onChangeText={(value) => handleFieldChange(fieldKey, value, true)}
                              placeholder={field.placeholder || ''}
                              placeholderTextColor="#D3D3D3"
                            />
                          )}

                          {clientErrors[fieldKey] && (
                            <Text style={{ color: '#FF3B30', fontSize: 12, marginTop: 4 }}>
                              {clientErrors[fieldKey]}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))
              )}
            </>
          ) : null}

          {/* Modales de selección */}
          <Modal visible={showDocumentTypeModal} transparent animationType="fade">
            <TouchableOpacity
              style={sales_styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowDocumentTypeModal(false)}
            >
              <View style={sales_styles.modalContent}>
                {documentTypes.map(type => (
                  <TouchableOpacity
                    key={type.value}
                    style={sales_styles.modalOption}
                    onPress={() => {
                      setDocumentType(type.value);
                      setShowDocumentTypeModal(false);
                    }}
                  >
                    <Text style={sales_styles.modalOptionText}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          <Modal visible={showPhoneCodeModal} transparent animationType="fade">
            <TouchableOpacity
              style={sales_styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowPhoneCodeModal(false)}
            >
              <View style={sales_styles.modalContent}>
                {countryCodes.map(code => (
                  <TouchableOpacity
                    key={code.value}
                    style={sales_styles.modalOption}
                    onPress={() => {
                      setPhoneCountryCode(code.value);
                      setShowPhoneCodeModal(false);
                    }}
                  >
                    <Text style={sales_styles.modalOptionText}>{code.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      );
    }

    if (step === 3) {
      console.log('=== PASO 3 DEBUG ===');
      console.log('loadingCatalog:', loadingCatalog);
      console.log('branches:', branches);
      console.log('zones:', zones);
      console.log('plans:', plans);
      console.log('branches type:', typeof branches);
      console.log('branches isArray:', Array.isArray(branches));

      if (loadingCatalog || loadingContractWizard) {
        return (
          <View style={sales_styles.form}>
            <ActivityIndicator size="large" color="#0C352E" />
            <Text style={{ marginTop: 8, color: '#666', textAlign: 'center' }}>Cargando...</Text>
          </View>
        );
      }

      const branchOptions = Array.isArray(branches) ? branches.map(b => ({ label: b.name, value: b.id })) : [];
      const zoneOptions = Array.isArray(zones) ? zones.map(z => ({ label: z.name, value: z.id })) : [];
      const planOptions = Array.isArray(plans) ? plans.map(p => ({ label: p.name, value: p.id })) : [];

      console.log('branchOptions:', branchOptions);
      console.log('zoneOptions:', zoneOptions);
      console.log('planOptions:', planOptions);

      return (
        <View style={sales_styles.form}>
          {/* Fecha de venta */}
          <Text style={sales_styles.label}>Fecha de venta</Text>
          <TouchableOpacity
            style={sales_styles.documentInputRow}
            onPress={() => setShowDatePicker(true)}
          >
            <TextInput
              style={[sales_styles.documentInput, { paddingLeft: 16 }]}
              value={saleDate.toLocaleDateString('es-CO')}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#D3D3D3"
              editable={false}
              pointerEvents="none"
            />
            <Feather name="calendar" size={20} color="#D3D3D3" style={{ marginRight: 12 }} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={saleDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setSaleDate(selectedDate);
              }}
            />
          )}

          {/* Sucursal */}
          <Select
            label="Sucursal"
            options={branchOptions}
            value={selectedBranch}
            onChange={(value) => {
              console.log('Sucursal seleccionada:', value);
              setSelectedBranch(value);
              setSelectedZone('');
              loadZones(value);
            }}
            placeholder="Matriz"
          />

          {/* Zona */}
          <Select
            label="Zona"
            options={zoneOptions}
            value={selectedZone}
            onChange={setSelectedZone}
            placeholder="Principal"
          />

          {/* Plan a contratar */}
          <Select
            label="Plan a contratar"
            options={planOptions}
            value={selectedPlan?.id}
            onChange={(value) => {
              const plan = plans.find(p => p.id === value);
              setSelectedPlan(plan);
            }}
            placeholder="Super Plan BBB"
          />

          {/* Campos dinámicos del wizard */}
          {contractWizard?.steps.map((wizardStep, stepIndex) => (
            <View key={stepIndex}>
              {contractWizard.steps.length > 1 && (
                <Text style={[sales_styles.sectionTitle, { marginTop: 16 }]}>
                  {wizardStep.name}
                </Text>
              )}
              {wizardStep.fields.map((field, fieldIndex) => {
                const fieldKey = field.is_system_field && field.system_field_mapping
                  ? field.system_field_mapping
                  : field.name;

                // Campos que ya se manejan arriba
                if (['service_plan_id', 'branch_id', 'sales_rep_id', 'client_id'].includes(fieldKey)) {
                  return null;
                }

                return (
                  <View key={fieldIndex}>
                    <Text style={sales_styles.label}>
                      {field.label}
                      {field.is_required && <Text style={{ color: '#FF3B30' }}> *</Text>}
                    </Text>

                    {field.field_type === 'number' ? (
                      <TextInput
                        style={sales_styles.input}
                        value={contractFormData[fieldKey]?.toString() || ''}
                        onChangeText={(value) => handleFieldChange(fieldKey, value, false)}
                        placeholder={field.placeholder || ''}
                        placeholderTextColor="#D3D3D3"
                        keyboardType="numeric"
                      />
                    ) : field.field_type === 'textarea' ? (
                      <TextInput
                        style={[sales_styles.input, sales_styles.textArea]}
                        value={contractFormData[fieldKey] || ''}
                        onChangeText={(value) => handleFieldChange(fieldKey, value, false)}
                        placeholder={field.placeholder || ''}
                        placeholderTextColor="#D3D3D3"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    ) : field.field_type === 'select' ? (
                      <Select
                        options={field.options?.map(opt => ({
                          label: typeof opt === 'string' ? opt : (opt as any).label,
                          value: typeof opt === 'string' ? opt : (opt as any).value
                        })) || []}
                        value={contractFormData[fieldKey] || ''}
                        onChange={(value) => handleFieldChange(fieldKey, value, false)}
                        placeholder={field.placeholder || 'Seleccionar'}
                      />
                    ) : (
                      <TextInput
                        style={sales_styles.input}
                        value={contractFormData[fieldKey] || ''}
                        onChangeText={(value) => handleFieldChange(fieldKey, value, false)}
                        placeholder={field.placeholder || ''}
                        placeholderTextColor="#D3D3D3"
                      />
                    )}

                    {contractErrors[fieldKey] && (
                      <Text style={{ color: '#FF3B30', fontSize: 12, marginTop: 4 }}>
                        {contractErrors[fieldKey]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}

          {/* Canvas de Firma */}
          <View style={sales_styles.signatureSection}>
            <View style={sales_styles.signatureHeaderRight}>
              <TouchableOpacity onPress={() => signatureRef.current?.clearSignature()}>
                <Text style={sales_styles.signatureClearButton}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            <View style={sales_styles.signatureCanvasLarge}>
              <SignatureCanvas
                ref={signatureRef}
                onOK={(signature) => setSignatureUrl(signature)}
                onBegin={() => setIsSignaturePadActive(true)}
                onEnd={() => setIsSignaturePadActive(false)}
                descriptionText=""
                clearText="Limpiar"
                confirmText="Guardar"
                webStyle={`.m-signature-pad {box-shadow: none; border: none; border-radius: 12px;} .m-signature-pad--body {border: none;} .m-signature-pad--footer {display: none;}`}
              />
            </View>
          </View>
        </View>
      );
    }

    if (step === 4) {
      const totalAmount = selectedPlan?.price || 0;
      const paymentMethods = [
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Nequi', value: 'nequi' },
        { label: 'Daviplata', value: 'daviplata' },
        { label: 'Link de Pago', value: 'link_pago' },
        { label: 'Transferencia', value: 'transferencia' },
      ];

      return (
        <View style={sales_styles.form}>
          {/* Monto Total */}
          <View style={sales_styles.totalAmountCard}>
            <Text style={sales_styles.totalAmountLabel}>Monto total</Text>
            <Text style={sales_styles.totalAmountValue}>
              {totalAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
            </Text>
          </View>

          {/* Pagos */}
          <View style={sales_styles.paymentsSection}>
            <View style={sales_styles.paymentsHeader}>
              <Text style={sales_styles.paymentsTitle}>Pagos</Text>
              <TouchableOpacity
                style={sales_styles.addPaymentButton}
                onPress={() => setPayments([...payments, { method: '', amount: '', reference: '' }])}
              >
                <Feather name="plus" size={18} color="#232323" />
              </TouchableOpacity>
            </View>

            {payments.length === 0 ? (
              <View style={sales_styles.emptyCard}>
                <Text style={sales_styles.emptyText}>No hay pagos registrados</Text>
                <Text style={[sales_styles.emptyText, { fontSize: 12, marginTop: 4 }]}>
                  Presiona + para agregar un método de pago
                </Text>
              </View>
            ) : (
              payments.map((payment, index) => (
                <View key={index} style={sales_styles.paymentCard}>
                  <TouchableOpacity
                    style={sales_styles.removePaymentButton}
                    onPress={() => setPayments(payments.filter((_, i) => i !== index))}
                  >
                    <Feather name="x" size={20} color="#FF3B30" />
                  </TouchableOpacity>

                  <View style={sales_styles.paymentRow}>
                    <View style={{ flex: 1 }}>
                      <Select
                        options={paymentMethods}
                        value={payment.method}
                        onChange={(value) => {
                          const newPayments = [...payments];
                          newPayments[index].method = value;
                          setPayments(newPayments);
                        }}
                        placeholder="Método de pago"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={sales_styles.input}
                        value={payment.amount}
                        onChangeText={(value) => {
                          const newPayments = [...payments];
                          newPayments[index].amount = value;
                          setPayments(newPayments);
                        }}
                        placeholder="Monto"
                        placeholderTextColor="#D3D3D3"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <TextInput
                    style={sales_styles.input}
                    value={payment.reference}
                    onChangeText={(value) => {
                      const newPayments = [...payments];
                      newPayments[index].reference = value;
                      setPayments(newPayments);
                    }}
                    placeholder="Referencia"
                    placeholderTextColor="#D3D3D3"
                  />

                  {payment.reference && (
                    <View style={sales_styles.referenceDisplayCard}>
                      <Text style={sales_styles.referenceDisplayText}>{payment.reference}</Text>
                    </View>
                  )}

                  {payment.method === 'link_pago' && (
                    <TouchableOpacity style={sales_styles.shareButton}>
                      <Feather name="share-2" size={20} color="#FFFFFF" />
                      <Text style={sales_styles.shareButtonText}>Compartir</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={sales_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
          <View style={sales_styles.header}>
            <TouchableOpacity
              style={sales_styles.backButton}
              onPress={() => step > 1 ? setStep(step - 1) : router.back()}
            >
              <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={sales_styles.stepIndicatorContainer}>
              <Svg width="72" height="72" style={{ position: 'absolute' }}>
                <SvgCircle
                  cx="36"
                  cy="36"
                  r="32"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="4"
                  fill="none"
                />
                <SvgCircle
                  cx="36"
                  cy="36"
                  r="32"
                  stroke="#0FE58B"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - step / 4)}`}
                  strokeLinecap="round"
                  rotation="90"
                  origin="36, 36"
                />
              </Svg>
              <View style={sales_styles.progressCircleInner}>
                <Feather name={getStepIcon()} size={28} color="#FFFFFF" />
                <Text style={sales_styles.stepNumber}>{step}/4</Text>
              </View>
            </View>

            <View style={sales_styles.headerTextContainer}>
              <Text style={sales_styles.headerTitle}>{getStepTitle()}</Text>
              <Text style={sales_styles.headerSubtitle}>{getStepSubtitle()}</Text>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView
          style={sales_styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isSignaturePadActive}
        >
          {renderStepContent()}
        </ScrollView>

        <TouchableOpacity
          style={sales_styles.nextButton}
          onPress={handleNextStep}
          disabled={searchingClient || creatingClient || creatingContract || creatingSale || checkingViability || uploadingFile}
        >
          {(searchingClient || creatingClient || creatingContract || creatingSale || checkingViability || uploadingFile) ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={sales_styles.nextButtonText}>
              {step === 1 && hasAvailability === false
                ? 'Registrar como Lead'
                : step === 4
                  ? 'Finalizar Venta'
                  : 'Siguiente'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Modal de Éxito */}
        <Modal
          visible={showSuccessModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={sales_styles.successModal}>
            <View style={sales_styles.successCard}>
              <View style={sales_styles.successIcon}>
                <Feather name="file-text" size={40} color="#FFFFFF" />
                <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: '#0FE58B', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                  <Feather name="check" size={16} color="#FFFFFF" />
                </View>
              </View>

              <Text style={sales_styles.successTitle}>¡Felicitaciones!</Text>
              <Text style={sales_styles.successSubtitle}>
                El equipo de ventas está revisando el contrato
              </Text>

              <Text style={sales_styles.successLabel}>Total pagado</Text>
              <Text style={sales_styles.successAmount}>
                {saleCreated?.total_amount?.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'} COP
              </Text>

              <View style={sales_styles.successDividerLine} />

              <View style={sales_styles.successDetails}>
                <Text style={sales_styles.successClientName}>
                  {selectedClient?.first_name?.toUpperCase()} {selectedClient?.last_name?.toUpperCase()}
                </Text>

                <View style={sales_styles.successDetailRow}>
                  <Text style={sales_styles.successDetailLabel}>Transacción ID</Text>
                  <Text style={sales_styles.successDetailValue}>{saleCreated?.sale_number || 'N/A'}</Text>
                </View>

                <View style={sales_styles.successDetailRow}>
                  <Text style={sales_styles.successDetailLabel}>Fecha</Text>
                  <Text style={sales_styles.successDetailValue}>
                    {saleCreated?.sale_date ? new Date(saleCreated.sale_date).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                  </Text>
                </View>

                <View style={sales_styles.successDetailRow}>
                  <Text style={sales_styles.successDetailLabel}>Hora</Text>
                  <Text style={sales_styles.successDetailValue}>
                    {saleCreated?.created_at ? new Date(saleCreated.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : 'N/A'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={sales_styles.successButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  resetForm();
                  router.back();
                }}
              >
                <Text style={sales_styles.successButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modales de selección del paso 2 */}
        <Modal visible={showDocumentTypeModal} transparent animationType="fade">
          <TouchableOpacity
            style={sales_styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDocumentTypeModal(false)}
          >
            <View style={sales_styles.modalContent}>
              {[
                { label: 'CC', value: 'CC' },
                { label: 'CE', value: 'CE' },
                { label: 'NIT', value: 'NIT' },
                { label: 'Pasaporte', value: 'Pasaporte' },
              ].map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={sales_styles.modalOption}
                  onPress={() => {
                    setDocumentType(type.value);
                    setShowDocumentTypeModal(false);
                  }}
                >
                  <Text style={sales_styles.modalOptionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={showPhoneCodeModal} transparent animationType="fade">
          <TouchableOpacity
            style={sales_styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPhoneCodeModal(false)}
          >
            <View style={sales_styles.modalContent}>
              {[
                { label: '+57', value: '+57' },
                { label: '+1', value: '+1' },
                { label: '+52', value: '+52' },
              ].map(code => (
                <TouchableOpacity
                  key={code.value}
                  style={sales_styles.modalOption}
                  onPress={() => {
                    setPhoneCountryCode(code.value);
                    setShowPhoneCodeModal(false);
                  }}
                >
                  <Text style={sales_styles.modalOptionText}>{code.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    </>
  );
}
