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
<p style="margin: 0.2rem 0;">22/11/26</p>

</div>

# 1. Ciclo de vida del proyecto y tercer Sprint

El Sprint 3 es el último del proyecto. Su objetivo fue cerrar el sistema de la Biblioteca Pública de Ciudad Quesada con un dashboard de consulta, reportes descargables en PDF y el despliegue final.

* **Fechas:** 16/11/2026 – 22/11/2026.
* **Equipo:** Karol Miranda Mora y Katherine Solis Ramírez.
* **Product Owner:** Prof. Rudy Barboza Rodríguez.

## Estado del backlog

| Historia | Sprint | Estado |
| :--- | :-: | :--- |
| Registro de usuarios | 1 | Terminado |
| Control de acceso | 1 | Terminado |
| Préstamos de libros y lista de espera | 2 | Terminado |
| Préstamos de cubículos y turnos | 2 | Terminado |
| **Dashboard y reportes en PDF** | **3** | **Terminado** |

## Fases del proyecto

| Fase | Trabajo | Estado |
| :--- | :--- | :--- |
| Inicio y planificación | Problema, interesados, backlog y enfoque | Finalizado |
| Ejecución Sprint 1 | Registro, edición, código por correo y acceso | Finalizado |
| Ejecución Sprint 2 | Catálogo, préstamos, lista de espera y cubículos | Finalizado |
| Ejecución Sprint 3 | Dashboard, reportes en PDF y despliegue | Finalizado |
| Cierre | Revisión final, aceptación, entrega y retrospectiva | Finalizado |

# 2. Definition of Done 3.0

Se mantienen las DoD 1.0 y 2.0. Para el Sprint 3 una historia está **Hecha** cuando cumple sus criterios de aceptación y además:

1. **Revisión cruzada:** cada Pull Request lo aprueba la otra integrante.
2. **Datos correctos:** los indicadores y reportes salen de los registros guardados, respetan el período elegido y no duplican operaciones.
3. **Descarga comprobada:** cada reporte se descarga en PDF, abre bien y muestra el período y los datos pedidos.
4. **Privacidad:** las vistas y descargas piden autenticación y los archivos no muestran datos que no corresponden.
5. **Diseño responsivo:** el dashboard, los filtros y las descargas funcionan en computadora y móvil.
6. **No regresión:** usuarios, accesos, catálogo, préstamos, lista de espera y cubículos siguen funcionando.
7. **Sin errores bloqueantes** ni respuestas 500.
8. **Documentación de entrega:** requisitos, configuración, despliegue y guía de uso.
9. **Aceptación del Product Owner** del dashboard, los reportes y la entrega final.

## Pruebas exigidas

| Tipo | Qué se prueba |
| :--- | :--- |
| Unitarias | Totales y períodos, límites de fechas, reportes sin datos y generación del PDF. |
| Integración | El dashboard y los reportes leen accesos, préstamos, devoluciones y cubículos. |
| Descargas | Nombre, extensión `.pdf`, contenido, paginación y apertura del archivo. |
| Manuales | Filtros semanal, quincenal y mensual; rangos sin resultados. |
| Entrega | Desplegar siguiendo la guía desde un ambiente limpio. |

**Integración y despliegue:** Pull Requests revisados por pares. Antes de entregar se revisaron la configuración del frontend y del backend, la conexión a MongoDB Atlas, las variables de entorno, los datos de prueba y el respaldo.

**Aprobación:** Karol Miranda Mora, Katherine Solis Ramírez y Prof. Rudy Barboza Rodríguez (Product Owner) · Versión 3.0 · 16/11/2026 (Planning del Sprint 3).

# 3. Sprint Backlog 3

## Sprint Goal

Entregar el sistema completo con un dashboard que reúna los indicadores principales, reportes semanales, quincenales y mensuales en PDF, y el despliegue final.

## Ítems seleccionados y criterios de aceptación

| ID | Historia | Puntos | Criterios de aceptación |
| :--- | :--- | :-: | :--- |
| HU-10 | Dashboard gerencial: ver usuarios, accesos, préstamos y uso de cubículos en un solo lugar | 8 | Muestra totales y tendencias; filtra por período; los valores coinciden con la base de datos; tiene mensajes claros cuando no hay datos. |
| HU-11 | Reportes descargables en PDF para auditoría | 5 | Se elige el período y se genera el reporte; incluye accesos, libros y cubículos; se descarga solo en PDF; el archivo abre bien y muestra el período y la fecha de generación. |
| TEC-05 | Despliegue final y entrega | 3 | Ambiente final verificado; configuración y despliegue documentados; guía de uso y mantenimiento entregada. |
| | **Total** | **16** | |

