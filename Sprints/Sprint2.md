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
<p style="margin: 0.2rem 0;">15/11/26</p>

</div>

<h1 style="margin-top: 0;">Ciclo de vida del proyecto y segundo sprint</h1>

**Enfoque:** mixto (predictivo/adaptativo)

Habiendo concluido de forma exitosa el primer sprint (despliegue del núcleo de usuarios, código único de 4 dígitos, notificación por correo y control de accesos), el segundo sprint se enfoca en el corazón operativo de la Biblioteca Pública de Ciudad Quesada: la gestión integral de préstamos bibliográficos físicos y la administración de los cubículos informáticos con control de turnos.

La construcción se realiza en paralelo mediante dos incrementos coordinados: el **Incremento 2.1 (Préstamo de Libros y Lista de Espera)** desarrollado por Katherine Solis y el **Incremento 2.2 (Préstamo de Cubículos y Control de Turnos)** desarrollado por Karol Miranda.

## Problema

Actualmente, el control de préstamos de libros se lleva en cuadernos físicos, provocando pérdida de ejemplares, retrasos no cuantificados en las devoluciones y reclamos de usuarios cuando los libros de alta demanda se agotan sin un mecanismo equitativo y transparente de asignación. De igual forma, el uso de los cubículos y computadoras carece de un registro de ocupación en tiempo real y no existe control del tiempo asignado por turno, generando acaparamientos y falta de trazabilidad en los servicios de cómputo brindados a la comunidad.

## Backlog inicial (historias de usuario)

1. **Registro de usuarios**
   Como administrador, quiero registrar y editar la información de los usuarios y generar un código único, para poder identificarlos dentro del sistema. *(Completado en Sprint 1)*

2. **Control de acceso**
   Como usuario, quiero ingresar mi código al llegar a la biblioteca, para registrar mi entrada y llevar un control de los visitantes. *(Completado en Sprint 1)*

3. **Préstamos de libros**
   Como administrador, quiero registrar los préstamos y devoluciones de libros, manejar el catálogo de títulos y controlar la lista de espera de 24 horas, para llevar un control estricto de las existencias. *(Alcance Sprint 2)*

4. **Préstamos de cubículos**
   Como administrador, quiero manejar los préstamos de cubículos y computadoras con control de tiempo por turno, para garantizar un uso ordenado y equitativo de los equipos. *(Alcance Sprint 2)*

5. **Dashboard y reportes**
   Como administrador, quiero consultar la información consolidada de préstamos, accesos y uso de cubículos para auditorías semanales, quincenales y mensuales. *(Planificado para Sprint 3)*

## Fases a seguir (Mapa de vida)

| N° Fase | Fase | Qué se realizará |
| :---: | :--- | :--- |
| 1 | Inicio | Se identificó la problemática, los interesados (bibliotecario, usuarios, municipalidad) y el objetivo general del software. *(Finalizado)* |
| 2 | Planificación | Se estructuró el Product Backlog con 5 módulos (63 puntos totales) divididos en Sprints semanales. *(Finalizado)* |
| 3 | Ejecución S1 | Se implementó el núcleo de registro, edición de usuarios, notificación vía correo y check-in (19 puntos). *(Finalizado)* |
| **4** | **Ejecución S2** | **Construcción y despliegue del catálogo de libros, préstamos, devoluciones, lista de espera con expiración de 24h, y préstamo de cubículos con turnos (28 puntos).** |
| 5 | Monitoreo S2 | Revisión diaria de avance (Daily Scrum), verificación del burndown e integración continua por PRs. |
| 6 | Cierre S2 | Demostración formal con el Product Owner (Sprint Review 2) y retrospectiva del equipo. |
| 7 | Sprint 3 y Cierre | Construcción del Dashboard general, reportes periódicos y despliegue en ambiente final. |

---

# Documento de Definition of Done (DoD)

## 1. Propósito
Establecer el estándar de calidad compartido y obligatorio entre el equipo de desarrollo (Karol Miranda Mora y Katherine Solis Ramírez) y el Product Owner (Prof. Rudy Barboza Rodríguez). En este segundo sprint, ninguna historia de usuario de libros o cubículos se considerará **"Terminada" (Done)** a menos que:
1. Satisfaga la totalidad de sus criterios funcionales de aceptación (reglas de préstamo, descuento y restitución de ejemplares, plazos de 24h y tiempos por turno).
2. Cumpla íntegramente con los requisitos técnicos, de no regresión, pruebas y documentación formal estipulados en esta DoD 2.0.

Cualquier historia que incumpla alguno de estos puntos regresará de inmediato al *Sprint Backlog* para su corrección.

---

## 2. Criterios de calidad (Lista verificable)
Para dar por terminado cualquier ítem del Sprint 2, se debe verificar el cumplimiento estricto de los siguientes criterios:

1. **Revisión cruzada por pares (Code Review):** El código desarrollado por Katherine (módulo de libros) debe ser revisado y aprobado formalmente por Karol vía Pull Request en GitHub, y viceversa para el módulo de cubículos.
2. **Consistencia de inventario y concurrencia:** El préstamo de un libro debe decrementar atómicamente el campo `availableCopies` sin permitir que baje de cero (`availableCopies >= 0`). La devolución debe incrementar el ejemplar sin superar el `totalCopies`.
3. **Persistencia e integridad referencial:** Las relaciones entre usuarios, libros, préstamos (`Loan`), lista de espera (`Waitlist`) y sesiones de cubículos (`ComputerSession`) se conservan sin registros huérfanos ni inconsistencias relacionales.
4. **Diseño responsivo y adaptabilidad:** Las vistas del catálogo, formularios de préstamo y monitores de cubículos se adaptan fluidamente a pantallas de escritorio de la biblioteca y a dispositivos móviles/tabletas.
5. **Cero defectos bloqueantes en consola:** La aplicación (Frontend Vite + React y Backend Express) compila limpiamente sin excepciones no controladas ni errores 500 en el servidor.
6. **No regresión:** Las nuevas funciones de libros y cubículos no degradan ni alteran el correcto funcionamiento de los módulos de usuarios y control de acceso implementados en el Sprint 1.
7. **Alertas descartables:** Todas las notificaciones y mensajes de error o validación cuentan con botón de cierre («×») interactivo.
8. **Validación con el Product Owner:** Demostración y aprobación funcional por parte del Prof. Rudy Barboza Rodríguez en la Sprint Review.

