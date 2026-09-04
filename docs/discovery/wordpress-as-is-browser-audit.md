# Auditoria READ-ONLY WordPress/WooCommerce AS-IS (Browser)

Fecha de auditoria: 2026-08-28  
Entorno: navegador integrado de VS Code con sesion autenticada en https://www.jaspeart.es/wp-admin/  
Alcance: solo lectura, sin ejecucion de acciones de guardado, activacion, desactivacion, actualizacion o cambio de configuracion.

## 1. Executive summary

El AS-IS de JaspeArt corre sobre WordPress + WooCommerce con un stack clasico de theme comercial (The7), constructores visuales (Elementor + WPBakery) y multiples plugins WooCommerce/YITH. A nivel operativo, la tienda muestra catalogo visible y navegable, pero con senales de deuda tecnica y de mantenimiento: WordPress desactualizado, PHP 7.4.33 obsoleto, muchas actualizaciones pendientes y overrides WooCommerce del theme obsoletos.

No se encontro evidencia directa en interfaz de un conector ERP explicito (por nombre/branding), ni de webhooks activos, ni de claves REST API creadas. Si hay indicios de posibles capas de integracion/operacion externa por datos de contacto internos (ej. correo softpyme@adenet.es), plugin POS, scheduler con 870 acciones y herramientas de import/export presentes.

En UX publica, la tienda funciona en lo basico (Home, PLP, PDP, filtros, busqueda, carrito), pero hay incoherencias funcionales y de contenido (muchos productos con Lee mas o Sin existencias, mezcla de URLs http/https, duplicidades taxonomicas y señales de contenido antiguo).

## 2. WordPress/WooCommerce overview

### WordPress

- Version WordPress visible en estado WooCommerce: 6.9.7 (con aviso de 7.1 disponible).
- Version PHP visible: 7.4.33 (obsoleta).
- Version MySQL visible: 8.0.46.
- Theme activo visible por contexto de temas y estado: The7 (dt-the7).
- Temas instalados: 11 (The7 + varias Twenty*).
- Child theme: no se aprecia child theme activo (en estado WooCommerce aparece Tema hijo: -).

### WooCommerce

- Version plugin WooCommerce: 10.7.0 (con update disponible a 11.0.1).
- Version DB WooCommerce: 10.7.0.
- Moneda: EUR (€).
- HPOS: no activo (estado muestra HPOS activado: -).
- Almacen de pedidos: WC_Order_Data_Store_CPT (post tables clasicas).
- Estado dashboard WooCommerce: 190 productos agotados (widget estado).
- Pedidos visibles en admin: 3 (1 pendiente, 1 procesando, 1 cancelado).

## 3. Plugins relevantes

Conteo visible en plugins:
- Total: 33
- Activos: 30
- Inactivos: 3
- Con actualizaciones: 26

### Plugins ecommerce/comercio visibles

- WooCommerce
- WooCommerce Global Payments HPP
- Redsys WooCommerce
- WooCommerce.com Update Manager
- YITH WooCommerce Ajax Product Filter
- ELEX WooCommerce Catalog Mode
- Perfect Brands for WooCommerce

### Plugins de soporte/complemento relevantes

- Elementor + Elementor Pro
- WPBakery Page Builder
- The7 Elementos
- Ultimate Addons for WPBakery
- Slider Revolution
- Yoast SEO
- Wordfence Security
- All-in-One WP Migration and Backup
- CookieYes
- Jetpack

### Plugins inactivos visibles

- Google Authenticator
- Hello Dolly
- Image Optimizer - Compress, Resize and Optimize Images

### Plugins custom/poco comunes a revisar

- Mantenimiento web (autor: Carlos Doral / webartesanal.com)
- Asesor de Cookies RGPD (autor: Carlos Doral Perez / webartesanal.com)
- Posible relacion operativa por correo tienda en POS: softpyme@adenet.es (no es plugin, pero es senal de actor externo)

