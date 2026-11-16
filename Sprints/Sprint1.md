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

# Matriz de Estimación
 
* **Escala:** Fibonacci (1, 2, 3, 5, 8, 13). Los puntos miden tamaño relativo, no horas.
* **Historia de referencia (3 puntos):** HU-02 Edición de usuarios.
* **Velocidad inicial:** 22 puntos por Sprint (rango supuesto: mínima 18, máxima 28), basada en la capacidad del equipo con trabajo en paralelo por módulos. Tras cada Sprint se reemplaza por la velocidad real y se revisa en la Retrospectiva.
| ID | Historia | Épica | Puntos | Prioridad | Dependencias |
| :--- | :--- | :--- | :---: | :---: | :--- |
| TEC-00 | Preparación técnica (TEC-01 a TEC-04: repositorio, ambiente, base de datos, diseño base) | Técnica | 3 | Alta | - |
| HU-01 | Registro de usuarios con código único | Registro | 5 | Alta | TEC-00 |
| HU-02 | Edición de usuarios (**referencia**) | Registro | 3 | Alta | HU-01 |
| HU-03 | Código de usuario por correo | Registro | 5 | Alta | HU-01 |
| HU-04 | Control de acceso mediante código (check-in) | Acceso | 3 | Alta | HU-01 |
| HU-05 | Catálogo de libros | Libros | 5 | Media | TEC-00 |
| HU-06 | Préstamo y devolución de libros | Libros | 5 | Alta | HU-01, HU-05 |
| HU-07 | Lista de espera de 24 horas | Libros | 8 | Media | HU-06 |
| HU-08 | Préstamo de cubículos | Cubículos | 5 | Alta | HU-01 |
| HU-09 | Control de tiempo por turno | Cubículos | 5 | Media | HU-08 |
| HU-10 | Dashboard de consulta | Dashboard | 8 | Media | HU-04, HU-06, HU-08 |
| HU-11 | Reportes semanal, quincenal y mensual | Dashboard | 5 | Media | HU-10 |
| TEC-05 | Despliegue final | Técnica | 3 | Alta | Todas |
| | **Total** | | **63** | | |
 
**Por épica:** Registro 13 · Acceso 3 · Libros 18 · Cubículos 10 · Dashboard 13 · Técnica 6.
 
**Historias para dividir:** ninguna pasa de 8. Si HU-07 o HU-10 generan desacuerdo en el planning poker, se dividen.
 
**Supuestos y riesgos:**
1. No hay historial de velocidad; todo se estima por comparación con HU-02.
2. Somos dos personas: una ausencia reduce mucho la capacidad.
3. El correo saliente (HU-03) es la mayor incertidumbre.
4. Las reglas de las 24 horas y de los turnos se validan con el cliente.
---

## Matriz de Riesgos (Registro de Riesgos)
 