---

## 3. Pruebas exigidas
* **Pruebas Unitarias:**
  * Lógica de validación de existencias: restricción de préstamo si `availableCopies === 0`.
  * Cálculo exacto de fechas de vencimiento de préstamo (plazo base de 7 días naturales o fecha personalizada).
  * Algoritmo de caducidad de la lista de espera: cálculo de ventana de 24 horas (`expiresAt = notifiedAt + 24h`) y traspaso de prioridad al siguiente en la fila.
  * Validación de duración de turnos de cubículos.
* **Pruebas de Integración:**
  * Flujo completo: Registro de usuario $\rightarrow$ Préstamo de libro $\rightarrow$ Descuento de stock en catálogo $\rightarrow$ Devolución $\rightarrow$ Reposición de stock $\rightarrow$ Notificación automática al primer usuario en lista de espera.
  * Asignación de cubículo a usuario activo mediante código de 4 dígitos $\rightarrow$ inicio de sesión con marca de tiempo $\rightarrow$ finalización de turno y liberación del cubículo.
* **Pruebas Manuales y de Casos Límite:**
  * Intentos de préstamo con código de usuario inactivo o inexistente.
  * Intentos de prestar dos veces el mismo ejemplar al mismo usuario de forma simultánea.
  * Inserción en lista de espera cuando no hay ejemplares y verificación de orden de llegada (FIFO).
  * Ocupación simultánea de computadoras en la sala de cómputo.

---

## 4. Integración y despliegue
* **Control de versiones:** Trabajo segregado en ramas de características (`feature/catalogo-libros`, `feature/prestamo-devolucion`, `feature/lista-espera`, `feature/cubiculos-turnos`) derivadas de `branchK` / `develop`.
* **Integración a main:** Fusión mediante Pull Request revisado por pares, manteniendo el historial limpio y sincronizado.
* **Ambiente de pruebas:** Despliegue y verificación en el ambiente local compartido con base de datos en la nube (MongoDB Atlas).

---

## 5. Documentación mínima requerida
* **Especificación técnica:** Esquemas actualizados de base de datos (`Book`, `Loan`, `Waitlist`, `Cubicle`, `ComputerSession`) y documentación de los endpoints REST en el expediente del proyecto.
* **Guía rápida de pruebas:** Casos de prueba documentados con pasos paso a paso, entradas y resultados esperados para la entrega.
* **Control de versiones del documento:** Registro de aprobaciones y firmas en el expediente formal.

---

## 6. Acuerdo del equipo y del Product Owner + Versión
* **Equipo de Desarrollo:** Aceptado por Karol Miranda Mora y Katherine Solis Ramírez.
* **Product Owner:** Aceptado por el Prof. Rudy Barboza Rodríguez.
* **Versión:** 2.0 · **Fecha de aprobación:** 15/11/2026

---

# Sprint Backlog 2

## 1. Sprint Goal

Construir y desplegar los módulos de catálogo y préstamo de libros con lista de espera de 24 horas, y el módulo de préstamo y control de turnos de cubículos informáticos, garantizando la trazabilidad del inventario y la equidad en el acceso a los recursos de la Biblioteca Pública de Ciudad Quesada.

---

## 2. Ítems seleccionados del Product Backlog

1. **HU-05: Catálogo de libros (5 puntos)**
   * *Descripción:* Como administrador, quiero registrar, editar, consultar y buscar libros con sus datos (título, autor, categoría, ISBN, editorial, año, ubicación y cantidad de ejemplares), para mantener el acervo bibliográfico actualizado.
2. **HU-06: Préstamo y devolución de libros (5 puntos)**
   * *Descripción:* Como administrador, quiero registrar préstamos y devoluciones asociando al visitante mediante su código único de 4 dígitos, para controlar las fechas de entrega, los préstamos vencidos y actualizar automáticamente los ejemplares en estantería.
3. **HU-07: Lista de espera de 24 horas para libros agotados (8 puntos)**
   * *Descripción:* Como usuario/administrador, quiero registrarme en una lista de espera cuando un libro esté agotado; al registrarse una devolución, el sistema debe asignar una reserva exclusiva por 24 horas antes de liberar el turno al siguiente en la fila.
4. **HU-08: Préstamo de cubículos informáticos (5 puntos)**
   * *Descripción:* Como administrador, quiero asignar los cubículos y puestos de cómputo disponibles a los visitantes mediante su código único, para llevar el control de los puestos ocupados y libres.
5. **HU-09: Control de tiempo por turno de cubículos (5 puntos)**
   * *Descripción:* Como administrador, quiero registrar la hora de inicio y fin del uso de cada computadora/cubículo, para controlar los turnos máximos y generar un uso ordenado del recurso.

* **Total de puntos del Sprint 2:** **28 puntos** (Velocidad máxima planificada del equipo).
* **Fuera del Sprint 2 (planificados para Sprint 3 y Cierre):**
  * HU-10: Dashboard gerencial de consulta (8 puntos).
  * HU-11: Reportes semanal, quincenal y mensual para auditoría (5 puntos).
  * TEC-05: Despliegue final y entrega (3 puntos).

---