## 4. Evidencia de integracion ERP

### Clasificacion de pistas (objetivo exclusivo: integracion WooCommerce-ERP)

#### STRONG EVIDENCE

- Ninguna evidencia fuerte encontrada en interfaz WordPress/WooCommerce.

#### WEAK EVIDENCE

- Punto de venta en WooCommerce settings (`tab=point-of-sale`) con datos operativos de tienda y correo de contacto (`softpyme@adenet.es`).
  - Lo observado sugiere operativa comercial, pero no muestra sincronizacion ERP explicitamente.
- Action Scheduler: existe una accion `wc-admin_import_orders` (grupo `wc-admin-data`, estado completo).
  - Es evidencia de proceso interno de WooCommerce Admin (import para analitica/reporting), no de conector ERP por si sola.

#### NOT ERP RELATED

- Plugins claramente no-ERP por descripcion/uso:
  - Antispam Bee
  - Asesor de Cookies RGPD
  - CookieYes
  - Contact Form 7
  - Google Analytics para WordPress por MonsterInsights
  - Jetpack
  - Popup Builder
  - Really Simple CAPTCHA
  - Slider Revolution
  - Speed Optimizer
  - Use Any Font
  - Yoast SEO
  - Wordfence Security
  - WPBakery Page Builder
  - Elementor / Elementor Pro
  - The7 Elementos
- Plugins WooCommerce de UX/comercial, sin evidencia de ERP en lo visible:
  - YITH WooCommerce Ajax Product Filter
  - Perfect Brands for WooCommerce
  - ELEX WooCommerce Catalog Mode
- Import/export generico sin evidencia de integracion operacional ERP:
  - All-in-One WP Migration and Backup
  - Herramientas WordPress de Importar/Exportar
- Pasarelas de pago (integracion de cobro, no ERP por definicion):
  - WooCommerce Global Payments HPP
  - Redsys WooCommerce

#### UNKNOWN

- WooCommerce > Avanzado > API REST keys:
  - No se listan claves creadas en la vista auditada, pero no se puede descartar uso de otros metodos de autenticacion o integracion fuera de esta pantalla.
- WooCommerce > Avanzado > Webhooks:
  - No se listan webhooks en la vista auditada, pero no se puede descartar integracion por polling/API pull o por servicios externos.
- WooCommerce > Avanzado > API heredada:
  - Se ve desactivada en UI, pero no permite concluir ausencia total de integraciones externas por otros canales.
- Action Scheduler (busquedas por terminos `erp`, `sync`, `stock`, `inventory`, `price`, `product`, `export`, `customer`, `jaspe`, `pos`):
  - Sin coincidencias operacionales directas de ERP en la vista read-only.
  - `order` devuelve mayormente tareas de mantenimiento WooCommerce (`woocommerce_cancel_unpaid_orders`, `woocommerce_refresh_order_count_cache`).
- Menus y paginas admin añadidas por plugins:
  - Se observan pantallas de WooCommerce, YITH, All-in-One WP Migration, The7 y utilidades varias.
  - Ninguna pagina muestra explicitamente nomenclatura o configuracion ERP.
- Posibilidad de integracion fuera de lo visible en navegador:
  - mu-plugins, plugins custom con nombre generico, codigo de theme/functions.php, cron de servidor, middleware externo.

## 5. Catalogo/producto/variantes

- Productos publicados visibles: 240 (12 paginas en admin, 20 por pagina aprox).
- Taxonomia de categorias: al menos 5 paginas de categorias.
- Atributos visibles en admin: Color y Formato.
- Marcas: aparecen taxonomias de marca (pwb-brand y product_brand visibles en submenu).
- Tipos de producto esperables por estado WooCommerce: simple, variable, grouped, external.
- En PLP/search se observa mezcla de CTA:
  - Anadir al carrito (comprable directo)
  - Lee mas / Detalles (productos no comprables directos en esa vista o sin stock)
