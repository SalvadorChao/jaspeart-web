# JaspeArt — Dirección visual V1

## Autoridad visual

Esta carpeta contiene las referencias visuales seleccionadas para implementar
la primera V1 del ecommerce.

Las exploraciones anteriores son histórico y NO deben utilizarse para mezclar
nuevas direcciones visuales.

## HOME

Dirección: editorial, libre y cinematográfica.

La Home no tiene que copiar literalmente la referencia E.
Debe funcionar como una capa editorial sobre el ecommerce:

- fotografía y vídeo / microfilm como protagonistas;
- materia, pigmento, agua, gesto y proceso;
- ritmo editorial;
- grandes imágenes y campos visuales;
- evitar apariencia de ecommerce genérico;
- evitar estética spa, SaaS o sistema de tarjetas redondeadas.

La Home tiene mayor libertad visual que PLP y PDP.

## PLP

Referencia principal:
`line-e/plp.png`

La línea E constituye la base visual del listado:

- fondo cálido / blanco roto;
- interfaz silenciosa;
- geometría recta;
- jerarquía limpia;
- producto protagonista;
- filtros especializados;
- alta densidad de información sin ruido;
- evitar pills, tarjetas blandas y estética SaaS.

No reinterpretar radicalmente esta pantalla.

## PDP

Referencia principal:
`line-e/pdp.png`

Usar la línea E como estructura y lenguaje visual principal.

Se incorporará además la idea visual de Lovable
(`lovable/pdp-product-details.png`) consistente en mostrar,
inmediatamente debajo del bloque de compra, un listado compacto de
atributos técnicos del producto.

Ejemplo:

```text
Pigmento         PB29
Familia          Azules
Temperatura      Frío
Transparencia    Transparente
Granulación      Alta
Permanencia      I
Formato          Godet entero
```

Debe sentirse integrado en el PDP, no como una card independiente.

Después pueden aparecer descripción, comportamiento, ficha técnica
y contenido editorial sobre el material.

## COLOR

La referencia de color y fondos es la línea E.

Mantener especialmente su fondo cálido y ligeramente roto.
No sustituirlo sistemáticamente por blanco puro.

El color del material/producto puede adquirir protagonismo cuando
el contenido lo justifique.

## TIPOGRAFÍA

La tipografía definitiva todavía NO está decidida.

Para esta iteración:

- usar una sans serif limpia y neutra;
- no construir la identidad alrededor de una fuente concreta;
- centralizar familias, tamaños, pesos y escalas en tokens/CSS;
- permitir una exploración tipográfica posterior sin rehacer componentes.

No dedicar esta iteración a explorar nuevas tipografías.

## IMÁGENES DE PRODUCTO

La fotografía definitiva de producto todavía NO está resuelta.

Para esta iteración:

- en Home se pueden utilizar imágenes editoriales/cinematográficas;
- en PLP y PDP no inventar packshots definitivos;
- para productos sin imagen real usar un placeholder consistente;
- el placeholder debe mostrar `FOTO TEST`;
- opcionalmente puede mostrar nombre o categoría;
- mantener los ratios y estructura previstos para las imágenes reales;
- preparar la implementación para sustituir fácilmente el placeholder
  por fotografías reales posteriormente.

Cuando se implemente el frontend, crear un componente reutilizable similar a:

`ProductImagePlaceholder`

El objetivo actual será validar layout, jerarquía, densidad del PLP
y estructura del PDP, no la fotografía final.

## PRINCIPIO

```text
HOME = editorial / cinematográfica
PLP  = precisión comercial
PDP  = compra + conocimiento especializado del material
```