# Registro de Solicitudes de Cambio y Working Agreements

**Proyecto:** Aplicación web para la biblioteca de Ciudad Quesada
**Curso:** ISW-912 Administración de Proyectos Informáticos · Semana 10
**Equipo:** Katherine Solis Ramirez · Karol Miranda Mora
**Fecha:** 18/11/2026

---

## 1. Registro de Solicitudes de Cambio

### 1.1 Flujo de un cambio

1. **Solicitante:** cualquier interesado (encargada de la biblioteca, profesor, o una persona del equipo) presenta la solicitud por escrito, con descripción y justificación.
2. **Evaluación:** el equipo estima el impacto en alcance, tiempo, costo y riesgo, en puntos de historia, y ve cómo afecta el release.
3. **Decisión:** el Product Owner aprueba, difiere o rechaza, y justifica. Si el cambio es urgente y afecta el Sprint Goal, se negocia qué sale del Sprint para que entre.
4. **Registro:** se anota en la tabla de abajo el mismo día de la decisión y el resultado se comunica en la siguiente Sprint Review.

### 1.2 Tabla de solicitudes

| ID | Fecha | Solicitante | Descripción | Impacto (alcance · tiempo · costo · riesgo) | Decisión y justificación | Responsable | Entra en |
|----|-------|-------------|-------------|---------------------------------------------|--------------------------|-------------|----------|
| CR-01 | 12/11 | Encargada de la biblioteca | Agregar al panel de reportes un reporte mensual de préstamos de libros por categoría | +5 pts · sin Sprint extra · costo bajo (sin gasto nuevo) · riesgo bajo | **Aprobado.** Aprovecha datos que el módulo de libros ya guarda y aporta valor directo a la biblioteca | Product Owner | Sprint 3 |
| CR-02 | 14/11 | Encargada de la biblioteca | Resaltar en la lista de espera de 24 h a la persona a la que le toca el turno, para que el bibliotecario la llame | +3 pts · sin Sprint extra · costo bajo · riesgo bajo | **Diferido al Sprint 4.** Es un cambio simple, pero el Sprint 3 ya está completo con CR-01 | Product Owner | Sprint 4 |
| CR-03 | 16/11 | Compañero de otro equipo | Reemplazar el código de usuario por reconocimiento facial en el acceso | +40 pts · +2 Sprints · costo alto · riesgo alto (datos biométricos y equipo que la biblioteca no tiene) | **Rechazado.** Contradice la restricción de bajo costo y protección de datos personales | Product Owner | No se realizará |

> Los puntos son estimaciones del equipo y deben ajustarse a la escala usada en la Matriz de Estimación.

---

## 2. Working Agreements

Fecha de revisión: se actualizan en cada Sprint Retrospective. Próxima revisión: Retrospective del Sprint 2.

| # | Categoría | Acuerdo | Cómo se verifica | Puño de cinco |
|---|-----------|---------|------------------|---------------|
| 1 | Comunicación | Usamos WhatsApp como canal oficial y respondemos en menos de 12 horas en días hábiles | Mensajes sin responder después de 12 h | 4 / 4 |
| 2 | Comunicación | Todo acuerdo que cambie alcance, fechas o reparto se deja por escrito en el Expediente del Proyecto | Existe el commit o la entrada en el historial | 4 / 5 |
| 3 | Ritmo de trabajo | Hacemos el Daily a la misma hora acordada y avisamos antes si no podemos llegar | Asistencia registrada en el tablero | 4 / 4 |
| 4 | Ritmo de trabajo | Si una tarjeta lleva más de 2 días en progreso, la hablamos en el Daily | Tarjetas con más de 2 días revisadas en el Daily | 4 / 4 |
| 5 | Calidad | Revisamos el Pull Request de la otra persona en menos de 24 horas | Fecha de apertura y de revisión en GitHub | 3 / 3 |
| 6 | Calidad | Movemos una tarjeta a Hecho solo cuando cumple la Definición de Terminado | Lista de verificación del DoD marcada | 4 / 4 |
| 7 | Decisiones | Decidimos por consenso y probamos con puño de cinco; si no hay acuerdo en una conversación, decide quien es dueño del módulo | Registro del resultado en el acta | 4 / 4 |
| 8 | Conflictos | Planteamos un desacuerdo con hechos observables, en privado y dentro de las 24 horas siguientes | Conversación realizada y anotada | 3 / 4 |
| 9 | Conflictos | Si un desacuerdo no se resuelve en 2 días, lo llevamos al Product Owner o al profesor | Escalamiento registrado | 3 / 3 |
| 10 | Cambios | Evaluamos y registramos toda solicitud de cambio antes de aceptarla, y protegemos el Sprint Goal: un cambio urgente entra solo si negociamos qué sale del Sprint | Entrada en el Registro de Solicitudes de Cambio | 4 / 5 |


## 3. Historial de cambios del documento

| Versión | Fecha | Autor | Cambio |
|---------|-------|-------|--------|
| 1.0 | 18/11/2026 | Equipo de K y K | Creación del Registro de Solicitudes de Cambio y de los Working Agreements |