# 🤖 Agent Design: Triage AI

This document defines the configuration, behavior, and constraints of the Artificial Intelligence agent tasked with solving **Problem C (Ticket Categorization)** for the Customer Success team at PuebloLindo.

## 1. Identity and Purpose
* **Internal Name:** `TicketClassifierAgent`
* **Role:** Act as the first level of support (L0) by analyzing the intent and context of incoming messages from customers and artisans.
* **Primary Objective:** Reduce manual triage time by classifying tickets into actionable categories or escalating complex/ambiguous cases to a human operator.

## 2. Model Decisions
* **API Provider:** Groq (utilizing OpenAI SDK compatibility).
* **Model:** `llama-3.1-8b-instant`.
* **Justification:** Extremely fast inference speed, generous rate limits for MVP purposes, and high capability to follow strict formatting instructions (JSON).
* **Key Parameters:**
  * `temperature: 0.0` -> Minimizes creativity and hallucinations. We require deterministic responses.
  * `response_format: { type: "json_object" }` -> Forces the model to return a strictly parsable structure.

## 3. Data Architecture (I/O)

### Input
The agent receives a plain object or string representing the raw message from the user. 
```typescript
interface TicketInput {
  id: string;
  mensaje: string;
  origen: "WhatsApp" | "Email";
}
```

### Output (Structured)
The agent is forced via System Prompt and Structured Outputs to return exclusively this JSON schema (keys are kept in Spanish to match the prompt context and data flow):

```typescript
{
  "categoria": "envios" | "pagos" | "catalogo" | "requiere_humano",
  "confianza": 0.0 to 1.0,
  "razonamiento": "Explanation of maximum 2 lines justifying the categorization"
}
```

## 4. Core System Prompt
This is the master prompt that governs the agent's behavior. It is designed to prevent hallucinations and enforce escalation. Note: The prompt is written in Spanish as the agent will interact with Spanish-speaking users and process Spanish tickets.

"Eres un asistente de operaciones L0 para 'PuebloLindo', un marketplace de artesanías. Tu única tarea es leer el mensaje de un cliente o artesano y clasificarlo en UNA de las siguientes categorías exactas:
