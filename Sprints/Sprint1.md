<div style="min-height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; page-break-after: always;">

<p style="margin: 0 0 0.8rem; font-size: 1.3em;"><strong>UNIVERSIDAD TÉCNICA NACIONAL</strong></p>
<p style="margin: 0 0 1.8rem; font-size: 1.3em;"><strong>SEDE SAN CARLOS</strong></p>

<img src="../Images/LogoU.png" alt="LogoU" width="170" />

<p style="margin: 1rem 0; font-size: 1.8em;"><strong>Proyecto de investigación</strong></p>

<p style="margin: 0.25rem 0; font-size: 1.05em;"><strong>Curso:</strong></p>
<p style="margin: 0.2rem 0;">Administración de Proyectos Informáticos</p>
<p style="margin: 0.1rem 0;">III-26, SC-03</p>

<p style="margin-top: 1.2rem; margin-bottom: 0.2rem; font-size: 1.05em;"><strong>Profesor:</strong></p>
<p style="margin: 0.2rem 0;">Rudy Barboza Rodríguez</p>

<p style="margin-top: 1.2rem; margin-bottom: 0.2rem; font-size: 1.05em;"><strong>Estudiantes:</strong></p>
<p style="margin: 0.2rem 0;">Karol Miranda Mora</p>
<p style="margin: 0.2rem 0;">Katherine Solis Ramírez</p>

<p style="margin-top: 1.2rem; margin-bottom: 0.2rem; font-size: 1.05em;"><strong>Fecha:</strong></p>
<p style="margin: 0.2rem 0;">29/09/26</p>

</div>

<h1 style="margin-top: 0;">Ciclo de vida del proyecto y primer sprint</h1>

**Enfoque:** mixto (predictivo/adaptativo)

En este caso, es mejor combinar ambos enfoques. El alcance general contará con cinco módulos y la construcción será por sprints semanales. De esta forma, podemos ir ajustando los cambios que van surgiendo. La meta de este primer sprint consiste en definir los ambientes de desarrollo de los miembros del equipo, la estructura de la base de datos y el frontend a utilizar.

## Problema

La Biblioteca Pública de Ciudad Quesada anota a mano en libros de papel los préstamos, el uso de computadoras y el ingreso de usuarios. Eso hace que la información esté dispersa, haya errores al copiar datos y no se puedan sacar informes para justificar el presupuesto y el horario.

## Backlog inicial (historias de usuario)

1. **Registro de usuarios**

   Como administrador, quiero registrar y editar la información de los usuarios y generar un código único, para poder identificarlos dentro del sistema.

2. **Control de acceso**

   Como usuario, quiero ingresar mi código al llegar a la biblioteca, para registrar mi entrada y llevar un control de los visitantes.

3. **Préstamos de libros**

   Como administrador, quiero registrar los préstamos de libros, para poder llevar un control de los préstamos realizados.

4. **Préstamos de cubículos**

   Como administrador, quiero manejar los préstamos de cubículos, para poder tener un control de los ocupados y disponibles.

5. **Dashboard**

   Como administrador, quiero consultar la información de los préstamos, accesos y uso de cubículos, para tener un mejor control de la biblioteca y generar reportes.

## Fases a seguir (Mapa de vida)

| N° Fase | Fase | Qué se realizará |
| :---: | :--- | :--- |
| 1 | Inicio | Se identifica el problema, los interesados (bibliotecario, personal de apoyo, usuarios, administración municipal, soporte técnico) y se define el objetivo del sistema. |
| 2 | Planificación | Se arma el Product Backlog con los cinco módulos, se priorizan y se define la duración de los Sprints. |
| 3 | Ejecución | Se construye el sistema Sprint por Sprint, empezando por el registro de usuarios. |
| 4 | Monitoreo y control | Se revisa el Sprint Backlog durante el Sprint y se hace Sprint Review con el equipo para validar cada avance. |
| 5 | Cierre | Se despliega el sistema. |

---

# Documento de Definition of Done (DoD)

## 1. Propósito
Establecer un estándar de calidad compartido y riguroso para el equipo de desarrollo (Karol Miranda Mora y Katherine Solis Ramírez) y el Product Owner (Prof. Rudy Barboza Rodríguez). En el sistema de la Biblioteca Pública de Ciudad Quesada, una historia de usuario o incremento de software solo se considerará **"Terminado" (Done)** cuando:
1. Satisface la totalidad de sus criterios de aceptación funcionales (hace exactamente lo que se solicitó).
2. Cumple de manera integral con los criterios de calidad, pruebas, integración y documentación estipulados en esta DoD (está bien construido y probado).

Si un ítem no cumple ambos aspectos, no podrá presentarse en la *Sprint Review* ni considerarse parte del incremento entregable, y retornará automáticamente al *Product Backlog*.

---

## 2. Criterios de calidad (Lista verificable)
Para dar por terminado cualquier ítem, se debe verificar el cumplimiento de los siguientes criterios:

