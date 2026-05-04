# Spec — Arquitectura y estándar del sistema (React / Vite)

Define la **arquitectura objetivo** y los **estándares estructurales** para la aplicación del design system en **`desarrollo-listo/`** (**React 18 + Vite + React Router**). Complementa **`Spec/proyect.md`**, **`Spec/arquitectura-visual-ui.md`** (UI) y **`Spec/api.md`** (red / datos remotos).

---

## 1. Principios

1. **Separación por capas:** la UI de catálogo no arma URLs ni parsea JSON de API a mano en cada vista; la capa de red no contiene JSX de página salvo loaders mínimos acordados.
2. **Una responsabilidad por archivo** cuando el tamaño crezca: extraer hooks, helpers y subcomponentes en lugar de vistas de >400 líneas.
3. **Reutilización:** primitivos en `components/ui/`; lógica compartida en `lib/` o `utils/`; sin copiar bloques entre `*-view.tsx`.
4. **Idioma React:** hooks, composición, `key` estables en listas, efectos con dependencias correctas; evitar estado derivado duplicado.
5. **Evolución trazable:** desviaciones de esta spec se documentan en PR o ADR breve.

---

## 2. Modelo de capas (ideal)

Flujo de dependencias recomendado (**hacia abajo**):

```
┌─────────────────────────────────────────┐
│  Shell / rutas (DashboardLayout, Router)│
├─────────────────────────────────────────┤
│  Vistas de catálogo (*-view.tsx)        │  ← orquestan layout + panel controles
├─────────────────────────────────────────┤
│  UI reutilizable (components/ui, …)    │  ← sin fetch a APIs de negocio
├─────────────────────────────────────────┤
│  Hooks de datos / estado local          │  ← useXxx que llaman a lib/api
├─────────────────────────────────────────┤
│  Capa API (lib/api) — Spec/api.md       │  ← fetch, tipos, errores
├─────────────────────────────────────────┤
│  Datos estáticos / build (data/, imports)│
└─────────────────────────────────────────┘
```

**Reglas:**

- Las vistas **`*-view.tsx`** pueden usar estado local y contexto ya existente (`ControlsPanelProvider`, `ThemeProvider`); **no** deben convertirse en capa global de red dispersa.
- **`components/ui/`** no importa desde vistas de catálogo de alto nivel (evitar ciclos).
- **`lib/api/`** (o convención equivalente documentada) **no** importa componentes con JSX.

---

## 3. Estructura de carpetas (`desarrollo-listo/src/`)

| Ruta actual / recomendada | Contenido |
|---------------------------|-----------|
| **`app/App.tsx`**, **`app/routes.tsx`** | Bootstrap y definición de rutas. |
| **`app/nav/`** | Configuración única de navegación Atomic (p. ej. `categories.ts`) compartida por sidebar y metadatos de módulo. |
| **`app/components/`** | Layout (`dashboard-layout`, `navbar`, `sidebar`), vistas `*-view.tsx`, controles del playground, `theme-provider`, etc. |
| **`app/components/ui/`** | Primitivos (Radix/shadcn-like). Sin llamadas HTTP de negocio. |
| **`app/utils/`** | Funciones puras, parsers, helpers sin efectos de red. |
| **`app/data/`** | JSON generados o catálogos locales (p. ej. flags). |
| **`app/lib/api/`** | Cliente HTTP compartido (`fetch`), errores tipados, funciones por recurso — ver **`Spec/api.md`**. |
| **`app/lib/`** | Otros módulos sin UI (helpers de dominio) si hiciera falta; **no** duplicar URLs fuera de `lib/api/`. |
| **`app/hooks/`** | *(Opcional)* Hooks reutilizables (`useMediaQuery`, hooks de datos que envuelvan `lib/api`). |
| **`imports/`** | Tokens y artefactos Figma (JSON). |
| **`styles/`** | CSS global, Tailwind, `theme.css`. |

**Code splitting:** usar `React.lazy` + `Suspense` en rutas pesadas cuando el bundle lo justifique (alineado a priorizar performance).

### 3.1 Mapeo con Atomic Design

| Atomic | Ubicación típica en React |
|--------|---------------------------|
| Foundations | Vistas + `styles/` + `imports/` |
| Átomos | `components/ui/` |
| Moléculas / organismos | `components/` (compuestos) o subcarpetas por dominio bajo `components/` |

---

## 4. Estándares técnicos (React)

### 4.1 Componentes

- Preferir **funciones** y hooks; props tipadas (TypeScript).
- **Presentacional vs contenedor:** el contenedor (vista) conecta datos y handlers; subcomponentes reciben props claras.
- Evitar **prop drilling** profundo: `Context` acotado (como el panel de controles) o composición.

### 4.2 Estado

- Estado local con **`useState` / `useReducer`** cuando baste.
- Estado compartido de UI: **Context** existente o nuevos contextos acotados por feature.
- Si se introduce **TanStack Query** u otra lib: documentar en esta spec y en **`Spec/api.md`**.

### 4.3 Rutas

- **`react-router`** como fuente de verdad; rutas sincronizadas con **`sidebar.tsx`**.
- Layout anidado vía `DashboardLayout` + `<Outlet />`.

### 4.4 Estilos

- Tailwind + tokens en **`theme.css`**; seguir **`Spec/arquitectura-visual-ui.md`**.

### 4.5 Testing

- **Vitest** + **Testing Library** para componentes y hooks cuando existan tests; mocks de red según **`Spec/api.md`**.

---

## 5. Integración con otras specs

| Spec | Relación |
|------|----------|
| **`Spec/proyect.md`** | Mapa repo (§5), SDD (§6). |
| **`Spec/arquitectura-visual-ui.md`** | Layout, panel, tokens visuales. |
| **`Spec/api.md`** | Contrato HTTP y convenciones de cliente en React. |

---

## 6. Checklist de revisión arquitectónica (React)

- [ ] Sin `fetch` disperso en `components/ui/` salvo excepción documentada.
- [ ] Rutas y sidebar alineados.
- [ ] Nuevas carpetas bajo `app/` reflejadas en esta spec si son patrón transversal.
- [ ] Build `npm run build` OK tras cambios estructurales.

---

*Documento vivo: al adoptar **Nx**, **RSPack** o empaquetado de librería compartida, añadir subsección.*
