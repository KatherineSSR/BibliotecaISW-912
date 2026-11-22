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
## 3. Tareas por ítem, con responsable

### Tareas Habilitadoras / Preparación Técnica
* **TEC-2.1:** Diseñar el modelo de datos y las relaciones de `Book`, `Loan`, `Waitlist`, `Cubicle` y `ComputerSession`. *(Katherine Solis)*
* **TEC-2.3:** Crear los componentes reutilizables de tablas, formularios y alertas. *(Karol Miranda)*

### HU-05: Catálogo de libros · cierre 11/11
* **T-05.1:** Diseñar la interfaz de listado, búsqueda y registro de libros. *(Katherine Solis)*
* **T-05.2:** Programar el modelo `Book` y los endpoints CRUD y de búsqueda. *(Katherine Solis)*
* **T-05.3:** Validar ISBN, año, ubicación y existencias. *(Katherine Solis)*

### HU-06: Préstamo y devolución de libros cierre 13/11
* **T-06.1:** Crear la pantalla para prestar y devolver, con búsqueda por código de usuario. *(Katherine Solis)*
* **T-06.2:** Programar el modelo `Loan` y las reglas de vencimiento y devolución. *(Katherine Solis)*
* **T-06.3:** Actualizar el inventario de forma atómica en cada préstamo y devolución. *(Katherine Solis)*
* **T-06.4:** Probar préstamos activos, vencidos, duplicados y devoluciones. *(Katherine Solis)*

### HU-07: Lista de espera de 24 horas cierre 15/11
* **T-07.1:** Diseñar la interfaz de la lista de espera. *(Katherine Solis)*
* **T-07.2:** Programar el modelo `Waitlist` y el orden FIFO. *(Katherine Solis)*
* **T-07.3:** Programar la reserva de 24 horas y su expiración. *(Katherine Solis)*
* **T-07.4:** Probar el traspaso de turno al siguiente usuario de la fila. *(Katherine Solis)*

### HU-08: Préstamo de cubículos cierre 12/11
* **T-08.1:** Mostrar la disponibilidad de cubículos y computadoras. *(Karol Miranda)*
* **T-08.2:** Asignar cubículo o computadora mediante el código de usuario. *(Karol Miranda)*
* **T-08.3:** Verificar la ocupación y la liberación del puesto. *(Karol Miranda)*

### HU-09: Control de tiempo por turno · cierre 15/11
* **T-09.1:** Programar la duración configurable del turno y la hora de vencimiento. *(Karol Miranda)*
* **T-09.2:** Programar el inicio, la finalización y la expiración de las sesiones. *(Karol Miranda)*
* **T-09.3:** Guardar el historial y los estados activo y finalizado. *(Karol Miranda)*

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

## 5. Acciones de mejora de la Retrospective del Sprint 1

Estas tres acciones entran al Sprint Backlog 2 como tareas.

| ID | Acción | Dueño | Fecha | Cómo se verifica |
| :-- | :-- | :-- | :-: | :-- |
| A-01 | Recalcular la velocidad con los 19 puntos reales del Sprint 1 y revisar que el alcance del Sprint 2 quepa | Karol | 13/11 | El Cronograma muestra la velocidad real y el burndown del Sprint 1 completo |
| A-02 | Entregar historias completas (backend, pantalla y pruebas), no por capas | Katherine y Karol | 15/11 | Cada historia mostrada dice "cumple / no cumple la DoD" |
| A-03 | Confirmar con el Product Owner la versión de la DoD y los criterios antes de iniciar el Sprint | Karol | Planning del Sprint 2 | El Sprint Backlog indica la versión de la DoD y la fecha de confirmación |

---

# Matriz de Estimación

* **Escala:** Fibonacci (1, 2, 3, 5, 8, 13). Los puntos miden tamaño relativo, no horas.
* **Historia de referencia (3 puntos):** HU-02 Edición de usuarios.
* **Velocidad real del Sprint 1:** 19 puntos. La velocidad supuesta era de 22 (rango: mínima 18, máxima 28).
* **Sprint 2:** se planifican 28 puntos, el máximo del rango. [completar: por qué el equipo puede con 28 puntos]