1. **Revisión de código por pares (Code Review):** Todo código desarrollado por una integrante debe ser revisado y aprobado por la otra integrante mediante un *Pull Request* antes de ser fusionado.
2. **Validación y consistencia de datos:** Los formularios implementan validaciones obligatorias tanto en cliente como en servidor (cédula válida, formato de correo electrónico, unicidad y campos no nulos).
3. **Persistencia e integridad referencial:** Los datos se guardan correctamente en la base de datos relacional, sin errores de concurrencia, pérdida de información ni llaves foráneas huérfanas.
4. **Diseño responsivo y adaptabilidad:** Las interfaces son accesibles, limpias y funcionales tanto en computadoras de escritorio (resolución estándar de biblioteca) como en dispositivos móviles (celulares y tabletas).
5. **Cero defectos bloqueantes en consola:** La aplicación compila limpiamente y no arroja advertencias críticas, excepciones no capturadas ni errores 500 en el servidor.
6. **No regresión:** Las nuevas funciones no alteran ni degradan el comportamiento de los componentes previamente desarrollados.
7. **Validación con el Product Owner:** Se valida y demuestra el cumplimiento de los criterios de aceptación directamente con el Product Owner.

---

## 3. Pruebas exigidas
* **Pruebas Unitarias:**
  * Validación de formatos (formato de cédula, estructura del correo electrónico, longitud de campos).
  * Algoritmo de generación automática del código alfanumérico único para usuarios.
* **Pruebas de Integración:**
  * Comunicación completa entre Frontend, Backend y Base de Datos (operaciones de inserción, edición y consulta de usuarios).
  * Integración con el servicio de despacho de correos electrónicos para el envío del código.
  * Verificación del módulo de acceso validando códigos contra la base de datos y registrando el sello de tiempo (*timestamp*).
* **Pruebas Manuales y Exploratorias:**
  * Recorrido de extremo a extremo (*End-to-End*): Registro $\rightarrow$ envío de correo $\rightarrow$ marcación de entrada con fecha y hora.
  * Pruebas de casos límite: Códigos no registrados, intentos de duplicación de cédula o accesos con datos vacíos.

---

## 4. Integración y despliegue
* **Control de versiones y ramas:** Cada funcionalidad se trabaja en una rama de características (`feature/`) derivada de `develop` o `main`. Se integra a la rama principal mediante *Pull Request* revisado.
* **Ambiente de pruebas:** Ninguna historia se da por concluida ni se expone en la *Sprint Review* si no ha sido desplegada y probada exitosamente en el ambiente de pruebas (*staging* / local compartido).

---

## 5. Documentación mínima requerida
* **Especificación técnica:** Esquema actualizado de la base de datos (tablas `Usuarios` y `Accesos`) y comentarios en métodos clave.
* **Guía rápida de pruebas:** Casos de prueba descritos brevemente con pasos para reproducir y resultados esperados.
* **Historial de cambios:** Registro formal en la tabla de control de versiones del Expediente del Proyecto.

---

## 6. Acuerdo del equipo y del Product Owner + Versión
* **Equipo de Desarrollo:** Aceptado por Karol Miranda Mora y Katherine Solis Ramírez.
* **Product Owner:** Aceptado por el Prof. Rudy Barboza Rodríguez.
* **Versión:** 1.0 · **Fecha de aprobación:** 14/10/2026

---

# Sprint Backlog 1

## 1. Sprint Goal

Construir y desplegar el núcleo de registro de usuarios y el control de acceso inicial mediante código único generado y notificado por correo, permitiendo identificar a los visitantes y registrar su ingreso a la Biblioteca Pública de Ciudad Quesada.

---

## 2. Ítems seleccionados del Product Backlog

1. **HU-01: Registro de usuarios con generación automática de código único.**
   * *Descripción:* Como administrador, quiero registrar usuarios con sus datos (nombre completo, número, correo, cédula, edad, dirección y tipo de usuario) y generarles un código único de forma automática, para individualizarlos en el sistema.
2. **HU-02: Edición de la información de usuarios.**
   * *Descripción:* Como administrador, quiero editar los datos de los usuarios registrados, para mantener la base de datos depurada y actualizada.
3. **HU-03: Notificación del código de usuario por correo electrónico.**
   * *Descripción:* Como usuario registrado, quiero recibir por correo mi código único asignado, para utilizarlo como identificación y check-in al visitar la biblioteca.
4. **HU-04: Control de acceso mediante código de usuario (Check-in).**
   * *Descripción:* Como usuario/administrador, quiero ingresar el código único al llegar a la biblioteca, para registrar el ingreso y guardar la fecha y hora exacta de la visita.

* **Fuera del Sprint 1 (planificados para siguientes sprints):**
  * Módulo de catálogo, préstamo de libros y lista de espera de 24 horas.
  * Módulo de préstamo de cubículos informáticos y control de tiempo por turno.
  * Módulo de dashboard gerencial y reportes para auditoría (semanal, quincenal, mensual).

---

## 3. Tareas por ítem, con responsable