**DoD vigente:** 3.0, confirmada con el Product Owner el 16/11/2026, antes de iniciar el trabajo.

## Tareas y responsables

| ID | Tarea | Responsable |
| :--- | :--- | :--- |
| T-10.1 | Acordar indicadores, fuentes y períodos con el Product Owner | Karol y Katherine |
| T-10.2 | Consultas y agregaciones en el backend | Katherine |
| T-10.3 | Vista de indicadores y gráficos responsivos | Karol |
| T-10.4 | Comparar los valores con la base de datos | Karol y Katherine |
| T-11.1 | Confirmar campos y filtros de los reportes | Karol y Katherine |
| T-11.2 | Generación y descarga del PDF por período | Katherine |
| T-11.3 | Controles para elegir el período y descargar | Karol |
| T-11.4 | Probar apertura, contenido y reportes sin datos | Karol y Katherine |
| T-05.1 | Documentar variables y configuración, sin incluir secretos | Katherine |
| T-05.2 | Desplegar y verificar frontend, backend y base de datos | Karol y Katherine |
| T-05.3 | Guía de usuario, respaldo y recuperación | Karol |
| T-05.4 | Demostración final y registro de aceptación | Karol y Katherine |

## Acciones de la Retrospectiva 2

| ID | Acción | Dueño | Fecha |
| :-- | :-- | :-- | :-: |
| A-04 | Respetar el WIP en todas las columnas | Karol y Katherine | Todo el Sprint |
| A-05 | Traspasos de libros y cubículos (MIT-01 y MIT-02) | Katherine y Karol | 17/11 |
| A-06 | Confirmar la DoD 3.0 en el Planning | Karol | 16/11 |

## Verificación del Sprint

* [x] HU-10 y HU-11 cumplen sus criterios de aceptación.
* [x] Los PDF de cada período se descargan y abren bien.
* [x] Pruebas de períodos, casos sin datos y permisos superadas.
* [x] Sin regresión en lo hecho en los Sprints 1 y 2.
* [x] Pull Requests revisados y aprobados.

**Solicitudes de cambio:** las solicitudes recibidas, su evaluación y su decisión están en el documento aparte *Registro de Solicitudes de Cambio y Working Agreements*.

# 4. Cronograma de Entregas

| Fecha | Entregable | Resultado |
| :--- | :--- | :--- |
| 16/11/2026 | Planning y DoD 3.0 | DoD confirmada con el Product Owner |
| 17/11/2026 | Criterios del dashboard y reportes; traspasos de módulos | Aprobados y registrados |
| 19/11/2026 | Dashboard y filtros | Datos comparados con la base y diseño responsivo |
| 22/11/2026 | Reportes en PDF | Semanal, quincenal y mensual generados y validados |
| 22/11/2026 | Despliegue y cierre | Guía revisada, demo final y aceptación |

**Burndown final del release:**

| Corte | Inicio | S1 | S2 | S3 |
| :--- | :-: | :-: | :-: | :-: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | 44 | 16 | 0 |

**Velocidad:** 19 (Sprint 1), 28 (Sprint 2) y 16 (Sprint 3). Se terminaron los 63 puntos en 3 Sprints, sin usar el Sprint 4 de reserva.

# 5. Tablero de Trabajo

**Herramienta:** Trello. Flujo: Por hacer → En progreso → En revisión → En pruebas → Hecho.

| ID | Tarjeta | Puntos | Responsable | Estado final |
| :--- | :--- | :-: | :--- | :--- |
| HU-10 | S3 - Dashboard gerencial | 8 | Karol y Katherine | Hecho |
| HU-11 | S3 - Reportes descargables en PDF | 5 | Karol y Katherine | Hecho |
| TEC-05 | S3 - Despliegue final y entrega | 3 | Karol y Katherine | Hecho |
| WA-01 | S3 - Working Agreements y puño de cinco | - | Karol y Katherine | Hecho |
| DOC-3 | S3 - Documentación Sprint 3 | - | Karol y Katherine | Hecho |

# 6. Acta de Sprint Review y cierre del proyecto

## 6.1 Fecha, duración y asistentes