| ID | Historia | Épica | Puntos | Prioridad | Dependencias | Sprint |
| :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| TEC-00 | Preparación técnica | Técnica | 3 | Alta | - | 1 (terminado) |
| HU-01 | Registro de usuarios con código único | Registro | 5 | Alta | TEC-00 | 1 (terminado) |
| HU-02 | Edición de usuarios (**referencia**) | Registro | 3 | Alta | HU-01 | 1 (terminado) |
| HU-03 | Código de usuario por correo | Registro | 5 | Alta | HU-01 | 1 (terminado) |
| HU-04 | Control de acceso mediante código (check-in) | Acceso | 3 | Alta | HU-01 | 1 (terminado) |
| HU-05 | Catálogo de libros | Libros | 5 | Media | TEC-00 | **2** |
| HU-06 | Préstamo y devolución de libros | Libros | 5 | Alta | HU-01, HU-05 | **2** |
| HU-07 | Lista de espera de 24 horas | Libros | 8 | Media | HU-06 | **2** |
| HU-08 | Préstamo de cubículos | Cubículos | 5 | Alta | HU-01 | **2** |
| HU-09 | Control de tiempo por turno | Cubículos | 5 | Media | HU-08 | **2** |
| HU-10 | Dashboard de consulta | Dashboard | 8 | Media | HU-04, HU-06, HU-08 | 3 |
| HU-11 | Reportes semanal, quincenal y mensual | Dashboard | 5 | Media | HU-10 | 3 |
| TEC-05 | Despliegue final | Técnica | 3 | Alta | Todas | 3 |
| | **Total** | | **63** | | | |

**Por épica:** Registro 13 · Acceso 3 · Libros 18 · Cubículos 10 · Dashboard 13 · Técnica 6.

**Supuestos y riesgos del Sprint 2:**
1. Ya hay un dato real de velocidad (19 puntos), pero viene de un solo sprint.
2. Somos dos personas y cada una trabaja un módulo distinto: una ausencia detiene todo un módulo.
3. Las reglas de las 24 horas y de los turnos se validan con el bibliotecario antes de programarlas.
4. HU-07 (8 puntos) es la historia más grande del sprint; si hay desacuerdo en el planning poker, se divide.

---

## Matriz de Riesgos (Registro de Riesgos)

Los riesgos son los mismos del Sprint 1. Se agrega cómo están al iniciar el Sprint 2.

| ID | Riesgo | Categoría | Tipo | P | I | Puntaje | Prioridad | Dueño | Estado al iniciar el Sprint 2 |
| :-- | :-- | :-- | :-- | :-: | :-: | :-: | :-- | :-- | :-- |
| R-01 | Si una integrante se ausenta o se satura, entonces la capacidad baja a la mitad y se detiene el módulo que solo ella conoce. | Equipo | Amenaza | 3 | 3 | 9 | **Alta prioridad** | Karol | Ahora cada una trabaja un módulo distinto, por eso se hacen los traspasos MIT-01 y MIT-02. |
| R-02 | Si el correo saliente no llega o cae en spam, entonces el usuario no recibe su código y no puede hacer el check-in. | Tercero | Amenaza | 3 | 2 | 6 | **Alta prioridad** | Katherine | En el Sprint 1 el correo llegó a una cuenta real. Se sigue vigilando. |
| R-03 | Si el bibliotecario no confirma las reglas de la lista de espera de 24 horas y los turnos, entonces HU-07 y HU-09 se rehacen. | Alcance | Amenaza | 3 | 2 | 6 | **Alta prioridad** | Karol | Aplica directo a este sprint: las reglas se confirman antes de programar HU-07 y HU-09. |
| R-04 | Si el Sprint 2 (28 puntos) no se completa, entonces el Dashboard se atrasa y se consume la reserva del Sprint 4. | Alcance | Amenaza | 3 | 2 | 6 | **Alta prioridad** | Katherine | El Sprint 1 cerró con 19 puntos y este sprint planea 28. Es el riesgo más importante del sprint. |
| R-05 | Si soporte técnico no tiene listo el ambiente, entonces el despliegue final se atrasa. | Tercero | Amenaza | 2 | 3 | 6 | **Alta prioridad** | Katherine | Se avisa a soporte técnico al iniciar el Sprint 2 (MIT-07). |
| R-06 | Si los datos personales se exponen o se guardan sin protección, entonces hay un problema legal y se pierde la confianza. | Negocio | Amenaza | 1 | 3 | 3 | Vigilar | Katherine | Sin cambios. |
| R-07 | Si el personal sigue usando el libro de papel o los usuarios olvidan su código, entonces los datos quedan incompletos. | Negocio | Amenaza | 2 | 2 | 4 | Vigilar | Karol | Sin cambios. |
| R-08 | Si la biblioteca tiene internet inestable, entonces el check-in y los préstamos fallan en el mostrador. | Técnico | Amenaza | 2 | 2 | 4 | Vigilar | Karol | Ahora también afecta los préstamos de libros y cubículos (MIT-10). |
| R-09 | Si los reportes se presentan a la administración municipal a tiempo, entonces puede apoyar el presupuesto y el horario. | Negocio | **Oportunidad** | 2 | 2 | 4 | Vigilar | Karol | Se envía el resumen de una página al cierre del Sprint 2 (MIT-11). |
| R-10 | Si un cambio en el modelo de datos rompe lo ya hecho en usuarios y acceso, entonces se pierde tiempo corrigiendo. | Técnico | Amenaza | 1 | 2 | 2 | Aceptar | Katherine | Pesa más: este sprint agrega cinco colecciones al modelo. La DoD exige no regresión. |

