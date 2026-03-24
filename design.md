# NeveraSmart — Diseño de Interfaz Móvil

## Concepto
App para gestionar los alimentos del hogar: registrar lo que tienes en la nevera/despensa, recibir alertas de vencimiento, generar listas de compras inteligentes y descubrir recetas con los ingredientes disponibles.

## Paleta de Colores
- **Primary**: `#2ECC71` (verde fresco — frescura, naturaleza, alimentos)
- **Secondary**: `#F39C12` (naranja cálido — apetito, energía)
- **Background light**: `#FAFDF7`
- **Background dark**: `#0F1A0F`
- **Surface light**: `#FFFFFF`
- **Surface dark**: `#1A2E1A`
- **Foreground light**: `#1A2E1A`
- **Foreground dark**: `#E8F5E8`
- **Muted light**: `#6B7C6B`
- **Muted dark**: `#9AB09A`
- **Warning**: `#F39C12` (próximo a vencer)
- **Error**: `#E74C3C` (vencido)
- **Success**: `#2ECC71`

## Pantallas

### 1. Home / Mi Nevera (`/`)
- **Header**: Saludo + resumen rápido ("Tienes 12 alimentos, 3 próximos a vencer")
- **Sección "Próximos a vencer"**: Cards horizontales con badge de días restantes
- **Sección "Todos los alimentos"**: Lista agrupada por categoría (Lácteos, Frutas, Verduras, Carnes, Otros)
- **FAB**: Botón flotante "+" para agregar alimento
- **Filtros**: Chips de categoría en la parte superior

### 2. Agregar/Editar Alimento (Modal/Sheet)
- Campo: Nombre del alimento
- Campo: Categoría (selector con iconos)
- Campo: Fecha de vencimiento (date picker)
- Campo: Cantidad y unidad
- Campo: Ubicación (Nevera / Congelador / Despensa)
- Botón guardar con haptic feedback

### 3. Lista de Compras (`/lista`)
- Lista de ítems pendientes con checkbox
- Sección "Sugeridos" (basados en alimentos vencidos o agotados)
- Agregar ítem manualmente
- Marcar todos / limpiar completados
- Contador de ítems pendientes en tab

### 4. Recetas (`/recetas`)
- Header: "¿Qué cocino hoy?"
- Sección "Con lo que tienes": recetas generadas con ingredientes disponibles
- Tarjetas de receta con imagen, tiempo, dificultad
- Detalle de receta con ingredientes y pasos

### 5. Estadísticas (`/stats`)
- Resumen mensual de desperdicio evitado
- Gráfico de alimentos por categoría (donut chart)
- Historial de alimentos vencidos
- Racha de días sin desperdiciar

## Flujos Clave

### Agregar alimento:
Home → FAB "+" → Sheet modal → Llenar datos → Guardar → Aparece en lista

### Ver próximos a vencer:
Home → Card naranja/roja → Detalle → Opción "Agregar a receta" o "Agregar a lista de compras"

### Generar lista de compras:
Lista → "Sugeridos" → Tap para agregar → Ir al supermercado → Marcar como comprado

### Descubrir receta:
Recetas → Ver recetas disponibles → Tap receta → Ver ingredientes y pasos → Marcar como cocinada

## Navegación
Tab bar inferior con 4 tabs:
1. 🥦 Mi Nevera (home)
2. 🛒 Lista
3. 👨‍🍳 Recetas
4. 📊 Stats
