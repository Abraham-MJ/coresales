# CoreSales - Arquitectura Hexagonal

Una aplicación React Native con Expo implementando **Arquitectura Hexagonal** para un sistema de ventas limpio, testeable y mantenible.

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Arquitectura Hexagonal** (Ports & Adapters), separando claramente:

- **Dominio**: Lógica de negocio pura
- **Aplicación**: Orquestación de casos de uso  
- **Infraestructura**: Adaptadores externos (APIs, Storage)
- **Presentación**: UI con React Native/Expo

## 📁 Estructura del Proyecto

```
src/
├── domain/              # 🎯 Lógica de Negocio
│   ├── entities/        # Entidades de dominio
│   ├── repositories/    # Interfaces (ports)
│   ├── usecases/        # Casos de uso
│   └── value-objects/   # Objetos de valor
├── application/         # 🔄 Orquestación
│   ├── services/        # Servicios de aplicación
│   └── dto/             # Data Transfer Objects
├── infrastructure/      # 🔌 Adaptadores
│   ├── api/             # Clientes HTTP
│   ├── storage/         # Almacenamiento local
│   ├── repositories/    # Implementaciones
│   └── services/        # Servicios externos
├── presentation/        # 🎨 UI React Native
│   ├── components/      # Componentes reutilizables
│   ├── screens/         # Pantallas
│   ├── hooks/           # Custom hooks
│   └── navigation/      # Configuración de rutas
└── shared/             # 🛠️ Código compartido
    ├── types/          # Tipos TypeScript
    ├── utils/          # Utilidades
    └── constants/      # Constantes globales
```

## 🚀 Inicio Rápido

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm start          # Iniciar Expo
npm run android    # Android
npm run ios        # iOS  
npm run web        # Web
```

### Linting
```bash
npm run lint
```

## 📚 Documentación

- **[Arquitectura Completa](./docs/ARCHITECTURE.md)** - Guía detallada de la arquitectura hexagonal
- **[Guía de Inicio](./docs/GETTING_STARTED.md)** - Cómo implementar tu primera feature

## 🧪 Testing

La arquitectura hexagonal facilita el testing:

- **Unit Tests**: Domain y Application (rápidos, sin dependencias)
- **Integration Tests**: Infrastructure (con mocks)  
- **E2E Tests**: Presentation (completos)

## 🔧 Tecnologías

- **React Native 0.81.4** con **React 19.1.0**
- **Expo SDK ~54.0** (Nueva Arquitectura habilitada)
- **TypeScript** con configuración estricta
- **Expo Router 6.0** para navegación file-based
- **React Native Reanimated** para animaciones

## 📋 Convenciones

### Naming
- **Entities**: `User`, `Product`, `Sale`
- **Interfaces**: `IUserRepository`, `IProductService`
- **Use Cases**: `GetUser`, `CreateSale`, `ProcessOrder`
- **Components**: `UserCard`, `SalesList`, `ProductForm`
- **Hooks**: `useUser`, `useSales`, `useAuth`

### Imports
```typescript
// Usa paths absolutos configurados en tsconfig.json
import { User } from '@domain/entities/User';
import { ApiUserRepository } from '@infrastructure/repositories/ApiUserRepository';
import { useUser } from '@presentation/hooks/useUser';
```

## 🔄 Flujo de Desarrollo

1. **Domain First**: Define entidades y casos de uso
2. **Infrastructure**: Implementa repositorios y servicios
3. **Application**: Crea servicios de orquestación si es necesario
4. **Presentation**: Desarrolla hooks, componentes y pantallas

## ✅ Beneficios

- **Testeable**: Lógica de negocio independiente
- **Mantenible**: Separación clara de responsabilidades  
- **Flexible**: Fácil cambio de implementaciones
- **Escalable**: Arquitectura que crece con el proyecto

---

¡Comienza desarrollando tu primera feature siguiendo la [Guía de Inicio](./docs/GETTING_STARTED.md)!