- En PDP muestreada se observan productos sin existencias y SKU visible.

Riesgos catalogo observables:
- Alto nivel de agotados (190 reportados).
- Aparente heterogeneidad de nomenclaturas/slug de filtros (ej. filter_color numerico y textual mixto).
- Posibles duplicidades o taxonomias paralelas (dos rutas de marca).

## 6. Checkout/pagos/envios

### Pagos

FACT:
- Global Payments HPP aparece Activo.
- Pago con Tarjeta (REDSYS) aparece Inactivo en panel moderno de pagos.
- Hay recomendaciones de instalar WooPayments/PayPal (no activadas desde esta auditoria).

INFERENCE:
- Pasarela principal operativa visible: Global Payments HPP.
- Redsys plugin instalado pero no activo en flujo actual (al menos en pantalla de pagos observada).

UNKNOWN:
- Configuracion fina de credenciales/entornos de pago (sandbox/produccion).
- Si existen pasarelas activas adicionales en modos no visibles por permisos.

### Envio

FACT:
- En Zonas de envio solo se observa Resto del mundo, sin metodos de envio asignados en esa zona.
- Hay clases de envio y ajustes accesibles, no modificados.

INFERENCE:
- Configuracion de envio potencialmente incompleta en la vista observada.

UNKNOWN:
- Si existen zonas/metodos ocultos por plugins, geolocalizacion o condiciones dinamicas.

### Checkout

FACT:
- /checkout redirige a /cart cuando el carrito esta vacio.
- Carrito vacio mostrado correctamente con CTA Volver a la tienda.

INFERENCE:
- Flujo base cart > checkout existe, pero no se puede validar checkout real sin crear carrito/pedido (fuera de alcance por regla no cambio).

UNKNOWN:
- Validacion completa de pasos de pago final, calculo fiscal final y emails transaccionales en compra real.

## 7. SEO/URLs observables

- Yoast SEO activo y sitemap index publico.
- robots.txt apunta a sitemap_index.xml usando URL http (no https).
- Sitemap index contiene 7 sitemaps (post, page, product, category, pwb-brand, product_cat, author).
- Enlaces observados mezclan https y http en distintos bloques del frontend.
- Estructuras URL visibles:
  - /tienda
  - /product/{slug}
  - /product-category/{slug}
  - /?s={query}&post_type=product

Riesgos SEO:
- Mezcla http/https en enlaces internos visibles.
- Contenido antiguo en sitemaps (fechas legacy en algunas secciones).
- Posible incoherencia taxonomica por brand taxonomies dobles.

## 8. UX/UI audit

### Clasificacion por area

1) Home
- Estado: MEJORAR
- Motivo: base funcional y narrativa de marca, pero visual con señales legacy, repeticiones y mezcla de patrones antiguos.

2) Navegacion principal
- Estado: MEJORAR
- Motivo: existe menu amplio y acceso a servicios, pero jerarquia y claridad ecommerce vs contenido puede optimizarse.

3) Busqueda
- Estado: CONSERVAR
- Motivo: busqueda de productos funciona y devuelve resultados numerados (ej. 222 para oleo).

4) PLP (/tienda)
- Estado: MEJORAR
- Motivo: hay filtros (precio, categorias, color), ordenacion y paginacion, pero experiencia muestra mezcla de CTA y probable ruido taxonomico en filtros.

5) PDP
- Estado: MEJORAR
- Motivo: muestra precio, SKU, categorias y tabs; muchos productos sin stock y CTA no siempre de compra directa.

6) Carrito
- Estado: CONSERVAR
- Motivo: estado vacio claro, pasos de checkout visibles.

7) Checkout
- Estado: RESEARCH
- Motivo: no validable extremo a extremo sin anadir producto y completar compra (fuera de alcance READ-ONLY).

