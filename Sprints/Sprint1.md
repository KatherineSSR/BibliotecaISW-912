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

# 1. Ciclo de vida del proyecto y primer Sprint

**Enfoque:** mixto (predictivo/adaptativo).

El alcance general se define desde el inicio con cinco módulos, y la construcción se hace por Sprints semanales para ir ajustando los cambios que surjan. La meta del primer Sprint es dejar listo el ambiente de trabajo, la base de datos y el módulo de usuarios.

## Problema

La Biblioteca Pública de Ciudad Quesada anota a mano, en libros de papel, los préstamos, el uso de computadoras y el ingreso de usuarios. La información queda dispersa, hay errores al copiar datos y no se pueden sacar informes para justificar el presupuesto y el horario.

## Backlog inicial

1. **Registro de usuarios:** como administrador, quiero registrar y editar usuarios y generar un código único, para identificarlos en el sistema.
2. **Control de acceso:** como usuario, quiero ingresar mi código al llegar, para registrar mi entrada.
3. **Préstamos de libros:** como administrador, quiero registrar los préstamos de libros, para controlar lo que se presta.
4. **Préstamos de cubículos:** como administrador, quiero manejar los préstamos de cubículos, para saber cuáles están ocupados y libres.
5. **Dashboard:** como administrador, quiero consultar préstamos, accesos y uso de cubículos, para controlar la biblioteca y generar reportes.

## Fases del proyecto

| N° | Fase | Qué se realizará |
| :-: | :--- | :--- |
| 1 | Inicio | Identificar el problema, los interesados y el objetivo del sistema. |
| 2 | Planificación | Armar y priorizar el Product Backlog y definir la duración de los Sprints. |
| 3 | Ejecución | Construir el sistema Sprint por Sprint, empezando por el registro de usuarios. |
| 4 | Monitoreo y control | Revisar el Sprint Backlog y validar cada avance en la Sprint Review. |
| 5 | Cierre | Desplegar el sistema y entregar. |

# 2. Definition of Done 1.0

Una historia está **Hecha** cuando cumple sus criterios de aceptación y todos los puntos de esta lista. Si no los cumple, no se presenta en la Sprint Review y vuelve al Product Backlog.

## Criterios de calidad

1. **Revisión cruzada:** el Pull Request lo revisa y aprueba la otra integrante.
2. **Validación de datos:** en cliente y servidor (cédula, correo, campos obligatorios y unicidad).
3. **Persistencia:** los datos se guardan en la base de datos (MongoDB Atlas) sin pérdidas ni registros huérfanos.
4. **Diseño responsivo:** funciona en computadora y en celular o tableta.
5. **Sin errores bloqueantes:** compila y no da errores 500.
6. **No regresión:** lo nuevo no daña lo que ya funcionaba.
7. **Validación con el Product Owner.**

## Pruebas exigidas

| Tipo | Qué se prueba |
| :--- | :--- |
| Unitarias | Formato de cédula y correo; generación del código único de 4 dígitos. |
| Integración | Frontend, backend y base de datos; envío del correo con el código; check-in con fecha y hora. |
| Manuales | Flujo completo: registro → correo → check-in. Casos límite: código no registrado, cédula duplicada y campos vacíos. |

## Integración, despliegue y documentación

* Cada función se trabaja en una rama `feature/` y se integra por Pull Request revisado.
* Ninguna historia se presenta si no se probó en el ambiente de pruebas.
* Documentación: esquema de la base de datos (usuarios y accesos), casos de prueba e historial de cambios en el Expediente.

**Aprobación:** Karol Miranda Mora, Katherine Solis Ramírez y Prof. Rudy Barboza Rodríguez (Product Owner) · Versión 1.0 · 14/10/2026.

# 3. Sprint Backlog 1

## Sprint Goal

Construir y desplegar el registro de usuarios y el control de acceso con un código único enviado por correo, para identificar a los visitantes y registrar su ingreso.

## Ítems seleccionados

| ID | Historia | Puntos |
| :--- | :--- | :-: |
| TEC-00 | Preparación técnica (repositorio, ambiente, base de datos y diseño base) | 3 |
| HU-01 | Registro de usuarios con código único | 5 |
| HU-02 | Edición de usuarios | 3 |
| HU-03 | Código de usuario por correo | 5 |
| HU-04 | Control de acceso con código (check-in) | 3 |
| | **Total** | **19** |

