# CoreSales - Dónde va cada cosa

## 📁 Carpetas y qué poner en cada una

```
src/
├── domain/              # Las cosas del negocio (User, Product, Sale)
├── application/         # Los servicios que coordinan todo
├── infrastructure/      # APIs y base de datos
├── presentation/        # Pantallas y componentes
└── shared/             # Cosas que todos usan
```

## 🧠 domain/ - Las cosas del negocio

### `entities/` - Qué ES cada cosa
```typescript
// User.ts
class User {
  name: string;
  email: string;
}

// Product.ts  
class Product {
  name: string;
  price: number;
}
```

### `usecases/` - Qué HACE la app
```typescript
// CreateSale.ts
class CreateSale {
  execute(product, customer) {
    // Lógica para crear venta
  }
}
```

### `repositories/` - Qué necesitas (interfaces)
```typescript
// IUserRepository.ts
interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User>;
}
```

## 🎯 application/ - Los coordinadores

### `services/` - Coordinan varias tareas
```typescript
// UserService.ts
class UserService {
  async registerUser(name, email) {
    // 1. Crear usuario
    // 2. Validar
    // 3. Guardar
    // 4. Enviar email
  }
}
```

### `dto/` - Datos entre capas
```typescript
// CreateUserDTO.ts
interface CreateUserDTO {
  name: string;
  email: string;
}
```

## 🔌 infrastructure/ - APIs y datos

### `repositories/` - Implementa las interfaces
```typescript
// ApiUserRepository.ts - Guarda en internet
class ApiUserRepository implements IUserRepository {
  async save(user) {
    await fetch('/api/users', { ... });
  }
}

// MockUserRepository.ts - Datos fake
class MockUserRepository implements IUserRepository {
  async save(user) {
    // Guardar en memoria
  }
}
```

### `api/` - Configuración HTTP
```typescript
// apiClient.ts
const api = axios.create({
  baseURL: 'https://mi-api.com'
});
```

### `storage/` - Base de datos local
```typescript
// database.ts
const db = SQLite.openDatabase('coresales.db');
```

## 👀 presentation/ - Pantallas y UI

### `screens/` - Las pantallas
```typescript
// LoginScreen.tsx
function LoginScreen() {
  const handleLogin = () => {
    // Usar service
  };
  
  return <View>...</View>;
}
```

### `components/` - Componentes reutilizables
```typescript
// Button.tsx
function Button({ title, onPress }) {
  return <TouchableOpacity>...</TouchableOpacity>;
}
```

### `hooks/` - Lógica reutilizable
```typescript
// useUsers.ts
function useUsers() {
  const [users, setUsers] = useState([]);
  return { users, loadUsers };
}
```

## 🛠️ shared/ - Cosas que todos usan

### `constants/` - Valores fijos
```typescript
// theme.ts
export const Colors = {
  primary: '#007AFF',
  background: '#FFFFFF'
};
```

### `utils/` - Funciones útiles
```typescript
// formatters.ts
export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}
```

### `types/` - Tipos comunes
```typescript
// common.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
}
```

---

## 🎯 Reglas simples

1. **domain** → No conoce nada más
2. **application** → Solo usa domain
3. **infrastructure** → Implementa lo que promete domain
4. **presentation** → Usa application y domain
5. **shared** → Todos lo pueden usar

## 💡 Ejemplo rápido

Usuario quiere ver productos:
1. Pantalla → Hook → Service → UseCase → Repository → API
2. API → Repository → UseCase → Service → Hook → Pantalla

**¡Listo!** 🎉