* **Fecha:** 22/11/2026 · **Duración:** 1 hora.
* **Product Owner:** Prof. Rudy Barboza Rodríguez.
* **Scrum Master:** Karol Miranda Mora.
* **Developers:** Karol Miranda Mora (cubículos y vista del dashboard) y Katherine Solis Ramírez (libros, consultas y reportes).

## 6.2 Sprint Goal y resultado

* **Sprint Goal:** entregar el sistema completo con un dashboard que reúna los indicadores principales, reportes semanales, quincenales y mensuales en PDF, y el despliegue final.
* **Resultado:** **cumplido.** Las tres historias del Sprint funcionan de principio a fin en el ambiente final.

## 6.3 Historias mostradas y cumplimiento de la DoD

Se mostró el sistema funcionando, en computadora y en vista móvil. No se presentó código.

| Historia | Puntos | Qué se mostró | DoD 3.0 |
| :--- | :-: | :--- | :-: |
| HU-10 Dashboard gerencial | 8 | Totales de usuarios, accesos, préstamos y uso de cubículos, con filtro por período. Los valores coincidieron con la base de datos y, sin registros, se muestra un mensaje claro. | Cumple |
| HU-11 Reportes en PDF | 5 | Se generaron y descargaron los reportes semanal, quincenal y mensual. Cada PDF abrió bien y muestra el período y la fecha de generación. | Cumple |
| TEC-05 Despliegue final | 3 | Sistema desplegado y verificado siguiendo la guía. Se entregaron la guía de uso y la documentación de configuración. | Cumple |

**Puntos terminados:** 16 de 16.

## 6.4 Retroalimentación y decisión del Product Owner

* El Product Owner **aceptó** el incremento del Sprint 3 y la entrega final del sistema.
* No se recibieron solicitudes nuevas en la revisión.
* Las solicitudes que quedaron diferidas en el Registro de Solicitudes de Cambio pasan a un **backlog de mantenimiento** y seguirán el mismo flujo de control de cambios.

## 6.5 Estado final del release

| Corte | Inicio | S1 | S2 | S3 |
| :--- | :-: | :-: | :-: | :-: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | 44 | 16 | 0 |

* **Avance:** 63 de 63 puntos terminados (100 %).
* **Velocidad:** 19 (Sprint 1), 28 (Sprint 2) y 16 (Sprint 3).
* **Cronograma:** se planearon de 3 a 4 Sprints y se terminó en 3. No se usó el Sprint 4 de reserva.
* **Costo:** con 3 Sprints, el esfuerzo quedó en el valor esperado de 90 horas-persona (rango planificado: 90 a 120).

## 6.6 Cierre del proyecto

### Producto entregado

| Módulo | Sprint | Qué resuelve |
| :--- | :-: | :--- |
| Usuarios y código por correo | 1 | Cada visitante queda registrado con un código único. |
| Control de acceso | 1 | El ingreso se guarda con fecha y hora, sin libro de papel. |
| Libros y lista de espera | 2 | Se controla el inventario y los libros agotados se asignan por orden de llegada. |
| Cubículos y turnos | 2 | Se sabe qué puestos están ocupados y cuánto tiempo se usan. |
| Dashboard y reportes PDF | 3 | La biblioteca tiene datos para auditorías y para justificar presupuesto y horario. |

Con esto se atiende el problema inicial: la información deja de estar en libros de papel y se pueden sacar reportes por período.

### Entregables finales

* Sistema desplegado (frontend, backend y base de datos en MongoDB Atlas).
* Guía de uso del sistema y de descarga de reportes.
* Documentación de configuración, despliegue, respaldo y recuperación.
* Expediente del Proyecto actualizado con los tres Sprints.
* Repositorio en GitHub: *(agregar enlace)*.

### Estado final de los riesgos

