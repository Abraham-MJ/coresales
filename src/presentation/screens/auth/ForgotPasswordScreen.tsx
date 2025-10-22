import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password Screen</Text>
      <Text style={styles.subtitle}>Aquí irá el formulario para recuperar contraseña</Text>
      
      <View style={styles.navigation}>
        <Link href="/auth/login" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Volver al Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  navigation: {
    gap: 15,
    alignItems: 'center',
  },
  link: {
    padding: 10,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});