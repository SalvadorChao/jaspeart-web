# JaspeArt Web

Nuevo proyecto web/ecommerce de **JaspeArt**, negocio especializado en materiales, productos y servicios relacionados con Bellas Artes.

## Estado

**Discovery / definición del producto**

El proyecto se encuentra actualmente en una fase inicial de análisis y definición.

Antes de seleccionar una arquitectura o comenzar la implementación se estudiarán:

* web/ecommerce actual;
* sistemas operacionales existentes;
* catálogo y calidad de datos;
* ownership de producto, precio y stock;
* operación ecommerce;
* requisitos funcionales;
* experiencia de usuario;
* SEO y estrategia de migración;
* alternativas de arquitectura.

## Objetivo

Construir una nueva experiencia ecommerce para JaspeArt que combine:

* especialización en Bellas Artes;
* facilidad y eficiencia de compra;
* descubrimiento e inspiración;
* una experiencia visual cuidada y contemporánea;
* buen rendimiento;
* accesibilidad;
* SEO;
* mantenibilidad.

La experiencia debe poder servir tanto a clientes que exploran materiales como a clientes que buscan una referencia concreta y necesitan encontrarla rápidamente.

## Principios

### Entender antes de construir

La secuencia de trabajo del proyecto es:

**Entender → Decidir → Diseñar → Prototipar → Implementar → Validar → Desplegar**

No se seleccionará tecnología únicamente por familiaridad, moda o velocidad inicial de desarrollo.

### Separar requisitos de implementación

Primero definimos **qué necesita el negocio y el usuario**.

Después decidimos **cómo implementarlo**.

### No inventar reglas de negocio

Cuando falte información relevante, se documentará como una **Open Question (OQ)**.

Las decisiones arquitectónicas importantes se documentarán mediante **Architecture Decision Records (ADR)**.

### Ownership claro de los datos

La interfaz ecommerce no debe convertirse en fuente maestra de:

* catálogo;
* clasificación;
* precio;
* stock;
* disponibilidad;
* promociones;
* reglas comerciales.

Estas responsabilidades deben pertenecer a los sistemas y capas adecuados.

### Simplicidad

La arquitectura debe responder al negocio, catálogo, volumen, equipo y capacidad real de mantenimiento de JaspeArt.

Evitar tanto soluciones insuficientes como sobrearquitectura innecesaria.

## Product vision

La visión de producto de JaspeArt está documentada en [docs/product/product-vision.md](docs/product/product-vision.md).

## Contexto existente

El proyecto no parte de cero.

Actualmente existen:

* una web/ecommerce basada en WordPress;
* sistemas operacionales de JaspeArt;
* un proyecto independiente de Data Warehouse / BI;
* conocimiento previo sobre catálogo, familias, marcas y ventas.

La arquitectura futura de este proyecto todavía **no está decidida**.

En particular, no se asume de antemano que WordPress deba mantenerse ni sustituirse.

## Catálogo

El catálogo interno contiene aproximadamente **21.000 referencias**, aunque la existencia de una referencia en los sistemas internos no implica automáticamente que deba publicarse o venderse online.

Será necesario definir explícitamente la **regla de publicabilidad ecommerce**.

Además de productos físicos, JaspeArt desarrolla actividades y servicios que pueden requerir journeys diferentes a una compra ecommerce convencional.

## Experiencia

La dirección de producto busca combinar dos necesidades:

**Inspiración + eficiencia de compra**

La experiencia visual debe ser editorial, limpia, contemporánea y cuidada, con fuerte protagonismo del producto y de los materiales propios de Bellas Artes.

Al mismo tiempo, búsqueda, navegación, filtros, PLP y PDP deben responder a la complejidad de un catálogo técnico con muchas referencias, marcas, formatos y atributos.

El diseño visual nunca debe dificultar encontrar y comprar un producto.

## Desarrollo asistido por AI

El proyecto utilizará herramientas de AI para acelerar discovery, diseño, implementación, testing y documentación.

Actualmente:

* **ChatGPT** — discovery, producto, arquitectura, especificaciones y revisión.
* **Lovable** — exploración visual y prototipado UX/UI.
* **GitHub Copilot** — implementación, refactor, testing y trabajo sobre el repositorio.

La AI debe acelerar la ejecución, no sustituir decisiones de negocio o arquitectura que todavía no hayan sido tomadas.

## Repositorio

Este repositorio es la fuente de verdad del código del nuevo ecommerce.

El proyecto de Data Warehouse / BI de JaspeArt permanece separado.

La estructura definitiva del repositorio se irá definiendo conforme avance el discovery y se tomen las decisiones arquitectónicas correspondientes.