| ID | Riesgo | Estado al cierre |
| :-- | :-- | :-- |
| R-01 | Ausencia de una integrante | Cerrado. Los traspasos de módulos se hicieron el 17/11. |
| R-02 | Falla del correo | Cerrado. El correo funcionó desde el Sprint 1. |
| R-03 | Reglas de 24 h y turnos sin confirmar | Cerrado. HU-07 y HU-09 se aceptaron sin rehacerse. |
| R-04 | Sprint 2 sobrecargado | Cerrado. Se completaron los 28 puntos. |
| R-05 | Ambiente de despliegue no listo | Cerrado. El despliegue se verificó en este Sprint. |
| R-06 | Exposición de datos personales | Pasa a mantenimiento. Las vistas y descargas piden autenticación. |
| R-07 | Poca adopción del sistema | Pasa a la biblioteca. Se entregó la guía de uso. |
| R-08 | Internet inestable | Pasa a mantenimiento. Se mantiene el respaldo en papel como contingencia. |
| R-09 | Oportunidad: apoyo municipal | Aprovechable. Los reportes en PDF ya se pueden presentar a la municipalidad. |
| R-10 | Un cambio rompe lo ya hecho | Cerrado. Se verificó la no regresión en cada Sprint. |

### Pendientes

* No quedan defectos bloqueantes.
* Las mejoras futuras y las solicitudes diferidas se manejan en el backlog de mantenimiento.

## 6.7 Aceptación

| Nombre | Rol | Decisión | Fecha | Firma |
| :--- | :--- | :--- | :-: | :--- |
| Prof. Rudy Barboza Rodríguez | Product Owner | Aprobado | 22/11/2026 | |
| Karol Miranda Mora | Scrum Master y Developer | Conforme | 22/11/2026 | |
| Katherine Solis Ramírez | Developer | Conforme | 22/11/2026 | |

# 7. Acta de Sprint Retrospective

**Formato:** Start / Stop / Continue. Se revisaron los acuerdos de trabajo, la gestión de cambios y la entrega.

## Seguimiento de las acciones del Sprint 2

| ID | Acción | Estado | Evidencia |
| :-- | :-- | :-: | :-- |
| A-04 | Respetar el WIP | Cumplida | Captura del tablero al cierre: ninguna columna pasa de 2 tarjetas |
| A-05 | Traspasos de libros y cubículos | Cumplida | Hechos el 17/11, el mismo día en que se definieron los indicadores |
| A-06 | Confirmar la DoD antes de iniciar | Cumplida | DoD 3.0 confirmada el 16/11, el día del Planning |

**Continue**

* La revisión cruzada y validar cada historia con sus criterios antes de integrarla.
* Registrar las decisiones y los cambios para que el estado del proyecto sea claro.
* Probar el flujo completo, incluida la descarga y apertura de los reportes.

**Stop**

* Dejar para el final la confirmación de los criterios y los formatos de entrega.
* Empezar una solicitud nueva sin evaluar su impacto en el Sprint Goal.

**Start**

* Usar los Working Agreements como base en cualquier versión o mantenimiento futuro.
* Actualizar el registro de cambios y la guía de usuario cuando se amplíen los reportes.

**Working Agreements:** se revisaron los diez acuerdos y se decidió conservarlos para el mantenimiento. El detalle y el puño de cinco están en el documento aparte.

## Lecciones aprendidas

El proyecto cerró con los 63 puntos en tres Sprints. Lo que más ayudó fue trabajar los módulos en paralelo y revisar el código entre las dos. Lo que más costó fue confirmar la DoD a tiempo, y eso se logró corregir en este último Sprint. Las mejoras futuras se manejarán en un backlog de mantenimiento con el mismo flujo de control de cambios.

# Acta de Sprint Review y cierre del proyecto

## 1 Fecha, duración y asistentes

* **Fecha:** 22/11/2026 · **Duración:** 1 hora.
* **Product Owner:** Prof. Rudy Barboza Rodríguez.
* **Scrum Master:** Karol Miranda Mora.
* **Developers:** Karol Miranda Mora (cubículos y vista del dashboard) y Katherine Solis Ramírez (libros, consultas y reportes).

## 2 Sprint Goal y resultado

* **Sprint Goal:** entregar el sistema completo con un dashboard que reúna los indicadores principales, reportes semanales, quincenales y mensuales en PDF, y el despliegue final.
* **Resultado:** **cumplido.** Las tres historias del Sprint funcionan de principio a fin en el ambiente final.

## 3 Historias mostradas y cumplimiento de la DoD

Se mostró el sistema funcionando, en computadora y en vista móvil. No se presentó código.

| Historia | Puntos | Qué se mostró | DoD 3.0 |
| :--- | :-: | :--- | :-: |
| HU-10 Dashboard gerencial | 8 | Totales de usuarios, accesos, préstamos y uso de cubículos, con filtro por período. Los valores coincidieron con la base de datos y, sin registros, se muestra un mensaje claro. | Cumple |
| HU-11 Reportes en PDF | 5 | Se generaron y descargaron los reportes semanal, quincenal y mensual. Cada PDF abrió bien y muestra el período y la fecha de generación. | Cumple |
| TEC-05 Despliegue final | 3 | Sistema desplegado y verificado siguiendo la guía. Se entregaron la guía de uso y la documentación de configuración. | Cumple |

