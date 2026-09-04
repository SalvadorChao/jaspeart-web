# JaspeArt Ecommerce Core Catalog V0

## 1. Objetivo

Este documento explica el modelo conceptual V0 definido en [docs/architecture/ecommerce-core-v0.dbml](docs/architecture/ecommerce-core-v0.dbml).

Su objetivo es operativo: dejar claro que datos resolvemos ya para arrancar catalogo ecommerce, de donde vienen, quien los gobierna y que se aplaza para fases posteriores.

Este documento no sustituye al DBML ni lo copia linea por linea.

---

## 2. Problema que resuelve este modelo

Core Catalog V0 resuelve el minimo necesario para publicar referencias vendibles reales con identidad estable y con capacidad de evolucionar:

- definir Product como referencia vendible ERP;
- reutilizar clasificacion existente (Brand, Family, Subfamily) sin redisenar toda la taxonomia;
- permitir agrupaciones UX opcionales mediante ProductRange;
- almacenar enriquecimiento comercial en ecommerce;
- dejar preparada la integracion operacional de precio, IVA y stock desde ERP;
- incorporar imagenes como metadata sin fijar aun infraestructura final de media.

El objetivo de V0 es lanzar base de catalogo correcta y migrable, no resolver todo el dominio ecommerce.

---

## 3. Principios aplicados en V0

1. Product representa una referencia vendible real del ERP.
2. Cada prod_cod distinto representa un Product distinto.
3. ProductRange es una agrupacion ecommerce opcional para UX.
4. No existe entidad Variant independiente en V0.
5. Family y Subfamily reutilizan clasificacion existente.
6. DW puede ayudar en carga inicial no critica.
7. ERP sera master operacional para precio, IVA y stock en produccion.
8. Ecommerce gobierna enriquecimiento comercial, slugs, imagenes y agrupaciones.
9. No se modela todavia la capa Crear/Descubrir.
10. No se modelan Technique ni taxonomia ecommerce adicional.
11. No se modelan checkout, pedidos, pagos, envios, promociones ni clientes.
12. El modelo debe evolucionar por migraciones, no por sobre-diseno inicial.

---

## 4. Leyenda de ownership (provisional)

- [DW V0]: dato que podemos cargar inicialmente desde Data Warehouse.
- [ERP PROD]: dato que en produccion debe venir directa o sincronizadamente del ERP.
- [ECOMMERCE]: dato gobernado por la nueva plataforma ecommerce.
- [MANUAL V0]: dato que puede informarse manualmente en la fase inicial.
- [DERIVED]: dato calculado o generado por la propia aplicacion.

Esta clasificacion es provisional y orientada a responsabilidades en fase V0.

---

## 5. Explicacion de tablas

## brand

### Purpose
Representa la marca comercial visible para navegacion y ficha de producto.

### Why it exists
Necesitamos una entidad de marca para clasificacion minima, filtros basicos futuros y consistencia visual/comercial.

### Data ownership
- source_brand_id: [DW V0] en arranque.
- name: [DW V0] en arranque.
- slug: [ECOMMERCE].
- id, created_at, updated_at: [DERIVED].

### Important relationships
- brand 1:N product.
- brand 1:N product_range.

### V0 simplifications
- No se modela jerarquia de marca, alias complejos ni estrategia multi-codigo avanzada.

### Future evolution
- Normalizacion de identidad de marca contra ERP maestro cuando exista contrato definitivo.

## family

### Purpose
Representa la familia comercial actual reutilizada del modelo existente.

### Why it exists
Permite clasificar productos desde el primer dia sin crear una taxonomia nueva completa.

### Data ownership
- source_family_id, name: [DW V0] en arranque.
- id, timestamps: [DERIVED].

### Important relationships
- family 1:N subfamily.
- family 1:N product.

### V0 simplifications
- Se reutiliza clasificacion actual sin introducir aun capa de CommerceCategory.

### Future evolution
- Mapeo Family hacia taxonomia ecommerce adicional cuando se disene IA ampliada.

## subfamily

### Purpose
Segunda capa de clasificacion bajo Family.

### Why it exists
Permite evolucionar hacia Family -> Subfamily -> Product sin bloquear V0 si cobertura no es completa.

### Data ownership
- source_subfamily_id, name, family_id: [DW V0] cuando haya calidad suficiente.
- id, timestamps: [DERIVED].

### Important relationships
- subfamily N:1 family.
- subfamily 1:N product.

### V0 simplifications
- subfamily_id en product puede ser NULL.
- No se bloquea lanzamiento por cobertura parcial de subfamilias.

### Future evolution
- Reforzar calidad y completitud de subfamilia con contrato ERP.

## product_range

### Purpose
Agrupacion comercial/UX opcional de varias referencias Product relacionadas.

### Why it exists
Reduce ruido en catalogo cuando varias referencias deben presentarse juntas, sin alterar identidad vendible de cada producto.

