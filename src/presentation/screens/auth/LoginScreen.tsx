import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../../components/ui/Input';
import { login_styles } from './styles/login-styles';

import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

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
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            rightIcon={<Feather name="mail" size={22} color="#D3D3D3" />}
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
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

          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <Text style={login_styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={login_styles.button} onPress={() => router.push('/(tabs)')}>
            <Text style={login_styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={login_styles.footer}>
        <Text style={login_styles.footerText}>¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={login_styles.registerLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
