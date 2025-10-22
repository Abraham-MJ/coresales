import { Redirect } from 'expo-router';

// Por defecto redirige al login
export default function AuthIndex() {
  return <Redirect href="/auth/login" />;
}