---

## Mapa de calor

| | Impacto bajo (1) | Impacto medio (2) | Impacto alto (3) |
| :-- | :--: | :--: | :--: |
| **Prob. alta (3)** | Vigilar<br>— | **Alta prioridad**<br>R-02 · R-03 · R-04 | **Alta prioridad**<br>R-01 |
| **Prob. media (2)** | Aceptar<br>— | Vigilar<br>R-07 · R-08 · R-09 (oportunidad) | **Alta prioridad**<br>R-05 |
| **Prob. baja (1)** | Aceptar<br>— | Aceptar<br>R-10 | Vigilar<br>R-06 |

# Plan de Mitigación

El plan completo de cada riesgo es el del Sprint 1. Para el Sprint 2 se incorporan al Sprint Backlog estas acciones:

| ID | Acción | Riesgo | Responsable | Cuándo |
| :-- | :-- | :-- | :-- | :-- |
| MIT-01 | Traspaso de 30 min del módulo de libros a la otra integrante | R-01 | Katherine | Durante el Sprint 2 |
| MIT-02 | Traspaso de 30 min del módulo de cubículos a la otra integrante | R-01 | Karol | Durante el Sprint 2 |
| MIT-05 | Confirmar por escrito con el bibliotecario las reglas de 24 horas y de turnos, y anotarlas en los criterios de HU-07 y HU-09 | R-03 | Karol | Antes de iniciar HU-07 y HU-09 |
| MIT-06 | Revisar el alcance del Sprint 2 con la velocidad real (se une a la acción A-01) | R-04 | Katherine | 13/11 |
| MIT-07 | Correo a soporte técnico con los requisitos de despliegue y fecha | R-05 | Katherine | Inicio del Sprint 2 |
| MIT-10 | Probar el check-in y los préstamos en la red real de la biblioteca | R-08 | Karol | Demo del Sprint 2 |
| MIT-11 | Resumen de una página para la administración municipal | R-09 | Karol | Cierre del Sprint 2 |

**Adquisiciones críticas:** sin cambios respecto al Sprint 1 (correo saliente, ambiente de despliegue, GitHub y Trello). MongoDB Atlas se usa en el plan gratuito, con salida de exportar la base de datos si cambia el plan.

---

# Cronograma de Entregas (Release Plan)

* **Duración del Sprint 2:** 1 semana, del 09/11/2026 al 15/11/2026. **Cierre del proyecto:** 24/11/2026
* **Sprints necesarios con la velocidad real:** quedan 44 puntos. 44 ÷ 19 = 2,3 → 3 Sprints más. Con el plan actual (28 + 16) alcanzan 2 Sprints, y el Sprint 4 queda como reserva.

| Sprint | Fechas | Incremento | Historias | Puntos |
| :---: | :--- | :--- | :--- | :---: |
| 1 | 12/10 – 08/11 | Módulo de usuarios: registro, edición, código por correo y control de acceso | TEC-00, HU-01 a HU-04 | 19 (terminado) |
| **2** | **09/11 – 15/11** | **Módulos completos de préstamo de libros y de cubículos** | **HU-05 a HU-09** | **28** |
| 3 | 16/11 – 22/11 | Dashboard, reportes y despliegue | HU-10, HU-11, TEC-05 | 16 |
| 4 (reserva) | 23/11 – 29/11 | Solo si el Sprint 2 no se completa o la velocidad es la mínima | Pendientes | - |