Quedan fuera: libros, cubículos y dashboard.

## Tareas y responsables

| ID | Tarea | Responsable |
| :--- | :--- | :--- |
| TEC-01 | Crear el repositorio, las ramas y las reglas de Pull Request | Karol y Katherine |
| TEC-02 | Configurar el ambiente de desarrollo y de pruebas | Karol y Katherine |
| TEC-03 | Diseñar el modelo de datos (`Usuario`, `Acceso`, `TipoUsuario`) | Katherine |
| TEC-04 | Diseño visual base y componentes reutilizables | Karol |
| T-01.1 | Formulario de registro | Karol |
| T-01.2 | Validaciones de cédula, correo, edad y campos requeridos | Katherine |
| T-01.3 | Generación automática del código único | Katherine |
| T-01.4 | Guardado en la base de datos y pruebas unitarias | Katherine |
| T-02.1 | Vista de búsqueda y edición de usuarios | Karol |
| T-02.2 | Endpoint de actualización | Katherine |
| T-02.3 | Probar que la edición no cambie el código | Karol |
| T-03.1 | Configurar el servicio de correo saliente | Katherine |
| T-03.2 | Plantilla del correo con el código | Karol |
| T-03.3 | Enviar el correo al guardar el registro | Katherine |
| T-03.4 | Probar la entrega en cuentas reales | Karol |
| T-04.1 | Pantalla de check-in | Karol |
| T-04.2 | Validar el código y guardar fecha y hora | Katherine |
| T-04.3 | Mensaje de confirmación con nombre y tipo de usuario | Karol |
| T-04.4 | Pruebas de códigos válidos, inválidos y sin conexión | Karol y Katherine |

## Verificación de la DoD

Antes de pasar un ítem a **Hecho** se revisa:

* [ ] Pull Request revisado por la compañera.
* [ ] Pruebas unitarias y de integración superadas.
* [ ] Registros comprobados en la base de datos.
* [ ] Probado en computadora y en vista móvil.
* [ ] Criterios de aceptación revisados con el Product Owner.

Si falla un punto, el ítem se queda en **En progreso** o **En pruebas** hasta corregirlo.

# 4. Matriz de Estimación

* **Escala:** Fibonacci (1, 2, 3, 5, 8, 13). Los puntos miden tamaño relativo, no horas.
* **Historia de referencia (3 puntos):** HU-02 Edición de usuarios.
* **Velocidad inicial:** 22 puntos por Sprint (rango supuesto de 18 a 28). Después de cada Sprint se cambia por la velocidad real.

| ID | Historia | Épica | Puntos | Prioridad | Dependencias |
| :--- | :--- | :--- | :-: | :-: | :--- |
| TEC-00 | Preparación técnica | Técnica | 3 | Alta | - |
| HU-01 | Registro de usuarios con código único | Registro | 5 | Alta | TEC-00 |
| HU-02 | Edición de usuarios (**referencia**) | Registro | 3 | Alta | HU-01 |
| HU-03 | Código de usuario por correo | Registro | 5 | Alta | HU-01 |
| HU-04 | Control de acceso (check-in) | Acceso | 3 | Alta | HU-01 |
| HU-05 | Catálogo de libros | Libros | 5 | Media | TEC-00 |
| HU-06 | Préstamo y devolución de libros | Libros | 5 | Alta | HU-01, HU-05 |
| HU-07 | Lista de espera de 24 horas | Libros | 8 | Media | HU-06 |
| HU-08 | Préstamo de cubículos | Cubículos | 5 | Alta | HU-01 |
| HU-09 | Control de tiempo por turno | Cubículos | 5 | Media | HU-08 |
| HU-10 | Dashboard de consulta | Dashboard | 8 | Media | HU-04, HU-06, HU-08 |
| HU-11 | Reportes semanal, quincenal y mensual | Dashboard | 5 | Media | HU-10 |
| TEC-05 | Despliegue final | Técnica | 3 | Alta | Todas |
| | **Total** | | **63** | | |

**Por épica:** Registro 13 · Acceso 3 · Libros 18 · Cubículos 10 · Dashboard 13 · Técnica 6. Ninguna historia pasa de 8; si HU-07 o HU-10 generan desacuerdo en el planning poker, se dividen.

**Supuestos:** no hay historial de velocidad; somos dos personas, así que una ausencia pesa mucho; el correo saliente es la mayor incertidumbre; las reglas de 24 horas y de turnos se validan con el bibliotecario.

