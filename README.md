# 🎯 Triage AI - Clasificador de Tickets

MVP que clasifica tickets de clientes/artesanos en categorías accionables usando Groq (LLM).

---

## Requisitos

* Node.js 18+
* API Key de Groq

---

## Setup

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd triage-ai

# 2. Instalar dependencias
npm install

# 3. Configurar API Key
cp .env.example .env

# Editar .env y añadir:
GROQ_API_KEY=tu_api_key_aqui
```

---

## Obtener API Key de Groq

1. Ir a https://groq.com
2. Crear cuenta o iniciar sesión
3. Entrar a **API Keys**
4. Generar nueva key
5. Copiarla en `.env`

---

## Ejecutar

```bash
npx ts-node index.ts
```

---

## Output Esperado

```text
╔════════════════════════════════════════════════════════════════════╗
║              🎯 TRIAGE AI - CLASIFICADOR DE TICKETS                ║
╚════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────┐
│ 📝 Ticket: T001                                                    │
│ Mensaje: ¿Dónde está mi pedido? Ya pasaron 3 días.                 │
│ Origen : WhatsApp                                                  │
├────────────────────────────────────────────────────────────────────┤
│ ✅ Clasificación                                                   │
│ Categoría: envios                                                  │
│ Confianza: 90%                                                     │
│ Razón    : Consulta por estado y demora de entrega del pedido.     │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 📝 Ticket: T002                                                    │
│ Mensaje: Me cobraron dos veces en la tarjeta de crédito.           │
│ Origen : Email                                                     │
├────────────────────────────────────────────────────────────────────┤
│ ✅ Clasificación                                                   │
│ Categoría: pagos                                                   │
│ Confianza: 90%                                                     │
│ Razón    : Reporta cobro duplicado en tarjeta.                     │
└────────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════
                           📊 RESUMEN FINAL
══════════════════════════════════════════════════════════════════════

┌──────┬──────────────────┬───────────┬──────────────────────────────┐
│ ID   │ CATEGORÍA        │ CONFIANZA │ RAZÓN                        │
├──────┼──────────────────┼───────────┼──────────────────────────────┤
│ T001 │ envios           │ 90%       │ Consulta estado de pedido    │
│ T002 │ pagos            │ 90%       │ Cobro duplicado              │
│ T003 │ catalogo         │ 90%       │ Error subiendo fotos         │
│ T004 │ envios           │ 80%       │ Pedido llegó dañado          │
│ T005 │ requiere_humano  │ 0%        │ Mensaje agresivo             │
└──────┴──────────────────┴───────────┴──────────────────────────────┘
```


## Categorías

| Categoría         | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| `envios`          | Estado de pedido, entrega, shipping             |
| `pagos`           | Cobros, tarjetas, reembolsos                    |
| `catalogo`        | Productos, fotos, uso de la plataforma          |
| `requiere_humano` | Otro idioma, mensaje agresivo o no clasificable |

---

## Notas

* Se recomienda usar `temperature: 0` para respuestas consistentes.
* El output está optimizado para verse bien en terminal.
* Puede integrarse luego con Zendesk, Freshdesk o WhatsApp API.
