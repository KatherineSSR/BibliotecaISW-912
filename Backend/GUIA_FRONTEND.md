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
      "userCode": "0001"
    }
  }
  ```
* **Respuestas de Error:**
  * `400`: Falta correo o contraseña.
  * `401`: Correo o contraseña incorrectos.
  * `403`: Usuario no es administrador o cuenta inactiva.

---

## 👤 2. Módulo de Registro y Edición de Usuarios (HU-01, HU-02)

### `POST /api/users` (HU-01: Registrar Usuario)
Registra un nuevo visitante en el sistema y genera automáticamente un código único de cuatro dígitos numéricos (incluidos posibles ceros a la izquierda, por ejemplo `0042`).

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
      "userCode": "4821",
      "isActive": true,
      "createdAt": "2026-10-18T23:10:00.000Z"
    }
  }
  ```
* **Tip para el Frontend:** Muestra una alerta o modal de confirmación con el código único asignado.

---

### `GET /api/users` (Listado y Búsqueda de Usuarios)
Obtiene todos los usuarios registrados.

* **Parámetros opcionales (Query Params):**
  * `?search=texto`: Filtra en tiempo real por nombre, apellidos, cédula, correo o código único.
  * *Ejemplo:* `GET /api/users?search=carlos` o `GET /api/users?search=4821`
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
        "userCode": "4821",
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

## 3. Módulo de Cubículos

El sistema registra seis cubículos. Al consultar el módulo por primera vez, los crea como libres sin borrar ni modificar los demás datos de la base. Solo una sesión autenticada de administrador puede consultar o cambiar sus estados.

### `GET /api/cubicles`
Devuelve el estado individual y los conteos de cubículos ocupados y libres.

* **Headers:** `Authorization: Bearer <token>`
* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "success": true,
    "total": 6,
    "occupied": 2,
    "free": 4,
    "data": [
      { "number": 1, "status": "occupied" },
      { "number": 2, "status": "free" }
    ]
  }
  ```
  *La respuesta incluye los seis cubículos; se abrevia aquí por claridad.*

### `PATCH /api/cubicles/:number`
Marca un cubículo como ocupado (`occupied`) o libre (`free`).

* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  { "status": "occupied" }
  ```
* **Respuestas de Error:** `400` número o estado inválido; `401` sesión ausente o expirada; `403` sesión sin rol de administrador.

---

## 4. Sala Informática

Las rutas requieren un token de administrador. La sala cuenta con 14 computadoras; una persona y una computadora no pueden tener más de una sesión activa simultáneamente.

### `GET /api/computer-lab`
Devuelve estado de los puestos y las sesiones recientes.

### `POST /api/computer-lab/sessions`
Inicia el uso de un puesto libre para un visitante activo.

```json
{
  "workstationNumber": 1,
  "userCode": "1001"
}
```

### `PATCH /api/computer-lab/sessions/:id/finish`
Finaliza la sesión y deja libre la computadora.

---

## 5. Cuentas de Prueba Pre-cargadas (Seed)

Para probar inmediatamente sin tener que inventar datos:

### Administradores (Contraseña para todos: `Admin123!`): npm run seed

* `admin.katherine@bibliotecacq.cr`
* `admin.karol@bibliotecacq.cr`
* `admin.rudy@bibliotecacq.cr`

Los códigos de los usuarios ya registrados se pueden actualizar ejecutando `npm run migrate:user-codes` desde `Backend`. La migración asigna códigos únicos de cuatro dígitos y actualiza los códigos guardados en el historial de Sala Informática. No ejecutes el seed para aplicar este cambio, porque el seed reinicia los usuarios.

### Códigos de Visitantes listos para probar Sala Informática:
* `1001` (María Elena Quesada Soto)
* `1002` (Juan Diego Murillo Vargas)
* `1003` (Sofía Hernández Castro)