# 5. Riesgos y adquisiciones

## Registro de riesgos

| ID | Si ocurre…, entonces… | Tipo | P | I | Puntaje | Prioridad | Dueño |
| :-- | :-- | :-- | :-: | :-: | :-: | :-- | :-- |
| R-01 | Si una integrante se ausenta o se satura, la capacidad baja a la mitad y su módulo se detiene. | Amenaza | 3 | 3 | 9 | **Alta** | Karol |
| R-02 | Si el correo no llega o cae en spam, el usuario no recibe su código. | Amenaza | 3 | 2 | 6 | **Alta** | Katherine |
| R-03 | Si el bibliotecario no confirma las reglas de 24 horas y turnos, HU-07 y HU-09 se rehacen. | Amenaza | 3 | 2 | 6 | **Alta** | Karol |
| R-04 | Si el Sprint 2 (28 puntos) no se completa, el Dashboard se atrasa. | Amenaza | 3 | 2 | 6 | **Alta** | Katherine |
| R-05 | Si soporte técnico no tiene listo el ambiente, el despliegue final se atrasa. | Amenaza | 2 | 3 | 6 | **Alta** | Katherine |
| R-06 | Si los datos personales se exponen, hay un problema legal y se pierde la confianza. | Amenaza | 1 | 3 | 3 | Vigilar | Katherine |
| R-07 | Si el personal sigue usando papel o los usuarios olvidan su código, los datos quedan incompletos. | Amenaza | 2 | 2 | 4 | Vigilar | Karol |
| R-08 | Si el internet de la biblioteca es inestable, el check-in y los préstamos fallan. | Amenaza | 2 | 2 | 4 | Vigilar | Karol |
| R-09 | Si los reportes llegan a tiempo a la municipalidad, puede apoyar el presupuesto y el horario. | **Oportunidad** | 2 | 2 | 4 | Vigilar | Karol |
| R-10 | Si un cambio en el modelo de datos rompe usuarios y acceso, se pierde tiempo corrigiendo. | Amenaza | 1 | 2 | 2 | Aceptar | Katherine |

## Mapa de calor

| | Impacto bajo (1) | Impacto medio (2) | Impacto alto (3) |
| :-- | :-: | :-: | :-: |
| **Prob. alta (3)** | — | **Alta:** R-02 · R-03 · R-04 | **Alta:** R-01 |
| **Prob. media (2)** | — | Vigilar: R-07 · R-08 · R-09 | **Alta:** R-05 |
| **Prob. baja (1)** | — | Aceptar: R-10 | Vigilar: R-06 |

## Plan de mitigación

| Riesgo | Estrategia | Acción | Disparador | Contingencia |
| :-- | :-- | :-- | :-- | :-- |
| R-01 | Mitigar | MIT-01 y MIT-02: traspaso de 30 min de cada módulo; 20 % de holgura | Sin respuesta en 24 h o tarjeta 3 días sin avance | La otra toma solo historias de prioridad Alta |
| R-02 | Mitigar | MIT-03: prueba con 3 cuentas reales; MIT-04: interfaz `EnvioCorreo` | Falla en 2 de 3 cuentas | Correo municipal o código impreso |
| R-03 | Mitigar | MIT-05: confirmar las reglas por escrito con el bibliotecario | No hay confirmación antes de iniciar | Versión mínima con valores configurables |
| R-04 | Evitar | MIT-06: revisar el alcance del Sprint 2 con la velocidad real | Puntos reales por encima del ideal | Usar el Sprint 4 de reserva |
| R-05 | Mitigar | MIT-07: enviar requisitos y fecha a soporte técnico | Sin respuesta en 3 días hábiles | Instalar en una computadora de la biblioteca |
| R-06 | Mitigar | MIT-08: pedir solo lo necesario, cédula parcial, acceso por rol | Reclamo de un usuario | Quitar el acceso y avisar al Product Owner |
| R-07 | Mitigar | MIT-09: capacitación breve y aviso impreso | Más de 3 visitas al día sin registro | Buscar al usuario por cédula |
| R-08 | Mitigar | MIT-10: probar en la red real de la biblioteca | El check-in se cae en una prueba | Anotar en papel y digitar después |
| R-09 | Mejorar | MIT-11: resumen de una página para la municipalidad | La municipalidad pide datos | Presentar los datos disponibles |
| R-10 | Aceptar | La DoD ya exige no regresión y Pull Request revisado | Una prueba previa falla | Revertir el cambio |

