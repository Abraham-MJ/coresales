import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Input } from '../../components/ui/Input';
import { login_styles } from './styles/login-styles';
import { useAuth } from '@presentation/hooks/useAuth';

import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    // Validar email
    if (!email) {
      setEmailError('El correo electrónico es requerido');
      hasError = true;
    } else {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Ingresa un correo electrónico válido');
        hasError = true;
      }
    }

    // Validar password
    if (!password) {
      setPasswordError('La contraseña es requerida');
      hasError = true;
    }

    // Si hay errores, no continuar
    if (hasError) {
      return;
    }

    const result = await login({ email, password });

    if (result) {
      // Login exitoso - navegar al dashboard
      router.replace('/(app)/(tabs)');
    } else if (error) {
      // Mostrar error en el campo correspondiente según la API
      if (error.field === 'email') {
        setEmailError(error.message);
      } else if (error.field === 'password') {
        setPasswordError(error.message);
      } else {
        // Error general, mostrar en email
        setEmailError(error.message);
      }
    }
  };

  return (
    <View style={login_styles.container}>
      <View style={login_styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={login_styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={login_styles.card}>
        <Text style={login_styles.title}>Iniciar Sesión</Text>

        <View style={login_styles.form}>
          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(''); // Limpiar error al escribir
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            error={emailError}
            rightIcon={<Feather name="mail" size={22} color="#D3D3D3" />}
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(''); // Limpiar error al escribir
            }}
            secureTextEntry={!showPassword}
            editable={!loading}
            error={passwordError}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#D3D3D3" 
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity 
            style={[login_styles.button, loading && { opacity: 0.6 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={login_styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
