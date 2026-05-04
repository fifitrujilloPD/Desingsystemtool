Actúa como un Product Designer senior especializado en Design Systems, tipografía avanzada y herramientas interactivas tipo Storybook y Dev Mode.

Estamos construyendo la sección de **Typography (Foundations)** dentro de un Design System Explorer basado en Atomic Design.

---

🎯 OBJETIVO

Diseñar una vista de tipografía interactiva que permita visualizar, explorar y editar los estilos tipográficos del sistema utilizando los tokens definidos en el JSON.

---

⚠️ REGLAS CRÍTICAS

* Usar exclusivamente los **tokens JSON proporcionados**
* No inventar valores (font-size, font-weight, font-family, colores, etc.)
* Toda la visualización debe derivarse de los tokens

---

🧱 LAYOUT BASE

👉 Seguir exactamente la misma línea de layout y estructura que se ha venido utilizando en las vistas anteriores (Colors e Icons), manteniendo consistencia visual y estructural.

Incluir:

* Sidenav izquierda (navegación)
* Navbar superior (switch Light/Dark)
* Main content
* Right panel (panel de control interactivo)

---

🎨 VISTA: TYPOGRAPHY

---

🧩 HEADER

* Title: “Typography”
* Description:
  “Explora y edita los estilos tipográficos del sistema en tiempo real.”

---

🧠 ESTRUCTURA PRINCIPAL

La vista debe mostrar una jerarquía tipográfica clara como:

* H1
* H2
* H3

Siguiendo una estructura visual como la referencia (lista vertical, limpia y escaneable).

---

🔤 TYPOGRAPHY SHOWCASE

Para cada nivel (H1, H2, H3):

Mostrar:

* Nombre del estilo (ej: H1)
* Token asociado (ej: fs-h1)
* Ejemplo visual del texto (ej: “Heading 1”)

Debajo o junto al ejemplo, mostrar:

* Font size (según token)
* Line height (según token)
* Equivalente en rem (si aplica)

---

⚖️ VARIANTES DE PESO

Cada nivel tipográfico debe poder visualizarse en:

* Regular
* Medium
* Semibold
* Bold

Estas variantes deben actualizar el mismo texto en tiempo real.

---

🧪 TEXTO EDITABLE

* Permitir editar el contenido del texto directamente
* El usuario debe poder escribir:

  * Títulos
  * Descripciones
* El preview debe actualizarse en tiempo real

---

🎛️ RIGHT PANEL (CONTROL PANEL)

Agregar controles para modificar la tipografía:

---

1. FONT SIZE

* Mostrar únicamente los tamaños disponibles desde tokens

---

2. FONT SIZE (TOKENS JSON)

* Selector de tamaños tipográficos definidos en el JSON
* Debe listar únicamente los valores disponibles en los tokens

---

3. FONT FAMILY

* Selector basado en tokens disponibles

---

4. COLOR

* Selector basado únicamente en:

  * Tokens de color tipo **text** del JSON

---

🎯 COMPORTAMIENTO

* Todos los cambios deben reflejarse en tiempo real
* Mantener consistencia visual con el Design System
* La experiencia debe ser clara, editable y fácil de escanear

---

🎨 ESTILO VISUAL

* Minimalista
* Limpio
* Enfocado en legibilidad
* Consistente con las vistas anteriores
* Similar a una tabla + preview tipográfico (como la referencia)

---

🎯 RESULTADO ESPERADO

Una vista donde el usuario pueda:

* Ver la jerarquía tipográfica (H1, H2, H3)
* Explorar sus variantes de peso
* Editar el contenido del texto
* Modificar propiedades desde el panel de control
* Entender cómo funcionan los tokens tipográficos en el sistema