* **Orden de trabajo del Sprint 2** (en paralelo):
  1. **Incremento 2.1, préstamo de libros (Katherine):** HU-05 catálogo (hasta 11/11) → HU-06 préstamo y devolución (hasta 13/11) → HU-07 lista de espera de 24 horas (hasta 15/11).
  2. **Incremento 2.2, préstamo de cubículos (Karol):** HU-08 préstamo (hasta 12/11) → HU-09 control de tiempo por turno (hasta 15/11).
* **Hitos del Sprint 2:** 11/11 catálogo · 12/11 préstamo de cubículos · 13/11 préstamos y devoluciones · 15/11 lista de espera, control de turnos y demo con el Product Owner.
* **Margen:** el release esperado termina el 22/11 y el peor caso el 29/11, con la semana del 30/11 al 04/12 libre para la documentación final y la entrega.
* **Costo:** 30 horas-persona por Sprint.

* **Seguimiento (burndown del release):**

| Corte | Inicio | S1 | S2 | S3 |
| :--- | :---: | :---: | :---: | :---: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | 44 | | |

# Plan de Comunicaciones

| Interesado | Poder | Interés | Qué necesita | Frecuencia / evento | Canal | Responsable |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| Prof. Rudy Barboza (docente y Product Owner) | Alto | Alto | Avance, decisiones de alcance, impedimentos | Cada Sprint (Revisión) y en clase | Clase y correo institucional | Katherine |
| Bibliotecario/a (cliente del caso) | Alto | Alto | Demo de flujos y validación de reglas (24 horas y turnos) | Antes de HU-07 y HU-09, y al final de cada Sprint | Demo y correo | Karol |
| Administración municipal | Alto | Bajo | Resumen de una página del avance | Cierre de Sprint 2 y despliegue | Correo | Karol |
| Soporte técnico | Alto | Bajo | Requisitos de despliegue y correo saliente | Inicio del Sprint 2 y ante cambios | Correo | Katherine |
| Personal de apoyo | Bajo | Alto | Cómo usar check-in, préstamos y cubículos | Final de Sprints 2 y 3 | Presencial | Karol |
| Usuarios de la biblioteca | Bajo | Alto | Su código y cómo usarlo | Al registrarse y al activar el ingreso | Correo automático y aviso impreso | Katherine |

**Comunicación interna:** planificación al inicio del Sprint (30 min), reunión diaria de máximo 15 minutos por mensajería, Revisión con el Product Owner al final, Retrospectiva solo del equipo y Pull Requests en GitHub.

**Reglas del equipo:**
1. Respuesta en máximo 24 horas hábiles; si es urgente, se llama.
2. Las decisiones se anotan en el tablero o en el Expediente, no solo en el chat.
3. Los cambios de alcance se consultan primero con el Product Owner.
4. Los bloqueos se avisan el mismo día.

---

# Tablero de Trabajo

**Reparto del trabajo por módulo:**

| Módulo | Historias | Responsable |
| :--- | :--- | :--- |
| Usuarios y acceso (terminado en el Sprint 1) | HU-01 a HU-04 | Backend: Katherine · Frontend: Karol |
| Préstamo de libros | HU-05, HU-06, HU-07 | Katherine (HU-05 y HU-06) · Katherine y Karol (HU-07) |
| Préstamo de cubículos | HU-08, HU-09 | Karol (completo) |
| Dashboard y reportes | HU-10, HU-11 | Ambas, mitad y mitad |

Cada Pull Request lo revisa la otra integrante.

