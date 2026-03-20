Actúa como un Product Designer senior especializado en Design Systems escalables, herramientas tipo Storybook y plataformas SaaS para equipos de diseño y desarrollo.

Tu objetivo es diseñar una herramienta para Product Designers que funcione como un repositorio visual de Design System basado en la metodología Atomic Design (Foundations, Atoms, Molecules, Organisms).

---

🎯 OBJETIVO PRINCIPAL

Diseñar una plataforma moderna, minimalista y escalable donde los usuarios puedan explorar, visualizar y editar foundations y componentes del Design System.

---

🧱 LAYOUT GENERAL

Diseña una interfaz tipo dashboard con la siguiente estructura:

1. SIDENAV (persistente a la izquierda)

* Buscador de componentes (input de búsqueda)
* Filtros por categoría:

  * Foundations
  * Atoms
  * Molecules
  * Organisms
* Lista navegable de componentes

2. NAVBAR (superior, compacta)

* Switch para cambiar entre Light Mode y Dark Mode

3. MAIN CONTENT
   Siempre debe incluir:

* Título de la vista o componente
* Descripción breve
* Tabs (si aplica)
* Botón “Code” para ver código o JSON editable

---

🎨 ESTILO VISUAL

* Moderno
* Minimalista
* Alta legibilidad
* UI limpia tipo SaaS / developer tool
* Espaciado consistente (8pt grid)
* Uso claro de jerarquías tipográficas

---

🎨 VISTA A DISEÑAR: COLORS (FOUNDATIONS)

Diseña la vista de colores del Design System.

---

🧩 HEADER

* Title: “Colors”
* Description: “Visualiza, gestiona y edita los colores del sistema de diseño en Light y Dark Mode.”

---

🧭 TABS

Crear 3 tabs:

1. Primary Colors
2. Secondary Colors
3. Foundation Colors

---

🎨 TAB: PRIMARY COLORS

* Mostrar colores en formato Cards

* Cada color debe incluir:

  * Nombre (ej: primary-500)
  * Escala (50 a 950)
  * Preview del color
  * Código HEX (solo Light Mode)

* Permitir cambiar la visualización con un toggle:

  * Cards
  * Columns
  * Rows

---

🎨 TAB: SECONDARY COLORS

* Mismo comportamiento que Primary Colors:

  * Cards con escala 50 a 950
  * Nombre + preview + hex
  * Solo Light Mode visible

* Incluir el mismo toggle:

  * Cards / Columns / Rows

---

🎨 TAB: FOUNDATION COLORS

Mostrar colores semánticos del sistema:

Categorías:

* Background
* Text
* Border
* Buttons

---

📊 TABLA DE FOUNDATION COLORS

Diseñar una tabla comparativa con:

Columnas:

* Name
* Light Mode
* Dark Mode

Cada fila debe:

* Representar un token (ej: background-main)
* Mostrar color en Light y Dark Mode
* Incluir swatch + código HEX

---

⚙️ BOTÓN CODE

* Ubicado en el header de la vista
* Permite ver y editar los colores en formato JSON

Ejemplo de estructura esperada:

{
"color": {
"background": {
"main": {
"light": "#FFFFFF",
"dark": "#0A0A0A"
}
}
}
}

---

📈 ESCALABILIDAD

Diseña la vista pensando en crecimiento futuro:

* Soporte para nuevos tokens
* Expansión de categorías
* Integración con Design Tokens (JSON)

---

🚫 IMPORTANTE

No incluir:

* Panel de control lateral (knobs)
* Simulación de estados interactivos

(Eso se agregará en futuras vistas)

---

🧠 PRINCIPIOS UX

* Fácil de escanear
* Comparación clara entre Light y Dark Mode
* Visualización limpia
* Edición accesible

---

💡 DETALLES UX (OPCIONAL)

* Hover para copiar color
* Click para copiar HEX
* Indicadores de tipo de token

---

Entrega una interfaz clara, bien estructurada y lista para escalar como herramienta profesional de Design System.