## Adquisiciones críticas

* **Correo saliente:** plan gratuito o servidor municipal; si falla, se cambia de proveedor con `EnvioCorreo`.
* **Ambiente de despliegue:** soporte técnico de la municipalidad, sin costo; alternativa: instalación local.
* **GitHub, Trello y MongoDB Atlas:** planes gratuitos; se respalda el repositorio y se exporta el tablero cada Sprint.

# 6. Cronograma de Entregas

* **Duración del Sprint:** 1 semana (el Sprint 1 va del 12/10 al 08/11 con dos incrementos).
* **Cierre del proyecto:** 04/12/2026.
* **Sprints necesarios:** 63 ÷ 22 = 2,9 → **3 Sprints**. Con la velocidad mínima (18) serían 4. **Rango: 3 a 4 Sprints.**

| Sprint | Fechas | Incremento | Historias | Puntos |
| :-: | :--- | :--- | :--- | :-: |
| 1 | 12/10 – 08/11 | Usuarios, código por correo y control de acceso | TEC-00, HU-01 a HU-04 | 19 |
| 2 | 09/11 – 15/11 | Préstamo de libros y de cubículos | HU-05 a HU-09 | 28 |
| 3 | 16/11 – 22/11 | Dashboard, reportes y despliegue | HU-10, HU-11, TEC-05 | 16 |
| 4 (reserva) | 23/11 – 29/11 | Solo si algo queda pendiente | Pendientes | - |

* **Incrementos del Sprint 1:** 1.1 (18/10): backend de usuarios con guía para el frontend · 1.2 (08/11): frontend, correo y pruebas. Con el 1.2 se cumple la DoD completa.
* **Margen:** la semana del 30/11 al 04/12 queda libre para la documentación final y la entrega.
* **Costo:** 30 horas-persona por Sprint (2 personas × 15 h). Release esperado: 90 horas (rango: 90 a 120).

**Seguimiento (burndown del release):**

| Corte | Inicio | S1 | S2 | S3 |
| :--- | :-: | :-: | :-: | :-: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | | | |

# 7. Plan de Comunicaciones

| Interesado | Poder | Interés | Qué necesita | Cuándo | Canal | Responsable |
| :--- | :-: | :-: | :--- | :--- | :--- | :--- |
| Prof. Rudy Barboza (Product Owner) | Alto | Alto | Avance, alcance e impedimentos | Cada Sprint y en clase | Clase y correo | Katherine |
| Bibliotecario/a | Alto | Alto | Demo y validación de reglas | Final de cada Sprint | Demo y correo | Karol |
| Administración municipal | Alto | Bajo | Resumen de una página | Cierre del Sprint 2 y despliegue | Correo | Karol |
| Soporte técnico | Alto | Bajo | Requisitos de despliegue y correo | Inicio del Sprint 2 | Correo | Katherine |
| Personal de apoyo | Bajo | Alto | Uso del check-in y préstamos | Final de Sprints 2 y 3 | Presencial | Karol |
| Usuarios | Bajo | Alto | Su código y cómo usarlo | Al registrarse | Correo y aviso impreso | Katherine |

**Comunicación interna:** planificación de 30 min al inicio del Sprint, Daily de máximo 15 min por mensajería, Review con el Product Owner, Retrospectiva del equipo y Pull Requests en GitHub.

**Reglas del equipo:** respuesta en máximo 24 horas hábiles (si es urgente, se llama); las decisiones se anotan en el tablero o el Expediente; los cambios de alcance pasan primero por el Product Owner; los bloqueos se avisan el mismo día.

# 8. Tablero de Trabajo