| ID | Descripción (si ocurre X, entonces Y) | Categoría | Tipo | P | I | Puntaje | Prioridad | Dueño |
| :-- | :-- | :-- | :-- | :-: | :-: | :-: | :-- | :-- |
| R-01 | Si una de las dos integrantes se ausenta o se satura con otros cursos, entonces la capacidad del equipo baja a la mitad y el módulo que solo ella conoce se detiene. | Equipo | Amenaza | 3 | 3 | 9 | **Alta prioridad** | Karol |
| R-02 | Si el correo saliente no llega o cae en spam, entonces el usuario no recibe su código (HU-03) y no puede hacer el check-in. | Tercero | Amenaza | 3 | 2 | 6 | **Alta prioridad** | Katherine |
| R-03 | Si el bibliotecario cambia o no confirma las reglas de la lista de espera de 24 horas y los turnos de cubículos, entonces HU-07 y HU-09 se rehacen. | Alcance | Amenaza | 3 | 2 | 6 | **Alta prioridad** | Karol |
| R-04 | Si el Sprint 2 (28 puntos, la velocidad máxima supuesta) no se completa, entonces el Dashboard se atrasa y se consume la reserva del Sprint 4. | Alcance | Amenaza | 3 | 2 | 6 | **Alta prioridad** | Katherine |
| R-05 | Si soporte técnico no tiene listo el ambiente o no responde a tiempo, entonces el despliegue final (TEC-05) se atrasa. | Tercero | Amenaza | 2 | 3 | 6 | **Alta prioridad** | Katherine |
| R-06 | Si los datos personales (cédula, edad, dirección) se exponen o se guardan sin protección, entonces hay un problema legal y se pierde la confianza de los usuarios. | Negocio | Amenaza | 1 | 3 | 3 | Vigilar | Katherine |
| R-07 | Si el personal de apoyo sigue usando el libro de papel o los usuarios olvidan su código, entonces los datos del sistema quedan incompletos y los reportes pierden valor. | Negocio | Amenaza | 2 | 2 | 4 | Vigilar | Karol |
| R-08 | Si la biblioteca tiene internet inestable, entonces el check-in y los préstamos fallan en el momento de atención. | Técnico | Amenaza | 2 | 2 | 4 | Vigilar | Karol |
| R-09 | Si los reportes se presentan a la administración municipal a tiempo, entonces puede apoyar el presupuesto y el horario de la biblioteca. | Negocio | **Oportunidad** | 2 | 2 | 4 | Vigilar | Karol |
| R-10 | Si un cambio en el modelo de datos (por ejemplo, para préstamos) rompe lo ya hecho en usuarios y acceso, entonces se pierde tiempo corrigiendo. | Técnico | Amenaza | 1 | 2 | 2 | Aceptar | Katherine |
 
---
 
## 3. Mapa de calor
 
| | Impacto bajo (1) | Impacto medio (2) | Impacto alto (3) |
| :-- | :--: | :--: | :--: |
| **Prob. alta (3)** | Vigilar<br>— | **Alta prioridad**<br>R-02 · R-03 · R-04 | **Alta prioridad**<br>R-01 |
| **Prob. media (2)** | Aceptar<br>— | Vigilar<br>R-07 · R-08 · R-09 (oportunidad) | **Alta prioridad**<br>R-05 |
| **Prob. baja (1)** | Aceptar<br>— | Aceptar<br>R-10 | Vigilar<br>R-06 |
 
# Plan de Mitigación
 
## Riesgos de alta prioridad (zona roja)
 
### R-01 · Ausencia o saturación de una integrante (dueño: Karol)
 
* **Estrategia:** mitigar.
* **Acciones:** traspaso de 30 min de cada módulo a la otra integrante (MIT-01 libros, MIT-02 cubículos) y 20 % de holgura al planificar.
* **Disparador:** no responde en 24 h hábiles, o una historia pasa más de 3 días en "En progreso" sin avance.
* **Contingencia / respaldo:** la otra toma solo historias de prioridad Alta; si la ausencia pasa de una semana, se reduce el alcance con el Product Owner.
* **Revisión y riesgo residual:** Planning Sprint 3 (16/11) · medio.
### R-02 · Falla del correo saliente (dueña: Katherine)
 
* **Estrategia:** mitigar.
* **Acciones:** prueba corta de 1 día con 3 cuentas reales (MIT-03) e interfaz propia `EnvioCorreo` para cambiar de proveedor (MIT-04).
* **Disparador:** el correo no llega o cae en spam en 2 de 3 cuentas, o se alcanza el límite de envíos.
* **Contingencia / respaldo:** usar el correo de la municipalidad; si no, imprimir el código en un comprobante.
* **Revisión y riesgo residual:** al terminar la prueba · bajo.
### R-03 · Reglas de 24 horas y turnos sin validar (dueño: Karol)
 