**Puntos terminados:** 16 de 16.

## 4 Retroalimentación y decisión del Product Owner

* El Product Owner **aceptó** el incremento del Sprint 3 y la entrega final del sistema.
* No se recibieron solicitudes nuevas en la revisión.
* Las solicitudes que quedaron diferidas en el Registro de Solicitudes de Cambio pasan a un **backlog de mantenimiento** y seguirán el mismo flujo de control de cambios.

## 5 Estado final del release

| Corte | Inicio | S1 | S2 | S3 |
| :--- | :-: | :-: | :-: | :-: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | 44 | 16 | 0 |

* **Avance:** 63 de 63 puntos terminados (100 %).
* **Velocidad:** 19 (Sprint 1), 28 (Sprint 2) y 16 (Sprint 3).
* **Cronograma:** se planearon de 3 a 4 Sprints y se terminó en 3. No se usó el Sprint 4 de reserva.
* **Costo:** con 3 Sprints, el esfuerzo quedó en el valor esperado de 90 horas-persona (rango planificado: 90 a 120).

## 6 Cierre del proyecto

### Producto entregado

| Módulo | Sprint | Qué resuelve |
| :--- | :-: | :--- |
| Usuarios y código por correo | 1 | Cada visitante queda registrado con un código único. |
| Control de acceso | 1 | El ingreso se guarda con fecha y hora, sin libro de papel. |
| Libros y lista de espera | 2 | Se controla el inventario y los libros agotados se asignan por orden de llegada. |
| Cubículos y turnos | 2 | Se sabe qué puestos están ocupados y cuánto tiempo se usan. |
| Dashboard y reportes PDF | 3 | La biblioteca tiene datos para auditorías y para justificar presupuesto y horario. |

Con esto se atiende el problema inicial: la información deja de estar en libros de papel y se pueden sacar reportes por período.

### Entregables finales

* Sistema desplegado (frontend, backend y base de datos en MongoDB Atlas).
* Guía de uso del sistema y de descarga de reportes.
* Documentación de configuración, despliegue, respaldo y recuperación.
* Expediente del Proyecto actualizado con los tres Sprints.
* Repositorio en GitHub: *(agregar enlace)*.

### Estado final de los riesgos

| ID | Riesgo | Estado al cierre |
| :-- | :-- | :-- |
| R-01 | Ausencia de una integrante | Cerrado. Los traspasos de módulos se hicieron el 17/11. |
| R-02 | Falla del correo | Cerrado. El correo funcionó desde el Sprint 1. |
| R-03 | Reglas de 24 h y turnos sin confirmar | Cerrado. HU-07 y HU-09 se aceptaron sin rehacerse. |
| R-04 | Sprint 2 sobrecargado | Cerrado. Se completaron los 28 puntos. |
| R-05 | Ambiente de despliegue no listo | Cerrado. El despliegue se verificó en este Sprint. |
| R-06 | Exposición de datos personales | Pasa a mantenimiento. Las vistas y descargas piden autenticación. |
| R-07 | Poca adopción del sistema | Pasa a la biblioteca. Se entregó la guía de uso. |
| R-08 | Internet inestable | Pasa a mantenimiento. Se mantiene el respaldo en papel como contingencia. |
| R-09 | Oportunidad: apoyo municipal | Aprovechable. Los reportes en PDF ya se pueden presentar a la municipalidad. |
| R-10 | Un cambio rompe lo ya hecho | Cerrado. Se verificó la no regresión en cada Sprint. |

### Pendientes

* No quedan defectos bloqueantes.
* Las mejoras futuras y las solicitudes diferidas se manejan en el backlog de mantenimiento.

## 7 Aceptación

| Nombre | Rol | Decisión | Fecha | Firma |
| :--- | :--- | :--- | :-: | :--- |
| Prof. Rudy Barboza Rodríguez | Product Owner | Aprobado | 22/11/2026 | |
| Karol Miranda Mora | Scrum Master y Developer | Conforme | 22/11/2026 | |
| Katherine Solis Ramírez | Developer | Conforme | 22/11/2026 | |