**Herramienta:** Trello · [Tablero de trabajo](https://trello.com/b/6aebddcac8243401d84573a9)

| Módulo | Historias | Responsable |
| :--- | :--- | :--- |
| Usuarios y acceso | HU-01 a HU-04 | Backend: Katherine · Frontend: Karol |
| Préstamo de libros | HU-05 a HU-07 | Katherine |
| Préstamo de cubículos | HU-08, HU-09 | Karol |
| Dashboard y reportes | HU-10, HU-11 | Ambas |

| Columna | Significado | WIP máx. |
| :--- | :--- | :-: |
| Por hacer | Sprint Backlog en orden de prioridad | - |
| En progreso | Se está programando o diseñando | 2 |
| En revisión | Pull Request esperando a la compañera | 2 |
| En pruebas | Pruebas en computadora y móvil | 2 |
| Hecho | Cumple la DoD | - |

**WIP:** una historia por integrante en progreso, para terminar más y empezar menos. Cada Pull Request lo revisa la otra integrante.

**Estado del tablero durante el Sprint:**

| ID | Historia | Puntos | Columna |
| :--- | :--- | :-: | :--- |
| TEC-00 | Preparación técnica | 3 | Hecho |
| HU-01 | Registro con código único | 5 | En progreso |
| HU-02 | Edición de usuarios | 3 | En revisión |
| HU-03 | Código por correo | 5 | En progreso |
| HU-04 | Control de acceso | 3 | En progreso |

# 9. Acta de Sprint Review

* **Fecha:** 08/11/2026 · **Duración:** 1 hora.
* **Product Owner:** Prof. Rudy Barboza Rodríguez · **Scrum Master:** Karol Miranda Mora.
* **Developers:** Karol Miranda Mora (frontend) y Katherine Solis Ramírez (backend).
* **Interesado presente:** representante de la biblioteca (rol simulado).

**Sprint Goal:** cumplido. Las cuatro historias funcionan de principio a fin en el ambiente de pruebas.

| Historia | Puntos | Qué se mostró | DoD |
| :--- | :-: | :--- | :-: |
| TEC-00 Preparación técnica | 3 | Repositorio, ambiente, base de datos y diseño base | Cumple |
| HU-01 Registro | 5 | Se registró un usuario y se generó su código | Cumple |
| HU-02 Edición | 3 | Se editó un usuario y el código no cambió | Cumple |
| HU-03 Correo | 5 | El correo llegó a una cuenta real | Cumple |
| HU-04 Check-in | 3 | Código válido guarda fecha y hora; código no registrado muestra aviso | Cumple |

**Puntos terminados:** 19 de 19.

**Retroalimentación:** el Product Owner aceptó el incremento. La representante de la biblioteca pidió buscar usuarios por cédula y poner el nombre de la biblioteca en el asunto del correo. Confirmó que lo siguiente más importante son los préstamos.

**Cambios al Product Backlog:** búsqueda por cédula (ajuste a HU-02) y asunto del correo (ajuste a HU-03), ambos para el Sprint 2. Las prioridades se mantienen.

**Estado del release:** 19 de 63 puntos (30 %). Quedan 44, igual que lo ideal. El cierre se mantiene el 04/12/2026.

# 10. Acta de Sprint Retrospective

**Formato:** Start / Stop / Continue · 45 minutos · se habla del proceso, no de personas.

**Continue**

* Entregar el backend temprano con una guía para el frontend. *Evidencia:* el Incremento 1.1 salió el 18/10 y Karol avanzó con las pantallas sin esperar.
* Dividir el trabajo en tareas con responsable. *Evidencia:* cada tarea tenía dueña y se terminaron los 19 puntos.

**Stop**

* Planificar con una velocidad supuesta. *Evidencia:* se estimaron 22 puntos y se terminaron 19.
* Contar un incremento parcial como entregable. *Evidencia:* el 1.1 (solo backend) no cumplía la DoD por sí solo.

**Start**

* Aprobar la DoD antes de empezar el Sprint. *Evidencia:* el Sprint inició el 12/10 y la DoD se aprobó el 14/10.
* Probar el correo desde el inicio del Sprint en que se use. *Evidencia:* era la mayor incertidumbre técnica.

**Seguimiento de acciones anteriores:** no aplica, es el primer Sprint.

## Acciones de mejora

| ID | Acción | Dueño | Fecha | Cómo se verifica |
| :-- | :-- | :-- | :-: | :-- |
| A-01 | Recalcular la velocidad con los 19 puntos reales y revisar que el Sprint 2 quepa | Karol | 13/11 | El Cronograma muestra la velocidad real y el burndown del Sprint 1 |
| A-02 | Entregar historias completas (backend, pantalla y pruebas), no por capas | Karol y Katherine | 15/11 | En el Acta del Sprint 2 cada historia dice si cumple la DoD |
| A-03 | Confirmar la DoD y los criterios con el Product Owner antes de iniciar | Karol | Planning del Sprint 2 | El Sprint Backlog indica la versión de la DoD y la fecha de confirmación |

Las tres acciones entran al Sprint Backlog 2.
