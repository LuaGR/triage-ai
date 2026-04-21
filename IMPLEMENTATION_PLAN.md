# 🚀 Triage AI: MVP Implementation Plan

This document outlines the step-by-step execution plan to build the Ticket Categorization MVP.

---

## Phase 1: Environment Setup ⏱️ [10 mins]

* [ ] Open the terminal in the project root directory.
* [ ] Initialize the Node.js project:

```bash
npm init -y
```

* [ ] Install core dependencies and development tools:

```bash
npm install openai dotenv
npm install -D typescript ts-node @types/node
```

* [ ] Initialize TypeScript configuration:

```bash
npx tsc --init
```

* [ ] Update `tsconfig.json` to allow importing JSON files:

```json
{
  "resolveJsonModule": true
}
```

---

## Phase 2: File Structure ⏱️ [5 mins]

* [ ] Create the following files in the root directory:

```txt
.env
.env.example
.gitignore
index.ts
tickets.json
AGENTS.md
DECISIONS.md
PROCESS.md
README.md
```

* [ ] `.env`: Store the `GROQ_API_KEY` here.
* [ ] `.env.example`: Template for GitHub.
* [ ] `.gitignore` should contain:

```txt
node_modules/
.env
```

---

## Phase 3: Mock Data (`tickets.json`) ⏱️ [5 mins]

* [ ] Populate `tickets.json` with strategic test cases to demonstrate AI capabilities and edge-case handling:

```json
[
  {
    "id": "T001",
    "mensaje": "¿Dónde está mi pedido? Ya pasaron 3 días.",
    "origen": "WhatsApp"
  },
  {
    "id": "T002",
    "mensaje": "Me cobraron dos veces en la tarjeta de crédito.",
    "origen": "Email"
  },
  {
    "id": "T003",
    "mensaje": "La app no me deja subir las fotos de mis telares, se queda cargando.",
    "origen": "WhatsApp"
  },
  {
    "id": "T004",
    "mensaje": "I need help with my order, it arrived broken.",
    "origen": "Email"
  },
  {
    "id": "T005",
    "mensaje": "¡SON UNOS ESTAFADORES, QUIERO HABLAR CON UN GERENTE AHORA!",
    "origen": "WhatsApp"
  }
]
```

---

## Phase 4: Core Logic (`index.ts`) ⏱️ [40 mins]

### Imports & Setup

* [ ] Import `dotenv`, OpenAI SDK, and mock data.
* [ ] Configure the OpenAI client to point to Groq's `baseURL`.

### Classifier Function

* [ ] Create an async function:

```ts
classifyTicket(message: string)
```

* [ ] Inject the System Prompt (from `AGENTS.md`).
* [ ] Set model:

```txt
llama3-8b-8192
```

* [ ] Set temperature:

```txt
0.0
```

* [ ] Force JSON output:

```json
{
  "type": "json_object"
}
```

### Execution Loop

* [ ] Create a `main()` function.
* [ ] Iterate through the `tickets.json` array.
* [ ] Await the classification for each ticket.
* [ ] Parse the JSON response.
* [ ] Output the final results clearly using:

```ts
console.table()
```

---

## Phase 5: Documentation ⏱️ [40 mins]

### DECISIONS.md

* [ ] State why Problem C was chosen.
* [ ] Justify the local CLI script approach:

  * Focus on AI value.
  * Clean data flow.
  * Avoid deployment overhead.
* [ ] List limitations:

  * In-memory data.
  * No actual DB integration.
  * No Zendesk integration.

### PROCESS.md

* [ ] Document prompt iterations.
* [ ] Explain how hallucination is prevented:

  * Structured Outputs.
  * Strict instructions.
* [ ] Note what would be done with an extra week:

  * Example: migrate to AWS Serverless.

### README.md

* [ ] Add strict and clear instructions to run locally:

  * Clone repository.
  * Run `npm install`.
  * Setup `.env`.
  * Run script.

---
## Phase 6: Interactive Human-in-the-Loop (HITL) Implementation

* [x] Setup `readline` interface for async user input from terminal.
* [x] Add evaluation logic: If `categoria === "requiere_humano"` or `confianza < 0.5`, pause script execution.
* [x] Display alert box with ticket info, confianza, and razón:
  ```
  ⚠️  ALERTA: La IA no pudo clasificar el ticket T005
     Confianza: 0%
     Razón: El cliente utiliza lenguaje agresivo...
     Mensaje: "¡SON UNOS ESTAFADORES..."
  
  Intervención Humana Requerida. Seleccione la categoría real:
  [1] envios  [2] pagos  [3] catalogo  [4] spam
  > _
  ```
* [x] Append flag `resolved_by: "AI"` or `resolved_by: "Human"` to result object.

### HITL Output Format

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠️  ALERTA: La IA no pudo clasificar el ticket T005                   │
│    Confianza: 0%                                                    │
├──────────────────────────────────────────────────────────────────┤
│    Razón: El cliente utiliza un lenguaje agresivo y exige hablar...│
├──────────────────────────────────────────────────────────────────┤
│    Mensaje: "¡SON UNOS ESTAFADORES, QUIERO HABLAR..." │
└──────────────────────────────────────────────────────────────────┘

   Intervención Humana Requerida. Seleccione la categoría real:
   [1] envios  [2] pagos  [3] catalogo  [4] spam
   > _
```

---
## Phase 7: Execution Loop & AI Ops Metrics

* [x] Initialize tracking variables: `performance.now()`, prompt tokens, completion tokens.
* [x] Iterate through `tickets.json`, trigger HITL pause when necessary.
* [x] Store results with `resolved_by` flag.
* [x] Print "Reporte de Operaciones AI" at the end.

### AI Ops Summary Format

```
═══════════════════════════════════════════════════════════════════════
                    📊 Reporte de Operaciones AI:                     
═══════════════════════════════════════════════════════════════════════

   - Tickets Procesados: 5
   - Resueltos por IA: 4
   - Escalados a Humano: 1
   - Tiempo total de ejecución: 3.3 segundos
   - Tokens Consumidos: 750 (Prompt) / 150 (Completion)
   - Costo Estimado: $0.0495 USD

═══════════════════════════════════════════════════════════════════════
```

---