### Data ownership
- name, slug, description, is_published: [ECOMMERCE].
- brand_id: base [DW V0] + asignacion de agrupacion [ECOMMERCE].
- id, timestamps: [DERIVED].

### Important relationships
- product_range 1:N product (opcional).
- product_range 1:N product_image.

### V0 simplifications
- Es opcional.
- range_id NULL en product es valido.
- No se fuerzan agrupaciones sin evidencia.
- ProductRange no tiene precio ni stock operacional.

### Future evolution
- Reglas mas sistematicas de agrupacion cuando exista evidencia robusta por familia.

## product

### Purpose
Unidad central vendible del catalogo ecommerce.

### Why it exists
La operacion comercial (precio, stock, compra futura) ocurre sobre referencia concreta, no sobre agrupacion.

### Data ownership
- erp_code (prod_cod): [DW V0] en arranque, [ERP PROD] como clave operacional en produccion.
- erp_name: [DW V0] en arranque.
- commerce_name, slug, short_description, long_description, is_published, range_id: [ECOMMERCE] y en parte [MANUAL V0].
- brand_id, family_id, subfamily_id: [DW V0] inicialmente.
- price, vat_rate, stock_quantity: [ERP PROD].
- price_synced_at, stock_status, stock_synced_at, imported_from_dw_at, created_at, updated_at: [DERIVED].

### Important relationships
- product N:1 brand.
- product N:1 family.
- product N:1 subfamily (opcional).
- product N:1 product_range (opcional).
- product 1:N product_image.

### V0 simplifications
- Sin entidad Variant independiente.
- Sin modelo de atributos/filtros avanzados.
- Sin historico de precios.
- Sin reservas ni multiwarehouse.

### Future evolution
- Incorporar capa de atributos/filtros.
- Definir modelo de publicabilidad mas expresivo.
- Evolucion de agrupaciones y relacion con capa Crear/Descubrir.

Regla clave de V0:

Product = referencia vendible ERP.

Ejemplo conceptual:

Amsterdam Standard Series / Azul Ultramar 120 ml / prod_cod X001 -> Product A.
Amsterdam Standard Series / Azul Ultramar 500 ml / prod_cod X002 -> Product B.

Ambos pueden pertenecer al mismo ProductRange, pero siguen siendo dos Product distintos.

Implicaciones:

- precio pertenece a Product;
- stock pertenece a Product;
- integracion ERP usa erp_code;
- carrito/pedido futuro referenciara Product;
- ProductRange no es unidad operacional de venta.

## product_image

### Purpose
Guarda metadata de imagen y referencia al recurso externo para Product o ProductRange.

### Why it exists
Necesitamos soporte de media minimo sin acoplar el modelo a una infraestructura final no decidida.

### Data ownership
- storage_key, source, source_reference, alt_text, sort_order, is_primary, asociaciones product_id/range_id: [ECOMMERCE] y parcialmente [MANUAL V0].
- id, created_at: [DERIVED].

### Important relationships
- product_image N:1 product (opcional).
- product_image N:1 product_range (opcional).

### V0 simplifications
- No se guardan binarios en PostgreSQL.
- No se cierra aun estrategia definitiva de object storage/CDN.
- No se modela pipeline avanzado de media.

### Future evolution
- Definir estrategia final de sourcing, normalizacion y calidad de imagen.

---

## 6. Product vs ProductRange (decision critica)

Product:
- referencia vendible concreta;
- tiene erp_code;
- tiene precio e IVA operacionales;
- tiene stock operacional;
- sera la unidad usada por carrito/pedido futuro.

ProductRange:
- agrupacion opcional para UX;
- puede mejorar presentacion de familias con muchas referencias;
- no tiene stock operacional;
- no tiene precio operacional;
- no sustituye la identidad de venta.

Regla operacional V0:

No forzar agrupaciones sin evidencia. range_id = NULL es un caso valido y esperado.

---

## 7. Matriz DW vs ERP vs Ecommerce

| Dato | Fuente V0 (arranque) | Fuente produccion / master | Comentario |
|---|---|---|---|
| prod_cod (erp_code) | DW V0 | ERP PROD | Clave de referencia vendible y de sincronizacion |
| descripcion origen (erp_name) | DW V0 | ERP PROD | Puede enriquecerse luego con commerce_name |
| marca | DW V0 | ERP PROD (objetivo) + ECOMMERCE para presentacion | En DW hay decisiones provisionales de marca por descripcion |
| familia | DW V0 | ERP PROD (objetivo) | Reutilizada como clasificacion base |
| subfamilia | DW V0 (si disponible) | ERP PROD (objetivo) | Cobertura/calidad aun por validar |
| nombre ecommerce (commerce_name) | MANUAL V0 / ECOMMERCE | ECOMMERCE | Enriquecimiento comercial |
| slug | ECOMMERCE | ECOMMERCE | URL publica |
| ProductRange | MANUAL V0 / ECOMMERCE | ECOMMERCE | Agrupacion UX opcional |
| precio | extracto controlado para dev | ERP PROD | Master operacional en produccion |
| IVA | extracto controlado para dev | ERP PROD | Parte del contrato de precio |
| stock | extracto controlado para dev | ERP PROD | No usar F_STOCK_SNAPSHOT como inventario web |
| imagenes | MANUAL V0 / ECOMMERCE / fuentes externas | ECOMMERCE (gobernanza) | Metadata en DB, binarios fuera |