8) Stock y disponibilidad
- Estado: REDISENAR
- Motivo: 190 agotados sugiere problema estructural de surtido visible/gestion de disponibilidad percibida.

9) Confianza/compliance
- Estado: MEJORAR
- Motivo: cookies y politicas presentes, pero conviven componentes legacy y multiples capas plugin.

10) Servicios/contenido no-producto
- Estado: CONSERVAR
- Motivo: secciones como talleres, enmarcacion, maquetismo y contenido editorial refuerzan posicionamiento de marca.

11) Elementos potencialmente prescindibles
- Estado: ELIMINAR (candidatos)
- Motivo: plugins/demo notices y elementos de admin legacy no aportan valor al front; requiere validacion tecnica previa.

## 9. Limitaciones de esta auditoria

- No se accedio al codigo fuente del servidor ni repositorio productivo WordPress.
- No se inspeccionaron logs de servidor, DB real ni trafico API de red con credenciales.
- No se ejecuto ninguna accion que genere cambio persistente.
- No se completo flujo checkout con pedido real por restriccion de no modificar.
- Visibilidad condicionada a permisos del usuario autenticado en wp-admin compartido.

## 10. Elementos que requieren acceso a codigo/servidor

1) Auditoria de plugins custom y mu-plugins:
- wp-content/plugins custom
- wp-content/mu-plugins

2) Trazabilidad de integraciones:
- hooks/actions de WooCommerce
- endpoints externos
- jobs de cron sistema y Action Scheduler payloads

3) Data ownership y sincronizacion:
- quien escribe precio, stock, catalogo y estados de pedido
- frecuencia y direccion de sync

4) Seguridad y operacion:
- estado real de backups
- hardening Wordfence/WAF
- errores PHP/WP en logs

5) SEO tecnico:
- canonicals
- redirects masivos
- consistencia http->https

6) Deuda de theme overrides WooCommerce:
- compatibilidad de plantillas dt-the7/woocommerce con version WooCommerce actual

## 11. Open Questions

OQ-01: Cual es el sistema maestro de producto, precio y stock?  
OQ-02: Existe ERP? Si existe, cual y por que canal integra (API, CSV, cron, middleware)?  
OQ-03: Por que Redsys esta instalado pero inactivo mientras Global Payments esta activo?  
OQ-04: La taxonomia de marca debe consolidarse (pwb-brand vs product_brand)?  
OQ-05: Se permite publicar productos sin stock de forma intencional para SEO/catalogo?  
OQ-06: El tab POS esta operativo en tienda fisica o solo residual?  
OQ-07: Quien mantiene y para que se usa el contacto softpyme@adenet.es en POS/clientes?  
OQ-08: Hay procesos batch externos que escriben pedidos/clientes en WooCommerce?  
OQ-09: Debe mantenerse The7 + WPBakery + Elementor en paralelo o simplificar stack?  
OQ-10: Cual es la politica objetivo de URLs y migracion SEO (http/https, slugs, canonicals)?

## 12. Proximos pasos

1) Inventario tecnico de integraciones en codigo
- revisar plugins custom/mu-plugins/functions.php
- localizar llamadas salientes (wp_remote_*, curl, SOAP, SDKs)

2) Mapa de ownership de datos
- definir maestro para producto/precio/stock/pedido/cliente
- documentar flujos de entrada/salida y SLAs

3) Auditoria de scheduler y automatizaciones
- clasificar acciones por origen plugin
- revisar payloads de tareas pendientes/reintentos

4) Plan de estabilidad tecnica
- actualizar PHP y stack WP/Woo/plugins en entorno controlado
- corregir overrides WooCommerce obsoletos del theme

5) Plan UX ecommerce
- saneamiento de filtros/atributos/stock visible
- estrategia de PDP/PLP para productos no comprables y agotados

6) Plan SEO operativo
- normalizar esquema HTTPS
- validar sitemaps, canonicals y redirecciones
