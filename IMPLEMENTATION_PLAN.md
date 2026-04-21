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
##  Phase 6: Interactive Human-in-the-Loop (HITL) Implementation

* [ ] Setup a `readline` interface to handle asynchronous user input from the terminal.
* [ ] Add evaluation logic: If the LLM returns `"categoria": "requiere_humano"` or `"confianza" < 0.85`, pause script execution.
* [ ] Display the complex ticket and prompt the user to manually select the correct category (e.g., `[1] envios, [2] pagos, [3] catalogo, [4] spam`).
* [ ] Append a flag `resolved_by: "AI"` or `resolved_by: "Human"` to the final parsed object.
---
##  Phase 7: Execution Loop & AI Ops Metrics

* [ ] Create a `main()` function.
* [ ] Initialize tracking variables for execution time (`performance.now()`), total prompt tokens, and total completion tokens.
* [ ] Iterate through the `tickets.json` array.
* [ ] Await the classification for each ticket (triggering the HITL pause when necessary).
* [ ] Store the results and update the token/time metrics.
* [ ] Output the final classification results using `console.table()`.
* [ ] Print an "AI Ops Summary Report" showing:
  * Total execution time.
  * Number of tickets resolved by AI vs. Human.
  * Total tokens consumed.
  * Estimated API cost.
---