* **Estrategia:** mitigar.
* **Acciones:** confirmar las reglas por escrito con el bibliotecario y anotarlas en los criterios de aceptación de HU-07 y HU-09 (MIT-05).
* **Disparador:** el bibliotecario no confirma antes de iniciar la historia o pide cambios en la demo.
* **Contingencia / respaldo:** construir primero una versión mínima con valores configurables; si no, pasar la historia al Sprint 4.
* **Revisión y riesgo residual:** antes del Planning del Sprint 3 · bajo.
### R-04 · Sprint 2 sobrecargado (dueña: Katherine)
 
* **Estrategia:** evitar.
* **Acciones:** planificar con 22 puntos, no 28, y mover HU-07 o HU-09 al Sprint 3 (MIT-06).
* **Disparador:** a mitad de Sprint los puntos pendientes reales superan los ideales del burndown.
* **Contingencia / respaldo:** usar el Sprint 4 de reserva; si no alcanza, recortar el alcance de reportes.
* **Revisión y riesgo residual:** cada corte del burndown · medio.
### R-05 · Soporte técnico no listo para el despliegue (dueña: Katherine)
 
* **Estrategia:** mitigar.
* **Acciones:** enviar requisitos y fecha por correo y pedir un despliegue de prueba antes del cierre (MIT-07).
* **Disparador:** sin respuesta en 3 días hábiles, o sin acceso al servidor al iniciar el Sprint 3.
* **Contingencia / respaldo:** escalar con el Product Owner; si no hay servidor, instalar en una computadora de la biblioteca.
* **Revisión y riesgo residual:** inicio del Sprint 3 y 30/11 · medio.
---
 
## Riesgos a vigilar (zona amarilla)
 
### R-06 · Datos personales expuestos (dueña: Katherine)
 
* **Estrategia:** mitigar.
* **Acciones:** pedir solo los datos necesarios, mostrar la cédula parcialmente, acceso por rol y conexión segura (MIT-08). Confirmar con el Product Owner si aplica la Ley 8968.
* **Disparador:** un usuario reclama por sus datos o se ve información sensible sin permiso.
* **Contingencia / respaldo:** quitar el acceso afectado de inmediato y avisar al Product Owner.
* **Revisión y riesgo residual:** Retrospectiva (22/11) · bajo.
### R-07 · El personal o los usuarios no adoptan el sistema (dueño: Karol)
 
* **Estrategia:** mitigar.
* **Acciones:** capacitación breve al personal de apoyo y aviso impreso para usuarios sobre su código (MIT-09).
* **Disparador:** más de 3 visitas al día sin registro en el sistema.
* **Contingencia / respaldo:** buscar al usuario por cédula si olvidó su código (consultar con el Product Owner); si no, anotar en papel y digitar después.
* **Revisión y riesgo residual:** final de Sprints 2 y 3 · medio.
### R-08 · Internet inestable en la biblioteca (dueño: Karol)
 
* **Estrategia:** mitigar.
* **Acciones:** probar el check-in y los préstamos en la red real de la biblioteca (MIT-10).
* **Disparador:** el check-in tarda más de unos segundos o se cae durante una prueba.
* **Contingencia / respaldo:** anotar temporalmente en papel y digitar cuando vuelva la conexión.
* **Revisión y riesgo residual:** demo de cada Sprint · medio.
### R-09 · Oportunidad: apoyo de la administración municipal (dueño: Karol)
 
* **Estrategia:** mejorar (aumentar su probabilidad).
* **Acciones:** enviar a la administración un resumen de una página al cierre del Sprint 2 y al despliegue, como indica el Plan de Comunicaciones (MIT-11).
* **Disparador:** la administración pide datos de uso o de presupuesto.
* **Contingencia / respaldo:** presentar los datos disponibles del Dashboard aunque estén incompletos.
* **Revisión y riesgo residual:** cierre del Sprint 2 · no aplica.
---
 
## Riesgo a aceptar (zona verde)
 
### R-10 · Cambio de esquema rompe lo ya hecho (dueña: Katherine)
 