Lectura clave:

- DW en V0 sirve para identidad y clasificacion no critica de arranque.
- ERP en produccion gobierna precio + IVA + stock.
- Ecommerce gobierna enriquecimiento comercial y presentacion.

---

## 8. Stock en V0

- ERP sera el master operacional en produccion.
- Commerce guardara una copia sincronizada para no consultar ERP en cada visita.
- No se usara F_STOCK_SNAPSHOT como backend operacional de inventario web.
- stock_synced_at se usa para visibilidad de frescura del dato.
- stock_status debe permitir IN_STOCK, OUT_OF_STOCK y UNKNOWN.
- La frecuencia exacta de sincronizacion queda pendiente y no se cierra en V0.

---

## 9. Precio en V0

- ERP sera inicialmente el master operacional de precio e IVA.
- Commerce guarda el ultimo valor sincronizado para lectura web rapida.
- Ecommerce no debe depender de llamada ERP en cada request de catalogo.
- Para desarrollo se aceptan extractos controlados o datos de prueba.
- Para produccion debe cerrarse contrato ERP explicito de campos y frescura.
- No se modelan promociones en Core Catalog V0.

---

## 10. Imagenes en V0

- Los binarios no viven en PostgreSQL.
- product_image guarda metadata y referencia a fichero (storage_key).
- Las imagenes pueden venir de WordPress, proveedor/fabricante, JaspeArt o carga manual.
- Una imagen puede asociarse a Product o a ProductRange.
- Todavia no se ha decidido infraestructura final de object storage/CDN.
- Si un Product no tiene imagen propia, UX podria reutilizar imagen de ProductRange si se aprueba ese comportamiento en capa aplicativa.

---

## 11. Out of scope for Core Catalog V0

Fuera de alcance en esta fase:

- Technique
- Creative Routes
- Create / Discover layer
- CommerceCategory
- atributos avanzados
- filtros especificos
- promociones
- historico de precios
- multiwarehouse
- reservas de stock
- pedidos
- carrito
- clientes
- pagos
- envios
- devoluciones
- recomendador
- CMS complejo

No estan descartados; solo quedan fuera del Core Catalog V0.

---

## 12. Riesgos y Open Questions activos

1. Cobertura/calidad real de subfamilia para V0.
2. Estrategia de agrupacion ProductRange sin forzar uniones no fiables.
3. Estrategia de sourcing de imagenes y calidad minima.
4. Contrato ERP de precio/IVA/stock para produccion.
5. Frecuencia y frescura de stock (sin SLA cerrado aun).
6. Regla futura de publicabilidad (catalogo interno != catalogo publicable).
7. Evolucion futura de capa Crear/Descubrir sin romper Product core.
8. Riesgo conocido DW: clasificacion marca/familia con limites provisionales en ciertos casos.
9. Riesgo conocido DW: referencias en ventas ausentes del maestro de articulos.

Conflictos o tensiones detectadas entre documentos:

- [docs/product/ecommerce-data-model.md](docs/product/ecommerce-data-model.md#L870) plantea Technique como MUST de V1 general.
- [docs/architecture/ecommerce-core-v0.dbml](docs/architecture/ecommerce-core-v0.dbml) y este documento la dejan fuera de Core Catalog V0.
- Esto no se resuelve inventando: se interpreta como diferencia de alcance (V1 global vs submodelo V0 de catalogo core).

---

## 13. Recomendacion de siguiente paso

1. Contrastar el DBML contra datos reales de muestra.
2. Seleccionar muestra representativa del catalogo.
3. Verificar prod_cod, familia, marca y subfamilia en esa muestra.
4. Identificar primeras ProductRange con evidencia clara.
5. Comprobar disponibilidad y calidad minima de imagenes.
6. Validar exactamente que campos/frescura hay que pedir al ERP para precio, IVA y stock.
7. Solo despues convertir este modelo a Prisma/PostgreSQL de implementacion.

---

## 14. Quality check de este documento

- Explica el modelo sin copiar textual el DBML: SI.
- Diferencia Product vs ProductRange: SI.
- Aclara DW vs ERP vs Ecommerce: SI.
- No introduce Technique accidentalmente en V0: SI.
- No agrega tablas nuevas fuera de las 6 pedidas: SI.
- Mantiene alcance minimo V0: SI.
- Marca incertidumbres y OQs: SI.
- No usa DW como backend operacional: SI.
- Deja precio y stock bajo ERP para produccion: SI.
