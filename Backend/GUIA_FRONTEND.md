# Guía de Integración API - Backend (Sprint 1)  
**Backend URL base:** `http://localhost:3000`  


---

##  1. Autenticación (Login de Administradores)
*Los administradores son los bibliotecarios autorizados para ingresar a gestionar el sistema.*

### `POST /api/auth/login`
Inicia sesión y genera el token de acceso.

* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "admin.katherine@bibliotecacq.cr",
    "password": "Admin123!"
  }
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Autenticación exitosa.",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "6ad550f5e70ca06083e4a88f",
      "name": "Katherine",
      "lastName": "Solis Ramírez",
      "email": "admin.katherine@bibliotecacq.cr",
      "role": "admin",
      "userCode": "BCQ-ADM01"
    }
  }
  ```
* **Respuestas de Error:**
  * `400`: Falta correo o contraseña.
  * `401`: Correo o contraseña incorrectos.
  * `403`: Usuario no es administrador o cuenta inactiva.

---

## 👤 2. Módulo de Registro y Edición de Usuarios (HU-01, HU-02, HU-03)

### `POST /api/users` (HU-01 y HU-03: Registrar Usuario)
Registra un nuevo visitante en el sistema, genera automáticamente su código único alfanumérico y le envía un correo electrónico de bienvenida con su código para hacer check-in.

* **Request Body:**
  ```json
  {
    "name": "Carlos",
    "lastName": "Alvarado Gómez",
    "cedula": "208760123",
    "email": "carlos.alvarado@correo.com",
    "phone": "8888-9999",
    "age": 22,
    "address": "Ciudad Quesada, Barrio San Martín"
  }
  ```
  *(Campos obligatorios: `name`, `lastName`, `cedula`, `email`).*

* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Usuario registrado exitosamente.",
    "data": {
      "_id": "6ad559a12c8b001a23",
      "name": "Carlos",
      "lastName": "Alvarado Gómez",
      "cedula": "208760123",
      "email": "carlos.alvarado@correo.com",
      "phone": "8888-9999",
      "age": 22,
      "address": "Ciudad Quesada, Barrio San Martín",
      "role": "user",
      "userCode": "BCQ-7K9A2",
      "isActive": true,
      "createdAt": "2026-10-18T23:10:00.000Z"
    },
    "emailStatus": {
      "sent": true,
      "messageId": "<...>"
    }
  }
  ```
* **Tip para el Frontend:** Muestra una alerta o modal de confirmación indicando:  
  * *"¡Usuario registrado! Su código único es **BCQ-7K9A2** y ha sido enviado a su correo electrónico."*

---

### `GET /api/users` (Listado y Búsqueda de Usuarios)
Obtiene todos los usuarios registrados.

* **Parámetros opcionales (Query Params):**
  * `?search=texto`: Filtra en tiempo real por nombre, apellidos, cédula, correo o código único.
  * *Ejemplo:* `GET /api/users?search=carlos` o `GET /api/users?search=BCQ-7K9A2`
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "6ad559a12c8b001a23",
        "name": "Carlos",
        "lastName": "Alvarado Gómez",
        "cedula": "208760123",
        "email": "carlos.alvarado@correo.com",
        "userCode": "BCQ-7K9A2",
        "isActive": true
      }
    ]
  }
  ```

---

### `GET /api/users/:id` (Consultar Usuario por ID)
Obtiene los detalles de un usuario específico para precargar el formulario de edición.

* **Ejemplo:** `GET /api/users/6ad559a12c8b001a23`
* **Respuesta Exitosa (`200 OK`):** Retorna el objeto del usuario en `data`.

---

### `PUT /api/users/:id` (HU-02: Editar Usuario)
Actualiza los datos personales del usuario.

> **Importante para el Frontend:** El campo **`userCode`** debe mostrarse en modo de solo lectura (`readOnly` o `disabled`), ya que el código asignado nunca cambia.

* **Request Body (enviar los campos a actualizar):**
  ```json
  {
    "phone": "8765-4321",
    "address": "Ciudad Quesada Centro, 200m Norte de la Catedral"
  }
  ```
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Usuario actualizado exitosamente.",
    "data": { ... }
  }
  ```

---

### `POST /api/users/:id/resend-code` (Reenviar Código por Correo)
Botón de auxilio por si el usuario borró o perdió el correo con su código.

* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Código reenviado a carlos.alvarado@correo.com",
    "emailStatus": { "sent": true }
  }
  ```

---

## 3. Módulo de Control de Acceso (HU-04: Check-in)

### `POST /api/access/check-in` (Registrar Ingreso)
Permite al visitante ingresar su código único al llegar a la biblioteca. El sistema valida su identidad y guarda la fecha y hora exacta de entrada.

* **Request Body:**
  ```json
  {
    "userCode": "BCQ-U7K9A",
    "notes": "Opcional: motivo o lectura en sala"
  }
  ```
* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "¡Bienvenido(a) María Elena Quesada Soto! Ingreso registrado correctamente.",
    "data": {
      "accessId": "6ad5611e9a224...",
      "user": {
        "id": "6ad550f5e70ca06083e4a892",
        "name": "María Elena",
        "lastName": "Quesada Soto",
        "cedula": "207550123",
        "email": "maria.quesada@ejemplo.com",
        "role": "user",
        "userCode": "BCQ-U7K9A"
      },
      "entryTime": "2026-10-18T23:15:30.450Z"
    }
  }
  ```
* **Tip para el Frontend:** 
  * Puedes mostrar una tarjeta de bienvenida en pantalla con el nombre del visitante y la hora de entrada.
* **Respuestas de Error:**
  * `400`: No se envió el código.
  * `404`: Código de usuario no existe en la base de datos.
  * `403`: El usuario está inactivo en el sistema.

---

### `GET /api/access` (Historial / Bitácora de Accesos)
Lista todos los ingresos registrados en orden cronológico (los más recientes primero).

* **Parámetros opcionales (Query Params):**
  * `?limit=50`: Cantidad máxima de registros a traer (por defecto 50).
  * `?date=YYYY-MM-DD`: Filtrar por una fecha específica (ej: `?date=2026-10-18`).
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "_id": "6ad5611e9a224...",
        "userCode": "BCQ-U7K9A",
        "userName": "María Elena Quesada Soto",
        "entryTime": "2026-10-18T23:15:30.450Z",
        "notes": "",
        "user": {
          "_id": "6ad550f5e70ca06083e4a892",
          "name": "María Elena",
          "lastName": "Quesada Soto",
          "email": "maria.quesada@ejemplo.com",
          "cedula": "207550123",
          "role": "user"
        }
      }
    ]
  }
  ```

---

##  4. Cuentas de Prueba Pre-cargadas (Seed)

Para probar inmediatamente sin tener que inventar datos:

### Administradores (Contraseña para todos: `Admin123!`): npm run seed

* `admin.katherine@bibliotecacq.cr`
* `admin.karol@bibliotecacq.cr`
* `admin.rudy@bibliotecacq.cr`

### Códigos de Visitantes listos para probar Check-in:
* `BCQ-U7K9A` (María Elena Quesada Soto)
* `BCQ-U3X8P` (Juan Diego Murillo Vargas)
* `BCQ-U5M2L` (Sofía Hernández Castro)