### Tareas Habilitadoras / Preparación Técnica
* **TEC-01:** Crear y configurar el repositorio Git, estructura de ramas y políticas de PR. *(Karol Miranda y Katherine Solis)*
* **TEC-02:** Configurar el ambiente de desarrollo, dependencias y ambiente de pruebas local. *(Karol Miranda y Katherine Solis)*
* **TEC-03:** Diseñar el modelo relacional de la base de datos (tablas `Usuario`, `Acceso`, `TipoUsuario`). *(Katherine Solis)*
* **TEC-04:** Configurar el diseño visual base del sistema y componentes reutilizables. *(Karol Miranda)*

### HU-01: Registro de usuarios y generación automática de código
* **T-01.1:** Maquetar la interfaz del formulario de registro de usuarios con campos obligatorios. *(Karol Miranda)*
* **T-01.2:** Implementar validaciones de datos (cédula costarricense, formato de correo, edad, campos requeridos). *(Katherine Solis)*
* **T-01.3:** Programar el algoritmo de generación automática del código alfanumérico único. *(Katherine Solis)*
* **T-01.4:** Programar la inserción en base de datos y escribir pruebas unitarias de validación y unicidad. *(Katherine Solis)*

### HU-02: Edición de usuarios
* **T-02.1:** Diseñar la vista de listado/búsqueda de usuarios con modal o pantalla de edición. *(Karol Miranda)*
* **T-02.2:** Implementar el servicio/endpoint de actualización de datos de usuarios en la base de datos. *(Katherine Solis)*
* **T-02.3:** Probar que las actualizaciones no alteren el código único ni generen inconsistencias. *(Karol Miranda)*

### HU-03: Notificación del código por correo
* **T-03.1:** Configurar las credenciales y el servicio de envío de correos salientes (SMTP/servicio transaccional). *(Katherine Solis)*
* **T-03.2:** Diseñar la plantilla de correo de bienvenida de la Biblioteca con el código de usuario destacado. *(Karol Miranda)*
* **T-03.3:** Conectar el evento de guardado exitoso de registro con el despacho del correo. *(Katherine Solis)*
* **T-03.4:** Realizar pruebas de entrega en cuentas de correo reales comprobando recepción y formato. *(Karol Miranda)*

### HU-04: Control de acceso con código y hora de ingreso
* **T-04.1:** Crear la pantalla de check-in con campo enfocado para digitar el código de usuario. *(Karol Miranda)*
* **T-04.2:** Programar la verificación del código, búsqueda del usuario y registro de la hora y fecha exacta de acceso. *(Katherine Solis)*
* **T-04.3:** Mostrar mensaje de confirmación en pantalla con el nombre y tipo de usuario tras el check-in. *(Karol Miranda)*
* **T-04.4:** Elaborar pruebas manuales y de integración para códigos válidos, inválidos y casos sin conexión. *(Karol Miranda y Katherine Solis)*

---

## 4. Cómo se verificará que cada ítem cumple la DoD
Antes de marcar un ítem como completado y moverlo a la columna **Done**, el equipo aplicará la siguiente lista de verificación:
* [ ] **Revisión cruzada:** El código fue sometido a *Pull Request* y revisado por la compañera de equipo.
* [ ] **Pruebas superadas:** Las pruebas unitarias y de integración pasan satisfactoriamente sin advertencias.
* [ ] **Persistencia verificada:** Los registros se comprueban directamente en la base de datos asegurando la integridad de la información.
* [ ] **Ambiente de pruebas:** La funcionalidad se probó en el entorno de pruebas tanto en navegador de computadora como en vista móvil.
* [ ] **Aprobación de criterios:** Se contrastó el funcionamiento contra los criterios de aceptación y se cuenta con el visto bueno del Product Owner.

Si algún ítem falla en al menos un punto, permanece en estado **Doing** / **Testing** hasta ser corregido.

---

## 5. Tablero de seguimiento (Workflow y Daily Scrum)

Se utilizará un tablero ágil estructurado en 3 estados principales:

* **To Do (Pendiente):** Tareas priorizadas para el Sprint que aún no han iniciado.
* **Doing (En Proceso):** Tareas en desarrollo activo (máximo dos tareas simultáneas por integrante para evitar dispersión).
* **Done (Terminado):** Tareas completadas que superaron el 100% de la Definition of Done.

### Mecanismo de seguimiento diario (Daily Scrum):
Para darle seguimiento continuo al Sprint, el equipo sostendrá una reunión diaria corta (10 a 15 minutos) respondiendo tres preguntas clave:
1. ¿Qué actividades completé desde la última sesión?
2. ¿Qué actividades abordaré el día de hoy?
3. ¿Identifiqué algún impedimento técnico o de requerimientos que afecte el avance?

---

## 6. Fechas de inicio y cierre del Sprint
* **Duración:** 2 semanas.
* **Fecha de Inicio:** 14 de octubre de 2026.
* **Fecha de Cierre (Sprint Review y Retrospectiva):** 28 de octubre de 2026.

---

## Historial de cambios del expediente

| Versión | Fecha | Descripción del cambio | Autoras |
| :---: | :---: | :--- | :--- |
| **1.0** | 14/10/2026 | Se formaliza el Documento de Definition of Done (DoD) y el Sprint Backlog 1 con asignación detallada de tareas para el registro de usuarios y control de acceso. | Karol Miranda Mora<br>Katherine Solis Ramírez |

