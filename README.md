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
git clone https://github.com/LuaGR/triage-ai
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
╔══════════════════════════════════════════════════════════════════╗
║               TRIAGE AI - CLASIFICADOR DE TICKETS               ║
╚══════════════════════════════════════════════════════════════════╝

╭──────────────────────────────────────────────────────────────────╮
│ 📝 Ticket: T001                                                 │
│    Mensaje: ¿Dónde está mi pedido? Ya pasaron 3 días.           │
│    Origen:  WhatsApp                                            │
├──────────────────────────────────────────────────────────────────┤
│ ✅ Clasificación:                                                │
│    Categoría: envios                                            │
│    Confianza: 80%                                               │
│    Razón: El cliente pregunta sobre el estado de su pedido...   │
╰──────────────────────────────────────────────────────────────────╯

... (más tickets) ...

╭──────────────────────────────────────────────────────────────────╮
│ 📝 Ticket: T005                                                 │
│    Mensaje: ¡SON UNOS ESTAFADORES, QUIERO HABLAR CON UN...      │
│    Origen:  WhatsApp                                            │
├──────────────────────────────────────────────────────────────────┤
│ ⚠️  ALERTA: La IA no pudo clasificar el ticket T005            │
│    Confianza: 0%                                                │
├──────────────────────────────────────────────────────────────────┤
│    Razón: El cliente utiliza un lenguaje agresivo...           │
├──────────────────────────────────────────────────────────────────┤
│    Mensaje: ¡SON UNOS ESTAFADORES, QUIERO HABLAR...            │
└──────────────────────────────────────────────────────────────────┘

   Intervención Humana Requerida. Seleccione la categoría real:
   [1] envios  [2] pagos  [3] catalogo  [4] spam
   > 4

╭──────────────────────────────────────────────────────────────────╮
│ 👤 Clasificación MANUAL:                                         │
│    Categoría: spam                                              │
╰──────────────────────────────────────────────────────────────────╯

═══════════════════════════════════════════════════════════════════
                    📊 Reporte de Operaciones AI:                  
═══════════════════════════════════════════════════════════════════

   - Tickets Procesados: 5
   - Resueltos por IA: 4
   - Escalados a Humano: 1
   - Tiempo total de ejecución: 3.3 segundos
   - Tokens Consumidos: 750 (Prompt) / 150 (Completion)
   - Costo Estimado: $0.0495 USD

═══════════════════════════════════════════════════════════════════
```

---

## Categorías

| Categoría         | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| `envios`         | Estado de pedido, entrega, shipping             |
| `pagos`          | Cobros, tarjetas, reembolsos                    |
| `catalogo`       | Productos, fotos, uso de la plataforma         |
| `spam`           | Mensajes agresivos, insultos, spam             |
| `requiere_humano`| No clasificable - para escalamiento interno     |

---

## Human-in-the-Loop (HITL)

Cuando la IA no puede clasificar con certeza (`confianza < 0.5` o `requiere_humano`), el sistema pausa y solicita intervención humana.

El resultado incluye `resolved_by: "AI"` o `resolved_by: "Human"`.

---

## AI Ops Metrics

El reporte final muestra:
- Tickets procesados
- Resueltos por IA vs humano
- Tiempo de ejecución
- Tokens consumidos (estimado)
- Costo estimado en USD

---

## Estructura del Proyecto

```
triage-ai/
├── index.ts              # Entry point
├── src/
│   ├── models/          # Tipos (Ticket, ClassificationResult)
│   ├── services/        # Lógica (Groq, classifier)
│   ├── prompts/        # System prompt
│   └── ui/             # Presentación (cajas, tablas)
├── data/
│   └── tickets.json    # Datos de prueba
├── docs/
│   ├── DECISIONS.md
│   └── PROCESS.md
├── README.md
├── AGENTS.md
├── IMPLEMENTATION_PLAN.md
└── package.json
```

---

## Notas

* Se recomienda usar `temperature: 0` para respuestas consistentes.
* El output está optimizado para verse bien en terminal.
* Puede integrarse luego con Zendesk, Freshdesk o WhatsApp API.
