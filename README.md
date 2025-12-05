# Power Play – React + Spring Boot + MongoDB

Aplicación e-commerce construida con React (Vite) para el frontal y un backend REST en Spring Boot que persiste datos en MongoDB Atlas. El backend está listo para desplegarse en Render y expone endpoints de autenticación, productos y órdenes.

## Estructura del proyecto

```
├── backend/              # API Spring Boot
│   ├── pom.xml
│   ├── src/main/java/com/powerplay
│   └── src/main/resources/products.json (seed inicial)
├── src/                  # Frontend React
├── .env.example          # URL del backend para Vite
└── backend/.env.example  # Variables del backend (Mongo, JWT, etc.)
```

## Requisitos

- Node.js 18+
- npm
- Java 21+
- Maven 3.9+
- Cuenta y cluster en MongoDB Atlas
- (Opcional) Cuenta en Render para el despliegue del backend

## Configurar el frontend

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea el archivo `.env` a partir del ejemplo y apunta al backend local o remoto:
   ```bash
   cp .env.example .env
   # VITE_API_URL=http://localhost:8080 (local) o la URL HTTPS de Render
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configurar el backend Spring Boot

1. Copia las variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   ```
   - `MONGODB_URI`: cadena de conexión de MongoDB Atlas (incluye usuario/contraseña).
   - `MONGODB_DB`: base de datos a usar.
   - `JWT_SECRET`: clave segura para los tokens.
   - `CLIENT_URL`: URL(s) permitidas para CORS (separa con comas si son varias, p. ej. `http://localhost:5173,https://powerplay.vercel.app`).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: credenciales del usuario administrador que se crea automáticamente.
2. Desde la carpeta `backend` ejecuta el servicio:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   El backend queda en `http://localhost:8080` y expone:
   - `POST /api/auth/signup`
   - `POST /api/auth/login`
   - `GET /api/products`
   - `POST/PUT/DELETE /api/products` (requiere token admin)
   - `GET/POST /api/orders` (requiere token)
3. La primera vez que corre, se importa el catálogo desde `backend/src/main/resources/products.json` y se asegura el usuario admin definido en las variables.

## Despliegue del backend en Render

1. Asegúrate de tener el repositorio en GitHub/GitLab.
2. (Opcional pero recomendado) Genera el wrapper de Maven una sola vez para que Render no dependa de Maven instalado:
   ```bash
   cd backend
   mvn -N wrapper:wrapper
   ```
   Esto crea `mvnw` y `mvnw.cmd`. Si no deseas usar wrapper, Render también acepta `mvn` siempre que esté disponible.
3. En Render:
   - Crea un **Web Service** nuevo conectado al repositorio.
   - En **Root Directory** pon `backend`.
   - **Build Command**: `./mvnw clean package` (o `mvn -B clean package`).
   - **Start Command**: `java -jar target/power-play-backend-0.0.1-SNAPSHOT.jar`.
   - Añade las mismas variables de entorno del `.env` (MONGODB_URI, JWT_SECRET, CLIENT_URL, etc.). Usa la URL de tu frontend desplegado en `CLIENT_URL`.
4. Render construirá el jar y levantará el servicio. Anota la URL pública (por ejemplo `https://power-play-backend.onrender.com`).
5. Actualiza el frontend (`.env`) para apuntar a esa URL y vuelve a desplegar el frontend (Vercel, Netlify, etc.).

## MongoDB Atlas

- Crea un Cluster compartido, una base de datos (por defecto `powerplay`) y un usuario con permisos de lectura/escritura.
- Asegúrate de habilitar la IP 0.0.0.0 o la IP de Render en la lista de acceso.
- Usa la cadena de conexión SRV en `MONGODB_URI` (ejemplo: `mongodb+srv://usuario:password@cluster.mongodb.net/powerplay`).

## Flujo de autenticación

- El contexto de React (`AuthContext`) consume `/api/auth/login` y almacena el token JWT en `localStorage`.
- Todas las operaciones administrativas y las órdenes usan el token en el header `Authorization: Bearer <token>`.
- El backend valida el token y verifica el rol `admin` para permitir la administración del catálogo.

## Scripts útiles

Frontend:
- `npm run dev`: entorno de desarrollo
- `npm run build`: build de producción

Backend:
- `mvn spring-boot:run`: levantar API en desarrollo
- `mvn test`: ejecutar pruebas (cuando existan)

## Próximos pasos sugeridos

- Añadir `mvnw` al repositorio para simplificar despliegues.
- Crear un flujo CI/CD que compile y ejecute pruebas del backend automáticamente.
- Implementar reCAPTCHA o verificación de email para el registro de usuarios.
- Mover los assets (imágenes) a un CDN y persistir sus URLs en la base de datos.
