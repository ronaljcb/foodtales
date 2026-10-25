# Recuperación de FoodTales

## Antes

El frontend utilizaba direcciones fijas de AWS que ya no permiten recorrer el proyecto de forma independiente.

## Edición de portafolio

Se conserva el frontend original y se añade un adaptador de demostración que respeta los contratos usados por la interfaz. La persistencia es local y por navegador. Las llamadas de negocio de la demo no llegan a AWS. Las imágenes, fuentes y mapas pueden consultar proveedores externos.

El monorepositorio contiene `frontend/` y el backend original de Spring Boot en `backend/`. Vercel publica el frontend. El backend Java se conserva como implementación original, con configuración por variables de entorno; no se ejecuta en esta demo ni se afirma haber migrado PostgreSQL.

## Volver a un backend real

Configura `VITE_DEMO_MODE=false` y `VITE_API_URL` con un backend HTTPS accesible. El backend necesita PostgreSQL, JWT_SECRET y las variables de correo indicadas en su configuración. Configura CORS para el origen exacto de tu frontend y valida el flujo completo antes de usar datos reales.

## Límites

El inicio de sesión de demostración no protege datos ni representa autenticación segura. El registro usa datos ficticios y no guarda contraseñas. No se envían correos, no se cobran compras y no se restauran datos de pacientes o usuarios. La aplicación es una muestra interactiva para el perfil.
