<div style="min-height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; page-break-after: always;">

<p style="margin: 0 0 0.8rem; font-size: 1.3em;"><strong>UNIVERSIDAD TÉCNICA NACIONAL</strong></p>
<p style="margin: 0 0 1.8rem; font-size: 1.3em;"><strong>SEDE SAN CARLOS</strong></p>

<img src="Images/LogoU.png" alt="LogoU" width="170" />

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

## Planificación del primer Sprint

La primera tarea a desarrollar será el módulo 1, correspondiente al registro de usuarios, ya que es el punto de partida del sistema. Los demás módulos, como acceso, préstamos y dashboard, están interconectados y dependen de la información registrada en este primer módulo.

- **Duración:** 2 semanas.
- **Objetivo:** Desarrollar el registro de usuarios y el acceso mediante un código único de usuario enviado por correo, para ser usado al loguear el ingreso.

### Historias a trabajar:
1. Registrar usuarios con sus datos y generar un código automáticamente.
2. Editar la información de los usuarios.
3. Enviar el código de usuario por correo.
4. Registrar el ingreso a la biblioteca mediante el código y guardar la hora.

- **Fuera del Sprint (para los siguientes sprints):** Préstamos de libros, préstamos de cubículos y dashboard.
- **Criterio de terminado:** Debe ser funcional, no presentar errores, guardar correctamente los datos.

## Pendientes del documento

- Definir si los reportes del dashboard serán en PDF, Excel o ambos.

## Mecanismo de seguimiento diario

Para darle seguimiento al Sprint, el equipo realizará una reunión corta diaria para revisar el avance de las tareas. Cada integrante comentará qué realizó, qué tiene pendiente y si encontró algún problema que pueda afectar el trabajo.

Se utilizará un tablero con tres estados:
- **Pendiente:** tareas que todavía no se han iniciado.
- **En proceso:** tareas que se están trabajando.
- **Terminado:** tareas que ya fueron completadas y probadas.
