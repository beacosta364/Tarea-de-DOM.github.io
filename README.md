# 📅 Organizador Semanal de Tareas

Aplicación web para organizar tareas personales, laborales y académicas mediante listas personalizadas y una planificación semanal.

El proyecto permite administrar diferentes categorías de actividades, distribuir las tareas por día de la semana, añadir notas con información complementaria y realizar seguimiento de su cumplimiento desde una interfaz sencilla, intuitiva y adaptable a dispositivos móviles.

## ✨ Características

- **Listas personalizadas:** crear, renombrar y eliminar listas independientes.
- **Organización semanal:** distribuir las tareas entre lunes y domingo.
- **Gestión de tareas:** agregar, editar y eliminar tareas.
- **Cambio de día:** trasladar una tarea a otro día de la semana sin perder su información asociada.
- **Notas por tarea:** añadir, consultar, editar y eliminar notas independientes para registrar detalles, recordatorios o instrucciones adicionales.
- **Seguimiento de actividades:** marcar las tareas como completadas o pendientes.
- **Reinicio semanal:** restablecer el estado de las tareas al comenzar una nueva semana, conservando su contenido, organización y notas.
- **Persistencia local:** guardar listas, tareas, estados y notas en el navegador mediante `localStorage`.
- **Interfaz adaptable:** diseño responsive para computadores, tabletas y celulares.
- **Ventana de edición:** modificar los datos de las tareas y consultar sus notas desde una interfaz específica.

## 🛠️ Tecnologías utilizadas

- **HTML5:** estructura y contenido de la aplicación.
- **CSS3:** estilos, diseño visual, ventanas modales y adaptación a dispositivos móviles.
- **JavaScript:** lógica de la aplicación, manipulación del DOM, eventos y administración de tareas.
- **LocalStorage:** almacenamiento persistente de la información en el navegador.

## 📁 Estructura del proyecto

```text
Tarea-de-DOM.github.io/
├── index.html
├── Css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md
```

## 🚀 Cómo utilizar la aplicación

1. Accede a la aplicación desde el navegador.
2. Crea una lista con el nombre que prefieras, por ejemplo: Personal, Trabajo o Universidad.
3. Ingresa a la lista que deseas organizar.
4. Selecciona el día de la semana correspondiente.
5. Añade las tareas que necesitas realizar.
6. Marca cada tarea como completada cuando termines.
7. Utiliza la opción de edición para modificar el nombre de una tarea o cambiarla de día.
8. Añade notas para complementar las tareas con información adicional.
9. Consulta, modifica o elimina las notas cuando lo necesites.
10. Edita o elimina las tareas y listas según tus necesidades.

## 💾 Almacenamiento y conservación de datos

La aplicación utiliza `localStorage` para guardar las listas, tareas, estados de cumplimiento y notas directamente en el navegador del usuario.

- Los datos permanecen guardados después de cerrar o recargar la página.
- Las actualizaciones de la interfaz y de las funcionalidades están diseñadas para conservar la información existente, siempre que se mantenga la compatibilidad con la estructura de datos almacenada.
- Al comenzar una nueva semana, se reinicia el estado de cumplimiento de las tareas según la lógica de la aplicación, sin eliminar su contenido ni sus notas.
- La información no se sincroniza automáticamente entre diferentes dispositivos, navegadores o perfiles.
- Si se borran los datos del sitio en el navegador, se pierde el acceso a la información almacenada localmente, salvo que exista una copia de seguridad.

**Importante:** se recomienda implementar y utilizar copias de seguridad periódicas antes de realizar cambios importantes o limpiar los datos del navegador.

## 🎨 Diseño

La interfaz utiliza una paleta de colores basada en azul marino, cian, gris y blanco, con tarjetas, botones y elementos visuales diseñados para ofrecer una experiencia clara y organizada.

El diseño responsive adapta la distribución de los elementos según el tamaño de la pantalla. Las ventanas modales permiten editar tareas y consultar notas sin recargar la página.

## 📌 Próximas mejoras

- Incorporar fechas específicas y fechas límite para las tareas.
- Añadir filtros y búsqueda de tareas.
- Mostrar estadísticas de tareas completadas y pendientes.
- Implementar la exportación e importación de copias de seguridad.
- Incorporar sincronización entre dispositivos mediante una base de datos y un backend.

## 👨‍💻 Autor

**Brayan Estein Acosta Achinte**

Desarrollado como proyecto personal para practicar y aplicar conocimientos de desarrollo web frontend, manipulación del DOM, manejo de eventos, almacenamiento local y diseño de interfaces adaptables.

---

**Estado del proyecto:** funcional y en desarrollo.