* **Estrategia:** aceptar con vigilancia.
* **Acciones:** sin ítem nuevo; la DoD ya exige no regresión y pruebas de integración, y todo cambio al esquema pasa por Pull Request revisado.
* **Disparador:** una prueba previa falla después de un cambio de esquema.
* **Contingencia / respaldo:** revertir el cambio y corregirlo en una rama aparte.
* **Revisión y riesgo residual:** cada Pull Request · bajo.
---
 
## Acciones para el Sprint Backlog
 
| ID | Acción | Riesgo | Responsable |
| :-- | :-- | :-- | :-- |
| MIT-01 | Traspaso del módulo de libros | R-01 | Katherine |
| MIT-02 | Traspaso del módulo de cubículos | R-01 | Karol |
| MIT-03 | Prueba corta del correo saliente (1 día) | R-02 | Katherine |
| MIT-04 | Interfaz `EnvioCorreo` | R-02 | Katherine |
| MIT-05 | Validación escrita de reglas de 24 h y turnos | R-03 | Karol |
| MIT-06 | Replanificar Sprint 2 | R-04 | Katherine |
| MIT-07 | Correo a soporte técnico y despliegue de prueba | R-05 | Katherine |
| MIT-08 | Protección de datos personales | R-06 | Katherine |
| MIT-09 | Capacitación al personal y aviso a usuarios | R-07 | Karol |
| MIT-10 | Prueba en la red de la biblioteca | R-08 | Karol |
| MIT-11 | Resumen de una página para la administración | R-09 | Karol |
 
---
 
## Adquisiciones críticas
 
* **Correo saliente (HU-03):** proveedor por definir con MIT-03 (plan gratuito) o servidor municipal · términos de uso, sin contrato de precio fijo ni de tiempo y materiales · salida: cambiar de proveedor desde `EnvioCorreo`.
* **Ambiente de despliegue (TEC-05):** soporte técnico de la municipalidad · sin costo, acuerdo por correo · salida: instalación local en la biblioteca.
* **GitHub y Trello:** plan gratuito · términos de uso · salida: clonar el repositorio y exportar el tablero cada Sprint.

 ---

# Cronograma de Entregas (Release Plan)
 
* **Duración del Sprint:** 1 semana (el Sprint 1 cierra el 08/11 con dos Incrementos). **Inicio del Sprint 1:** 12/10/2026. **Cierre del proyecto:** 04/12/2026 *(ajustar)*.
* **Sprints necesarios:** 63 ÷ 22 = 2,9 → **3 Sprints** esperados. Con velocidad máxima (28): 63 ÷ 28 = 2,3 → 3. Con la mínima (18): 63 ÷ 18 = 3,5 → 4. **Rango: 3 a 4 Sprints.**
| Sprint | Fechas | Incremento | Historias | Puntos |
| :---: | :--- | :--- | :--- | :---: |
| 1 | 12/10 – 08/11 | Módulo de usuarios: registro, edición, código por correo y control de acceso (Incrementos 1.1 y 1.2) | TEC-00, HU-01 a HU-04 | 19 |
| 2 | 09/11 – 15/11 | Módulos completos de préstamo de libros y de cubículos | HU-05 a HU-09 | 28 |
| 3 | 16/11 – 22/11 | Dashboard, reportes y despliegue | HU-10, HU-11, TEC-05 | 16 |
| 4 (reserva) | 23/11 – 29/11 | Solo si el Sprint 2 no se completa o la velocidad es la mínima | Pendientes | - |
 
* **Incrementos del Sprint 1:**
  1. **Incremento 1.1 (18/10/2026):** backend del módulo de usuarios (registro, edición y control de acceso), con guía para el frontend.
  2. **Incremento 1.2 (08/11/2026, estimado):** frontend del módulo de usuarios (registro, edición y check-in), correo con el código (HU-03) y pruebas. Aquí se cumple el DoD completo.
* **Orden de trabajo del Sprint 2** (por dependencias, en paralelo):
  1. **Incremento 2.1, préstamo de libros (Katherine):** HU-05 catálogo (hasta 11/11) → HU-06 préstamo y devolución (hasta 13/11) → HU-07 lista de espera de 24 horas (hasta 15/11).
  2. **Incremento 2.2, préstamo de cubículos (Karol):** HU-08 préstamo (hasta 12/11) → HU-09 control de tiempo por turno (hasta 15/11).
