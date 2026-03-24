# NeveraSmart — TODO

## Configuración y Branding
- [x] Generar logo de la app
- [x] Actualizar paleta de colores (verde fresco)
- [x] Actualizar app.config.ts con nombre y logo
- [x] Configurar iconos del tab bar

## Pantalla: Mi Nevera (Home)
- [x] Header con saludo y resumen
- [x] Sección "Próximos a vencer" (cards horizontales)
- [x] Lista de alimentos agrupada por categoría
- [x] Chips de filtro por categoría
- [x] FAB para agregar alimento

## Modal: Agregar/Editar Alimento
- [x] Formulario con nombre, categoría, fecha de vencimiento
- [x] Selector de ubicación (Nevera/Congelador/Despensa)
- [x] Campo de cantidad y unidad
- [x] Guardar con AsyncStorage

## Pantalla: Lista de Compras
- [x] Lista de ítems con checkbox
- [x] Sección de ítems sugeridos
- [x] Agregar ítem manualmente
- [x] Marcar/desmarcar ítems
- [x] Limpiar completados

## Pantalla: Recetas
- [x] Recetas generadas con ingredientes disponibles
- [x] Tarjetas de receta con info básica
- [x] Pantalla de detalle de receta

## Pantalla: Estadísticas
- [x] Resumen de alimentos actuales
- [x] Gráfico de categorías
- [x] Contador de alimentos vencidos/desperdiciados

## Persistencia y Lógica
- [x] Almacenamiento con AsyncStorage
- [x] Cálculo de días hasta vencimiento
- [x] Alertas de vencimiento próximo
- [x] Lógica de sugerencias de lista de compras


## Escáner de Código de Barras (Nueva funcionalidad)
- [x] Crear componente de escáner con expo-camera
- [x] Integrar base de datos de productos (Open Food Facts API)
- [x] Agregar botón de escáner al modal de agregar alimento
- [x] Parsear código de barras y buscar producto
- [x] Autocompletar nombre y categoría desde API
- [x] Manejo de errores y productos no encontrados
- [x] Tests para el escáner
