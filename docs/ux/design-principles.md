# Design Principles — JaspeArt Ecommerce V1

## Context

Este documento traduce el benchmark (competencia directa + referencias aspiracionales) a principios accionables para diseno y producto.

Cada principio incluye:

* Principle
* Intent
* Application
* Do
* Don't
* V1 relevance

No define decisiones cerradas de arquitectura ni reglas de negocio no confirmadas.

---

## 1) Inspiration with purchase intent

**Principle**

La inspiracion debe empujar hacia una accion de compra o descubrimiento concreto.

**Intent**

Evitar una Home bonita pero improductiva.

**Application**

Cada bloque editorial debe tener una salida clara a categoria, tecnica, gama o producto.

**Do**

Usar CTAs especificos: "Explorar acuarela", "Ver pinceles redondos", "Comprar gama".

**Don't**

Publicar hero editoriales sin puerta de entrada al catalogo.

**V1 relevance**

**MUST**

---

## 2) Multiple routes, one catalog truth

**Principle**

El usuario debe poder llegar al mismo catalogo por tecnica, categoria, marca, busqueda o contenido.

**Intent**

Resolver intenciones distintas sin duplicar logica de producto.

**Application**

Disenar rutas paralelas que convergen en la misma base de producto y disponibilidad.

**Do**

Mantener consistencia entre PLP de tecnica, PLP de categoria y resultados de busqueda.

**Don't**

Crear catalogos paralelos desconectados por canal de entrada.

**V1 relevance**

**MUST**

---

## 3) Decision-first PDP

**Principle**

La PDP debe priorizar decision de compra antes que narrativa extensa.

**Intent**

Reducir friccion en usuarios que ya tienen alta intencion.

**Application**

Orden recomendado: uso breve, variante, precio, disponibilidad, CTA; despues especificaciones y contenido ampliado.

**Do**

Mostrar disponibilidad y coste/condiciones clave cerca del CTA.

**Don't**

Esconder precio o stock por privilegiar composicion visual.

**V1 relevance**

**MUST**

---

## 4) Variable friction by product complexity

**Principle**

No todos los productos necesitan el mismo camino de compra.

**Intent**

Acelerar reposicion simple sin aumentar errores en productos complejos.

**Application**

Quick add para productos simples; paso por PDP en productos con variantes de riesgo (tamano, color tecnico, compatibilidad).

**Do**

Definir criterios de "producto simple" basados en datos y errores historicos.

**Don't**

Forzar quick add universal por perseguir conversion de corto plazo.

**V1 relevance**

**SHOULD**

---

## 5) Family-first merchandising

**Principle**

Cuando existe gama, la experiencia debe agrupar y explicar antes de listar variaciones repetitivas.

**Intent**

Reducir ruido visual y mejorar comprension.

**Application**

Usar bloques de familia (gama, colores disponibles, formatos, usos) y acceso a seleccion detallada.

**Do**

Presentar "ver gama" con contexto de uso.

**Don't**

Mostrar decenas de tarjetas casi identicas sin jerarquia.

**V1 relevance**

**SHOULD / MUST si datos preparados**

---

## 6) Technical findability over decorative minimalism

**Principle**

La interfaz debe respetar el lenguaje tecnico del material artistico.

**Intent**

Permitir compra dirigida con precision.

**Application**

Filtros por familia y atributos reales (ej. gramaje, punta, pelo, formato, opacidad, secado).

**Do**

Priorizar facetas que el artista usa para decidir.

**Don't**

Usar filtros genericos iguales para todo el catalogo.

**V1 relevance**

**MUST**

---

## 7) Guided expertise, not just support

**Principle**

El conocimiento experto debe estar integrado en el journey, no escondido en una pagina de ayuda.

**Intent**

Reducir indecision y devoluciones por mala eleccion.

**Application**

Microguias en PLP/PDP, comparativas breves y escalado claro a especialista cuando haga falta.

**Do**

Combinar autoservicio (contenido) con asistencia humana visible.

**Don't**

Depender solo de contacto manual para dudas recurrentes.

**V1 relevance**

**SHOULD**

---

## 8) Out-of-stock is a branch, not a dead end

**Principle**

Sin stock debe activar una siguiente accion util.

**Intent**

Conservar intencion comercial y confianza.

**Application**

Estado claro + alternativas compatibles + opcion futura de aviso/reposicion.

**Do**

Mostrar sustitutos por tecnica/compatibilidad, no solo por popularidad.

**Don't**

Terminar el journey en "no disponible" sin salida.

**V1 relevance**

**MUST** para estado claro; **SHOULD** para alternativas/aviso

---

## 9) Coherent transactional language

**Principle**

El microcopy de accion debe ser consistente en toda la experiencia.

**Intent**

Reducir carga cognitiva y errores de interpretacion.

**Application**

Estabilizar nomenclatura de acciones: anadir, reservar, ver gama, consultar especialista, etc.

**Do**

Aplicar un sistema de etiquetas y verbos consistente en Home, PLP, PDP y carrito.

**Don't**

Cambiar verbos por estilo de campana sin criterio de usabilidad.

**V1 relevance**

**MUST**

---

## 10) Visual identity with operational realism

**Principle**

La direccion visual debe ser fuerte, pero sostenible con la capacidad real de contenido y fotografia.

**Intent**

Evitar deuda editorial que degrade rapidamente la experiencia.

**Application**

Definir un sistema visual modular: plantillas reutilizables, ritmos de actualizacion y niveles de calidad por tipo de bloque.

**Do**

Priorizar menos piezas, mejor producidas y mejor conectadas al catalogo.

**Don't**

Depender de produccion editorial diaria si la operacion no puede mantenerla.

**V1 relevance**

**MUST**

---

# Proposed JaspeArt visual direction

Una direccion visual recomendada para V1:

* Materialidad: fotografia cercana de textura real (papel, pigmento, pincelada, fibra, grano).
* Ritmo: alternar bloques de alta atmosfera con bloques de decision rapida.
* Jerarquia: primero orientacion creativa, despues decision de compra.
* Tipologia de bloque: editorial corto, familia de producto, comparativa tecnica, seleccion curada, entrada a tecnica.
* Tono: experto, claro, sin grandilocuencia ni tecnicismo innecesario.
* Interaccion: transiciones sobrias, foco en legibilidad y seleccion de variante.

## We are not

* No somos un catalogo plano de thumbnails sin criterio editorial.
* No somos una revista visual sin capacidad de compra dirigida.
* No somos una web de lujo generica desconectada de necesidades tecnicas del artista.
* No somos una interfaz minimalista que esconda stock, precio o atributos clave.
* No somos una coleccion de campanas sueltas sin continuidad de catalogo.