* **Margen:** el release esperado termina el 22/11 y el peor caso el 29/11, con la semana del 30/11 al 04/12 libre para la documentación final y la entrega.
* **Hitos:** demo con el Product Owner al final de cada Sprint; aviso a soporte técnico al iniciar el Sprint 2; despliegue al final del Sprint 3.
* **Costo:** 30 horas-persona por Sprint *(2 personas × 15 h, ajustar)*. Release esperado: 90 horas; rango: 90 a 120 horas.

* **Seguimiento (burndown del release):**
| Corte | Inicio | S1 | S2 | S3 |
| :--- | :---: | :---: | :---: | :---: |
| Pendientes (ideal) | 63 | 44 | 16 | 0 |
| Pendientes (real) | 63 | | | |

# Plan de Comunicaciones
 
| Interesado | Poder | Interés | Qué necesita | Frecuencia / evento | Canal | Responsable |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| Prof. Rudy Barboza (docente y Product Owner) | Alto | Alto | Avance, decisiones de alcance, impedimentos | Cada Sprint (Revisión) y en clase | Clase y correo institucional | Katherine |
| Bibliotecario/a (cliente del caso) | Alto | Alto | Demo de flujos y validación de reglas | Final de cada Sprint | Demo y correo | Karol |
| Administración municipal | Alto | Bajo | Resumen de una página del avance | Cierre de Sprint 2 y despliegue | Correo | Karol |
| Soporte técnico | Alto | Bajo | Requisitos de despliegue y correo saliente | Inicio del Sprint 2 y ante cambios | Correo | Katherine |
| Personal de apoyo | Bajo | Alto | Cómo usar check-in y préstamos | Final de Sprints 2 y 3 | Presencial | Karol |
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
| Usuarios y acceso (registro, edición, correo, check-in) | HU-01 a HU-04 | Backend: Katherine · Frontend: Karol |
| Préstamo de libros | HU-05, HU-06, HU-07 | Katherine (completo) |
| Préstamo de cubículos | HU-08, HU-09 | Karol (completo) |
| Dashboard y reportes | HU-10, HU-11 | Ambas, mitad y mitad |
 
Cada Pull Request lo revisa la otra integrante.
 
* **Herramienta:** Trello. **Enlace:** [Tablero de trabajo](https://trello.com/b/6aebddcac8243401d84573a9)
| Columna | Significado | WIP máx. |
| :--- | :--- | :---: |
| Por hacer | Historias del Sprint Backlog 1 en orden de prioridad | - |
| En progreso | Se está programando o diseñando | 2 |
| En revisión | Pull Request esperando a la compañera | 2 |
| En pruebas | Pruebas en el ambiente de pruebas (computadora y móvil) | 2 |
| Hecho | Cumple el DoD | - |
 
**Justificación del WIP:** una historia por integrante en progreso, para terminar más y empezar menos.
 
**Regla para pasar a "Hecho"** (DoD 1.0): Pull Request aprobado por la compañera, pruebas superadas, persistencia verificada en la base de datos, funciona en computadora y móvil, y visto bueno del Product Owner.
 
| ID | Historia | Puntos | Responsable | Columna |
| :--- | :--- | :---: | :--- | :--- |
| TEC-00 | Preparación técnica | 3 | Karol y Katherine | Hecho |
| HU-01 | Registro con código único | 5 | Backend: Katherine · Frontend: Karol | En progreso |
| HU-02 | Edición de usuarios | 3 | Backend: Katherine · Frontend: Karol | En revisión |
| HU-03 | Código por correo | 5 | Backend: Katherine · Plantilla: Karol | En progreso |
| HU-04 | Control de acceso (check-in) | 3 | Backend: Katherine · Frontend: Karol | En progreso |