* **Herramienta:** Trello. **Enlace:** [Tablero de trabajo](https://trello.com/b/6aebddcac8243401d84573a9)

| Columna | Significado | WIP máx. |
| :--- | :--- | :---: |
| Por hacer | Historias del Sprint Backlog 2 en orden de prioridad | - |
| En progreso | Se está programando o diseñando | 2 |
| En revisión | Pull Request esperando a la compañera | 2 |
| En pruebas | Pruebas en el ambiente de pruebas (computadora y móvil) | 2 |
| Hecho | Cumple el DoD | - |

**Regla para pasar a "Hecho"** (DoD 2.0): Pull Request aprobado por la compañera, pruebas superadas, inventario y persistencia verificados, funciona en computadora y móvil, no hay regresión y hay visto bueno del Product Owner.

| ID | Tarjeta en el tablero | Puntos | Responsable | Columna |
| :--- | :--- | :---: | :--- | :--- |
| HU-05 | S2 - HU-05: Catálogo de libros | 5 | Katherine | En pruebas |
| HU-06 | S2 - HU-06: Préstamo y devolución de libros | 5 | Katherine | En pruebas |
| HU-07 | S2 - HU-07: Lista de espera de 24 horas para libros agotados | 8 | Katherine y Karol | En pruebas |
| HU-08 | S2 - HU-08: Préstamo de cubículos informáticos | 5 | Karol | En pruebas |
| HU-09 | S2 - HU-09: Control de tiempo por turno de cubículos | 5 | Karol | En pruebas |
| DOC-2 | S2 - Documentacion sprint 2 | - | Katherine y Karol | En progreso |

* **Hecho:** las 6 tarjetas del Sprint 1 (TEC-00, HU-01 a HU-04 y S1 - Documentación Sprint 1), todas de Katherine y Karol.
* **Sprint 3:** ya tiene sus tarjetas creadas (HU-10, HU-11, TEC-05, WA-01 y Documentación sprint 3).
* **Etiquetas:** cada tarjeta lleva la etiqueta de su sprint (Sprint 1, Sprint 2 o Sprint 3) y el prefijo S1, S2 o S3 en el título.

# Acta de Sprint Review y Cierre

## 1. Fecha, duración y asistentes

- **Fecha:** 15/11/2026
- **Duración:** 1 hora
- **Product Owner:** Prof. Rudy Barboza Rodríguez
- **Scrum Master:** Karol Miranda Mora
- **Developers:** Katherine Solis Ramírez (libros) y Karol Miranda Mora (cubículos y computadoras)

## 2. Sprint Goal y si se cumplió

- **Sprint Goal:** construir y desplegar el catálogo y el préstamo de libros con lista de espera de 24 horas, y el préstamo de cubículos informáticos con control de turnos, para tener el inventario controlado y un acceso justo a los recursos de la biblioteca.
- **Resultado:** **cumplido.** Las cinco historias del Sprint funcionan de principio a fin en el ambiente de pruebas.
- **Entregas del Sprint:**
  1. **Incremento 2.1 (Katherine):** catálogo de libros, préstamo y devolución, y lista de espera de 24 horas.
  2. **Incremento 2.2 (Karol):** préstamo de cubículos y control de tiempo por turno.

## 3. Historias mostradas y cuáles cumplen la DoD

Se mostró el producto funcionando en el ambiente de pruebas.

- **HU-05, Catálogo de libros (5 puntos):** se registró y se buscó un libro, y el sistema validó ISBN, año, ubicación y existencias. **Cumple la DoD.**
- **HU-06, Préstamo y devolución de libros (5 puntos):** se prestó un libro a un usuario con su código, bajó la cantidad de ejemplares disponibles y al devolverlo volvió a subir. Se probaron también los préstamos vencidos y los duplicados. **Cumple la DoD.**
- **HU-07, Lista de espera de 24 horas (8 puntos):** con un libro agotado, el usuario quedó en la lista. Al devolverse el libro, se le reservó por 24 horas y, al vencer la reserva, el turno pasó al siguiente de la fila. **Cumple la DoD.**
- **HU-08, Préstamo de cubículos informáticos (5 puntos):** se asignó un cubículo con el código del usuario. **Cumple la DoD.**
- **HU-09, Control de tiempo por turno (5 puntos):** se configuró la duración del turno, el sistema calculó la hora de vencimiento y mostró los estados activo y finalizado con su historial. **Cumple la DoD.**

Las tareas técnicas TEC-2.1, TEC-2.2 y TEC-2.3 (modelo de datos, ambiente y componentes) también quedaron terminadas.

**Puntos terminados:** 28 de 28 planificados.

## 4. Cambios al Product Backlog acordados

- **Sin cambios de alcance.** Las historias del Sprint 3 se mantienen: Dashboard gerencial (HU-10), Reportes en PDF (HU-11) y despliegue final (TEC-05).
- **Prioridades:** se mantienen. Sigue el Dashboard y después el despliegue.

## 5. Estado del release: avance frente al Cronograma de Entregas

- **Avance:** 47 de 63 puntos terminados. Quedan 16 puntos, igual a lo previsto en el seguimiento ideal del Sprint 2.
- **Velocidad:** el Sprint 1 cerró con 19 puntos y el Sprint 2 con 28.
- **Seguimiento (burndown del release):**

| Corte | Inicio | S1 | S2 | S3 |
| :--- | :---: | :---: | :---: | :---: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | 44 | 16 | |

- **Próximo Sprint (Sprint 3):** Dashboard, reportes y despliegue (HU-10, HU-11 y TEC-05, 16 puntos), del 16/11 al 22/11.
- **Cierre del proyecto:** sin cambios en la fecha (24/11/2026).
---

## Parte 2. Acta de Sprint Retrospective

### 1. Formato usado

**Start / Stop / Continue** (qué empezar, qué dejar y qué seguir haciendo). Participó el equipo Scrum: Product Owner, Scrum Master y Developers. Duración: 45 minutos. Regla de la sesión: se habla del proceso, no de personas.

### 2. Qué funcionó bien y qué no, con evidencia

**Continue (seguir haciendo):**

- **Trabajar los dos módulos en paralelo, uno por integrante.** Evidencia: los dos incrementos (2.1 y 2.2) se terminaron dentro del Sprint, con las cinco historias y los 28 puntos.
- **Poner una fecha de cierre a cada historia, en orden de dependencia.** Evidencia: el Sprint Backlog fijó el 11/11 para el catálogo, el 12/11 para los cubículos, el 13/11 para préstamos y el 15/11 para la lista de espera y los turnos.

**Stop (dejar de hacer):**

- **Dejar todo un módulo en una sola persona.** Evidencia: HU-05 y HU-06 son de Katherine, HU-08 y HU-09 son de Karol.

**Start (empezar a hacer):**

- Terminar las tarjetas en el momento: moverlas a "Hecho" cuando cumplan la DoD.

### 3. Seguimiento de las acciones del sprint anterior

| ID | Acción | Estado | Evidencia |
| :-- | :-- | :-: | :-- |
| A-01 | Recalcular la velocidad con los 19 puntos reales y revisar el alcance del Sprint 2 | Cumplida | El Cronograma y la Matriz de Estimación muestran la velocidad real y el burndown del Sprint 1 completo |
| A-02 | Entregar historias completas, no por capas | Cumplida | En esta acta, cada historia mostrada dice si cumple la DoD |
| A-03 | Confirmar la DoD y los criterios con el Product Owner antes de iniciar el Sprint |  | La DoD 2.0 tiene fecha de aprobación del 15/11/2026, que es posterior al inicio del Sprint (09/11) |

### 4. Acciones de mejora (máximo 3, con dueño y fecha)

1. **Respetar el WIP en el Sprint 3.**
   - **Acción:** no pasar de 2 tarjetas en "En progreso", "En revisión" y "En pruebas", y mover cada tarjeta a la siguiente columna apenas termine.
   - **Dueño:** Katherine Solis y Karol Miranda (Developers).
   - **Fecha:** durante el Sprint 3 (cierre el 24/11/2026).
   - **Cómo se verifica:** la captura del tablero al cierre del Sprint 3 no muestra más de 2 tarjetas en esas columnas.
2. **Hacer el traspaso de los módulos de libros y cubículos.**
   - **Acción:** cada integrante explica su módulo a la otra en 30 minutos (MIT-01 y MIT-02), porque el Dashboard (HU-10) usa los datos de los dos.
   - **Dueño:** Katherine Solis (libros) y Karol Miranda (cubículos).
   - **Fecha:** 17/11/2026, el día en que se definen los indicadores del Dashboard.
   - **Cómo se verifica:** el Sprint Backlog 3 registra la fecha en que se hizo cada traspaso.
3. **Confirmar la DoD antes de iniciar el Sprint.**
   - **Acción:** en el Planning del Sprint 3 se confirma con el Product Owner la versión de la DoD y los criterios de cada historia, antes de empezar a trabajar.
   - **Dueño:** Karol Miranda (Scrum Master), con la confirmación del Product Owner.
   - **Fecha:** Planning del Sprint 3 (16/11/2026).
   - **Cómo se verifica:** el Sprint Backlog 3 indica la versión de la DoD y una fecha de confirmación anterior al inicio del Sprint.

### 5. Acciones incorporadas al Sprint Backlog siguiente

Las tres acciones entran al Sprint Backlog 3 como tareas con responsable y fecha. Se revisan en la Retrospective del Sprint 3.